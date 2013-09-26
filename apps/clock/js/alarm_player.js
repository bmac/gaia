(function(exports) {
'use strict';

var _playSound = function(audioElement, alarmName, loop) {
  audioElement.pause();
  audioElement.loop = loop;
  var previewRingtone = 'shared/resources/media/alarms/' + alarmName;

  audioElement.src = previewRingtone;
  audioElement.play();
};

/**
 * AlarmPlayer
 *
 * Constructs an object used to play/preview alarm sound files.
 *
 * @return {AlarmPlayer} AlarmPlayer object.
 *
 */
var AlarmPlayer = function() {
  this._audioElement = new Audio();
  this._audioElement.mozAudioChannelType = 'alarm';
  var pause = this.pause.bind(this);
  var mozInterruptHandler = (function() {
    this.pause();
    this.onInterrupt.apply(this, arguments);
  }).bind(this);

  // Only ringer/telephony channel audio could trigger 'mozinterruptbegin'
  // event on the 'alarm' channel audio element.
  this._audioElement.addEventListener('mozinterruptbegin', mozInterruptHandler);
};

/**
 * previewSound given an alarm name this will play the alarm's audio
 * file on a loop.
 *
 * @param {String} alarmName the file name of the alarm
 *
 */
AlarmPlayer.prototype.previewSound = function(alarmName) {
  _playSound(this._audioElement, alarmName, true);
};

/**
 * playSound given an alarm name this will play the alarm's audio
 * file once.
 *
 * @param {String} alarmName the file name of the alarm
 *
 */
AlarmPlayer.prototype.playSound = function(alarmName) {
  _playSound(this._audioElement, alarmName, false);
};

/**
 * pause Pauses the media playback.
 *
 */
AlarmPlayer.prototype.pause = function() {
  this._audioElement.pause();
};

/**
 * onInterrupt called when the mozinterruptbegin event is triggered
 *
 * @param {Event} event object
 */
AlarmPlayer.prototype.onInterrupt = function(event) {};


exports.AlarmPlayer = AlarmPlayer;

}(this));
