requireApp('clock/js/emitter.js');
requireApp('clock/js/alarm_player.js');
requireApp('clock/js/form_button.js');
requireApp('clock/js/alarm_preview.js');

suite('AlarmPreview Test', function() {
  var alarmPreview, select;

  setup(function() {
    var doc = document.createElement('div');
    doc.innerHTML = ['<select id="timer-sound">',
                     '<option value="0">No Sound</option>',
                     '<option value="ac_classic_clock_alarm.opus"></option>',
                     '<option value="ac_classic_clock_radio.opus"></option>',
                     '<option value="ac_normal_gem_echoes.opus"></option>',
                     '<option value="ac_normal_ringing_strings.opus"></option>',
                     '<option value="ac_soft_humming_waves.opus"></option>',
                     '<option value="ac_soft_into_the_void.opus"></option>',
                     '<option value="ac_soft_smooth_strings.opus"></option>',
                     '</select>'].join('');

    select = doc.querySelector('#timer-sound');
    alarmPreview = new AlarmPreview(select);
  });

  test('it should preview the alarm when an option is changed', function() {
    var selectValue = 'ac_soft_humming_waves.opus';
    this.sinon.stub(alarmPreview.player, 'playLoop');
    Utils.changeSelectByValue(select, selectValue);
    select.dispatchEvent(new Event('change'));
    assert.isTrue(alarmPreview.player.playLoop.called);
    assert.isTrue(alarmPreview.player.playLoop.calledWith(selectValue));
  });

  test('it should pause when the select is blured', function() {
    this.sinon.stub(alarmPreview.player, 'pause');
    select.dispatchEvent(new Event('blur'));
    assert.isTrue(alarmPreview.player.pausex.called);
  });
});
