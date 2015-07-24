'use strict';

//WorldClockEditor
var WorldClockEditor = {
  displayArea: null,

  //初始化
  init: function() {
    this.displayArea = document.getElementById('addworldclock');
    //console.log('WorldClockEditor.init()');
    //this.init_timezone();
  },

  save: function() {
    //console.log('WorldClockEditor.save()');
    var cityname = $('#city').val();
    var timeoffset = parseInt($('#timezone').val(), 10);
    //console.log(cityname,timeoffset);
    if(cityname == ''){
      //console.log("@@@ city is null @@@");
      alert("Please enter a city !");
    }else{
      WorldClock.addClock(cityname, timeoffset);
    }
    $('#search').val('');
    $('#city').val('');
    $('#timezone').val('');
  },

  //設定顯示
  show: function() {
    //console.log('WorldClockEditor.show()');
    if (this.displayArea) {
      this.displayArea.classList.add('display');
      this.displayArea.classList.remove('hidden');
    }
    //console.log(this.displayArea.classList);
  },
  //設定隱藏
  hide: function() {
    //console.log('WorldClockEditor.hide()');
    if (this.displayArea) {
      this.displayArea.classList.remove('display');
      this.displayArea.classList.add('hidden');
    }
    //console.log(this.displayArea.classList);
  }
};
