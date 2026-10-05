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
function startPlayback () {
    var playResult = audiomanager.play();
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
function bindTouch () {
    var $sliderPoint = $scope.find(".slider-point");
    var offset = $scope.find(".pro-wrapper").offset();
    var left = offset.left;
    var width = offset.width;
    $sliderPoint.on("touchstart", function () {
        process.stop();  //停止定时器
    }).on("touchmove",function (e) {
        var x = e.changedTouches[0].clientX;  //获取百分比
        var percent = clampPercent((x - left) / width);
        process.setPercent(percent);
    }).on("touchend", function (e) {
        var x = e.changedTouches[0].clientX;
        var percent = clampPercent((x - left) / width);
        process.setPercent(percent);
        var index = controlmanager.index;
        var curDuration = songList[index].duration;
        var curTime = curDuration * percent;
        var playResult = audiomanager.jumpToPlay(curTime);
        if (playResult && typeof playResult.then === "function") {
            playResult.then(function () {
                process.start();
                syncPlayButton();
            }).catch(function () {
                process.stop();
                syncPlayButton();
            });
        } else {
            if (audiomanager.status == "play") {
                process.start();
            }
            syncPlayButton();
        }
    })
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
audiomanager.onEnded = function () {
    process.stop();
    process.setPercent(1);
    syncPlayButton();
};
$scope.on("player:change", function (event,index,flag) {
    var shouldPlay = audiomanager.status == "play" || flag;
    root.render(songList[index]);
    audiomanager.changeSource(songList[index].audio); //顺序很重要，先加载资源
    process.renderAllTime(songList[index].duration);
    process.upData(0);
    if (shouldPlay) {
        startPlayback();
    } else {
        syncPlayButton();
    }
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
    bindTouch(); 
    playList.renderPlayList(data);
    controlmanager = new root.controlManager(data.length);  
}
getData("./mock/data.json")
