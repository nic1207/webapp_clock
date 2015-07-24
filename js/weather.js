'use strict';

//天氣
var Weather = {
  city: null,
  lat: null,
  lon: null,
  ipaddress: null,
  ticker: null,
  xhr: null,
  loaded: false,
  yql: 'http://query.yahooapis.com/v1/public/yql?q=',
  setstr: '&format=json&diagnostics=true',
  apikey: 'b235207961eaa6fde57cebaa8f2c053dab611c42905f1d897ad361ef3bec4433',

  init: function() {
    //console.log(this.loaded);
    //if(!this.city&&!this.loaded)
    //  this.getMozSettingCity();
    if (!this.city && !this.loaded)
      this.getGeoLocationCity();
    //city = "kaohsiung";
    //if(this.city!=null && !this.loaded)
    //  this.getWeatherData();
    this.ticker = setInterval(function(self) {
      self.getWeatherData();
    }, 60000, this);//1000ms檢查一次
  },

  getIP: function() {
    //console.log('this.getIP() call ajax');
    //var url = "http://smart-ip.net/geoip-json";
    //var url = "http://dazzlepod.com/ip/me.json";
    var url = 'http://jsonip.appspot.com';
    //var url = "http://ip-api.com/json";
    if (!this.xhr)
      this.initXhr();
    this.xhr.responseType = 'jsonp';
    this.xhr.timeout = 60000;
    this.xhr.onreadystatechange = function(a) {
      //console.log(this);
      if (this.readyState === 4) {
        if (this.status === 200) {
          var msg = '';
          //console.log(this.responseText);

          var data = JSON.parse(this.responseText);
          Weather.ipaddress = data.ip;
          Weather.getIPGeoLocationCity();
        }
      }
    };
    this.xhr.open('GET', url, true);
    this.xhr.send();
    //$.getJSON(url,
    /*
    // jquery ajax寫法, 無法在 FFOS上執行, crossdomain時會有問題
    $.ajax({
      url: url,
      type:'GET',
      dataType: 'jsonp',
      timeout: 60000,
      jsonpCallback: 'jsonpxxxx',
      //  console.log("xxxxxxxxxxxxxx");
      //},
      success: function (data){
        //console.log(data.host);
        //console.log(console);
        Weather.ipaddress = data.host;
        //console.log("Weather.ipaddress="+Weather.ipaddress);
        //console.log(Weather);
        Weather.getIPGeoLocationCity();
      },
      error: function (jqXHR, exception){
        var msg = "";
        if (jqXHR.status === 0)
          msg = '無法連線. 請檢查你的網路.';
        else if (exception === 'timeout')
          msg = '連結逾時錯誤.';
        else if (jqXHR.status == 404)
          msg = '網址不存在，請確認網址的正確性. [404]';
        alert(msg);
        //$("#weatherArea").innerHTML = msg;
      }
    });
    */
  },

  getIPGeoLocationCity: function() {
    //if(this.ipaddress==null) {
    //  console.log("this.ipaddress=null");
    //  return;
    //}
    //console.log('getIPGeoLocationCity() call ajax');
    var url = 'http://ip-api.com/json';
    //console.log(url);
    if (!this.xhr)
      this.initXhr();

    this.xhr.onreadystatechange = function(a) {
      //console.log("a=",a.readyStat);
      //console.log("this=",this);
      if (this.readyState === 4) {
        if (this.status === 200) {
          var msg = '';
          var data = JSON.parse(this.responseText);
          //console.log('ip lookup success');
          Weather.city = data.city;
          Weather.lat = data.lat;
          Weather.lon = data.lon;
          //Weather.city = data.cityName;
          //Weather.lat = data.latitude;
          //Weather.lon = data.longitude;
          Weather.loaded = true;
        }
      }
    };
    this.xhr.open('GET', url, true);
    this.xhr.send();
    /*
    // jquery ajax寫法, 無法在 FFOS上執行, crossdomain時會有問題
    $.ajax({
      url: url,
      type:'GET',
      dataType: 'jsonp',
      timeout: 60000,
      jsonpCallback: 'jsonpxxxx',
      success: function (data){
        console.log("ip lookup success");
        Weather.city = data.cityName;
        Weather.lat = data.latitude;
        Weather.lon = data.longitude;
        Weather.loaded = true;
        //if(Weather.city!=null)
        //  Weather.getWeatherData();
      },
      error: function (jqXHR, exception){
        var msg = "";
        if (jqXHR.status === 0)
          msg = '無法連線. 請檢查你的網路.';
        else if (exception === 'timeout')
          msg = '連結逾時錯誤.';
        else if (jqXHR.status == 404)
          msg = '網址不存在，請確認網址的正確性. [404]';
        alert(msg);
        //$("#weatherArea").innerHTML = msg;
      }
    });
    */
  },

  getGeoLocationCity: function() {
    //console.log('******getGeoLocationCity()');
    if (!navigator.geolocation) {
      //console.log('*****browser not supported geoLocation Object*');
      return;
    }
    //console.log(navigator.geolocation);
    var geo_options = {
      enableHighAccuracy: false,
      maximumAge: 0,
      timeout: 5000
    };
    navigator.geolocation.getCurrentPosition(this.onLocationSuccess,
    this.onLocationError, geo_options);
  },

  getMozSettingCity: function() {
    //this.city = "kaohsiung";
    //this.loaded = true;
    if (navigator.mozSettings == undefined)
    {
      //console.log(navigator.mozSettings);
      return;
    }
    //console.log('******getMozSettingCity()');
    var xx = navigator.mozSettings.createLock().get('time.timezone');
    //console.log(xx);
    //his.city = xx;
    //this.loaded = true;
    //console.log(xx);
    //this.city = navigator.mozSettings.createLock().get('time.timezone');
    //console.log("getMozSettingCity() this.city:"+this.city);
  },

  onLocationSuccess: function(position) {
    //console.log('getGeoLocation success!!!');
    Weather.lat = position.coords.latitude;
    Weather.lon = position.coords.longitude;
    //console.log(Weather.lat + " : " + Weather.lon);
    //alert(Weather.lat + " : " + Weather.lon);

    Weather.loaded = true;
  },

  onLocationError: function(error) {
    //console.log('getGeoLocation Error()');
    //alert(error.code);
    var xmsg = '';
    switch (error.code) {
      case error.PERMISSION_DENIED:
        xmsg = 'User denied the request for Geolocation.';
      break;
      case error.POSITION_UNAVAILABLE:
        xmsg = 'Location information is unavailable.';
      break;
      case error.TIMEOUT:
        xmsg = 'The request to get user location timed out.';
      break;
      case error.UNKNOWN_ERROR:
        xmsg = 'An unknown error occurred.';
      break;
    }
    //alert(xmsg);
    //alert('ERROR(' + error.code + '): ' + error.message);
    //console.log(msg);
    //if(Weather.city==null&&!Weather.loaded)
    //Weather.getIP();
    Weather.getIPGeoLocationCity();
    //console.log(Weather);
    //var s = document.querySelector('#status');
    //s.innerHTML = typeof msg == 'string' ? msg : "failed";
    //s.className = 'fail';
  },

  getWeatherText: function(city) {
    //console.log('********getWeatherText(' + city + ')*******');
    if (!city)
      return '';
    if (city) {
      var qstr = 'select * from weather.forecast where woeid in (';
      qstr += 'select woeid from geo.placefinder where text="' + city + '")';
      qstr += 'and u="c" limit 1';
    }
    //console.log('getWeatherText(' + city + ') call ajax');

    var xhr = new XMLHttpRequest({mozSystem: true});
    xhr.responseType = 'jsonp';
    xhr.timeout = 30000;
    xhr.ontimeout = function(e) {
      //console.log('Timeout!!! while executing query',e);
      $('#' + city + '_wt').html('N/A');
    };
    xhr.onerror = function(e) {
      console.error('Error:', e);
       $('#' + city + '_wt').html('N/A');
    }; // onerror
    //console.log(qstr);
    //console.log(this.yql+qstr+this.setstr);
    xhr.onreadystatechange = function(a) {
      //console.log("a=",a.readyStat);
      //console.log("this=",this);
      if (this.readyState === 4) {
        if (this.status === 200) {
          var msg = '';
          var data = JSON.parse(this.responseText);
          //console.log(msg);
          if (data.query.results.channel.item.condition)
          {
            msg += data.query.results.channel.item.condition.text + '<br>';
            msg += data.query.results.channel.item.condition.temp + ' &deg;C';
          } else {
            msg += 'N/A';
          }
          $('#' + city + '_wt').html(msg);
        }
      }
    };
    xhr.open('GET', this.yql + qstr + this.setstr, true);
    xhr.send();
    /*
    // jquery ajax寫法, 無法在 FFOS上執行, crossdomain時會有問題
    $.getJSON(this.yql+qstr+this.setstr,function(data) {
      //console.log(data);
      var msg = "";
      //console.log(msg);
      if(data.query.results.channel.item.condition)
      {
        msg += data.query.results.channel.item.condition.text+'<br>';
        msg += data.query.results.channel.item.condition.temp+' &deg;C';
      } else {
        msg += '';
      }
      //console.log('#'+city+'_wt');
      //console.log(msg);
      $('#'+city+'_wt').html(msg);
      //console.log($(city+'_wt'));
      //return msg;
      //console.log("XXXX");
    });
    */
  },

  initXhr: function() {
    if (!this.xhr)
      this.xhr = new XMLHttpRequest({mozSystem: true});
    this.xhr.responseType = 'jsonp';
    this.xhr.timeout = 60000;
    this.xhr.ontimeout = function(e) {
      //console.log('Timeout!!! while executing query', e);
    };
    this.xhr.onerror = function(e) {
      //console.log('Error:', e);
    }; // onerror
  },

  getWeatherData: function() {
    if (!this.loaded) {
      //console.log(this.loaded);
      return;
    }
    //console.log('****getWeatherData(' + this.city + ')*************');
    //var yql = "http://query.yahooapis.com/v1/public/yql?q=";
    if (this.city)
    {
      var qstr = 'select * from weather.forecast where woeid in (';
      qstr += 'select woeid from geo.placefinder where ';
      qstr += 'text="' + this.city + '") and u="c" limit 1';
    } else if (this.lat != null & this.lon != null) {
      var qstr = 'select * from weather.forecast where woeid in ';
      qstr += '(select woeid from geo.placefinder where ';
      qstr += 'text="' + this.lat + ', ' + this.lon + '" and gflags="R") ';
      qstr += 'and u="c" limit 1';
    } else
      return;
    //alert(qstr);
    //console.log('getWeatherData() call ajax');

    if (!this.xhr)
      this.initXhr();

    this.xhr.onreadystatechange = function(a) {
      //console.log("a=",a.readyStat);
      //console.log("this=",this);
      if (this.readyState === 4) {
        if (this.status === 200) {
          //console.log('yql success');
          var data = JSON.parse(this.responseText);
          if (data.query && data.query.count > 0) {
            Weather.process(data.query.results.channel);
          } else {
            //console.log('data.query.count=0');
          }
        }
      }
    };

    //console.log(this.yql+qstr+this.setstr);
    this.xhr.open('GET', this.yql + qstr + this.setstr, true);
    this.xhr.send();
    if (this.ticker != null)
      clearInterval(this.ticker);
  },

  process: function(feed) {
    var html = "<div class='weatherItem'";
    html += ' style="background-image: url(images/weather/';
    html += feed.item.condition.code + '.png); background-repeat: no-repeat;"';
    html += '>';
    html += '<div class="weatherCity">' + feed.location.city + '</div>';
    html += '<div class="weatherTemp">';
    html += feed.item.condition.temp + '&deg;C</div>';
    html += '<div class="weatherDesc">' + feed.item.condition.text + '</div>';
    html += '</div>';
    $('#weatherArea').html(html);
    //$("#weatherArea").append(html);
  }
};
