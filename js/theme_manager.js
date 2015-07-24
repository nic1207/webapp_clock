'use strict';
//佈景主題管理器
var ThemeManager = {
  name: 'ThemeManager',
  nowTheme: 'morning', // morning | noon | afternoon | night 四種主題
  lastTheme: 'morning', // morning | noon | afternoon | night 四種主題
  nowHour: 0,
  ticker: null,

  //初始化
  init: function() {
    this.autoUpdate();
    this.start();
  },

  //開始
  start: function() {
    this.ticker = setInterval(function(self) {
      self.autoUpdate();
    }, 60000, this);//1分鐘檢查一次
  },

  //停止
  stop: function() {
    clearInterval(this.ticker);
  },

  //換佈景主題
  changeTheme: function() {
    //if(this.lastTheme==this.nowTheme)
    //  return;
    //console.log('changeTheme(' + this.lastTheme + ' to ' + this.nowTheme + ')');
    document.body.className = this.nowTheme;
    //$('body').removeClass(this.lastTheme);
    //$('body').addClass(this.nowTheme);
  },

  //檢查是否達到更換主題的條件
  autoUpdate: function() {
    //console.log('this.nowHour:'+this.nowHour);
    if (this.nowHour != (new Date().getHours()))
    {
      this.nowHour = new Date().getHours();
      //alert(this.nowHour);
      if (this.nowHour >= 5 && this.nowHour < 11) {
        this.lastTheme = this.nowTheme;
        this.nowTheme = 'morning';
      } else if (this.nowHour >= 11 && this.nowHour < 14) {
        this.lastTheme = this.nowTheme;
        this.nowTheme = 'noon';
      } else if (this.nowHour >= 14 && this.nowHour < 18) {
        this.lastTheme = this.nowTheme;
        this.nowTheme = 'afternoon';
       } else {
        //console.log("xxx");
        this.lastTheme = this.nowTheme;
        this.nowTheme = 'night';
      }
      this.changeTheme();
    }
    //console.log("this.name:"+this.name);
    //console.log("this.nowHour: "+this.nowHour);
    //this.changeTheme();
    //console.log("==============================");
  }
};
