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
  


  return {
    init: init,
    setVars:setVars
  };

});
