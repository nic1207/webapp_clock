'use strict';
/*
var $ = function (selector) {
  return document.querySelectorAll(selector);
};
*/

var completeClock = {
  completeButton: null,
  clockprefix:"clock",
  worldprefix:"worldclock_",

  init: function() {
    //console.log("completeClock.init()");

    this.completeButton = document.getElementById('WorldClockComplete');
    this.completeButton.addEventListener('click', this.complete.bind(this));
  },
  
  complete: function () {        
    localStorage.clear();
    
//    console.log(" complete start . length = " + WorldClock.locals.length);
//    console.log(WorldClock.locals);
   
    var temp = new Array();
    var ul = document.getElementById('clocksettingList'); 
       
    for(var i = 0 ; i < WorldClock.locals.length ; i++){
      var li = ul.childNodes[i];
      if(li==undefined)
        continue;
//      console.log(li);
      var li_id = li.id; 
      var reSort = parseInt(li_id.replace(this.clockprefix, ""), 10); 
     
      for(var x in WorldClock.locals){
        if(reSort == WorldClock.locals[x].index){          
          var local_obj = new Object();
          local_obj.index = i;
          local_obj.cityname = WorldClock.locals[x].cityname;
          local_obj.timeoffset = WorldClock.locals[x].timeoffset;
          temp.push(local_obj);
        }
      }  
    }   
    WorldClock.locals = [];
//    console.log("@@@@@@ temp @@@@@@@");
//    console.log(temp);
    
    for(var i =0; i< temp.length; i++){      
      WorldClock.locals[i] = temp[i];
      
      var reSortObj = new Object();
      reSortObj.cityname = temp[i].cityname;
      reSortObj.timeoffset = temp[i].timeoffset;
   
      localStorage.setItem(this.worldprefix + i, JSON.stringify(reSortObj));
    }

//    WorldClock.loadStorage();
    WorldClock.loadClocks();   
    
//    console.log("******** complete finish **********");
//    console.log(WorldClock.locals);

  }
  

/*
  del: function() {
    //console.log("XXX");
    var timeDiv = $('.timeDiv');
    
    if(!editNow) {
      //this.clickTimes ++;
      for (var i = 0; i < timeDiv.length; i++) {
        var delButton = document.createElement('span');
        delButton.className = 'delButton';
        delButton.tagname =  timeDiv[i].id;
        delButton.innerHTML = 'x';
        delButton.onclick = function() {
          var ul = document.getElementById('clockList');
          var li = this.parentNode.parentNode;
          ul.removeChild(li);
          console.log("this.tagname:"+this.tagname);
          WorldClock.delClock(this.tagname);
        }
        timeDiv[i].appendChild(delButton);
      }
      editNow = true;

      this.editButton.innerHTML = 'Done';
    } else {
      var delButton = $('.delButton');

      for (var i = 0; i < delButton.length; i++) {
        timeDiv[i].removeChild(delButton[i]);
      }
      editNow = false;

      this.editButton.innerHTML = 'Edit';
    }
  }
  
  */
};

window.addEventListener('load', completeClock.init.bind(completeClock));