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
  APP.forecast_key = 'c9002942b156fa5d0583934e2b1eced8';


  var init = function () {

    // intialize the application
    APP.instance = new kendo.mobile.Application(document.body, { skin: 'pure', loading: "<h1>Please wait...</h1>" });

    var admob = window.plugins.AdMob;

      admob.createBannerView(
      {
         'publisherId': 'ca-app-pub-7082385269825044/2315316012',
         'adSize': admob.AD_SIZE.BANNER,
         'tagForChildDirectedTreatment':true
      },

          // createBannerView success callback: we can now request an ad to show in the view
          function() {
            admob.requestAd(
              {'isTesting':false},
              // requestAd success callback: we can now show he ad in the placeholder
              function() {
                admob.showAd(
                  true,
                  // showAd success callback: if this is called, the ad is being shown
                  function() {console.log('show ok')},
                  // showAd error callback
                  function() { alert('failed to show ad')}
                );
              },
              // requestAd error callback
              function(){ alert('failed to request ad'); }
            );
          },
          // createBannerView error callback
          function(){ alert('failed to create banner view'); }
          );
              
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

                  var lat = localStorage.getItem('lat');
                  var long = localStorage.getItem('long');


                  if (localStorage.getItem('transportation') === null){
                    localStorage.setItem('transportation','bus');
                  }
                  $('.transportation').attr("src","img/"+localStorage.getItem("transportation")+".png");


                  getCurrent(lat,long)

 
              },
              function (err) {
                  alert("sorry, we couldn't get your location!")
                  
              });
      }
      else{
        alert("sorry, we couldn't get your location!")
      }

      

  };

  var getCurrent = function(lat,long){
    
    
    //get today's forecast
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
                    
                    //we do an initial set here
                    $('.current').addClass('icon-'+APP.current_conditions.icon);
                    $('.current_temp').html(tmp[0]+'&deg;');

                    localStorage.setItem('current_icon','icon-'+APP.current_conditions.icon);
                    localStorage.setItem('current_temp',tmp[0]+'&deg;');  

                    $('.summary').html(APP.forecast.summary);
                    for (i = 0; i < APP.forecast.data.length; i++) { 
                      $('.date_'+i).html(moment.utc(APP.forecast.data[i].time, 'X').format('dddd'));
                      $('.day_'+i).html(APP.forecast.data[i].summary);
                      $('.day_'+i+'_icon').addClass('icon-'+APP.forecast.data[i].icon);
                      
                      var minTemp = APP.forecast.data[i].temperatureMin.toString().split('.');
                      var maxTemp = APP.forecast.data[i].temperatureMax.toString().split('.');

                      $('.day_'+i+'_temps').html('Temperatures between '+minTemp[0]+'&deg; and '+maxTemp[0]+'&deg;');
                    }
                    getTimedForecast(lat,long);

                }


          });

  forecast.read();
};

var getTimedForecast = function(lat,long){

//get timed forecast
 var todays_date = moment().format('YYYY-MM-DD').toString();

 if (localStorage.getItem('departure_time') === null){
      localStorage.setItem('departure_time','08:00');
 }

    var departure_time = todays_date+'T'+localStorage.getItem('departure_time')+':00'

    console.log(departure_time)

    var timed_url = 'https://api.forecast.io/forecast/' + APP.forecast_key + '/' + lat + ',' + long + ',' + departure_time + '';
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
                    localStorage.setItem('departure_temp',t[0]);


                    var icon = localStorage.getItem('departure_icon');
                    console.log(icon)
                    var temp = localStorage.getItem('departure_temp');
                    console.log(temp)

                    
                      if(temp >= 70){
                        if(icon == 'icon-rain'){
                          $('.cat').attr("src","img/rain-cat.png");                        
                        }
                        else{
                          $('.cat').attr("src","img/hot-cat.png");                      
                        } 
                      }
                      else if(temp >= 50 && temp < 70){
                        
                        if(icon == 'icon-rain'){
                          $('.cat').attr("src","img/rain-cat.png");
                        }
                        else{
                          $('.cat').attr("src","img/warm-cat.png");
                        } 
                      }
                      else if(temp >= 32 && temp < 50){
                        if(icon == 'icon-rain'){
                          $('.cat').attr("src","img/rain-cat.png");                        
                         }
                        else{
                          $('.cat').attr("src","img/cold-cat.png");                        
                        }
                      }
                      else if(temp < 32){
                        $('.cat').attr("src","img/snow-cat.png");                               
                      }
                    

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
