var AlarmEdit = {

  alarm: null,
  alarmRef: null,
  timePicker: {
    hour: null,
    minute: null,
    hour24State: null,
    is12hFormat: false
  },
  previewRingtonePlayer: null,

  get element() {
    delete this.element;
    return this.element = document.getElementById('alarm-edit-panel');
  },

  get scrollList() {
    delete this.scrollList;
    return this.scrollList = document.getElementById('edit-alarm');
  },

  get labelInput() {
    delete this.labelInput;
    return this.labelInput =
      document.querySelector('input[name="alarm.label"]');
  },

  get timeSelect() {
    delete this.timeSelect;
    return this.timeSelect = document.getElementById('time-select');
  },

  get alarmTitle() {
    delete this.alarmTitle;
    return this.alarmTitle = document.getElementById('alarm-title');
  },

  get repeatSelect() {
    delete this.repeatSelect;
    return this.repeatSelect = document.getElementById('repeat-select');
  },

  get soundSelect() {
    delete this.soundSelect;
    return this.soundSelect = document.getElementById('sound-select');
  },

  get vibrateSelect() {
    delete this.vibrateSelect;
    return this.vibrateSelect = document.getElementById('vibrate-select');
  },

  get snoozeSelect() {
    delete this.snoozeSelect;
    return this.snoozeSelect = document.getElementById('snooze-select');
  },

  get deleteButton() {
    delete this.deleteButton;
    return this.deleteButton = document.getElementById('alarm-delete');
  },

  get backButton() {
    delete this.backElement;
    return this.backElement = document.getElementById('alarm-close');
  },

  get doneButton() {
    delete this.doneButton;
    return this.doneButton = document.getElementById('alarm-done');
  },

  init: function aev_init() {
    navigator.mozL10n.translate(this.element);
    this.backButton.addEventListener('click', this);
    this.doneButton.addEventListener('click', this);
    this.timeButton = new FormButton(this.timeSelect, {
      formatLabel: function(value) {
        var time = Utils.parseTime(value);
        return Utils.format.time(time.hour, time.minute);
      }.bind(this)
    });
    this.repeatSelect.addEventListener('change', this);
    this.repeatButton = new FormButton(this.repeatSelect, {
      selectOptions: DAYS,
      buttonId: 'repeat-menu',
      formatLabel: function(daysOfWeek) {
        return this.alarm.summarizeDaysOfWeek(daysOfWeek);
      }.bind(this)
    });
    this.soundButton = new FormButton(this.soundSelect, {
      buttonId: 'sound-menu',
      formatLabel: function(sound) {
        return (sound === null || sound === '0') ?
                               _('noSound') :
                               _(sound.replace('.', '_'));
      }
    });
    this.soundSelect.addEventListener('change', this);
    this.soundSelect.addEventListener('blur', this);
    this.vibrateButton = new FormButton(this.vibrateSelect, {
      formatLabel: function(vibrate) {
        return (vibrate === null || vibrate === '0') ?
                                 _('vibrateOff') :
                                 _('vibrateOn');
      }
    });
    this.snoozeButton = new FormButton(this.snoozeSelect, {
      buttonId: 'snooze-menu',
      formatLabel: function(snooze) {
        return _('nMinutes', {n: snooze});
      }
    });

    this.deleteButton.addEventListener('click', this);

    this.alarmPreviewPlayer = new AlarmPreviewPlayer();
    this.init = function() {};
  },

  handleEvent: function aev_handleEvent(evt) {
    evt.preventDefault();
    var input = evt.target;
    if (!input)
      return;

    switch (input) {
      case this.backButton:
        ClockView.show();
        break;
      case this.doneButton:
        ClockView.show();
        this.save(function aev_saveCallback(err, alarm) {
          if (err) {
            return;
          }
          AlarmList.refreshItem(alarm);
        });
        break;
      case this.soundSelect:
        switch (evt.type) {
          case 'change':
            this.previewSound();
            break;
          case 'blur':
            this.stopPreviewSound();
            break;
        }
        break;
      case this.deleteButton:
        ClockView.show();
        this.delete();
        break;
    case this.repeatSelect:
        this.alarm.repeat = this.repeatButton.getValue();
        break;
    }
  },

  focusMenu: function aev_focusMenu(menu) {
    setTimeout(function() { menu.focus(); }, 10);
  },

  load: function aev_load(alarm) {
    this.init();
    // scroll to top of form list
    this.scrollList.scrollTop = 0;

    if (!alarm) {
      this.element.classList.add('new');
      this.alarmTitle.textContent = _('newAlarm');
      alarm = new Alarm();
    } else {
      this.element.classList.remove('new');
      this.alarmTitle.textContent = _('editAlarm');
    }
    this.alarm = new Alarm(alarm);

    this.element.dataset.id = alarm.id;
    this.labelInput.value = alarm.label;

    // Init time, repeat, sound, snooze selection menu.
    this.initTimeSelect();
    this.initRepeatSelect();
    this.initSoundSelect();
    this.initVibrateSelect();
    this.initSnoozeSelect();
    location.hash = '#alarm-edit-panel';
  },

  initTimeSelect: function aev_initTimeSelect() {
    // The format of input type="time" should be in HH:MM
    var time = (this.alarm.hour < 10 ? '0' : '') +
                            this.alarm.hour + ':' +
                            (this.alarm.minute < 10 ? '0' : '') +
                            this.alarm.minute;
    this.timeButton.setValue(time);
  },

  getTimeSelect: function aev_getTimeSelect() {
    return Utils.parseTime(this.timeSelect.value);
  },
  initRepeatSelect: function aev_initRepeatSelect() {
    this.repeatButton.setValue(this.alarm.repeat);
  },

  initSoundSelect: function aev_initSoundSelect() {
    this.soundButton.setValue(this.alarm.sound);
  },

  getSoundSelect: function aev_getSoundSelect() {
    return this.soundButton.getValue();
  },

  previewSound: function aev_previewSound() {
    this.alarmPreviewPlayer.previewSound(this.getSoundSelect());
  },

  stopPreviewSound: function aev_stopPreviewSound() {
    this.alarmPreviewPlayer.stopPreviewSound();
  },

  initVibrateSelect: function aev_initVibrateSelect() {
    this.vibrateButton.setValue(this.alarm.vibrate);
  },

  getVibrateSelect: function aev_getVibrateSelect() {
    return this.vibrateButton.getValue();
  },

  initSnoozeSelect: function aev_initSnoozeSelect() {
    this.snoozeButton.setValue(this.alarm.snooze);
  },

  getSnoozeSelect: function aev_getSnoozeSelect() {
    return this.snoozeButton.getValue();
  },

  getRepeatSelect: function aev_getRepeatSelect() {
    return this.repeatButton.getValue();
  },

  save: function aev_save(callback) {
    if (this.element.dataset.id !== '') {
      this.alarm.id = parseInt(this.element.dataset.id, 10);
    } else {
      delete this.alarm.id;
    }
    var error = false;

    this.alarm.label = this.labelInput.value;

    var time = this.getTimeSelect();
    this.alarm.time = [time.hour, time.minute];
    this.alarm.repeat = this.repeatButton.getValue();
    this.alarm.sound = this.getSoundSelect();
    this.alarm.vibrate = this.getVibrateSelect();
    this.alarm.snooze = parseInt(this.getSnoozeSelect(), 10);

    if (!error) {
      this.alarm.cancel();
      this.alarm.setEnabled(true, function(err, alarm) {
        if (err) {
          callback && callback(err, alarm);
          return;
        }
        AlarmList.refreshItem(alarm);
        AlarmList.banner.show(alarm.getNextAlarmFireTime());
        AlarmManager.updateAlarmStatusBar();
        callback && callback(null, alarm);
      });
    } else {
      // error
      if (callback) {
        callback(error);
      }
    }

    return !error;
  },

  delete: function aev_delete(callback) {
    if (!this.alarm.id) {
      setTimeout(callback.bind(null, new Error('no alarm id')), 0);
      return;
    }

    this.alarm.delete(function aev_delete(err, alarm) {
      AlarmList.refresh();
      AlarmManager.updateAlarmStatusBar();
      callback && callback(err, alarm);
    });
  }

};
