(function(exports) {
'use strict';

var _playSound = function(audioElement, ringtoneName, loop) {
  audioElement.pause();
  audioElement.loop = loop;
  var previewRingtone = 'shared/resources/media/alarms/' + ringtoneName;

  audioElement.src = previewRingtone;
  audioElement.play();
};

var AlarmPlayer = function() {
  this.audioElement = new Audio();
  this.audioElement.mozAudioChannelType = 'alarm';
  var pause = this.pause.bind(this);
  this.audioElement.addEventListener('mozinterruptbegin', pause);
};

AlarmPlayer.prototype.previewSound = function(ringtoneName) {
  _playSound(this.audioElement, ringtoneName, true);
};

AlarmPlayer.prototype.playSound = function(ringtoneName) {
  _playSound(this.audioElement, ringtoneName, false);
};

AlarmPlayer.prototype.pause = function() {
  this.audioElement.pause();
};

AlarmPlayer.prototype.addEventListener = function() {
  this.audioElement.addEventListener.apply(this.audioElement, arguments);
};

exports.AlarmPlayer = AlarmPlayer;

}(this));
