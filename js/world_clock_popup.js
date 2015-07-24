/**
 * @author YayaHuang
 */

'use strict';

$(function() {
    $('#overlay').hide();
    $('.PopupLayer').hide();

    function notice_show() {
      $('#overlay').show();
      $('.PopupLayer').show();
      $('.PopupLayer').css({opacity: '1', 'z-index': '1001'});
      $('.ui-autocomplete').css({'z-index': '2001'});
      WorldClock.loadSettingClocks();
      WorldClock.sort();
    }

    function notice_hide() {
      $('.PopupLayer').css({opacity: '0', 'z-index': '-10'})
        .hide();
      $('#overlay').hide();
    }

    $('#WorldClockComplete').click(function() {
      notice_hide();
    });

    $('#goWorldClockEdit').click(function() {
      notice_show();
    });

});

