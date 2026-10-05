(function ($, root) {
    var $scope = $(document.body);
    var curDuration;
    var frameId = null;
    var startTime;
    var lastPercent = 0;
    function formateDate (duration) {
        duration = Math.round(duration);
        var minute = Math.floor(duration / 60);
        var second = duration % 60;
        if (minute < 10) {
            minute = "0" + minute;
        }
        if (second < 10) {
            second = "0" + second;
        }   
        return minute + ":" + second; 
    }
    function renderPro (percent) {   //渲染进度条
        var percentage = (percent - 1) * 100 + "%";
        $scope.find(".pro-top").css({
            transform: "translateX("+percentage+")"
        })
    }
    function stopLoop () {
        if (frameId !== null) {
            cancelAnimationFrame(frameId);
            frameId = null;
        }
    }
    function upData (percent) {    //更新
        if (percent < 0) {
            percent = 0;
        }
        if (percent > 1) {
            percent = 1;
        }
        var currentTime = percent * curDuration;  //当前时间
        var time = formateDate(currentTime);  //组成分秒的形式
        $scope.find(".cur-time").html(time);
        renderPro(percent);
    }
    function setPercent (percent) {
        if (percent < 0) {
            percent = 0;
        }
        if (percent > 1) {
            percent = 1;
        }
        lastPercent = percent;
        upData(percent);
    }
    function start () {
        stopLoop();
        startTime = new Date().getTime();
        function frame () {
            var curTime = new Date().getTime();
            var percent = lastPercent + (curTime - startTime) / (curDuration * 1000);
            if (percent >= 1) {
                lastPercent = 1;
                upData(1);
                frameId = null;
                return;
            }
            upData(percent);
            frameId = requestAnimationFrame(frame);
        }
        frameId = requestAnimationFrame(frame);
    }
    function stop () {
        if (startTime) {
            var stopTime = new Date().getTime();
            lastPercent = lastPercent + (stopTime - startTime) / (curDuration * 1000);
            if (lastPercent < 0) {
                lastPercent = 0;
            }
            if (lastPercent > 1) {
                lastPercent = 1;
            }
            startTime = null;
        }
        stopLoop();
    }
    function renderAllTime (duration) {
        curDuration = duration;   //没有var
        lastPercent = 0;
        startTime = null;
        stopLoop();
        var allTime = formateDate(duration);
        $scope.find(".all-time").html(allTime);
    }
    root.process = {
        renderAllTime: renderAllTime,
        start: start,
        stop: stop,
        upData: upData,
        setPercent: setPercent
    }
}(window.Zepto, window.player))
