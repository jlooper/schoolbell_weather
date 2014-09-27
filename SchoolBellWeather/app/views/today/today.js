define([
  'views/view',
  'text!views/today/today.html'
], function (View, html) {

  var view, navbar, body, page;

  
  var today = new kendo.data.DataSource({
    data: [
      { title: 'Now', page: 'Today'}
    ]
  });

  
//todo build this out
  var model = kendo.observable({
    today: today
  });

   
  var events = {
    init: function (e) {

      navbar = e.view.header.find('.km-navbar').data('kendoMobileNavBar');

      if (localStorage.getItem('transportation') === null){
        localStorage.setItem('transportation','bus');
      }
      $('.transportation').attr("src","img/"+localStorage.getItem("transportation")+".png");

      if (localStorage.getItem('departure_time') === null){
        localStorage.setItem('departure_time','08:00');
      }
    },
    afterShow: function (e) {

      var forecast_key = 'c9002942b156fa5d0583934e2b1eced8';


    if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
              function (position) {
                  localStorage.setItem('lat',position.coords.latitude);
                  localStorage.setItem('long',position.coords.longitude);

                  var lat = localStorage.getItem('lat');
                  var long = localStorage.getItem('long');


                  

                  getCurrent(lat,long)
                  
 
              },
              function (err) {
                  alert("sorry, we couldn't get your location!")
                  
              });
      }
      else{
        alert("sorry, we couldn't get your location!")
      }

      var getCurrent = function(){

        var todays_date = moment().format('YYYY-MM-DD').toString();
        var departure_time = todays_date+'T'+localStorage.getItem('departure_time')+':00'
        
        var lat = localStorage.getItem('lat')
        var long = localStorage.getItem('long')

        var url = 'https://api.forecast.io/forecast/' + forecast_key + '/' + lat + ',' + long + '';
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

                  
                    var current_conditions = event.response.currently;
                  
                    var tmp = current_conditions.temperature.toString().split('.');                    
                    
                    
                    localStorage.setItem('current_icon','icon-'+current_conditions.icon);
                    localStorage.setItem('current_temp',tmp[0]+'&deg;');  
                
                    $('.current').addClass('icon-'+current_conditions.icon);
                    $('.current_temp').html(tmp[0]+'&deg;');

                    var current_conditions = event.response.currently;
                    var forecast = event.response.daily;

                    var tmp = current_conditions.temperature.toString().split('.');                    
                    
                    //we do an initial set here
                    $('.current').addClass('icon-'+current_conditions.icon);
                    $('.current_temp').html(tmp[0]+'&deg;');

                    localStorage.setItem('current_icon','icon-'+current_conditions.icon);
                    localStorage.setItem('current_temp',tmp[0]+'&deg;');  

                    $('.summary').html(forecast.summary);
                    for (i = 0; i < forecast.data.length; i++) { 
                      $('.date_'+i).html(moment.utc(forecast.data[i].time, 'X').format('dddd'));
                      $('.day_'+i).html(forecast.data[i].summary);
                      $('.day_'+i+'_icon').addClass('icon-'+forecast.data[i].icon);
                      
                      var minTemp = forecast.data[i].temperatureMin.toString().split('.');
                      var maxTemp = forecast.data[i].temperatureMax.toString().split('.');

                      $('.day_'+i+'_temps').html('Temperatures between '+minTemp[0]+'&deg; and '+maxTemp[0]+'&deg;');
                    }

                    getTimed(lat,long)

                    
                }


          });

  forecast.read();
        
      }
   
  var getTimed = function(lat,long){

    //get timed forecast
 var todays_date = moment().format('YYYY-MM-DD').toString();

 

    var departure_time = todays_date+'T'+localStorage.getItem('departure_time')+':00'

    console.log(departure_time)


    var timed_url = 'https://api.forecast.io/forecast/' + forecast_key + '/' + lat + ',' + long + ',' + departure_time + '';
    
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
                    

                    $('#conditions').show();
                    $('.header').show();
                    $("#please_wait").data("kendoMobileModalView").close();
                   

                }


          });

    forecast.read();
  }

      page = e.view.params.page || 'Today';
      
      today.filter({ field: 'page', operator: 'eq', value: page });

      navbar.title(page);
        
      $('.transportation').attr("src","img/"+localStorage.getItem("transportation")+".png");

    },
    closeModal: function (e) {
      $("#tutorial-modal").data("kendoMobileModalView").close();
    }
  };

  // create a new view
  view = new View('today', html, model, events);



});
