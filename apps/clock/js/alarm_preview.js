(function(exports) {
'use strict';

function AlarmPreview(select, config) {
  FormButton.call(this, select, config);

  var player = this.player = new AlarmPlayer();

  select.addEventListener('change', this.previewAlarm.bind(this));
  select.addEventListener('blur', player.pause.bind(player));
};

AlarmPreview.prototype = Object.create(FormButton.prototype);

AlarmPreview.prototype.previewAlarm = function() {
  var sound = this.getValue();
  this.player.playLoop(sound);
};

exports.AlarmPreview = AlarmPreview;

}(this));
