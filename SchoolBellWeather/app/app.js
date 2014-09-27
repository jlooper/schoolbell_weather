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
