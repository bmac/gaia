requireApp('clock/js/emitter.js');
requireApp('clock/js/alarm_player.js');

suite('AlarmPreviewPlayer Test', function() {
  var mockAudio, alarmPlayer;

  setup(function() {
    sinon.stub(Audio.prototype, 'play');
    sinon.stub(Audio.prototype, 'pause');
    mockAudio = new Audio();
    sinon.stub(window, 'Audio').returns(mockAudio);
    alarmPlayer = new AlarmPlayer();
  });

  teardown(function() {
    Audio.restore();
    Audio.prototype.play.restore();
    Audio.prototype.pause.restore();
  });

  test('it should play the alarm sound', function() {
    alarmPlayer.play('foo.opus');
    assert.isTrue(mockAudio.play.called);
    assert.include(mockAudio.src, 'shared/resources/media/alarms/foo.opus');
    assert.equal(mockAudio.mozAudioChannelType, 'alarm');
    assert.equal(mockAudio.loop, false);
  });

  test('it should preview the alarm sound', function() {
    alarmPlayer.playLoop('foo.opus');
    assert.isTrue(mockAudio.play.called);
    assert.include(mockAudio.src, 'shared/resources/media/alarms/foo.opus');
    assert.equal(mockAudio.mozAudioChannelType, 'alarm');
    assert.equal(mockAudio.loop, true);
  });

  test('it should pause the alarm sound', function() {
    alarmPlayer.pause();
    assert.isTrue(mockAudio.pause.called);
  });

  test('the mozinterruptbegin event should pause playback', function() {
    mockAudio.dispatchEvent(new Event('mozinterruptbegin'));
    assert.isTrue(mockAudio.pause.called);
  });

  test('the mozinterruptbegin should trigger an interrup event', function() {
    var handler = this.sinon.spy();
    alarmPlayer.on('interrupt', handler);
    mockAudio.dispatchEvent(new Event('mozinterruptbegin'));
    assert.isTrue(handler.calledOnce);
  });
});
