var $ = window.Zepto;
var root = window.player;
var index = 0;
var $scope = $(document.body);
var songList;
var controlmanager;
var playList = root.playList;
var audiomanager = new root.audioManager();
var process = root.process;
function clampPercent (percent) {
    if (percent < 0) {
        return 0;
    }
    if (percent > 1) {
        return 1;
    }
    return percent;
}
function syncPlayButton () {
    var $btn = $scope.find(".play-btn");
    if (audiomanager.status == "play") {
        $btn.addClass("playing");
    } else {
        $btn.removeClass("playing");
    }
}
function handlePlayResult (playResult) {
    if (playResult && typeof playResult.then === "function") {
        return playResult.then(function () {
            process.start();
            syncPlayButton();
        }).catch(function () {
            process.stop();
            syncPlayButton();
        });
    }
    if (audiomanager.status == "play") {
        process.start();
    } else {
        process.stop();
    }
    syncPlayButton();
    return playResult;
}
function startPlayback () {
    return handlePlayResult(audiomanager.play());
}
function percentFromEvent (e, barEl) {
    var point = e;
    if (e.changedTouches && e.changedTouches[0]) {
        point = e.changedTouches[0];
    } else if (e.touches && e.touches[0]) {
        point = e.touches[0];
    }
    var rect = barEl.getBoundingClientRect();
    if (!rect.width) {
        return 0;
    }
    return clampPercent((point.clientX - rect.left) / rect.width);
}
function seekToPercent (percent) {
    process.setPercent(percent);
    var index = controlmanager.index;
    var curDuration = songList[index].duration;
    var curTime = curDuration * percent;
    return handlePlayResult(audiomanager.jumpToPlay(curTime));
}
function bindSeek () {
    var barEl = $scope.find(".pro-wrapper")[0];
    var $bar = $(barEl);
    var dragging = false;
    var activePointer = null;
    function onDown (e) {
        dragging = true;
        process.stop();
        process.setPercent(percentFromEvent(e, barEl));
        if (e.pointerId != null && barEl.setPointerCapture) {
            activePointer = e.pointerId;
            barEl.setPointerCapture(e.pointerId);
        }
        if (e.preventDefault) {
            e.preventDefault();
        }
    }
    function onMove (e) {
        if (!dragging) {
            return;
        }
        if (e.pointerId != null && activePointer != null && e.pointerId !== activePointer) {
            return;
        }
        process.setPercent(percentFromEvent(e, barEl));
        if (e.preventDefault) {
            e.preventDefault();
        }
    }
    function onUp (e) {
        if (!dragging) {
            return;
        }
        if (e.pointerId != null && activePointer != null && e.pointerId !== activePointer) {
            return;
        }
        dragging = false;
        activePointer = null;
        seekToPercent(percentFromEvent(e, barEl));
    }
    if (window.PointerEvent) {
        $bar.on("pointerdown", onDown);
        $bar.on("pointermove", onMove);
        $bar.on("pointerup pointercancel", onUp);
    } else {
        $bar.on("mousedown", onDown);
        $(document).on("mousemove", onMove);
        $(document).on("mouseup", onUp);
        $bar.on("touchstart", onDown);
        $bar.on("touchmove", onMove);
        $bar.on("touchend touchcancel", onUp);
    }
}
function bindClick () {
    $scope.on("click", ".play-btn", function () {
        if (audiomanager.status == "play") {
            audiomanager.pause();
            process.stop();
            syncPlayButton();
        }else {
            startPlayback();
        }
    })
    $scope.find(".list-btn").on("click", function () {
        playList.show(controlmanager);
    })
    $scope.find(".next-btn").on("click", function () {
        var index = controlmanager.next(); 
        $scope.trigger("player:change", index);
    })
    $scope.find(".prev-btn").on("click", function () {
        var index = controlmanager.prev();
        $scope.trigger("player:change",index);
    })
}
function preloadNeighbor (currentIndex) {
    if (!songList || songList.length < 2) {
        return;
    }
    var nextIndex = (currentIndex + 1) % songList.length;
    audiomanager.preloadNext(songList[nextIndex].audio);
}
audiomanager.onEnded = function () {
    process.stop();
    process.setPercent(1);
    syncPlayButton();
};
$scope.on("player:change", function (event,index,flag) {
    var shouldPlay = audiomanager.status == "play" || flag;
    root.render(songList[index]);
    process.renderAllTime(songList[index].duration);
    process.upData(0);
    var playResult = audiomanager.switchTo(songList[index].audio, shouldPlay);
    if (shouldPlay) {
        handlePlayResult(playResult);
    } else {
        process.stop();
        syncPlayButton();
    }
    preloadNeighbor(index);
})
function getData (url) {
    $.ajax({
        type: "GET",
        url: url,
        success: successFn 
        
    })
}

function successFn (data) {
    songList = data;
    $scope.trigger("player:change",0);
    bindClick();
    bindSeek(); 
    playList.renderPlayList(data);
    controlmanager = new root.controlManager(data.length);  
}
getData("./mock/data.json")
