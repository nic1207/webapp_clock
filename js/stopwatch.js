'use strict';

var loadDigitNo = function() {
  //console.log('load digits menifest');

  var digit0 = 'images/stopwatch/digit0.png';
  var digit1 = 'images/stopwatch/digit1.png';
  var digit2 = 'images/stopwatch/digit2.png';
  var digit3 = 'images/stopwatch/digit3.png';
  var digit4 = 'images/stopwatch/digit4.png';
  var digit5 = 'images/stopwatch/digit5.png';
  var digit6 = 'images/stopwatch/digit6.png';
  var digit7 = 'images/stopwatch/digit7.png';
  var digit8 = 'images/stopwatch/digit8.png';
  var digit9 = 'images/stopwatch/digit9.png';

  var digitno = [digit0, digit1, digit2, digit3,
    digit4, digit5, digit6, digit7,
    digit8, digit9
  ];

  return digitno;
};

var StopWatch = {
  displayArea: null,
  recordList: null,
  digitno: null,
  sw: null,
  startBtn: null,
  lapBtn: null,
  pauseBtn: null,
  stopBtn: null,
  headNut: null,
  sideNut: null,
                                       
  //初始化
  init: function() {
    //console.log('stopwatch.init()');
    this.displayArea = document.getElementById('stopwatch');
    var docHeight = document.documentElement.clientHeight;
    this.recordList = document.getElementById('recordList');
    //if(this.recordList)
    //  this.recordList.style.height = docHeight * 0.7 + 'px';
    this.startBtn = document.getElementById('startBtn');
    this.lapBtn = document.getElementById('lapBtn');
    this.pauseBtn = document.getElementById('pauseBtn');
    this.stopBtn = document.getElementById('stopBtn');  
    this.headNut = document.getElementById('headNut');
    this.sideNut = document.getElementById('sideNut');
    
    if(this.sw==null) {
      var digitno = loadDigitNo();
      this.sw = new StopwatchObj(digitno);
      this.sw.initPosition();
    }
    
    if(this.startBtn)
    this.startBtn.addEventListener('click', function() {
      if (!StopWatch.sw.started) {
        StopWatch.sw.start();
      }
      StopWatch.startBtn.className = 'hide';
      StopWatch.pauseBtn.className = 'show';
      StopWatch.lapBtn.className = 'show';  
      StopWatch.stopBtn.className = 'hide'; 
    });
    
    if(this.pauseBtn)
    this.pauseBtn.addEventListener('click', function() {
      StopWatch.startBtn.className = 'show';
      StopWatch.pauseBtn.className = 'hide';
      StopWatch.lapBtn.className = 'hide';  
      StopWatch.stopBtn.className = 'show'; 
      StopWatch.sw.stop();
    });
    
    if(this.lapBtn) {
    this.lapBtn.addEventListener('click', function() {
      StopWatch.sw.lap();
    });
    }
    
    if(this.stopBtn)
    this.stopBtn.addEventListener('click', function() {
      StopWatch.sw.reset();
    });
    
    if(this.headNut)      
    this.headNut.addEventListener('click', function() {
      if (!StopWatch.sw.started) {
        StopWatch.sw.start();
        if(StopWatch.startBtn)
        StopWatch.startBtn.className = 'hide';
        if(StopWatch.pauseBtn)
        StopWatch.pauseBtn.className = 'show';
        if(StopWatch.lapBtn)
        StopWatch.lapBtn.className = 'show';  
        if(StopWatch.stopBtn)
        StopWatch.stopBtn.className = 'hide'; 
      } else {
        StopWatch.sw.stop();
        if(StopWatch.startBtn)
        StopWatch.startBtn.className = 'show';
        if(StopWatch.pauseBtn)
        StopWatch.pauseBtn.className = 'hide';
        if(StopWatch.lapBtn)
        StopWatch.lapBtn.className = 'hide';  
        if(StopWatch.stopBtn)
        StopWatch.stopBtn.className = 'show'; 
      }
    });
    
    if(this.sideNut)
    this.sideNut.addEventListener('click', function() {
      if (StopWatch.sw.started) {
        StopWatch.sw.lap();
      } else {
        StopWatch.sw.reset();
      }
    });
  },

  //設定顯示
  show: function() {
    //console.log('stopwatch.show()');
    if(this.displayArea!=null)
      this.displayArea.className = 'display';
  },
  //設定隱藏
  hide: function() {
    //console.log('stopwatch.hide()');
    if(this.displayArea!=null)
      this.displayArea.className = 'hidden';
  }
};

var StopwatchObj = function(digitno) {
  //console.log("StopwatchObj=",this);
  this.started = false;
  
  this.startTime = 0;
  this.totalElapsed = 0;
  this.tickInterval = null;
  this.hours = 0;
  this.mins = 0;
  this.secs = 0;
  this.ms = 0;
  
  this.msselector = null;
  this.mselector = null;
  this.sselector = null;
  if(this.msselector==null)
    this.msselector = $('.sw_microsec');//cache起來 避免在loop中使用selector
  if(this.sselector==null)
    this.sselector = $('.sw_second');//cache起來 避免在loop中使用selector
  if(this.mselector==null)
    this.mselector = $('.sw_minute');//cache起來 避免在loop中使用selector
                                     

  this.onehour = 1000 * 60 * 60;
  this.onemin = 1000 * 60;
  this.onesec = 1000;

  var scale = 0.6;

  var recordList = document.getElementById('recordList');
  var lapCount = 1;

  var secHand = new Image();
  var minHand = new Image();
  minHand.src = 'images/stopwatch/Clock2-14.png';
  secHand.src = 'images/stopwatch/Clock2-15.png';
  
  secHand.onload = function() {
    this.loaded = true;
    swContext.drawImage(secHand,
      302 * scale, 148 * scale, 
      secHand.width * scale,    
      secHand.height * scale);
  }
  minHand.onload = function() {
    this.loaded = true;
    swContext.drawImage(minHand,
      302 * scale, 194 * scale,       
      minHand.width * scale,                  
      minHand.height * scale);
  }
  
  var swCanvas = document.getElementById('stopwatchCanvas');
  var swContext = swCanvas.getContext('2d');
  var watchWidth = 662;
  var watchHeight = 746;
  swCanvas.width = watchWidth * scale;
  swCanvas.height = watchHeight * scale;
  var swCanvasWidth = swCanvas.width;
  var swCanvasHeight = swCanvas.height;
  
  var fpad = function(no, digits) {
    no = no.toString();
    while (no.length < digits)
      no = '0' + no;
    return no;
  };
  this.timeToString = function() {
    return fpad(this.mins, 2) + "'" + fpad(this.secs, 2) + '"\t' + fpad(this.ms, 2);
  };

  var showDigits = function(selector, no) {
    if(selector[0]==undefined)return;
    no = fpad(no,2);
    if (no.length == 1) {
      var j = no[0];
      var src = digitno[j];
      if(selector[1].src != src)
        selector[1].src = src;
      if(selector[0].src != digitno[0])  
        selector[0].src = digitno[0];
    } else if (no.length == 2) {
      var i = 0;
      while (i < no.length) {
        var j = no[i];
        var src = digitno[j];
        if(selector[i].src!=src)
          selector[i].src = src;
        i++;
      }
    }
  };
  
  var clearCanvas = function() {
    swContext.clearRect(0, 0, swCanvasWidth, swCanvasHeight);
  };
  
  var getSecondAngle = function(seconds) {
    // Calculate the expected angle
    return 360 / 60 * seconds;
  };
  var getMinuteAngle = function(minutes) {
    // Calculate the expected angle
    return Math.floor((360 / 60) * minutes);
  };
  var drawSecond = function(image, angle) {
    swContext.save();
    swContext.translate((image.width / 2 + 302) * scale,
      (image.height / 2 + 237.5) * scale);
    swContext.rotate(angle * (Math.PI / 180));

    swContext.drawImage(image,
       -(image.width / 2) * scale,
       -(image.height / 2 + 90) * scale,
       image.width * scale,
       image.height * scale);
       
    swContext.restore();
  };
  var drawMinute = function(image, angle) {
    swContext.save();
    swContext.translate((image.width / 2 + 302)  * scale,
      (image.height  /2+ 200) * scale);
    swContext.rotate(angle * (Math.PI / 180));

    swContext.drawImage(image,
      -(image.width / 2) * scale,
      -(image.height / 2 + 6) * scale,
      image.width * scale,
      image.height * scale);

    swContext.restore();
  };


  this.start = function() {
    if (!this.started) {
      this.startTime = new Date().getTime();
      this.started = true;
      this.onTick();
      //tickInterval = setInterval(this.onTick, 123);
      
      $(headNut).animate({
        top: '52px'
      }, 100, function() {
        $(this).animate({
          top: '46px'
        }, 100);
      });
    }
  };

  this.onTick = function () {
    if(!this.started)
      return;
    //swContext.save();
    clearCanvas();
    swCanvas.width = swCanvas.width;
    var elapsed = new Date().getTime() - this.startTime;
    elapsed += this.totalElapsed;
    this.hours = parseInt(elapsed / this.onehour);
    elapsed %= this.onehour;
    var nowmin = parseInt(elapsed / this.onemin);
    
    elapsed %= this.onemin;
    this.sec = elapsed / this.onesec;
    
    var nowsec = parseInt(elapsed / this.onesec);
    this.ms = parseInt((elapsed % this.onesec) / 10);
    showDigits(this.msselector, this.ms);
    if(this.secs!=nowsec) {
      this.secs = nowsec;
      showDigits(this.sselector, this.secs);
    }
    if(this.mins!=nowmin) {
      this.mins = nowmin;
      showDigits(this.mselector, this.mins);
    }
    drawMinute(minHand, getMinuteAngle(this.mins));
    drawSecond(secHand, getSecondAngle(this.sec));
    
    //swContext.restore();
    this.tickInterval = window.requestAnimationFrame(this.onTick.bind(this));
  };

  this.stop = function() {
    this.totalElapsed += new Date().getTime() - this.startTime;
    //console.log("this.totalElapsed=",this.totalElapsed);
    this.started = false;
    //clearInterval(this.tickInterval);
    //window.cancelAnimationFrame(this.tickInterval);
    $(headNut).animate({
      top: '52px'
    }, 100, function() {
      $(this).animate({
        top: '46px'
      }, 100);
    });
    
  };

  this.lap = function() {
    var li = document.createElement('li');
    var time = document.createTextNode(this.timeToString());
    var label = document.createElement('label');
    label.className = ('number');
    var lapNo = document.createTextNode(lapCount + '.');

    label.appendChild(lapNo);
    li.appendChild(label);
    li.appendChild(time);
    if(recordList)
      recordList.insertBefore(li, recordList.childNodes[0]);
    lapCount++;

    $(sideNut).animate({
      top: '92px',
      right: '95px'
    }, 100, function() {
      $(this).animate({
        top: '88px',
        right: '98px'
      }, 100);
    });
  };
  
  this.initPosition = function() {
    clearCanvas();
    swCanvas.width = swCanvas.width;
    if(minHand.loaded) {
      swContext.drawImage(minHand,
        302 * scale, 194 * scale,
        minHand.width * scale,
        minHand.height * scale);
    }
    if(secHand.loaded) {
      swContext.drawImage(secHand,
        302 * scale, 148 * scale,
        secHand.width * scale,
        secHand.height * scale);
    };
  };
  
  this.reset = function() {
    //console.log('Reset Stopwatch');

    if(recordList)
      recordList.innerHTML = '';
    this.startTime = 0;
    this.totalElapsed = 0;
    this.tickInterval = null;
    this.hours = 0;
    this.mins = 0;
    this.secs = 0;
    this.ms = 0;
    lapCount = 1;

    this.initPosition();

    showDigits(this.msselector, this.ms);
    showDigits(this.sselector, this.secs);
    showDigits(this.mselector, this.mins);

    $(sideNut).animate({
      top: '92px',
      right: '95px'
    }, 100, function() {
      $(this).animate({
        top: '88px',
        right: '98px'
      }, 100);
    });
  };
};