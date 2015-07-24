'use strict';

var RingView = {
  _ringtonePlayer: null,
  _screenLock: null,
  _onFireAlarm: {},
  _started: false,
  alarmTitle: null,
  alarmContent: null,
  
  init: function rv_init() {
    this.alarmTitle = document.getElementById('alarm-title');
    this.alarmContent = document.getElementById('alarm-content');
    document.addEventListener('visibilitychange', this);
    
    this._onFireAlarm = window.opener.ActiveAlarm.getOnFireAlarm();
    var self = this;
    if (!document.hidden) {
      this.startAlarmNotification();
    } else {
      window.setTimeout(function rv_checkHidden() {
        if (!document.hidden) {
          self.startAlarmNotification();
        }
      }, 0);
    }

    if( RingView.getAlarmType() == 1 ) {
        $(".alarm-icon").hide();
        $(".timer-icon").show();
    }
    else {
        $(".alarm-icon").show();
        $(".timer-icon").hide();
    }

    if( RingView.getAlarmSnooze() > 0 ) {
	$(".ring-sleft").show();
	$(".ring-sright").show();
	$(".ring-smiddle").show();
	$(".ring-close").css('right', '200px');
    }
    else {
	$(".ring-sleft").hide();
	$(".ring-sright").hide();
	$(".ring-smiddle").hide();
	$(".ring-close").css('right', '140px');
    }

    $('.ring-middle').click(function() {      
      RingView.stopAlarmNotification();
      window.close();
    });

    $('.ring-smiddle').click(function() {
      RingView.stopAlarmNotification();
      window.opener.ActiveAlarm.snoozeHandler();
      window.close();
    });


    self.setAlarmTitle();
    self.setAlarmContent();

    $('.AlarmOnRingPopupLayer').animate({opacity: '1', 'z-index': '2001'});

  },
  
  setWakeLockEnabled: function rv_setWakeLockEnabled(enabled) {
    // Don't let the phone go to sleep while the alarm goes off.
    // User must manually close it until 15 minutes.
    if (!navigator.requestWakeLock) {
      console.warn('WakeLock API is not available.');
      return;
    }

    if (enabled) {
      this._screenLock = navigator.requestWakeLock('screen');
    } else if (this._screenLock) {
      this._screenLock.unlock();
      this._screenLock = null;
    }
  },

  setAlarmTitle: function rv_setAlarmTitle() {
    var label = this.getAlarmTitle();
    this.alarmTitle.textContent = (label === '') ? 'Alarm Title' : label;
  },

  setAlarmContent: function rv_setAlarmContent() {
    var label = this.getAlarmContent();
    this.alarmContent.textContent = (label === '') ? 'Alarm Content' : label;
  },

  ring: function rv_ring() {
    this._ringtonePlayer = new Audio();
    var ringtonePlayer = this._ringtonePlayer;
    ringtonePlayer.addEventListener('mozinterruptbegin', this);
    ringtonePlayer.mozAudioChannelType = 'alarm';
    ringtonePlayer.loop = true;
    var selectedAlarmSound = 'music/' +
                             this.getAlarmSound() + ".wav";
    ringtonePlayer.src = selectedAlarmSound;
    ringtonePlayer.play();
    /* If user don't handle the onFire alarm,
       pause the ringtone after 15 minutes */
    var self = this;
    var duration = 60000 * 15;
    window.setTimeout(function rv_pauseRingtone() {
      self.stopAlarmNotification('ring');
    }, duration);
  },

  startAlarmNotification: function rv_startAlarmNotification() {
    // Ensure called only once.
    if (this._started)
      return;

    this._started = true;
    this.setWakeLockEnabled(true);
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
    this.setWakeLockEnabled(false);
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
      // There's chance to miss the hidden state when inited,
      // before setVisible take effects, there may be a latency.
      if (!document.hidden) {
        this.startAlarmNotification();
      }
      break;
    case 'mozinterruptbegin':
      // Only ringer/telephony channel audio could trigger 'mozinterruptbegin'
      // event on the 'alarm' channel audio element.
      // If the incoming call happens after the alarm rings,
      // we need to close ourselves.
      this.stopAlarmNotification();
      window.close();
      break;
    }
  }
};

RingView.init();

