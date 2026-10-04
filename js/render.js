
(function ($, root) {
    var $scope = $(document.body);
    function renderInfo (data) {
        var html = '<div class="song-name">'+data.song+'</div>'+
        '<div class="singer-name">'+data.singer+'</div>'+
        '<div class="album-name">'+data.album+'</div>';
        $scope.find('.song-info').html(html);
    }
    function renderImg (url) {
        var img = new Image();
        img.onload = function () {
            $scope.find(".song-img img").attr("src",url);
            root.blurImg(img, $scope);
        }
        img.src = url;
    }
    root.render = function (data) {
        renderInfo(data);
        renderImg(data.image);
    }
}(window.Zepto, window.player))