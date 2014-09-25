define([
  'views/view',
  'text!views/today/today.html'
], function (View, html) {

  var view, navbar, body, page;

  /*forecast info*/


  var today = new kendo.data.DataSource({
    data: [
      { title: 'Now', page: 'Today'}
    ]
  });

  var days = new kendo.data.DataSource({
    data: [
      { name: 'Tomorrow', url: '#tomorrow'  },
      { name: 'Five Days', url: '#fiveday'  }
    ]
  });
//todo build this out
  var model = kendo.observable({
    today: today,
    days: days,
    departure_temp: localStorage.getItem('departure_temp'+'&deg;'),
    current_temp: localStorage.getItem('current_temp_temp')
  });

  
  var events = {
    init: function (e) {

      // store a reference to the navbar component in this view
      navbar = e.view.header.find('.km-navbar').data('kendoMobileNavBar');

    },
    afterShow: function (e) {

    var todays_date = moment().format('YYYY-MM-DD').toString();
    APP.departure_time = todays_date+'T'+localStorage.getItem('departure_time')+':00'
    console.log(APP.departure_time)
    APP.forecast_key = 'c9002942b156fa5d0583934e2b1eced8';

    var lat = localStorage.getItem('lat')
    var long = localStorage.getItem('long')

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


                }


          });

  forecast.read();

//get timed forecast
    var timed_url = 'https://api.forecast.io/forecast/' + APP.forecast_key + '/' + lat + ',' + long + ',' + APP.departure_time + '';
    
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
                    
                    
                    localStorage.setItem('departure_icon','icon-'+event.response.currently.icon);
                    localStorage.setItem('departure_temp',t[0]);

                    //set this initially; later it is binded
                    $('.departure').addClass('icon-'+event.response.currently.icon);
                    $('.departure_temp').html(t[0]+'&deg;');

                  

                    $('#please_wait').hide();
                    $('#conditions').show();
                    $('.header').show();
                    $('.footer').show();


                }


          });

    forecast.read();

      // pull the current page off the parameters object
      page = e.view.params.page || 'Today';
      type = e.view.params.type || '';
      day = e.view.params.day || '';

      // filter the data source against the current page
      today.filter({ field: 'page', operator: 'eq', value: page });

      // update the navbar and refresh divs
        navbar.title(page);

        
        //$('.current_temp').html(localStorage.getItem('current_temp'));
        $('.current').addClass(localStorage.getItem('current_icon'));
        //$('.departure_temp').html(localStorage.getItem('departure_temp')+'&deg;');
        $('.departure').addClass(localStorage.getItem('departure_icon'));

      var icon = localStorage.getItem('departure_icon');
      var temp = localStorage.getItem('departure_temp');
      
      
        if(temp >= 70){
          $('.cat').attr("src","img/hot-cat.png");
        }
        else if(temp >= 50 && temp < 70){
          $('.cat').attr("src","img/warm-cat.png");
        }
        else if(temp >= 32 && temp < 50){
          $('.cat').attr("src","img/cold-cat.png");
        }
        else if(temp < 32){
          $('.cat').attr("src","img/snow-cat.png");
        }
        else if(icon == 'icon-rain'){
          $('.cat').attr("src","img/rain-cat.png");
        }


      $('.transportation').attr("src","img/"+localStorage.getItem("transportation")+".png");

    }
  };

  // create a new view
  view = new View('today', html, model, events);



});
