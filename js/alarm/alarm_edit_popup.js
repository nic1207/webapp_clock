'use strict';

var AlarmPOPup = {
  
  init: function() {
    //console.log('alarm popup init()');
    $('#overlay').hide();
    $('.AlarmEditPopupLayer').hide();
  },

  show: function() {
    $('#overlay').show();
    $('.AlarmEditPopupLayer').show();
    $('.AlarmEditPopupLayer').css({opacity: '1', 'z-index': '1001'});
  },
  
  hide:function() {
    $('.AlarmEditPopupLayer').css({opacity: '0', 'z-index': '-10'}).hide();
    $('#overlay').hide();
  }
};

$(document).ready(function() {
  $('#overlay').hide();
  $('.AlarmEditPopupLayer').hide(); 
  
  $('#goAlarmSave').click(function() {
    AlarmEditor.save();
    AlarmPOPup.hide();
  });

  $('#AlarmEditBotton').click(function() {
    var size = $('.alarm-cell').length;
    if (size >= 20) {
      alert('Max Setting Clock: 20');
      return;
    }
    AlarmEditor.init();
    AlarmPOPup.show();
  });
  
  $('#alarm-hour').change(function() {
    var re = /^[0-9]+$/;
    var ah = $(this).get(0);
    if (!re.test(ah.value))
      ah.value = '0';
    if(parseInt(ah.value)<0)
      ah.value = '0';
    if(parseInt(ah.value)>23)
      ah.value = '23';
  });
  
  $('#alarm-min').change(function() {
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