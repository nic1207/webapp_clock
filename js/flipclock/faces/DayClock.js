(function($) {
  
  /**
   * Month-Day Clock Face
   *
   * This class will generate a month-day our clock for FlipClock.js
   *
   * @param  object  The parent FlipClock.Factory object
   * @param  object  An object of properties to override the default  
   */
   
  FlipClock.DayClockFace = FlipClock.Face.extend({

    /**
     * An array of jQuery objects used for the dividers (the colons)
     */
     
    dividers: [],

    /**
     * Build the clock face
     *
      time     = time ? time : this.factory.time.getHourCounter();
     * @param  object  Pass the time that should be used to display on the clock. 
     */
     
    build: function(time) {
      var t        = this;
      var children = this.factory.$wrapper.find('ul');
      
      time = time ? time : (this.factory.time.time || this.factory.time.getMDW());
      //console.log("xxxxxxxxxxxxxxxxxxxx",time);
      
      if(time.length > children.length) {
        $.each(time, function(i, digit) {
          //console.log(digit);
          t.factory.lists.push(t.createList(digit));
        });
      }
      this.dividers.push(this.createMdDivider('月'));
      this.dividers.push(this.createMdDivider('日'));
      //console.log("yyyyyyyyyyyyyyyyyyyyyyyy",this.factory.lists.length);
      $(this.dividers[0]).insertBefore(this.factory.lists[2].$obj);
      //$(this.dividers[1]).insertBefore(this.factory.lists[4].$obj);
      $(this.dividers[1]).insertAfter(this.factory.lists[this.factory.lists.length -1].$obj);
      
      var ww = this.createWeekDivider();
      ww.insertAfter(this.dividers[1]);
      
      this._clearExcessDigits();
      
      if(this.autoStart) {
        this.start();
      }
    },
    
    /**
     * Flip the clock face
     */
     
    flip: function(time) {
      time = time ? time : this.factory.time.getMDW();
      //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", time);
      //console.trace();
      //console.log(this);
      this.base(time);  
    },
    
    /**
     * Clear the excess digits from the tens columns for sec/min
     */
     
    _clearExcessDigits: function() {
      var tenSeconds = this.factory.lists[this.factory.lists.length - 2];
      var tenMinutes = this.factory.lists[this.factory.lists.length - 4];
      
      for(var x = 6; x < 10; x++) {
        tenSeconds.$obj.find('li:last-child').remove();
        tenMinutes.$obj.find('li:last-child').remove();
      }
    }
        
  });
  
}(jQuery));