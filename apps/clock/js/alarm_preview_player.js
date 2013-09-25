(function(exports) {
'use strict';

var AlarmPreviewPlayer = function() {
  this.audioElement = new Audio();
};

AlarmPreviewPlayer.prototype.previewSound = function(ringtoneName) {
  var alarmPlayer = this.audioElement;
  alarmPlayer.pause();

  var previewRingtone = 'shared/resources/media/alarms/' + ringtoneName;
  alarmPlayer.mozAudioChannelType = 'alarm';
  alarmPlayer.src = previewRingtone;
  alarmPlayer.play();
};

AlarmPreviewPlayer.prototype.stopPreviewSound = function() {
  this.audioElement.pause();
};

exports.AlarmPreviewPlayer = AlarmPreviewPlayer;

}(this));
