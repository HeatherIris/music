(function ($,root) {
     function audioManager () {
         this.audio = new Audio();
         this.status = "pause";
         this.onEnded = null;
         this._bindAudioEvents();
     }
     audioManager.prototype = {
         _bindAudioEvents: function () {
            var self = this;
            this.audio.addEventListener("play", function () {
                self.status = "play";
            });
            this.audio.addEventListener("pause", function () {
                if (self.audio.ended) {
                    self.status = "pause";
                    return;
                }
                if (self.audio.paused) {
                    self.status = "pause";
                }
            });
            this.audio.addEventListener("ended", function () {
                self.status = "pause";
                if (typeof self.onEnded === "function") {
                    self.onEnded();
                }
            });
         },
         play: function () {
            var self = this;
            var result = this.audio.play();
            if (result && typeof result.then === "function") {
                return result.then(function () {
                    self.status = "play";
                }).catch(function (err) {
                    self.status = "pause";
                    throw err;
                });
            }
            if (!this.audio.paused) {
                this.status = "play";
            }
            return result;
         },
         pause: function () {
             this.audio.pause();
             this.status = "pause";
         },
         changeSource: function (src) {
            this.audio.src = src;
            this.audio.load();
         },
         jumpToPlay: function (time) {
            this.audio.currentTime = time;
            return this.play();
         }
     }
     root.audioManager = audioManager;
}(window.Zepto, window.player))
