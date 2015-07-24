'use strict';

//世界時鐘
var WorldClock = {
  prefix: "worldclock_",
  locals: null,
  clocks: null,
  next_index: 0,
  hasLocalStorage: 'localStorage' in window,
  //初始化
  init : function() {
    //console.log("worldclock.init()");
    this.locals = new Array();
    this.clocks = new Array();
    
    $('ul.clockList').smoothDivScroll({
      mousewheelScrolling: 'allDirections',
      manualContinuousScrolling: false,
      scrollableAreaClass: "scrollableArea_1",
      autoScrollingMode: '',
      visibleHotSpotBackgrounds: 'always',
      touchScrolling: true
    });
    
    this.reload();
    
  },
  
  reload: function() {
    this.loadStorage();
    this.loadClocks();    
  },
  
  //
  addClock: function(key,value) {
    var add_tag = true;
    if(key!=undefined && value!=undefined){
      if(this.hasLocalStorage) {
        //console.log("******************LocalStorage.add("+this.prefix + key+":"+value+")");
     
        for(var i = 0; i <localStorage.length ; i++) {
          var loc_key = localStorage.key(i);
          if(loc_key.indexOf(this.prefix) == 0) {
            var check_value = JSON.parse(localStorage.getItem(loc_key));
            var check_obj = new Object();
            check_obj.cityname = check_value.cityname;
            if(key == check_obj.cityname){
              //console.log(" break! the city exist: "+ check_obj.cityname);
              alert("the city exist!");
              var add_tag = false;
              break;
            }
           }
         }   
         
         if(add_tag == true){           
           var index = 0;
           if(localStorage.length > 0){
             index = this.next_index + 1;
           }
           var local_obj= new Object();
           local_obj.cityname = key;
           local_obj.timeoffset = value;
           localStorage.setItem(this.prefix + index, JSON.stringify(local_obj));  
         }
         
         this.loadStorage();
         this.loadClocks();
         this.loadSettingClocks();
         this.sort();

      }            
    }
  },
  
  delClock: function(key) {
    if(key!=undefined){
      if(this.hasLocalStorage) {
        //console.log("******************LocalStorage.remove("+this.prefix + key+")");
        //localStorage.removeItem(this.prefix + key);
        for(var i = 0; i < localStorage.length ; i++) {
          var loc_key = localStorage.key(i);
          if(loc_key.indexOf(this.prefix) == 0) {
            var index = parseInt(loc_key.replace(this.prefix, ""), 10);
            
            var value = JSON.parse(localStorage.getItem(loc_key));
            var obj = new Object();
            obj.cityname = value.cityname;
            obj.timeoffset = value.timeoffset;
            if(key == obj.cityname){
              //console.log(" delete for = " + obj.cityname );
              localStorage.removeItem(this.prefix + index);
              break;
            }
          }
       }   
      }
    }
    this.loadStorage();
    this.loadClocks();
  },
  
  loadStorage: function() {
    this.locals.length =0;
    var temp = new Array();
    if(this.hasLocalStorage) {
      try {
        //localStorage.clear();
        //console.log(this.locals);
        //console.log(" localStorage.length="+ localStorage.length);

        for(var i = 0; i < localStorage.length; i++) {
          var key = localStorage.key(i);
          if(key.indexOf(this.prefix) == 0) {
            var index = parseInt(key.replace(this.prefix, ""), 10); 
            if(index > this.next_index){
              this.next_index = index;
            }

            var value = JSON.parse(localStorage.getItem(key));
            var obj = new Object();
            obj.index = index;
            obj.cityname = value.cityname;
            obj.timeoffset = value.timeoffset;  
            //console.log("obj.index = "+ obj.index +" obj.cityname = "+ obj.cityname);
            temp.push(obj);                
          }
        }          
        //temp.sort(function(a,b){return a.index - b.index}) //新增在最下面
//        temp.sort(function(a,b){return b.index - a.index}); //新增在最上面
        
        for(var i = 0; i < temp.length; i++){
          this.locals[i] = temp[i];
        }     
        //console.log(this.locals);
      }
      catch(e) {}
    }
  },
  
  loadClocks: function() {
 //   var parent = $("#worldclockdisplay").get(0);    
//    parent.innerHTML="";  
//    var ul = document.createElement('ul');
//    ul.id = "clockList";
//    parent.appendChild(ul);
    
    var ul = document.getElementById('clockList');
    ul.innerHTML="";
//    console.log("this.clocks.length="+this.locals.length);
    this.clocks.length =0;
    if(this.clocks.length<=0) {
      //var parent = $("#worldclockdisplay").get(0);
      for(var i=0;i<this.locals.length;i++) {
        var vclock = $.extend(true, {}, Clock);
        vclock.id = i;
        var vcanvas = document.createElement('canvas');
        vcanvas.id     = 'smallClock'+i;
        vcanvas.width  = 80;
        vcanvas.height = 80;
        vcanvas.classList.add('smallClock');
        var vctx = vcanvas.getContext('2d');
        vclock.canvas=vcanvas;
        vclock.ctx=vctx;
        vclock.canToggle = false;

        var worldDiv = document.createElement('div');
        worldDiv.className = 'worldDiv';

        var city = document.createElement('span');
        city.className = 'city';
        city.innerHTML = this.locals[i].cityname;

        var clock = document.createElement('span');
        clock.className = 'clock';
        clock.appendChild(vcanvas);
        
        var timeSpan = document.createElement('span');
        timeSpan.className = 'timeSpan';
        timeSpan.id = this.locals[i].cityname;
             
        var time = document.createElement('span');
        time.className = 'time';

        vclock.initDefault(vcanvas,vctx,false,"analog");
        vclock.setupTime(this.locals[i].cityname,this.locals[i].timeoffset);
        time.innerHTML = vclock.getHHMM();
        vclock.setUpdateTimeDiv(time);

        timeSpan.appendChild(time);
        
        var weatherText = document.createElement('div');
        weatherText.id = this.locals[i].cityname + '_wt';
        time.className = 'weather';
        Weather.getWeatherText(this.locals[i].cityname);
        weatherText.innerHTML = "loading...";

        timeSpan.appendChild(weatherText);
   
        worldDiv.appendChild(city);
        worldDiv.appendChild(clock);
        worldDiv.appendChild(timeSpan);
      
        /*
        if(i % 3 == 0){       
          var worldpage = document.createElement('li');
          worldpage.className = 'worldpage';
      
          worldpage.appendChild(worldDiv);   
          ul.appendChild(worldpage);      
        }
        else if(i % 3 == 1){
          worldpage.appendChild(worldDiv);   
          ul.appendChild(worldpage);
        }
        else if(i % 3 == 2){
          worldpage.appendChild(worldDiv);   
          ul.appendChild(worldpage);
        }
        
        */
       
        if(i % 3 == 0){       
          var worldpage = document.createElement('li');
          worldpage.className = 'worldpage';
        }
        
          worldpage.appendChild(worldDiv);   
          ul.appendChild(worldpage);

        /*
        var div = document.createElement('div');
        div.classList.add("smallclocktext");
        //console.log(this.locals[i]);
        var div1 = document.createElement('div');
        div1.innerHTML = this.locals[i].cityname;
        var div2 = document.createElement('div');
        div2.appendChild(vcanvas);
        div.appendChild(div1);
        div.appendChild(div2);
        parent.appendChild(div);
        */
        this.clocks.push(vclock);
      }
      
      //console.log("load clock  = " +this.locals.length);
      var page_num = Math.ceil(this.locals.length/3);
      //console.log("page_num = " + page_num);
      var set_width = page_num * 600;
      $('.scrollableArea_1').css('width', set_width);

    }
  },
  
  
  loadSettingClocks: function() {

    var parent = $("#worldclocksetting").get(0);

    parent.innerHTML="";
    var ul = document.createElement('ul');
    ul.id = "clocksettingList";
    parent.appendChild(ul);
    
    
    //console.log("this.clocks.length="+this.clocks.length);
    this.clocks.length =0;
    if(this.clocks.length<=0)
    {
//      var parent = $("#worldclocksetting").get(0);
      for(var i=0;i<this.locals.length;i++) {
  
        var vclock = $.extend(true, {}, Clock);
        vclock.id = i;
        var vcanvas = document.createElement('canvas');
        vcanvas.id     = 'smallClock'+i;
        vcanvas.width  = 80;
        vcanvas.height = 80;
        vcanvas.classList.add('smallClock');
        var vctx = vcanvas.getContext('2d');
        vclock.canvas=vcanvas;
        vclock.ctx=vctx;
       
        var li = document.createElement('li');
        li.className = 'settingclocks';
        //li.id = 'clock'+ i;
        li.id = 'clock'+ this.locals[i].index;
        //console.log("xxxxxxx",this.locals[i]);
       
        var delButton = document.createElement('span');
        delButton.className = 'delButton';
        delButton.id = 'delButton'+i;
        delButton.tagname = this.locals[i].cityname;       
        delButton.onclick = function(){
          var ul = document.getElementById('clocksettingList');
          var li = this.parentNode;
          ul.removeChild(li);
          
          //console.log("this.tagname:"+this.tagname);
          WorldClock.delClock(this.tagname);
          WorldClock.loadStorage();
          WorldClock.loadClocks();
        };

        var city = document.createElement('span');
        city.className = 'city_setting';
        city.innerHTML = this.locals[i].cityname;
        city.id = this.locals[i].cityname;
        
        var time = document.createElement('span');
        time.className = 'time_setting';
        vclock.initDefault(vcanvas,vctx,false,"analog");
        vclock.setupTime(this.locals[i].cityname,this.locals[i].timeoffset);
        time.innerHTML = vclock.getHHMM();
        vclock.setUpdateTimeDiv(time);
       
        var sortButton = document.createElement('span');
        sortButton.className = 'sortButton';
    
        li.appendChild(delButton);       
        li.appendChild(city);      
        li.appendChild(time);     
        li.appendChild(sortButton);
        ul.appendChild(li);
        
        /*
        var div = document.createElement('div');
        div.classList.add("smallclocktext");
        //console.log(this.locals[i]);
        var div1 = document.createElement('div');
        div1.innerHTML = this.locals[i].cityname;
        var div2 = document.createElement('div');
        div2.appendChild(vcanvas);
        div.appendChild(div1);
        div.appendChild(div2);
        parent.appendChild(div);
        */

        //vclock.initDefault(vcanvas,vctx,false,"analog");
        //vclock.setupTime(this.locals[i].cityname,this.locals[i].timeoffset);
        this.clocks.push(vclock);
        
      }
    }
  },

  sort: function(){
    $("#clocksettingList " ).sortable({
      cursor: 'move',
      axis: "y",
      handle: ".sortButton"
    });
    $("#clocksettingList " ).disableSelection();
  }
};