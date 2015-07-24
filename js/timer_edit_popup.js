'use strict';

var TimerPopup = {

  init: function() {
    //console.log('timer popup init()');
    $('#overlay').hide();
    $('.TimerEditPopupLayer').hide();
  },

  show: function() {
    $('#overlay').show();
    $('.TimerEditPopupLayer').show();
    $('.TimerEditPopupLayer').animate({opacity: '1', 'z-index': '1001'});
  },
  
  hide:function() {
    $('.TimerEditPopupLayer').animate({opacity: '0', 'z-index': '-10'},0)
      .hide();
    $('#overlay').hide();
  }
};

$(document).ready(function() {
  $('#overlay').hide();
  $('.TimerEditPopupLayer').hide(); 
  
  $('#timerSave').click(function(event) {
    TimerPopup.hide();
    //TimerEditor.save(true);
    Timer.callCounting(event);
  });

  $('#buttonSpan').click(function() {
    //console.log('!!!!');
    Timer.timerStop();
    TimerPopup.show();
    //TimerEditor.init();
    Timer.popupInit();
  });
  
  $('#timer-hour').change(function() {
    var re = /^[0-9]+$/;
    var ah = $(this).get(0);
    if (!re.test(ah.value))
      ah.value = '0';
    if(parseInt(ah.value)<0)
      ah.value = '0';
    if(parseInt(ah.value)>23)
      ah.value = '23';
  });
                                          
  $('#timer-min').change(function() {
    var re = /^[0-9]+$/;
    var ah = $(this).get(0);
    if (!re.test(ah.value))
      ah.value = '0';       
    if(parseInt(ah.value)<0)
      ah.value = '0';        
    if(parseInt(ah.value)>59)
      ah.value = '59';
  });
  
  $('#timer-sec').change(function() {
    var re = /^[0-9]+$/;
    var ah = $(this).get(0);
    if (!re.test(ah.value))
    ah.value = '0';        
    if(parseInt(ah.value)<0) 
      ah.value = '0';        
    if(parseInt(ah.value)>59)
      ah.value = '59';
  });
});