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

    },
    afterShow: function (e) {

    //refresh the departure variables

    var todays_date = moment().format('YYYY-MM-DD').toString();
    var departure_time = todays_date+'T'+localStorage.getItem('departure_time')+':00'
    var forecast_key = 'c9002942b156fa5d0583934e2b1eced8';

    var lat = localStorage.getItem('lat')
    var long = localStorage.getItem('long')

    //get timed forecast
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
                    

                    $('#please_wait').hide();
                    $('#conditions').show();
                    $('.header').show();
                   

                }


          });

    forecast.read();

      page = e.view.params.page || 'Today';
      
      today.filter({ field: 'page', operator: 'eq', value: page });

      navbar.title(page);
        
      $('.transportation').attr("src","img/"+localStorage.getItem("transportation")+".png");

    }
  };

  // create a new view
  view = new View('today', html, model, events);



});
