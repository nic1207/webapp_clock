'use strict';
/*
 * alarm for web
 */
var AlarmWeb = {
  ticker: null,
  alarmList: null,
  
  init: function() {
    $('.AlarmOnRingPopupLayer').hide();
    if (navigator.mozAlarms)
      return;
    console.log("AlarmWeb.init()");
    if(this.alarmList==null)
      this.refresh();
    this.ticker = setInterval(function(self) {
      self.checkTime();
    }, 1000, this);//1000ms檢查一次
  },
  
  loadAlarmList: function() {
    this.refresh();
  },

  filterList: function(al) {
    this.alarmList = new Array();
    for(var i=0;i<al.length;i++) {
      if(!al[i].enabled)
        continue;
      //if(isAlarmPassToday(al[i].hour,al[i].minute))
      //  continue;
      this.alarmList.push(al[i]);
    }
    //console.log(this.alarmList);
  },
  
  refresh: function() {
    if (navigator.mozAlarms)
      return;
    //console.log("AlarmWeb.refresh()");
    this.alarmList = null;
    var self = this;
    AlarmManager.getAlarmList(function(list) {
      self.filterList(list);
    });
  },
  
  pad2: function al_pad2(number) {
    if(typeof number == 'string')
      return '';
    else
      return (number < 10 ? '0' : '') + number;
  },
  
  checkTime: function() {
    //console.log("checkTime()");
    if (navigator.mozAlarms)
      return;
    if(this.alarmList==null)
      return;
    var dt = new Date();
    var nowTime = this.pad2(dt.getHours()) + ":" + this.pad2(dt.getMinutes()) 
      + ":" + this.pad2(dt.getSeconds());
    //console.log(nowTime);
    for(var i=0;i<this.alarmList.length;i++) {
      var alarmTime = null;
      if(this.alarmList[i].type==1) {
        alarmTime = this.pad2(this.alarmList[i].hour) + ":" +
          this.pad2(this.alarmList[i].minute) + ":" + 
          this.pad2(this.alarmList[i].second);
      } else {
        alarmTime = this.alarmList[i].hour + ":" +
          this.alarmList[i].minute + ":01";
      }
      
      //console.log(nowTime,alarmTime);
      //console.log(alarmTime);
      if(nowTime==alarmTime) {
        console.log("!!!");
        ActiveAlarm.onWebAlarmFiredHandler(this.alarmList[i]);
        this.refresh();
        break;
      }
    }
  }
};