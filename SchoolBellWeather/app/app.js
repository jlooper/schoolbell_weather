define([
  'views/leftNav/leftNav',
  'views/today/today',
  'views/transportation/transportation',
  'views/schedule/schedule',
  'views/tomorrow/tomorrow',
  'views/fiveday/fiveday'
  
], function () {

  // create a global container object
  var APP = window.APP = window.APP || {};

  var init = function () {

    // intialize the application
    APP.instance = new kendo.mobile.Application(document.body, { skin: 'pure', loading: "<h1>Please wait...</h1>" });

    APP.forecast_key = 'c9002942b156fa5d0583934e2b1eced8';


  };
  var setVars = function () {

   $('#please_wait').show();
   $('#conditions').hide();  
   $('.header').hide(); 
   $('.footer').hide();         

    if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
              function (position) {
                  localStorage.setItem('lat',position.coords.latitude);
                  localStorage.setItem('long',position.coords.longitude);

                  getCurrent(localStorage.getItem('lat'),localStorage.getItem('long'));
 
              },
              function (err) {
                  alert("sorry, we couldn't get your location!")
                  
              });
      }
      else{
        alert("sorry, we couldn't get your location!")
      }

      //set some defaults and paint the divs
      if (localStorage.getItem('departure_time') == ''){
        localStorage.setItem('departure_time','08:00');
      }
      if (localStorage.getItem('transportation') == ''){
        localStorage.setItem('transportation','bus');
      }

      $('.transportation').attr("src","img/"+localStorage.getItem("transportation")+".png");


  };
  var getCurrent = function (lat,long) {

    var url = 'https://api.forecast.io/forecast/' + APP.forecast_key + '/' + lat + ',' + long + '';
    var forecast = new kendo.data.DataSource({

        transport: {
              read: {
                    url: function(options) {
                        return url
                        },
                      dataType: "jsonp"
                  }
                },
                schema: {
                  data: "daily.data"
                },
                requestEnd: function( event ) {

                  
                    APP.current_conditions = event.response.currently;
                    APP.forecast = event.response.daily;

                    var tmp = APP.current_conditions.temperature.toString().split('.');                    
                    
                    $('.current').addClass('icon-'+APP.current_conditions.icon);
                    $('.current_temp').html(tmp[0]+'&deg;');

                    localStorage.setItem('current_icon','icon-'+APP.current_conditions.icon);
                    localStorage.setItem('current_temp',tmp[0]+'&deg;');
                    
                    getScheduledForecast(lat,long);

                    

                    $('.summary').html(APP.forecast.summary);
                    for (i = 0; i < APP.forecast.data.length; i++) { 
                      $('.date_'+i).html(moment.utc(APP.forecast.data[i].time, 'X').format('dddd'));
                      $('.day_'+i).html(APP.forecast.data[i].summary);
                      $('.day_'+i+'_icon').addClass('icon-'+APP.forecast.data[i].icon);
                      
                      var minTemp = APP.forecast.data[i].temperatureMin.toString().split('.');
                      var maxTemp = APP.forecast.data[i].temperatureMax.toString().split('.');

                      $('.day_'+i+'_temps').html('Temperatures between '+minTemp[0]+'&deg; and '+maxTemp[0]+'&deg;');
                    }


                }


          });

  forecast.read();

  };
  var getScheduledForecast = function (lat,long) {
    
    function ISODateString(d,t){

       var today = localStorage.getItem('departure_time')
       //split that string
       if(today==null){
         var hour = 08
         var min = 00}
         else{var hour = today.slice(0,2)
       var min = today.slice(3)}

       function pad(n){return n<10 ? '0'+n : n}
       return d.getUTCFullYear()+'-'
            + pad(d.getUTCMonth()+1)+'-'
            + pad(d.getUTCDate())+'T'
            + hour+':'
            + min+':'
            + '00'
      }

var todays_date = new Date();
var todays_day = todays_date.getDay();
APP.departure_time = ISODateString(todays_date,todays_day);
console.log(APP.departure_time)
    
    var timed_url = 'https://api.forecast.io/forecast/' + APP.forecast_key + '/' + lat + ',' + long + ',' + APP.departure_time + '';
    console.log(timed_url)
    
    var forecast = new kendo.data.DataSource({

        transport: {
              read: {
                    url: function(options) {
                        return timed_url
                        },
                      dataType: "jsonp"
                  }
                },
                schema: {
                  data: "daily.data"
                },
                requestEnd: function( event ) {
                    
                    var tmp = event.response.currently.temperature.toString();
                    var t = tmp.split('.');
                    $('.departure').addClass('icon-'+event.response.currently.icon);
                    $('.departure_temp').html(t[0]+'&deg;');

                    localStorage.setItem('departure_icon','icon-'+event.response.currently.icon);
                    localStorage.setItem('departure_temp',t[0]+'&deg;');
                  

                    $('#please_wait').hide();
                    $('#conditions').show();
                    $('.header').show();
                    $('.footer').show();


                }


          });

    forecast.read();

  };


  return {
    init: init,
    setVars:setVars
  };

});
