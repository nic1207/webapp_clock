'use strict';

var Timer = {
  digitNoMf: null,
  belt: null,
  arrow: null,
  x: null,
  // secs: 0,
  // mins: 0,
  // hours: 0,

  mv_x: null,
  secDatum: -630,
  minDatum: -420,
  hourDatum: -210,
  tickInterval: null,
  onesec: 1000,
  onemin: 1000 * 60,
  onehour: 1000 * 60 * 60,
  targetTime: null,

  canvas: null,
  context: null,
  tWidth: null,
  tHeight: null,
  hand: null,
  scale: 0.7,
  totalSecs: 0,

  previewRingtonePlayer: null,

  hour: 0,
  minute: 0,
  second: 0,

  timerAlarm: {},

  hourSelector: null,
  minSelector: null,
  secSelector: null,
  
  timerHour: null,
  timerMin: null,
  timerSec: null,
  timerTitle: null,
  timerSoundSelect: null,
  timerContent: null,

  reqAnimation: false,  
  arrowInterval: null,

  beltDiv: null,
  
  //初始化
  init: function() {
    //console.log('timer.init()');
    if (!this.previewRingtonePlayer) {
      var dba = document.getElementById('debuga');
      this.previewRingtonePlayer = document.createElement('audio');
      dba.appendChild(this.previewRingtonePlayer);
      
      //this.previewRingtonePlayer
      //mm = '<source src="'+ item.wav + '">',
      //this.previewRingtonePlayer = $('<audio controls>').get(0);
      
      //$(this.previewRingtonePlayer).appendTo('#debuga');
      
    }
                            
    this.timerHour = document.querySelector('input[name="timer-hour"]');
    this.timerMin = document.querySelector('input[name="timer-min"]');
    this.timerSec = document.querySelector('input[name="timer-sec"]');
    this.timerTitle = document.querySelector('input[name="timer-title"]');
    this.timerSoundSelect = document.getElementById('timer-sound-select');
    this.timerContent = document.getElementById('timer-content');
    this.canvas = document.getElementById('timerCanvas');
    this.context = this.canvas.getContext('2d');
    this.hand = new Image();
    this.hand.src = 'images/timer/Clock2-15.png';
    this.hand.onload = function() {
      this.loaded = true;
    };

    this.beltDiv = document.getElementById('beltDiv');

    // this.arrow = new Image();
    // this.arrow.src = 'images/timer/Clock2-65.png';
    // this.arrow.width = 21;
    // this.arrow.height = 70;
    // this.arrow.onload = function() {
    //   this.loaded = true;
    // }

    this.innerInit();
  },

  arrowAnimation: function() {
    // var arrow1 = this.arrow;
    // var arrow2 = this.arrow;

    // arrow1.style = 'position:absolute; top:22px; right:670px;';
    // arrow2.style = 'position:absolute; top:22px; right:675px;';

    // if(this.arrowIntervalCount == 0) {
    //   this.beltDiv.appendChild(arrow1);
    //   this.arrowIntervalCount++;
    // } else if (this.arrowIntervalCount == 1) {
    //   console.log('arrow2');
    //   this.beltDiv.appendChild(arrow2);
    //   this.arrowIntervalCount++;
    // } else if (this.arrowIntervalCount == 2) {
    //   // this.beltDiv.removeChild(arrow1);
    //   // this.beltDiv.removeChild(arrow2);
    //   this.arrowIntervalCount = 0;
    // }
    
    $(this.arrow).animate({
      right: 655},
        800, 'easeOutQuad',
        function() {
          //complete function
          $(this).css('right', '675px');
        }
    );
  },

  cancelArrowAnimation: function() {

  },

  loadDigitNo: function() {
    var digit0 = 'images/timer/digit0.png';
    var digit1 = 'images/timer/digit1.png';
    var digit2 = 'images/timer/digit2.png';
    var digit3 = 'images/timer/digit3.png';
    var digit4 = 'images/timer/digit4.png';
    var digit5 = 'images/timer/digit5.png';
    var digit6 = 'images/timer/digit6.png';
    var digit7 = 'images/timer/digit7.png';
    var digit8 = 'images/timer/digit8.png';
    var digit9 = 'images/timer/digit9.png';

    this.digitNoMf = [digit0, digit1, digit2, digit3,
      digit4, digit5, digit6, digit7,
      digit8, digit9
    ];
  },

  showDigits: function(sect, no) {
    no = no.toString();

    if (no.length == 1) {
      var j = no[0];
      var src = this.digitNoMf[j];
      if(sect[1].src != src)
        sect[1].src = src;
      if(sect[0].src != this.digitNoMf[0])
        sect[0].src = this.digitNoMf[0];
    } else if (no.length == 2) {
      var i = 0;
      while (i < no.length) {
        var j = no[i];
        var src = this.digitNoMf[j];
        if(sect[i].src != src)
          sect[i].src = src;
        i++;
      }
    }
  },

  randNumber: function(datum, mv_x, range) {
    var dist = Math.abs(datum - mv_x);
    //var randNo = Math.floor(Math.random() * 10 + (dist / range));
    var randNo = 0;
    if(range == 3.5) {
      if(dist < 175)
        randNo = Math.floor(Math.random()*10 + (dist/range));
      else
        randNo = 50 + Math.floor(Math.random()*10);
    } else if (range == 8.75) {
      if(dist < 122.5)
        randNo = Math.floor(Math.random()*10 + (dist/range));
      else
        randNo = 14 + Math.floor(Math.random()*10);
    }
    return randNo;
  },

  updateDigitTime: function(h,m,s) {
    //console.log(h);
    if(h!=undefined) {
      if(this.hour!=h)
        this.showDigits(this.hourSelector, h);
      this.hour = h;
    } else
      this.showDigits(this.hourSelector, this.hour); 
    if(m!=undefined) {
      if(this.minute!=m)
        this.showDigits(this.minSelector, m);
      this.minute = m;
    } else
      this.showDigits(this.minSelector, this.minute);
    if(s!=undefined) {
      if(this.second!=s)
        this.showDigits(this.secSelector, s);
      this.second = s;
    } else
      this.showDigits(this.secSelector, this.second);
  },

  fpad: function(no, digits) {
    no = no.toString();
    while(no.length < digits)
      no = '0' + no;
    return no;
  },

  getAngle: function(seconds) {
    return 360 / 60 * seconds;
  },
  clearCanvas: function() {
    this.context.clearRect(0, 0, this.tWidth, this.tHeight);
  },

  innerInit: function(event) {
    console.log("timer.innerInit()");
    ActiveAlarm.init();
    this.loadDigitNo();
    this.belt = document.getElementById('belt');
    this.arrow = document.getElementById('arrow');

    this.belt.addEventListener('mousedown', this.onObject.bind(this));
    this.belt.addEventListener('touchstart', this.onObject.bind(this));
    this.belt.addEventListener('mousemove', this.dragObject.bind(this));
    this.belt.addEventListener('touchmove', this.dragObject.bind(this));
    this.belt.addEventListener('mouseup', this.offObject.bind(this));
    this.belt.addEventListener('touchend', this.offObject.bind(this));

    this.hourSelector = $('.t_hour');
    this.minSelector = $('.t_minute');
    this.secSelector = $('.t_second');


    this.canvas = document.getElementById('timerCanvas');
    this.context = this.canvas.getContext('2d');
    this.tWidth = this.canvas.width;
    this.tHeight = this.canvas.height;

    this.hand.src = 'images/timer/Clock2-15.png';
    this.context.drawImage(this.hand,
      303 * this.scale, 150 * this.scale,
      this.hand.width * this.scale,
      this.hand.height * this.scale
    );

    TimerPopup.init();

    var self = this;
    this.arrowInterval = setInterval(
      function() {
        self.arrowAnimation();
      }, 1000);
  },

  popupInit: function() {
    this.timerAlarm = this.getDefaultTimerAlarm();

    this.timerSoundSelect.addEventListener('change', this);
    this.timerSoundSelect.addEventListener('blur', this);
    this.timerSoundSelect.addEventListener('click', this);

    this.timerHour.value = this.hour;
    this.timerMin.value = this.minute;
    this.timerSec.value = this.second;
    this.timerTitle.value = this.timerAlarm.title;
    this.initSoundSelect();
    this.timerContent.value = this.timerAlarm.content;
  },

  getDefaultTimerAlarm: function aev_getDefaultAlarm() {
    return {
      type: 1, //type 0:alarm 1:timer
      id: '', // for Alarm APP indexedDB id
      normalAlarmId: '', // for request AlarmAPI id (once, repeat)
      snoozeAlarmId: '', // for request AlarmAPI id (snooze)
      title: 'Timer Title',
      content: 'Timer Reminder Notes',
      hour: this.hour,
      minute: this.minute,
      second: this.second,
      enabled: true,
      repeat: '0000000', // flags for days of week, init to false
      sound: 'Alarm_Beep_01',
      snooze: false
    };
  },

  handleEvent: function aev_handleEvent(evt) {
    evt.preventDefault();
    var input = evt.target;
    if (!input)
      return;

    switch (input) {
      case this.timerSoundSelect:
        switch (evt.type) {
          case 'change':
            this.previewSound();
            break;
          case 'blur':
            this.stopPreviewSound();
            break;
          case 'click':
            this.previewSound();
            break;
          default:
          console.log(evt.type);
            break;
        }
        break;
    }
  },

  initSoundSelect: function aev_initSoundSelect() {
    changeSelectByValue(this.timerSoundSelect, 
        this.timerAlarm.sound);
  },

  getSoundSelect: function aev_getSoundSelect() {
    return getSelectedValue(this.timerSoundSelect);
  },

  previewSound: function aev_previewSound() {
    //console.trace();
    var ringtonePlayer = this.previewRingtonePlayer;
    var ringtoneName = this.getSoundSelect();
    var previewRingtone = 'music/' + ringtoneName;
    console.log(previewRingtone);
    //var previewRingtone = 'music/test.mp3';
    //ringtonePlayer = new Audio();
    
    if (!ringtonePlayer) {
      this.previewRingtonePlayer = new Audio();
      //this.previewRingtonePlayer = document.createElement('audio');
      //$('<audio>').html(mm).appendTo('#player');
      ringtonePlayer = this.previewRingtonePlayer;
    } else {
      ringtonePlayer.pause();
    }
    $(ringtonePlayer).html('');
    var source;
    /*
    source = document.createElement('source');
    source.type = 'audio/ogg';
    source.src =  previewRingtone + '.ogg';
    ringtonePlayer.appendChild(source);
    source = document.createElement('source');
    source.type = 'audio/mpeg';
    source.src = previewRingtone +'.mp3';
    ringtonePlayer.appendChild(source);
    */
    source = document.createElement('source');
    source.type = 'audio/wav';
    source.src = previewRingtone +'.wav';
    ringtonePlayer.appendChild(source);
                
    
    //ringtonePlayer.mozAudioChannelType = 'alarm';
    //ringtonePlayer.src = previewRingtone;
    ringtonePlayer.load();
    ringtonePlayer.play();
  },

  stopPreviewSound: function aev_stopPreviewSound() {
    if (this.previewRingtonePlayer)
      this.previewRingtonePlayer.pause();
  },

  onObject: function(event) {
    event.preventDefault();
    //console.log("onObject");
    if (event.type == 'mousedown') {
      this.x = event.clientX;
    } else if (event.type == 'touchstart') {
      this.x = event.touches[0].pageX;
    }
    if (this.tickInterval != null)
      this.timerStop();

    this.popupInit();

    $(this.arrow).hide();
    clearInterval(this.arrowInterval);
  },

  dragObject: function(event) {
    event.preventDefault();
    //console.log("move");
    if (!this.x)
      return false;

    if (event.type == 'mousemove') {
      var offset_x = event.clientX - this.x;
      this.x = event.clientX;
    } else if (event.type == 'touchmove') {
      var offset_x = event.touches[0].pageX - this.x;
      this.x = event.touches[0].pageX;
    }
    this.mv_x = $(this.belt).position().left + offset_x;

    if (this.mv_x < -630) {
      this.x = null;
      return false;
    }

    $(this.belt).css({
      'left': (this.mv_x > 0) ? 0 : this.mv_x
    });

    if (this.mv_x < this.minDatum) {
      this.second = this.randNumber(this.secDatum, this.mv_x, 3.5);
      this.showDigits(this.secSelector, this.second);
      //console.log("secs : " + secs);
    } else if (this.mv_x > this.minDatum && this.mv_x < this.hourDatum) {
      this.minute = this.randNumber(this.minDatum, this.mv_x, 3.5);
      this.showDigits(this.minSelector, this.minute);
    } else if (this.mv_x > this.hourDatum && this.mv_x < 0) {
      this.hour = this.randNumber(this.hourDatum, this.mv_x, 8.75);
      this.showDigits(this.hourSelector, this.hour);
    }

    if (this.mv_x < this.minDatum) {
      this.minute = 0;
      this.updateDigitTime();
    }
    if (this.mv_x < this.hourDatum) {
      this.hour = 0;
      this.updateDigitTime();
    }
    if (this.mv_x == -630) {
      this.second = 0;
      this.minute = 0;
      this.hour = 0;
      this.updateDigitTime();
    }

    this.totalSecs = this.second + (this.minute * 60) + (this.hour * 3600);
    this.clearCanvas();
    this.drawHand(this.hand, this.getAngle(this.totalSecs));
  },

  offObject: function(event) {
    event.preventDefault();
    //console.log("up");

    if (event.type == 'mouseup' ||
      event.type == 'touchend') {
      this.x = null;
    }  

    this.timerHour.value = this.hour;
    this.timerMin.value = this.minute;
    this.timerSec.value = this.second;

    this.callCounting(event);
  },

  callCounting: function(event) {
    //console.log(event.type);
    this.save(event);

    this.totalSecs = this.second + (this.minute * 60) + (this.hour * 3600);
    this.clearCanvas();
    this.drawHand(this.hand, this.getAngle(this.totalSecs));

    this.targetTime = new Date().getTime();
    this.targetTime += (this.second * this.onesec) +
                        (this.minute * this.onemin) +
                        (this.hour * this.onehour);  

    var duration = this.targetTime - new Date().getTime();
    $(this.belt).animate({
        left: this.secDatum
      }, duration
    );
    
    this.reqAnimation = true;
    //console.log("call countdown()");
    this.countDown();
  },

  countDown: function() {
    //this.context.save();
    this.clearCanvas();

    var startTime = new Date().getTime();
    var elapsed = this.targetTime - startTime;

    this.totalSecs = elapsed / 1000;

    //console.log("elapsed : " + elapsed);
    if (elapsed > 0) {
      var hours = Math.floor(elapsed / this.onehour);
      elapsed %= this.onehour;
      var minutes = Math.floor(elapsed / this.onemin);
      elapsed %= this.onemin;
      var seconds = Math.floor(elapsed / this.onesec);
      
      this.updateDigitTime(hours,minutes,seconds);
      this.drawHand(this.hand, this.getAngle(this.totalSecs));
    } else {
      elapsed = 0;
      this.timerStop();
    }

    //this.context.restore();
    if (this.reqAnimation) 
      this.tickInterval = requestAnimationFrame(this.countDown.bind(this));
  },

  timerStop: function() {
    //console.log('timer stop');
    //cancelAnimationFrame(this.tickInterval);
    this.reqAnimation = false;
    this.tickInterval = null;
    $(this.arrow).css('display', 'block');
    var self = this;
    //if(this.arrowInterval==null)
    this.arrowInterval = setInterval(function() {
      self.arrowAnimation();
    },4000);
                                
    $(this.belt).stop(true);
    this.delete();

    $(this.arrow).show();
    var self = this;
    this.arrowInterval = setInterval(
      function() {
        self.arrowAnimation();
      }, 1000
    );
  },

  drawHand: function(image, angle) {
    this.context.save();
    this.context.translate(
      (image.width / 2 * this.scale) + (303 * this.scale),
      (image.height / 2 * this.scale) + (240 * this.scale)
    );

    this.context.rotate(angle * (Math.PI / 180));

    this.context.drawImage(image,
       -(image.width / 2) * this.scale,
       -(image.height / 2 + 90) * this.scale,
       image.width * this.scale,
       image.height * this.scale);

    //this.context.rotate(- angle * (Math.PI / 180));
    this.context.restore();
  },

  getTimerTime: function() {
    var time = {
      hours: this.hour,
      mins: this.minute,
      secs: this.second
    }
    return time;
  },

  setTimerTime: function(hours, mins, secs) {
    this.hour = this.fpad(hours, 2);
    this.minute = this.fpad(mins, 2);
    this.second = this.fpad(secs, 2);
  },

  save: function(event, callback) {
    if(isNaN(this.timerHour.value) || 
        isNaN(this.timerMin.value) ||
        isNaN(this.timerSec.value)) {
      alert('Please Enter Number');
      return false;
    }
    if(this.timerHour.value.toString().length > 2 || 
        this.timerMin.value.toString().length > 2 || 
        this.timerSec.value.toString().length > 2 ||
        this.timerHour.value.toString().length == 0 ||
        this.timerMin.value.toString().length == 0 ||
        this.timerSec.value.toString().length == 0) {
      alert('Time Format Error');
      return false;
    }

    // var totalTime = 0;
    // if(event.type == 'click') {
    //   if(parseInt(this.timerHour.value) == 0 && 
    //     parseInt(this.timerMin.value) == 0) {
    //     return false;
    //   }
    //   this.hour = this.timerHour.value;
    //   this.minute = this.timerMin.value;
    //   this.second = 0;
    //   totalTime = parseInt(this.hour) * 3600 + 
    //               parseInt(this.minute) * 60;
    // } else if (event.type == 'mouseup' ||
    //             event.type == 'touchend') {
    //   this.hour = this.timerHour.value;
    //   this.minute = this.timerMin.value;
    //   totalTime = parseInt(this.hour) * 3600 + 
    //               parseInt(this.minute) * 60 + 
    //               parseInt(this.second);
    // }

    this.hour = this.timerHour.value;
    this.minute = this.timerMin.value;
    this.second = this.timerSec.value;

    var totalTime = parseInt(this.hour) * 3600 + 
                  parseInt(this.minute) * 60 + 
                  parseInt(this.second);
    this.updateDigitTime();

    var d = new Date();
    //console.log("Timer totalTime : " + totalTime);
    d.setSeconds(new Date().getSeconds() + totalTime);

    //console.log("Timer alarm time = " + d.getHours() + 
    //    ":" + d.getMinutes() + ":" + d.getSeconds());
    console.log("Timer Content : " + this.timerContent.value);
    this.timerAlarm.enabled = true;
    this.timerAlarm.title = this.timerTitle.value;
    this.timerAlarm.content = this.timerContent.value;
    this.timerAlarm.hour = d.getHours();
    this.timerAlarm.minute = d.getMinutes();
    this.timerAlarm.second = d.getSeconds();
    this.timerAlarm.sound = this.getSoundSelect();

    AlarmManager.putAlarm(this.timerAlarm, function al_putAlarmList(timer) {
      AlarmManager.toggleAlarm(timer, timer.enabled);
      callback && callback(timer);
      //console.log(timer);
    });

  },

  delete: function(callback) {
    var timer = this.timerAlarm;
    //console.log(timer);
    AlarmManager.delete(timer, function aev_delete() {
      callback && callback(timer);
    });
  }

};


//window.addEventListener('load', Timer.innerInit.bind(Timer));
