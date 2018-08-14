var $ = window.Zepto;
var root = window.player;
var index = 0;
var $scope = $(document.body);
var songList;
var controlmanager;
var playList = root.playList;
var audiomanager = new root.audioManager();
var process = root.process;
// console.log(audiomanager)
function bindTouch () {
    var $sliderPoint = $scope.find(".slider-point");
    var offset = $scope.find(".pro-wrapper").offset();
    // console.log(offset)
    var left = offset.left;
    var width = offset.width;
    $sliderPoint.on("touchstart", function () {
        process.stop();  //停止定时器
    }).on("touchmove",function (e) {
        // console.log(e.changedTouches[0].clientX);
        var x = e.changedTouches[0].clientX;  //获取百分比
        var percent = (x - left) / width;
        if(percent > 1 || percent < 0) {
            percent = 0;
        }
        process.upData(percent);
    }).on("touchend", function (e) {
        var x = e.changedTouches[0].clientX;
        var percent = (x - left) / width;
        if(percent > 1 || percent < 0) {
            percent = 0;
        }
        process.upData(percent);
        var index = controlmanager.index;
        var curDuration = songList[index].duration;
        var curTime = curDuration * percent;
        audiomanager.jumpToPlay(curTime);
        $scope.find(".play-btn",).addClass(".playing");
    })
}
function bindClick () {
    $scope.on("click", ".play-btn", function () {
        if (audiomanager.status == "play") {
            audiomanager.pause();
            process.stop();
            // $(this).removeClass("playing");
        }else {
            audiomanager.play();
            process.start();
            // $(this).addClass("playing");
        }
        $(this).toggleClass("playing");   //特殊属性
    })
    $scope.find(".list-btn").on("click", function () {
        playList.show(controlmanager);
    })
    $scope.find(".next-btn").on("click", function () {
        // if(index > songList.length - 2){
        //     index = 0;
        // }else {
        //     index++;
        // }
        // root.render(songList[index]);
        var index = controlmanager.next(); 
        $scope.trigger("player:change", index);
        // console.log(controlmanager.next())
    })
    $scope.find(".prev-btn").on("click", function () {
        // if(index == 0){
        //     index = songList.length - 1;
        // }else {
        //     index--;
        // }
        // root.render(songList[index]);
        var index = controlmanager.prev();
        $scope.trigger("player:change",index);
    })
}
$scope.on("player:change", function (event,index,flag) {
    // console.log(index)
    root.render(songList[index]);
    audiomanager.changeSource(songList[index].audio); //顺序很重要，先加载资源
    if (audiomanager.status == "play" || flag) {
        // console.log(2); 
        process.start();
        audiomanager.play();
    }
    // audiomanager.changeSource(songList[index].audio);
    process.renderAllTime(songList[index].duration);
    process.upData(0);
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