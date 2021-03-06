define([
  'views/view',
  'text!views/leftNav/leftNav.html'
], function (View, html) {

  var leftNav = new kendo.data.DataSource({
    data: [
      { name: 'Today', url: 'today' },
      { name: 'My Transportation', url: 'transportation' },
      { name: 'My Schedule', url: 'schedule' },
      { name: 'Tomorrow', url: 'tomorrow' },
      { name: 'Next Five Days Weather', url: 'fiveday' }
    ]
  });

  var model = {
    leftNav: leftNav
  };
  
  
  // create a new view
  var view = new View('leftNav', html, model);

});
