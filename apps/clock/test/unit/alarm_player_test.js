requireApp('clock/js/alarm_player.js');

suite('AlarmPreviewPlayer Test', function() {
  var audioMock, alarmPreviewPlayer;

  setup(function() {
    audioMock = {
      play: sinon.spy(),
      pause: sinon.spy(),
      addEventListener: sinon.spy()
    };
    this.sinon.stub(window, 'Audio').returns(audioMock);
    alarmPreviewPlayer = new AlarmPlayer();
  });

  teardown(function() {
    window.Audio.restore();
  });

  test('it should play the alarm sound', function() {
    alarmPreviewPlayer.playSound('foo.opus');
    assert.isTrue(audioMock.play.called);
    assert.equal(audioMock.src, 'shared/resources/media/alarms/foo.opus');
    assert.equal(audioMock.mozAudioChannelType, 'alarm');
    assert.equal(audioMock.loop, false);
  });

  test('it should preview the alarm sound', function() {
    alarmPreviewPlayer.previewSound('foo.opus');
    assert.isTrue(audioMock.play.called);
    assert.equal(audioMock.src, 'shared/resources/media/alarms/foo.opus');
    assert.equal(audioMock.mozAudioChannelType, 'alarm');
    assert.equal(audioMock.loop, true);
  });

  test('it should pause the alarm sound', function() {
    alarmPreviewPlayer.pause();
    assert.isTrue(audioMock.pause.called);
  });
});
