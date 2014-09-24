// configure the path to the text plugin since it is not in the same directory
// as require.js
require.config({
  paths: {
    'text': '../bower_components/requirejs-text/text'
  }
});

define([
  'app'
], function (app) {

  // if we are running on device, listen for cordova deviceready event
  if (kendo.mobileOs) {
    document.addEventListener('deviceready', function () {

      // initialize application
      app.init();
      app.setVars();
     

      // hide the native spash screen
      navigator.splashscreen.hide();
    }, false);
  }
  else {

    app.init();
    app.setVars();
  }

});
