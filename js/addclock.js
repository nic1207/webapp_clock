'use strict';
//var ContinentObj = {};
/*
 * author@ nic
 */
var CitesData = {
  cities: null,

  init: function() {
    $.getJSON('js/tz.json', function(json) {
        //console.log(json);
        this.cities = new Array();

        for (var key1 in json) {
          //console.log("area : " + key1);
          for (var key2 in json[key1]) {
            //console.log("city:",json[key1][key2]);
            var city = new Object();
            city.label = json[key1][key2].city;
            city.timezone = json[key1][key2].offset;
            this.cities.push(city);
          }
        }

        //console.log(this.cities);
        $('#search').autocomplete({
          source: this.cities,
          select: function(event, ui) {
            var tzArr = ui.item.timezone.split(',');
            $('#city').val(ui.item.label);
            $('#search').val(ui.item.label);
            $('#timezone').val(tzArr[0]);
            return false;
          }
        });
      }
    );
  }
};
window.addEventListener('load', CitesData.init.bind(CitesData));
