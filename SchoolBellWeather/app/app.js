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
    
             
  };
  var setVars = function () {

   $('#conditions').hide();  
   $('.header').hide(); 
   $('.footer').hide(); 
   $("#please_wait").data("kendoMobileModalView").open();           

  };


  


  return {
    init: init,
    setVars:setVars
  };

});
