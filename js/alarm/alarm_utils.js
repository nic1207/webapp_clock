'use strict';

function escapeHTML(str, escapeQuotes) {
  var span = document.createElement('span');
  span.textContent = str;

  if (escapeQuotes)
    return span.innerHTML.replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
  return span.innerHTML;
}

function summarizeDaysOfWeek(bitStr) {

  if (bitStr == '')
    return 'Never';

  // Format bits: 0123456(0000000)
  // Case: Everyday:  1111111
  // Case: Weekdays:  1111100
  // Case: Weekends:  0000011
  // Case: Never:     0000000
  // Case: Specific:  other case  (Mon, Tue, Thu)

  var summary = '';
  switch (bitStr) {
  case '1111111':
    summary = 'Everyday';
    break;
  case '0111110':
    summary = 'Weekdays';
    break;
  case '1000001':
    summary = 'Weekends';
    break;
  case '0000000':
    summary = 'Never';
    break;
  default:
    var weekdays = [];
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var iDay = 0;
    for (var i = 0; i < bitStr.length; i++) {
      if (bitStr.substr(i, 1) == '1') {
        // Note: here, Monday is the first day of the week
        // whereas in JS Date(), it's Sunday -- hence the (+1) here.
        weekdays.push(days[(i % 7)]);
        iDay++;
      }
    }
    summary = weekdays.join(', ');
    if( iDay >= 5 )
      summary = 'Five Days';
  }
  return summary;
}

function isAlarmPassToday(hour, minute) { // check alarm has passed or not
  var now = new Date();
  if (hour > now.getHours() ||
      (hour == now.getHours() && minute > now.getMinutes())) {
    return false;
  }
  return true;
}

function getNextAlarmFireTime(alarm) { // get the next alarm fire time
  var repeat = alarm.repeat;
  var hour = alarm.hour;
  var minute = alarm.minute;
  var second=alarm.second;
  var now = new Date();
  var nextAlarmFireTime = new Date();
  var timer=alarm.type;
  var diffDays = 0; // calculate the diff days from now
  
  if (repeat == '0000000') { // one time only and alarm within 24 hours
    if (isAlarmPassToday(hour, minute) && !timer) // if alarm has passed already
      diffDays = 1; // alarm tomorrow
  } else { // find out the first alarm day from the repeat info.
    //console.log("repeat=",repeat);
    var weekDayFormatRepeat =
      repeat.slice(-1).concat(repeat.slice(0, repeat.length - 1));
    var weekDayOfToday = now.getDay();
    var index = 0;
    for (var i = 0; i < weekDayFormatRepeat.length; i++) {
      index = (i + weekDayOfToday + 1) % 7;
      if (weekDayFormatRepeat.charAt(index) == '1') {
        if (diffDays == 0) {
          if (!isAlarmPassToday(hour, minute)) // if alarm has passed already
            break;

          diffDays++;
          continue;
        }
        break;
      }
      diffDays++;
    }
  }
  //console.log("diffDays=",diffDays);
  nextAlarmFireTime.setDate(nextAlarmFireTime.getDate() + diffDays);
  nextAlarmFireTime.setHours(hour);
  nextAlarmFireTime.setMinutes(minute);
  nextAlarmFireTime.setSeconds(second,0);
  
  return nextAlarmFireTime;
}

function changeSelectByValue(selectElement, value) {
  var options = selectElement.options;
  for (var i = 0; i < options.length; i++) {
    if (options[i].value == value) {
      if (selectElement.selectedIndex != i) {
        selectElement.selectedIndex = i;
      }
      break;
    }
  }
}

function getSelectedValue(selectElement) {
  return selectElement.options[selectElement.selectedIndex].value;
}

function formatTime(hour, minute) {
  var period = '';

  if (hour == 0) {
    hour = '00';
  }

  if (minute < 10) {
    minute = '0' + minute;
  }

  return hour + ':' + minute + period;
}

function parseTime(time) {
  var parsed = time.split(':');
  var hour = +parsed[0]; // cast hour to int, but not minute yet
  var minute = parsed[1];

  // account for 'AM' or 'PM' vs 24 hour clock
  var periodIndex = minute.indexOf('M') - 1;
  if (periodIndex >= 0) {
    hour = (hour == 12) ? 0 : hour;
    hour += (minute.slice(periodIndex) == 'PM') ? 12 : 0;
    minute = minute.slice(0, periodIndex);
  }

  return {
    hour: hour,
    minute: +minute // now cast minute to int
  };
}