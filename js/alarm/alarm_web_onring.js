'use strict';

var RingWebView = {
  _ringtonePlayer: null,
  _onFireAlarm: {},
  showed: false,
  alarmTitle: null,
  alarmContent: null,
  
  init: function rv_init(ofalarm) {
    this.alarmTitle = document.getElementById('alarm-title');
    this.alarmContent = document.getElementById('alarm-content');
    document.addEventListener('visibilitychange', this);
    
    this._onFireAlarm = ofalarm;
    var self = this;
    
    if( RingWebView.getAlarmType() == 1 ) {
      $(".alarm-icon").hide();
      $(".timer-icon").show();
    } else {
      $(".alarm-icon").show();
      $(".timer-icon").hide();
    }

    if( RingWebView.getAlarmSnooze() > 0 ) {
      $(".ring-sleft").show();
      $(".ring-sright").show();
      $(".ring-smiddle").show();
      $(".ring-close").css('right', '200px');
    } else {
      $(".ring-sleft").hide();
      $(".ring-sright").hide();
      $(".ring-smiddle").hide();
      $(".ring-close").css('right', '140px');
    }

    $('.ring-middle').click(function() {      
      RingWebView.stopAlarmNotification();
      RingWebView.hide();
    });

    $('.ring-smiddle').click(function() {
      RingWebView.stopAlarmNotification();
      ActiveAlarm.WebsnoozeHandler();
      RingWebView.hide();
    });
    self.setAlarmTitle();
    self.setAlarmContent();
  },
  
  setAlarmTitle: function rv_setAlarmTitle() {
    var label = this.getAlarmTitle();
    this.alarmTitle.textContent = (label === '') ? 'Alarm Title' : label;
  },
  
  show: function() {
    this.startAlarmNotification();
    $('.AlarmOnRingPopupLayer').css({opacity: '1', 'z-index': '2001'});
    $('#overlay').show();
    $('.AlarmOnRingPopupLayer').show();
    this.showed = true;
  },
  
  hide: function() {
    this.showed = false;
    $('#overlay').hide();
    $('.AlarmOnRingPopupLayer').hide();
  },

  setAlarmContent: function rv_setAlarmContent() {
    var label = this.getAlarmContent();
    this.alarmContent.textContent = (label === '') ? 'Alarm Content' : label;
  },

  ring: function() {
    this._ringtonePlayer = new Audio();
    var ringtonePlayer = this._ringtonePlayer;
    ringtonePlayer.addEventListener('mozinterruptbegin', this);
    ringtonePlayer.mozAudioChannelType = 'alarm';
    ringtonePlayer.loop = true;
    var selectedAlarmSound = 'music/' +
                             this.getAlarmSound() + ".wav";
    ringtonePlayer.src = selectedAlarmSound;
    ringtonePlayer.play();
    //console.log(ringtonePlayer);
    /* If user don't handle the onFire alarm,
       pause the ringtone after 15 minutes */
    var self = this;
    var duration = 60000 * 15;
    window.setTimeout(function rv_pauseRingtone() {
      self.stopAlarmNotification('ring');
    }, duration);
  },

  startAlarmNotification: function() {
    if (this._onFireAlarm.sound) {
      this.ring();
    }
  },

  stopAlarmNotification: function rv_stopAlarmNotification(action) {
    switch (action) {
    case 'ring':
      if (this._ringtonePlayer)
        this._ringtonePlayer.pause();

      break;
    default:
      if (this._ringtonePlayer)
        this._ringtonePlayer.pause();

      break;
    }
  },

  getAlarmTitle: function am_getAlarmTitle() {
    return this._onFireAlarm.title;
  },

  getAlarmContent: function am_getAlarmContent() {
    return this._onFireAlarm.content;
  },

  getAlarmSnooze: function am_getAlarmSnooze() {
    return this._onFireAlarm.snooze;
  },

  getAlarmSound: function am_getAlarmSound() {
    return this._onFireAlarm.sound;
  },

  getAlarmType: function am_getAlarmType() {
    return this._onFireAlarm.type;
  },

  handleEvent: function rv_handleEvent(evt) {
    switch (evt.type) {
    case 'visibilitychange':
      if (!this.showed)
      this.startAlarmNotification();
      break;
    case 'mozinterruptbegin':
      this.stopAlarmNotification();
      break;
    }
  }
};
