'use strict';

var AlarmEditor = {
  alarmHead: null,
  alarmHour: null,
  alarmMin: null,
  alarmRepeat: null,
  alarmTitle: null,
  soundSelect: null,
  snoozeSelect: null,
  alarmContent: null,
  alarm: {},
  previewRingtonePlayer: null,

  pad2: function al_pad2(number) {
    return (number < 10 ? '0' : '') + number;
  },
  
  init: function aev_init(alarm) {
    this.alarmHead = document.getElementById('alarm-head-word');
    this.alarmHour = document.querySelector('input[name="alarm-hour"]');
    this.alarmMin = document.querySelector('input[name="alarm-min"]');
    this.alarmRepeat = document.getElementsByName('alarm-repeat');
    this.alarmTitle = document.querySelector('input[name="alarm-title"]');
    this.soundSelect = document.getElementById('sound-select');
    this.snoozeSelect = document.getElementById('snooze');
    this.alarmContent = document.getElementById('alarm-content');
    this.soundSelect.addEventListener('change', this);
    this.soundSelect.addEventListener('blur', this);

    if (!alarm) {
      this.alarmHead.textContent = 'Add New Alarm';
      alarm = this.getDefaultAlarm();
    } else {
      this.alarmHead.textContent = 'Edit Alarm';
    }

    this.alarm = alarm;

    if (alarm.snooze == '0')
      this.snoozeSelect.checked = false;
    else
      this.snoozeSelect.checked = true;

    this.initTime();
    this.initRepeat();
    this.alarmTitle.value = alarm.title;
    this.initSoundSelect();
    this.alarmContent.value = alarm.content;
  },

  getDefaultAlarm: function aev_getDefaultAlarm() {
    // Reset the required message with default value
    var now = new Date();
    return {
      type: 0, //type 0:alarm 1:timer
      id: '', // for Alarm APP indexedDB id
      normalAlarmId: '', // for request AlarmAPI id (once, repeat)
      snoozeAlarmId: '', // for request AlarmAPI id (snooze)
      title: 'Alarm Title',
      content: 'Alarm !',
      hour: now.getHours(), // use current hour
      minute: now.getMinutes(), // use current minute
      second: 0, // use current second
      enabled: true,
      repeat: '0000000', // flags for days of week, init to false
      sound: 'Alarm_Beep_01',
      snooze: true
    };
  },

  handleEvent: function aev_handleEvent(evt) {
    evt.preventDefault();
    var input = evt.target;
    if (!input)
      return;

    switch (input) {
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
    }
  },

  initTime: function aev_initTime() {
    this.alarmHour.value = this.pad2(parseInt(this.alarm.hour, 10));
    this.alarmMin.value = this.pad2(parseInt(this.alarm.minute, 10));
  },

  initRepeat: function aev_initRepeat() {
    var daysOfWeek = this.alarm.repeat;
    for (var i = 0; i < this.alarmRepeat.length; i++) {
      this.alarmRepeat[i].checked =
        (daysOfWeek.substr(i, 1) === '1') ? true : false;
    }
  },

  getRepeatSelect: function aev_getRepeatSelect() {
    var daysOfWeek = '';
    for (var i = 0; i < this.alarmRepeat.length; i++) {
      daysOfWeek += (this.alarmRepeat[i].checked) ? '1' : '0';
    }
    return daysOfWeek;
  },

  initSoundSelect: function aev_initSoundSelect() {
    changeSelectByValue(this.soundSelect, this.alarm.sound);
  },

  getSoundSelect: function aev_getSoundSelect() {
    return getSelectedValue(this.soundSelect);
  },

  previewSound: function aev_previewSound() {
    var ringtonePlayer = this.previewRingtonePlayer;
    if (!ringtonePlayer) {
      this.previewRingtonePlayer = new Audio();
      ringtonePlayer = this.previewRingtonePlayer;
    } else {
      ringtonePlayer.pause();
    }

    var ringtoneName = this.getSoundSelect();
    var previewRingtone = 'music/' + ringtoneName + ".wav";
    ringtonePlayer.mozAudioChannelType = 'alarm';
    ringtonePlayer.src = previewRingtone;
    ringtonePlayer.play();
  },

  stopPreviewSound: function aev_stopPreviewSound() {
    if (this.previewRingtonePlayer)
      this.previewRingtonePlayer.pause();
  },

  save: function aev_save(callback) {

    if (this.alarm.id == '') {
      delete this.alarm.id;
    }

    var error = false;

    this.alarm.enabled = true;
    this.alarm.title = this.alarmTitle.value;
    this.alarm.content = this.alarmContent.value;
    this.alarm.hour = this.pad2(parseInt(this.alarmHour.value, 10));
    this.alarm.minute = this.pad2(parseInt(this.alarmMin.value, 10));
    this.alarm.second = 0;
    this.alarm.repeat = this.getRepeatSelect();
    this.alarm.sound = this.getSoundSelect();
    this.alarm.snooze = (this.snoozeSelect.checked) ? '5' : '0';

    var alarmT = this.alarm.hour + ':' + this.alarm.minute;
    if (!this.isTimePart(alarmT)) {
      error = true;
      alert('Time Format Error');
    }

    if (!error) {
      AlarmManager.putAlarm(this.alarm, function al_putAlarmList(alarm) {
        AlarmManager.toggleAlarm(alarm, alarm.enabled);
        AlarmList.refresh();
        callback && callback(alarm);

        var scrollElement = $('div#nav');
        scrollElement.smoothDivScroll();
        scrollElement.data('scrollWrapper').scrollLeft(0);
      });
    }

    return !error;
  },

  delete: function aev_delete(callback) {
    if (!this.dataset.id)
      return;

    var alarm = this.alarm;
    AlarmManager.delete(alarm, function aev_delete() {
      AlarmList.refresh();
      callback && callback(alarm);
    });
  },

  isTimePart: function aev_isTimePart(timeStr) {
    var parts = timeStr.split(':');

    if (parts.length < 2) {
      return false;
    }

    for (var i = 0; i < parts.length; i++) {
      if (isNaN(parts[i])) {
        return false;
      }
    }

    var h = parts[0];
    var m = parts[1];

    if (h < 0 || h > 23) {
      return false;
    }
    if (m < 0 || h > 59) {
      return false;
    }

    if (parts.length > 2) {
      var s = parts[2];
      if (s < 0 || s > 59) {
        return false;
      }
    }
    return true;
  }

};
