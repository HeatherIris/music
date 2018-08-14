(function ($, root) {
    var $scope = $(document.body);
    var curDuration;
    var frameId;    
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
    function upData (percent) {    //更新
        var currentTime = percent * curDuration;  //当前时间
        console.log(curDuration)
        var time = formateDate(currentTime);  //组成分秒的形式
        $scope.find(".cur-time").html(time);
        renderPro(percent);
    }
    function start () {
        // console.log(1)
        cancelAnimationFrame(frameId);
        startTime = new Date().getTime();
        function frame () {
            var curTime = new Date().getTime();
            // console.log(curTime);
            var percent =lastPercent + (curTime - startTime) / (curDuration * 1000);
            if (percent < 1) {
               frameId = requestAnimationFrame(frame);
               upData(percent);
            }else {
                cancelAnimationFrame(frameId);
            }
            // var percent = curTime = startTime;
            requestAnimationFrame(frame);
            // console.log(percent);
        }
        frame();
    }
    function stop () {
        var stopTime = new Date().getTime();
        lastPercent = lastPercent + (stopTime - startTime) / (curDuration * 1000);
        cancelAnimationFrame(frameId);
    }
    function renderAllTime (duration) {
        curDuration = duration;   //没有var
        lastPercent = 0;
        var allTime = formateDate(duration);
        $scope.find(".all-time").html(allTime);
    }
    root.process = {
        renderAllTime: renderAllTime,
        start: start,
        stop: stop,
        upData: upData
    }
}(window.Zepto, window.player))