'use strict';
//文件下載完畢, 進入點
$(document).ready(function() {
//document.addEventListener('DOMContentLoaded',onReady,false);
//window.addEventListener('load',onReady,false);
//function onReady() {
  /*  
  var FPSstats = new Stats();
  FPSstats.setMode(0);
  document.body.appendChild(FPSstats.domElement);
  setInterval(function() {
    FPSstats.begin();
    FPSstats.end();
  }, 1000 / 60 );
  */    
  /*
  //停用頁面捲動功能
  document.body.addEventListener('touchmove', function(event) {
    event.preventDefault();
  }, false);
  */
  
  // Get Canvas & Context
  var canvas = document.getElementById('clockCanvas');
  var ctx = canvas.getContext('2d');

  ThemeManager.init();//佈景主題管理初始化
  Clock.initDefault(canvas, ctx, true, 'analog');//時鐘初始化
  WorldClock.init();
  WorldClockEditor.init();
  Alarm.init();
  //AlarmEditor.init();
  AlarmWeb.init();
  Weather.init();
  Timer.init();
  StopWatch.init();

  //window.location.hash = 'clock';
  
  var swi1 = document.getElementById('onoffswitch');
  var chk1 = document.getElementById('switchToClock');
  var dba = document.getElementById('debuga');
  var swi2 = document.getElementById("tsswitch01");
  var chk2 = document.getElementById('goTimer');
  chk1.checked = true;
  chk2.checked = true;
  $("#view1").show();
  $("#view2").hide();
  $("#view3").hide();
  //swi2.className = 'hidden';
  $(swi2).hide();
  console.log("xxx");
  swi1.addEventListener('touchstart',disp1,false);
  swi1.addEventListener('mousedown',disp1,false);
  //swi1.addEventListener('click',disp1,true);
  //swi2.addEventListener('click',disp2,true);
  swi2.addEventListener('touchstart',disp2,false);
  swi2.addEventListener('mousedown',disp2,false);
  chk1.addEventListener('click',ccc,true);
  chk2.addEventListener('click',ccc,true);
  
  function disp1(e) {
    //dba.innerHTML += "("+e.type+")";
    //dba.innerHTML += "!";
    chk1.checked = !chk1.checked;
    if (chk1.checked) {
      //console.log("("+e.type+")",this.id+" checked");
      //dba.innerHTML += 'z';
      //$('#view1').animate({left:'100%'},"slow");
      $("#view1").show();
      $('#view1').animate({left:0},"fast");
      $("#view2").show();
      $("#view2").animate({left:'-100%'},"fast");
      //$("#view1").fadeIn('slow');
      //$("#view2").fadeOut('slow');
      $("#view3").hide();
      $(swi2).hide();
      //swi2.className = 'hidden';
    } else {
      //console.log("("+e.type+")",this.id+" unchecked");
      //dba.innerHTML += 'a';
      chk2.checked = true;
      //$("#view1").fadeOut('slow');
      //$("#view2").fadeIn('slow');
      //$('#view1').animate({left:0},"slow");
      $("#view1").show();
      $('#view1').animate({left:'100%'},"fast");
      $('#view2').show();
      $('#view2').animate({left:'0'},"fast");
      $("#view3").hide();
      $(swi2).show();
      //swi2.className = 'tsswitch';
    }
    e.preventDefault();
    //e.stopPropagation();    
  }
  
  function disp2(e) {
    //dba.innerHTML += "("+e.type+")";
    //dba.innerHTML += "!";
    chk2.checked = !chk2.checked;
    if (chk2.checked) {
      //console.log("("+e.type+")",this.id+' checked');
      //dba.innerHTML += 'z';  
      $("#view1").hide();
      //$('#view2').animate({left:0},"slow");
      //$('#view3').animate({left:'-100%'},"slow");
      $("#view2").fadeIn('fast');
      $("#view3").fadeOut('fast'); 
    } else {
      //console.log("("+e.type+")",this.id+' unchecked');
      //dba.innerHTML += 'a';
      $("#view1").hide();
      $("#view2").fadeOut('fast');
      $("#view3").fadeIn('fast');       
    }
    e.preventDefault();
    //e.stopPropagation();
  }
  
  function ccc(e) {
    e.preventDefault();
    e.stopPropagation();    
  }
  /*
  $('.goClock').click(function() {
    //console.log("world clock clicked");
    Clock.show();
    WorldClock.show();
    Alarm.show();
    StopWatch.hide();
    Timer.hide();
    window.location.hash = 'clock';
    return false;
  });
  
  $('.goWorldClock').click(function() {
    //console.log("world clock clicked");
    Clock.hide();
    WorldClock.show();
    Alarm.hide();
    StopWatch.hide();
    Timer.hide();
    //window.location.hash = 'worldclock';
    return false;
  });
  */
   $('#goWorldClockAdd').click(function() {
    console.log("GGG");
    //Clock.hide();
    //WorldClock.hide();
    WorldClockEditor.show();
    //Alarm.hide();
    //StopWatch.hide();
    //Timer.hide();
    //window.location.hash = 'addworldclock';
    return false;
  });

  $('#goWorldClockSave').click(function() {
    console.log("HHH");
    WorldClockEditor.save();
    //WorldClock.show();
    //StopWatch.hide();
    //Timer.hide();
    return false;
  });
});