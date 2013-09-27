(function(exports) {
'use strict';

function playAlarm(audio, alarmName, loop) {
  audio.pause();
  audio.loop = loop;

  audio.src = 'shared/resources/media/alarms/' + alarmName;
  audio.play();
};

/**
 * AlarmPlayer
 *
 * Constructs an object used to play/preview alarm sound files.
 *
 * @return {AlarmPlayer} AlarmPlayer object.
 *
 */
function AlarmPlayer() {
  this.audio = new Audio();
  this.audio.mozAudioChannelType = 'alarm';
  var pause = this.pause.bind(this);
  var mozInterruptHandler = (function() {
    this.pause();
    this.emit('interrupt');
  }).bind(this);

  // Only ringer/telephony channel audio could trigger 'mozinterruptbegin'
  // event on the 'alarm' channel audio element.
  this.audio.addEventListener('mozinterruptbegin', mozInterruptHandler);
};

Emitter.mixin(AlarmPlayer.prototype);

/**
 * playLoop given an alarm name this will play the alarm's audio
 * file on a loop.
 *
 * @param {String} alarmName the file name of the alarm
 *
 */
AlarmPlayer.prototype.playLoop = function(alarmName) {
  playAlarm(this.audio, alarmName, true);
};

/**
 * play given an alarm name this will play the alarm's audio
 * file once.
 *
 * @param {String} alarmName the file name of the alarm
 *
 */
AlarmPlayer.prototype.play = function(alarmName) {
  playAlarm(this.audio, alarmName, false);
};

/**
 * pause Pauses the media playback.
 *
 */
AlarmPlayer.prototype.pause = function() {
  this.audio.pause();
};

exports.AlarmPlayer = AlarmPlayer;

}(this));
