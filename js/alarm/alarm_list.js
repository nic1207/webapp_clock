'use strict';

var AlarmList = {

  alarmList: [],
  refreshingAlarms: [],
  item_num: 0,
  drop_stop: 0,
  hold_flag: false,
  alarms: null,

  startMove: function al_startMove() {
   
    //$('.movable').bind('mousemove', function(event) {
    $('body').bind('mousemove', function(event) {
      event.preventDefault();
      event.stopPropagation();

      var thisX = event.pageX, thisY = event.pageY;
      //dba.innerHTML = thisX + " ," + thisY;
      //console.log(thisX + " ," + thisY);
      $('.movable').css('position', 'fixed');
      $('.movable').css('z-index', '1500');
      var w = $('.movable').width()/2;
      //console.log('w=',w);
      $('.movable').offset({
        left: thisX - w,
        top: thisY-20
      });
      
    });

    //$('.movable').bind('touchmove', function(event) {
    $('body').bind('touchmove', function(event) {
      event.preventDefault();
      event.stopPropagation();
      
      var touch = event.originalEvent.touches[0];
      var thisX = touch.pageX, thisY = touch.pageY;
      //dba.innerHTML = thisX + " ," + thisY;
      //console.log(thisX + " ," + thisY);
      $('.movable').css('position', 'fixed');
      $('.movable').css('z-index', '1500');
      var w = $('.movable').width()/2;
      $('.movable').offset({
        left: thisX-w,
        top: thisY-20
      });
      return false;
    });

  },

  endMove: function al_endMove() {
    var $this = $('.movable');
    var image_width = 128;
    var frame_count = 5;
    // create container
    var $puff = $('<div class="puff"></div>').css({
      height: $this.outerHeight(),
      left: $this.offset().left,
      top: $this.offset().top,
      width: $this.outerWidth(),
      position: 'absolute',
      overflow: 'hidden'
    }).appendTo('body');

    // add the animation image
    var scale_factor = 0.7;//$this.outerWidth() / image_width;
    var $image = $('<img class="puff" src="images/alarm/epuff.png"/>').css({
      width: image_width * scale_factor,
      height: (frame_count * image_width) * scale_factor
    }).data('count', frame_count).appendTo($puff);

    // remove the original element
    $this.animate({
      opacity: 0
    }, 'fast').remove();

    (function animate() {
      var count = $image.data('count');
      if (count) {
        var top = frame_count - count;
        var height = $image.height() / frame_count;
        $image.css({
          'top' : -(top * height),
          'position' : 'absolute'
        });
        $puff.css({
          'height' : height
        });
        $image.data('count', count - 1);
        setTimeout(animate, 75);
      } else {
        $image.parent().remove();
      }
    })();
  },

  checkMovepos: function al_checkMovePos() {
    //console.log("movable.offset=",$('.movable').offset());
    var my = $('.movable').offset().top;
    var mx = $('.movable').offset().left;

    var d_left = $('.ca-menu').offset().left;
    var d_top = $('.ca-menu').offset().top;
    var d_width = $('.ca-menu').outerWidth();
    var d_height = 260;//$('.ca-menu').outerHeight();

    if ((mx > d_left) && (my >= d_top) &&
        (mx < (d_left + d_width)) && (my < (d_top + d_height))) {
      return true;
    }
    else {
      return false;
    }
  },

  handleEvent: function al_handleEvent(evt) {
    var link = evt.target;
    if (!link)
      return;

    //console.log('!!!!!!!!!!!!!!!!!!!='+ link.classList, evt.type);

    /*
    if (link.classList.contains('ca-icon') && evt.type.contains('click') ) {
      console.log("ca-icon");
      AlarmEditor.init(this.getAlarmFromList(parseInt(link.dataset.id, 10)));
      AlarmPOPup.notice_show();
    } else */
    //console.log(evt.type.);
    if (link.classList.contains('onoffswitchsmall-checkbox') &&
    //	  evt.type.contains('click')) {
        evt.type.indexOf('click')!=-1) {
      this.toggleAlarmEnableState(link.checked,
        this.getAlarmFromList(parseInt(link.id.substring(5), 10)));
    }
    else if (link.classList.contains('ca-icon') &&
       (evt.type.indexOf('mousedown')!=-1 ||
       evt.type.indexOf('touchstart')!=-1)) {
    //         (evt.type.contains('mousedown') ||
    //          evt.type.contains('touchstart'))) {

      this.hold_flag = false;
      this.drop_stop = setTimeout(function(self) {
                         self.hold_flag = true;
                         $('.alarm-cell[data-id=' + link.dataset.id + ']').
                          css('opacity', '0.7');
                         $('.alarm-cell[data-id=' + link.dataset.id + ']').
                          addClass('movable');
                         self.startMove();
                       },100, this);
    }
    else if ((link.classList.contains('ca-icon') ||
             link.classList.contains('movable')) &&
             (evt.type.indexOf('mouseup')!=-1 ||
             evt.type.indexOf('touchend')!=-1)) {
    //               (evt.type.contains('mouseup') ||
    //                evt.type.contains('touchend'))) {

      if (!this.hold_flag) {
        clearTimeout(this.drop_stop);
      }
      else {
        //console.log("XXXXXXXXXX");
        //$('.movable').unbind('mousemove touchmove', function(event) {});
        $('body').unbind('mousemove touchmove');
        this.hold_flag = false;
        if (this.checkMovepos()) {
          this.refresh();
        }
        else {
          this.deleteCurrent(parseInt(link.dataset.id, 10));
          this.endMove();
        }

        $('.alarm-cell[data-id=' + link.dataset.id + ']').
          removeClass('movable');
      }
    }
  },

  init: function al_init() {
    this.alarms = document.getElementById('alarms');
    //true 由外而內 false 由內而外
    this.alarms.addEventListener('click', this, true);
    this.alarms.addEventListener('mousedown', this, true);
    this.alarms.addEventListener('mousemove', this, true);
    this.alarms.addEventListener('mouseup', this, true);

    this.alarms.addEventListener('touchstart', this, true);
    this.alarms.addEventListener('touchmove', this, true);
    this.alarms.addEventListener('touchend', this, true);
    this.refresh();
    AlarmManager.regUpdateAlarmEnableState(this.refreshItem.bind(this));
  },

  refresh: function al_refresh() {
    var self = this;
    AlarmManager.getAlarmList(function al_gotAlarmList(list) {
      self.fillList(list);
    });
  },

  pad2: function al_pad2(number) {
    return (number < 10 ? '0' : '') + number;
  },


  buildAlarmContent: function al_buildAlarmContent(alarm) {
    var d = new Date();
    var curr_date, curr_month, curr_year, YMD;

    if ( (alarm.snoozeAlarmId == '') && 
         (alarm.repeat == '0000000') && 
         isAlarmPassToday(alarm.hour, alarm.minute)) {
        var today = new Date();
        d.setDate(today.getDate() + 1);
    }

    curr_date = d.getDate();
    curr_month = d.getMonth() + 1; //Months are zero based
    curr_year = d.getFullYear();
    YMD = curr_year + '.' + this.pad2(curr_month) +
              '.' + this.pad2(curr_date);

    var summaryRepeat =
      (alarm.repeat === '0000000') ? YMD : summarizeDaysOfWeek(alarm.repeat);
    var isChecked = alarm.enabled ? ' checked="true"' : '';
    var times = formatTime(parseInt(alarm.hour, 10),
                           parseInt(alarm.minute, 10));
    var label = (alarm.content === '') ? 'Alarm' : escapeHTML(alarm.content);

    return '  <div class="ca-sub">' + summaryRepeat + '</div>' +
           '  <div class="ca-icon" data-id="' + alarm.id +
           '">' + times + '</div>' +
           '  <div class="ca-content" >' +
           '  <div class="ca-main" >' + label + '</div>' +
           '  <label class="ca-ring">Ringtone</label>' +
           '  <div class="onoffswitchsmall">' +
           '  <input type="checkbox" name="chbx_' + alarm.id +
           '" class="onoffswitchsmall-checkbox" id="chbx_' + alarm.id +
           '" ' + isChecked + '>' +
           '  <label class="onoffswitchsmall-label" for="chbx_' + alarm.id +
           '">' +
           '  <div class="onoffswitchsmall-inner"> </div>' +
           '  <div class="onoffswitchsmall-switch"> </div>' +
           '  </label>' +
           '  </div>' +
           '  </div>';
  },

  refreshItem: function al_refreshItem(alarm) {
    if (alarm.type == 0) {
      this.setAlarmFromList(alarm.id, alarm);
      var id = 'div[data-id="' + alarm.id + '"]';
      var alarmItem = this.alarms.querySelector(id);
      if(alarmItem)
        alarmItem.parentNode.innerHTML = this.buildAlarmContent(alarm);
      // clear the refreshing alarm's flag
      //var index = this.refreshingAlarms.indexOf(alarm.id);
      //this.refreshingAlarms.splice(index, 1);
    }
  },

  fillList: function al_fillList(alarmDataList) {
    this.alarmList = alarmDataList;
    this.item_num = 0;

    this.alarms.innerHTML = '';
    alarmDataList.forEach(function al_fillEachList(alarm) {
      if (alarm.type == 0) {
        var li = document.createElement('li');
        li.className = 'alarm-cell';
        li.setAttribute('data-id', alarm.id);
        li.innerHTML = this.buildAlarmContent(alarm);
        this.alarms.appendChild(li);
        this.item_num = this.item_num + 1;
      }
    }.bind(this));

    var set_width = this.item_num * 215;
    $('.scrollableArea').css('width', set_width);
  },

  getAlarmFromList: function al_getAlarmFromList(id) {
    for (var i = 0; i < this.alarmList.length; i++) {
      if (this.alarmList[i].id === id)
        return this.alarmList[i];
    }
    return null;
  },

  setAlarmFromList: function al_setAlarmFromList(id, alarm) {
    for (var i = 0; i < this.alarmList.length; i++) {
      if (this.alarmList[i].id === id) {
        this.alarmList[i] = alarm;
        return;
      }
    }
  },

  getAlarmCount: function al_getAlarmCount() {
    return this.alarmList.length;
  },

  toggleAlarmEnableState: function al_toggleAlarmEnableState(enabled, alarm) {
    //if (this.refreshingAlarms.indexOf(alarm.id) !== -1) {
    //  return;
    //}
    if (!alarm)
      return;

    if (alarm.enabled === enabled)
      return;

    alarm.enabled = enabled;
    //this.refreshingAlarms.push(alarm.id);

    var self = this;
    AlarmManager.putAlarm(alarm, function al_putAlarm(alarm) {
    if (!alarm.type && !alarm.enabled &&
        !alarm.normalAlarmId && !alarm.snoozeAlarmId) {
        self.refreshItem(alarm);
      } else {
        AlarmManager.toggleAlarm(alarm, alarm.enabled);
      }
    });
  },

  deleteCurrent: function al_deleteCurrent(id) {
    if (id < 0)
    {
      console.log(id);
      return;
    }
    var alarm = this.getAlarmFromList(id);
    var self = this;

    AlarmManager.delete(alarm, function al_deleted() {
      self.refresh();
    });

    var scrollElement = $('div#nav');
    scrollElement.smoothDivScroll();
    scrollElement.data('scrollWrapper').scrollLeft(0);
  }

};
