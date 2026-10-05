(function ($,root) {
     function audioManager () {
         this.status = "pause";
         this.onEnded = null;
         this._currentSrc = "";
         this._preloadedSrc = "";
         this.audio = this._createAudio();
         this.nextAudio = this._createAudio();
     }
     audioManager.prototype = {
         _createAudio: function () {
            var audio = new Audio();
            audio.preload = "auto";
            this._bindAudioEvents(audio);
            return audio;
         },
         _bindAudioEvents: function (audio) {
            var self = this;
            audio.addEventListener("play", function (e) {
                if (e.target !== self.audio) {
                    return;
                }
                self.status = "play";
            });
            audio.addEventListener("pause", function (e) {
                if (e.target !== self.audio) {
                    return;
                }
                if (self.audio.ended) {
                    self.status = "pause";
                    return;
                }
                if (self.audio.paused) {
                    self.status = "pause";
                }
            });
            audio.addEventListener("ended", function (e) {
                if (e.target !== self.audio) {
                    return;
                }
                self.status = "pause";
                if (typeof self.onEnded === "function") {
                    self.onEnded();
                }
            });
         },
         _resetAudio: function (audio) {
            audio.pause();
            audio.removeAttribute("src");
         },
         _swapToPreloaded: function () {
            var old = this.audio;
            old.pause();
            this.audio = this.nextAudio;
            this.nextAudio = old;
            this._resetAudio(this.nextAudio);
            this._preloadedSrc = "";
         },
         isPreloaded: function (src) {
            return src && src === this._preloadedSrc && this.nextAudio.readyState >= 2;
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
            this._currentSrc = src;
            this.audio.preload = "auto";
            this.audio.src = src;
         },
         switchTo: function (src, shouldPlay) {
            if (this.isPreloaded(src)) {
                this._swapToPreloaded();
                this._currentSrc = src;
            } else {
                this.changeSource(src);
            }
            if (shouldPlay) {
                return this.play();
            }
            this.pause();
         },
         preloadNext: function (src) {
            if (!src || src === this._currentSrc || src === this._preloadedSrc) {
                return;
            }
            this._preloadedSrc = src;
            this.nextAudio.preload = "auto";
            this.nextAudio.src = src;
         },
         jumpToPlay: function (time) {
            this.audio.currentTime = time;
            return this.play();
         }
     }
     root.audioManager = audioManager;
}(window.Zepto, window.player))
