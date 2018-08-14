var gulp = require("gulp")//引入gulp
var connect = require("gulp-connect")
var less = require("gulp-less")
// $.on("own")         //事件绑定
// $.trigger("own")   //事件触发
//把src的HTML放到dist下
gulp.task("html",  function () {
    gulp.src("./src/index.html")//读取文件
        .pipe(connect.reload())//热启
        .pipe(gulp.dest("./dist"))
})

//监听变化
gulp.task("watch", function () {
    gulp.watch("./src/index.html", ["html"]);
    gulp.watch("./src/less/*.less", ["less"]);
    gulp.watch("./src/js/*.js",["js"]);
})
// less任务
gulp.task("less", function () {
    gulp.src("./src/less/*.less")
        .pipe(connect.reload())
        .pipe(less())
        .pipe(gulp.dest("./dist/css"))
})

gulp.task("js", function () {
    gulp.src("./src/js/*.js")
        .pipe(connect.reload())
        .pipe(gulp.dest("./dist/js"))
})
// 服务器
gulp.task("server",function() {
    connect.server({
        root : "./dist",
        port:8091,
        livereload:true,
    })
})

gulp.task("default",["html","watch","server","less","js"])
