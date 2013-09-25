requireApp('clock/js/alarm_preview_player.js');

suite('AlarmPreviewPlayer Test', function() {
  var audioMock, alarmPreviewPlayer;

  setup(function() {
    audioMock = {
      play: sinon.spy(),
      pause: sinon.spy()
    };
    this.sinon.stub(window, 'Audio').returns(audioMock);
    alarmPreviewPlayer = new AlarmPreviewPlayer();
  });

  test('it should play the alarm sound', function() {
    alarmPreviewPlayer.previewSound('foo.opus');
    assert.isTrue(audioMock.play.called);
    assert.equal(audioMock.src, 'shared/resources/media/alarms/foo.opus');
    assert.equal(audioMock.mozAudioChannelType, 'alarm');
  });

  test('it should pause the alarm sound', function() {
    alarmPreviewPlayer.stopPreviewSound('foo.opus');
    assert.isTrue(audioMock.pause.called);
  });
});
