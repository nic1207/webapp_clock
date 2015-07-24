'use strict';
// Array of on / off of sections to create numbers
var numberArray = [
  [true, true, false, true, true, true, true],//0
  [false, false, false, true, false, false, true],//1
  [true, false, true, true, true, true, false],//2
  [true, false, true, true, false, true, true],//3
  [false, true, true, true, false, false, true],//4
  [true, true, true, false, false, true, true],//5
  [false, true, true, false, true, true, true],//6
  [true, false, false, true, false, false, true],//7
  [true, true, true, true, true, true, true],//8
  [true, true, true, true, false, false, true] //9
];
//時鐘
var Clock = {
  id: 0,
  prefix: 'clock_',
  hasLocalStorage: 'localStorage' in window,
  //self : null,
  drawType: 'analog',// 顯示類型 : digital / analog
  clockFace: new Image(),
  clockFace2: new Image(),
  clockFaceSmallDay: new Image(),
  clockFaceSmallNight: new Image(),
  hourHand: new Image(),
  minuteHand: new Image(),
  secondHand: new Image(),
  currentTime: new Date(),
  city: null,
  //timeoffset : 0,
  //gmt: 0,
  gmtOffset: null,
  x: 0,
  y: 0,
  size: 0,
  pointSize: 0,
  onColor: 'rgb(0, 255, 0)',
  offColor: 'rgb(20, 20, 20)',
  canvas: null,
  ctx: null,
  margin: 0,
  spacing: 0,
  width: 0,
  canToggle: false,
  scale: 1,
  IMG_HEIGHT: 451,
  IMG_WIDTH: 1200,
  DIGIT_WIDTH: 263,
  DIGIT_HEIGHT: 451,
  splitWidth: 0,
  xSecondStartPos: 0,
  secondWidth: 0,
  secondHeight: 0,
  iHHMMGap: 5,
  iSSGap: 5,
  ticker: null,
  ticker2: null,
  isNight: false,// day/night
  timediv: null,
  timetick: null,
  dayDate: null,

  //以預設值初始化
  initDefault: function(canvas, ctx, canToggle, drawType) {
    //console.log(canvas);
    //console.log(ctx);
    var x = canvas.width / 14, y = canvas.width / 10,
    size = canvas.width / 10, pointSize = canvas.width / 35;
    //console.log(pointSize);
    this.init(x, y, size, pointSize, 'rgb(0,255,0)',
      'rgb(20,20,20)', canvas, ctx, canToggle);
  },

  //初始化
  init: function(x, y, size, pointSize, onColor, offColor,
    canvas, ctx, canToggle, drawType) {
    //console.log("!!!!!!clock.init()");
    this.displayArea = document.getElementById('clock');
    this.dayDate = document.getElementById('clock-day-date');
    var self = this;
    this.clockFace.onload = function() {
      this.loaded = true;
    };
    this.clockFace.src = 'images/clock/analog_clock_marks1.png';
    this.clockFace2.src = 'images/clock/flip_clock.png';
    this.clockFaceSmallDay.src = 'images/clock/Clock2-07.png';
    this.clockFaceSmallNight.src = 'images/clock/Clock2-25.png';

    this.hourHand.src = 'images/clock/hour_hand.png';
    this.minuteHand.src = 'images/clock/minute_hand.png';
    this.secondHand.src = 'images/clock/second_hand.png';

    this.splitWidth = canvas.width / 4;
     this.secondWidth = this.splitWidth / 5;
    this.xSecondStartPos = this.splitWidth * 4 - (this.secondWidth * 2);
    this.secondHeight = canvas.height / 10;
    this.x = x;
    this.y = y;
    this.size = size;
    this.pointSize = pointSize;
    this.onColor = onColor;
    this.offColor = offColor;
    this.canvas = canvas;
    this.canToggle = canToggle;
    //console.log("@@@@@@@@@@@@@@@canToggle=",this.canToggle);
    if (drawType != '')
      this.drawType = drawType;
    this.canvas.onclick = function() {
      self.toggleMode();//切換數位/類比
    };
    if (this.canToggle)
      this.drawType = this.loadStorage('drawType');
    this.ctx = ctx;
    this.margin = this.pointSize;
    this.spacing = this.pointSize / 2;
    this.width = this.size + this.pointSize * 2 + this.margin;

    this.checkIsNight();
    // Draw Alarm
    this.ticker = setInterval(function(self) {
      self.draw();
    }, 950, this);//950ms畫一次

    this.ticker2 = setInterval(function(self) {
      self.checkIsNight();
    }, 60000, this);//60秒檢查一次
  },

  setupTime: function(city, timeoffset) {
    this.city = city;
    this.gmtOffset = timeoffset;
    this.currentTime = this.getCurrentTime();
    this.checkIsNight();
  },

  setUpdateTimeDiv: function(div) {
    this.timediv = div;
    this.timetick = setInterval(function(self) {
      self.UpdateTimeDiv();
    }, 5000, this);//5秒檢查一次
  },

  UpdateTimeDiv: function() {
    //console.log(this.timediv);
    if (this.timediv != null)
      this.timediv.innerHTML = this.getHHMM();
  },

  checkIsNight: function() {
    //console.log(hour);
    var hour = this.currentTime.getHours();
    //console.log(hour);
    if (hour >= 18 || hour < 6)
      this.isNight = true;
    else
      this.isNight = false;
  },

  saveStorage: function(key, value) {
    if (key != undefined && key != '') {
      if (this.hasLocalStorage) {
        //console.log("**LocalStorage.save("+this.prefix + key+":"+value+")");
        //localStorage.clear();
        localStorage.setItem(this.prefix + key, value);
      }
    }
  },
  loadStorage: function(searchkey) {
    if (this.hasLocalStorage) {
      try {
        //console.log(" localStorage.length="+ localStorage.length);
        var value = '';
        for (var i = 0; i < localStorage.length; i++) {
          var key = localStorage.key(i);
          //console.log(key);
          if (key.indexOf(this.prefix) == 0) {
            var shortkey = key.replace(this.prefix, '');
            if (shortkey == searchkey) {
              //console.log("searchkey:"+shortkey);
              value = localStorage.getItem(key);
              break;
            }
          }
        }
        return value;
      }
      catch (e) {}
    }
  },

  //畫時鐘
  draw: function() {
    //console.log(this.id + this.canvas);
    this.currentTime = this.getCurrentTime();
    if (this.drawType == 'digital')
      this.drawDigital2();
    else
      this.drawAnalog();
  },

  clearCanvas: function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },

  getRequiredMinuteAngle: function(currentTime) {
    // Calculate the expected angle
    return Math.floor(((360 / 60) * currentTime.getMinutes()), 0);
  },

  getRequiredHourAngle: function(currentTime) {
    // Calculate the expected angle
    var angel1 = Math.floor(((360 / 12) * currentTime.getHours()), 0);
    var angel2 = Math.floor(((360 / 12) * (currentTime.getMinutes() / 60)), 0);
    return angel1 + angel2;
  },

  getRequiredSecondAngle: function(currentTime) {
    // Calculate the expected angle
    return Math.floor(((360 / 60) * currentTime.getSeconds()), 0);
  },

  rotateAndDraw: function(image, angle) {
    // Rotate around this point
    this.ctx.rotate(angle * (Math.PI / 180));
    // Draw the image back and up
    this.ctx.drawImage(image, 0 - (image.width / 4 * this.scale),
    0 - ((image.height / 2 - 40) * this.scale) ,
    (image.width / 2) * this.scale, image.height / 2 * this.scale);
    this.ctx.rotate(-angle * (Math.PI / 180));
  },

  getHHMM: function() {
    var now = new Date();
    var off = now.getTimezoneOffset();
    var dt = this.gmtOffset != null ? new Date(now.valueOf() +
     ((off + (this.gmtOffset * 60)) * 1000 * 60)) : now;
    var hour = this.pad2(dt.getHours());
    var min = this.pad2(dt.getMinutes());
    //console.log(hour + ":" + min);
    return hour + ':' + min;
  },

  //取得目前時間
  getCurrentTime: function() {
    var now = new Date();
    var off = now.getTimezoneOffset();
    var dt = this.gmtOffset != null ? new Date(now.valueOf() +
     ((off + (this.gmtOffset * 60)) * 1000 * 60)) : now;
    return dt;
  },

  //畫傳統時鐘
  drawAnalog: function() {
    //console.log(this.getHHMM(3));
    this.clearCanvas();
    this.scale = this.canvas.width / 300;
    this.canvas.height = this.canvas.width;
    // Draw the clock onto the canvas
    if (!this.canToggle) {
      if (this.isNight)
        this.ctx.drawImage(this.clockFaceSmallNight, 0, 0,
          this.canvas.width, this.canvas.height);
      else
      {
        this.ctx.drawImage(this.clockFaceSmallDay, 0, 0,
          this.canvas.width, this.canvas.height);
        //console.log(this.id);
      }
    }
    else
      this.ctx.drawImage(this.clockFace, 0, 0, this.canvas.width,
        this.canvas.height);
    // Save the current drawing state
    this.ctx.save();
    // Now move across and down half way
    this.ctx.translate(this.canvas.height / 2,
      this.canvas.width / 2 - 3 * this.scale);
    this.rotateAndDraw(this.hourHand,
      this.getRequiredHourAngle(this.currentTime));
    this.rotateAndDraw(this.minuteHand,
      this.getRequiredMinuteAngle(this.currentTime));
    this.rotateAndDraw(this.secondHand,
      this.getRequiredSecondAngle(this.currentTime));
    // Restore the previous drawing state
    this.ctx.restore();
  },

  //畫數位時鐘1
  drawDigital1: function() {
    this.clearCanvas();
    //if(this.canvas.classList.contains("circleborder"))
    //  this.canvas.classList.remove("circleborder");
    this.canvas.height = this.canvas.width / 2;
    var hour = this.currentTime.getHours();//this.gmt + this.timeoffset;
    var min = this.currentTime.getMinutes();
    var sec = this.currentTime.getSeconds();
    // Add 0 if time is single figure
    hour = this.pad2(hour);
    min = this.pad2(min);
    var seperatorOn = sec % 2 === 0 ? true : false;
    //console.log(hours);
    this.drawNumber(hour.substring(0, 1), this.width * 0);//draw h1
    this.drawNumber(hour.substring(1, 2), this.width * 1);//draw h2
    this.drawSeperator(seperatorOn, this.width * 2);//draw :
    this.drawNumber(min.substring(0, 1), this.width * 3);//draw m1
    this.drawNumber(min.substring(1, 2), this.width * 4);//draw m2
  },

  //畫數位時鐘2
  drawDigital2: function() {
    var time = this.pad2(this.currentTime.getHours()) +
      this.pad2(this.currentTime.getMinutes()) +
      this.pad2(this.currentTime.getSeconds());
    //this.canvas.width = 300;
    var iDigit;
    //console.log(time);
    this.clearCanvas();
    // Draw the HHHH digits onto the canvas
    for (iDigit = 0; iDigit < 4; iDigit++) {
      this.drawHHMMDigit(time, iDigit);
    }
    // Draw scalled second digits
    this.ctx.drawImage(this.clockFace2,
      time.substr(4, 1) * this.DIGIT_WIDTH,
      0, this.DIGIT_WIDTH, this.DIGIT_HEIGHT,
      this.xSecondStartPos, 0, this.secondWidth, this.secondHeight);
    this.ctx.drawImage(this.clockFace2,
      time.substr(5, 1) * this.DIGIT_WIDTH, 0, this.DIGIT_WIDTH,
      this.DIGIT_HEIGHT, this.xSecondStartPos + this.secondWidth,
      0, this.secondWidth, this.secondHeight);
  },

  pad2: function(number) {
    return (number < 10 ? '0' : '') + number;
  },

  drawHHMMDigit: function(time, unit) {
    //console.log(this.clockFace2);
    //console.log(time+":"+unit);
    //console.log(time.substr(unit,1));
    //console.log(time.substr(unit,1) * this.DIGIT_WIDTH);
    var swidth = this.DIGIT_WIDTH;
    var sheight = this.DIGIT_HEIGHT;
    var sx = time.substr(unit, 1) * this.DIGIT_WIDTH;
    var sy = 0;
    var x = unit * 75;
    var y = 0;
    var width = 75;
    var height = 200;

    this.ctx.drawImage(this.clockFace2, sx, sy, swidth,
      sheight, x, y, width, height);
  },

  //畫單一數字
  drawNumber: function(number, offset) {
    //console.log("clock.drawNumber("+ number+" " +numberArray[number]+")");
    this.drawDigitalClockPart(this.size, this.pointSize,
      offset + this.x, this.y, numberArray[number][0]);  // Top bar
    this.drawDigitalClockPart(this.pointSize, this.size,
      offset + this.x - this.spacing, this.y + this.spacing,
      numberArray[number][1]);// Top left Bar
    this.drawDigitalClockPart(this.size, this.pointSize,
      offset + this.x, this.y + this.size + this.spacing * 2,
      numberArray[number][2]);// Middle bar
    this.drawDigitalClockPart(this.pointSize, this.size,
      offset + this.x + this.spacing + this.size,
      this.y + this.spacing, numberArray[number][3]);  // Top right Bar
    this.drawDigitalClockPart(this.pointSize, this.size,
      offset + this.x - this.spacing, this.y + this.size + this.spacing * 3,
      numberArray[number][4]);// Bottom left Bar
    this.drawDigitalClockPart(this.size, this.pointSize,
      offset + this.x, this.y + this.size * 2 + this.spacing * 4,
      numberArray[number][5]);// Bottom bar
    this.drawDigitalClockPart(this.pointSize, this.size,
      offset + this.x + this.spacing + this.size,
      this.y + this.size + this.spacing * 3,
      numberArray[number][6]);// Bottom right Bar
  },

  //畫分隔符號  :
  drawSeperator: function(on, offset) {
    this.ctx.fillStyle = this.getColor(on);
    if (on) {
      this.ctx.shadowBlur = 20;
      this.ctx.shadowColor = this.getColor(on);
    } else {
      this.ctx.shadowBlur = 0;
      this.ctx.shadowColor = this.getColor(false);
    }

    var horzOffset = this.x + offset + (this.width / 2) - (this.pointSize * 2);
    this.ctx.fillRect(horzOffset, this.y + this.width / 2 - this.pointSize / 2,
      this.pointSize, this.pointSize);
    this.ctx.fillRect(horzOffset, this.y + this.width + this.pointSize / 2,
      this.pointSize, this.pointSize);
  },

  //Draws a single part of the digital display
  drawDigitalClockPart: function(width, height, x, y, on) {
    this.ctx.fillStyle = this.getColor(on);
    this.ctx.shadowBlur = on ? 20 : 0;
    this.ctx.shadowColor = this.getColor(on);

    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    // Draw the pointed ends in the right place based on vertical or horizontal
    if (width > height) {
      this.ctx.lineTo(x + height / 2, y + height / 2);
      this.ctx.lineTo(x + width - height / 2, y + height / 2);
      this.ctx.lineTo(x + width, y);
      this.ctx.lineTo(x + width - height / 2, y - height / 2);
      this.ctx.lineTo(x + height / 2, y - height / 2);
    } else {
      this.ctx.lineTo(x + width / 2, y + width / 2);
      this.ctx.lineTo(x + width / 2, y + height - width / 2);
      this.ctx.lineTo(x, y + height);
      this.ctx.lineTo(x - width / 2, y + height - width / 2);
      this.ctx.lineTo(x - width / 2, y + width / 2);
    }
    this.ctx.closePath();
    this.ctx.fill();
  },

  //更新日期文字
  updateDaydate: function() {
    var d = this.currentTime;
    //var f = new navigator.mozL10n.DateTimeFormat();
    //var format = navigator.mozL10n.get('dateFormat');
    //console.log(format);
    //var formated = f.localeFormat(d, format);
    //console.log(formated);
    //console.log(d.toLocaleDateString());
    this.dayDate.innerHTML = d.toDateString();
    //alert(this.dayDate.innerHTML);
    var remainMillisecond = (24 - d.getHours()) * 3600 * 1000 -
      d.getMinutes() * 60 * 1000 - d.getMilliseconds();//計算下次更新時間
    this._updateDaydateTimeout = setTimeout(function(self) {
      self.updateDaydate();
    }, remainMillisecond, this);//設定下次更新時間
  },

  //取得顏色
  getColor: function(on) {
    return on ? this.onColor : this.offColor;
  },

  //切換數位/類比
  toggleMode: function() {
    if (this.canToggle)
    {
      if (this.drawType == 'digital')
        this.drawType = 'analog';
      else
        this.drawType = 'digital';
      this.saveStorage('drawType', this.drawType);
    }
  }

};