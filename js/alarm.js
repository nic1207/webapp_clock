'use strict';

//鬧鐘
var Alarm = {
  clock: null,
  
  //初始化
  init: function() {
    //console.log('alarm.init()');
    ActiveAlarm.init();
    AlarmList.init();
    AlarmPOPup.init();

    $('ul.ca-menu').smoothDivScroll({
       mousewheelScrolling: 'allDirections',
       manualContinuousScrolling: false,
       autoScrollingMode: '',
       visibleHotSpotBackgrounds: 'always',
       touchScrolling: true
    });


  }
};
