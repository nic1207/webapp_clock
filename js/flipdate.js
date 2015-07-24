'use strict';
//日期翻轉
$(document).ready(function() {
  var clock1 = $('.dateclock').FlipClock({
    clockFace: 'DayClock'
  });
});

/*
var FlipDate = {
  current: null,
  pathDouble: "images/flipdate/Double",
  ticker: null,

  init: function() {
    this.current = {
      "m1": -1,
      "m2": -1,
      "s1": -1,
      "s2": -1
    };
    //this.update();
    //setInterval(this.update, 1000);

    this.ticker = setInterval(function(self) {
      self.update();
    }, 1000, this);//1000ms畫一次

  },

  flip: function(upperId, lowerId, changeNumber, pathUpper, pathLower) {
    var upperBackId = upperId+"Back";
    $(upperId).attr('src', $(upperBackId).attr('src')).height("64px")
      .css({"visibility": "visible", 'display': 'inline-block' });

    $(upperBackId).attr('src', pathUpper + parseInt(changeNumber, 10) + ".png");

    $(lowerId).attr('src', pathLower + parseInt(changeNumber, 10) + ".png")
      .height('0px').css({"visibility": "visible", 'display': 'inline-block'});

    $(upperId).animate({'height': 0}, { 'duration': 200,
    defaultEasing: 'easeinoutsine', 'complete': function(){
      $(lowerId).animate({'height': 64},
      { 'duration': 200, defaultEasing: 'easeinoutsine',
      'complete': function(){
        $(lowerId + "Back").attr('src', $(lowerId).attr('src') );
        $(lowerId).add(upperId).css({"visibility": "hidden",
        "display": 'inline-block' }).height('0');
      }});
    }});
  },

  update: function() {
    var now = new Date(),
      m1 = (now.getMonth()+1) / 10,//month1
      m2 = (now.getMonth()+1) % 10,//month2
      d1 = now.getDate() / 10,//day1
      d2 = now.getDate() % 10;//day2
      //pathSingle = paths.singles,
    //var pathDouble = "Double";

    if(m2 !=this.current.m2) {
      this.flip('#minutesUpRight', '#minutesDownRight', m2,
        this.pathDouble + '/Up/Right/', this.pathDouble + '/Down/Right/');
      this.current.m2 = m2;
      this.flip('#minutesUpLeft', '#minutesDownLeft', m1,
        this.pathDouble + '/Up/Left/', this.pathDouble + '/Down/Left/');
      this.current.m1 = m1;
    }
    if (d2 != this.current.d2) {
      this.flip('#secondsUpRight', '#secondsDownRight', d2,
        this.pathDouble + '/Up/Right/', this.pathDouble + '/Down/Right/');
      this.current.d2 = d2;
      this.flip('#secondsUpLeft', '#secondsDownLeft', d1,
        this.pathDouble + '/Up/Left/', this.pathDouble + '/Down/Left/');
      this.current.d1 = d1;
    }
  }
};
*/
