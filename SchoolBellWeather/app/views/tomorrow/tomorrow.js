define([
  'views/view',
  'text!views/tomorrow/tomorrow.html'
], function (View, html) {

  var view, navbar, body, page;

  
  var tomorrow = new kendo.data.DataSource({
    data: [
      { title: 'Tomorrow', page: 'Tomorrow'}
    ]
  });

  

  var model = kendo.observable({
    tomorrow: tomorrow
  });

  var events = {
    init: function (e) {

      // store a reference to the navbar component in this view
      navbar = e.view.header.find('.km-navbar').data('kendoMobileNavBar');

      },
      
      afterShow: function (e) {

          // pull the current page off the parameters object
          page = e.view.params.page || 'Tomorrow\'s Forecast';
            
          // filter the data source against the current page
          tomorrow.filter({ field: 'page', operator: 'eq', value: page });

          // update the navbar title
            
          navbar.title(page);
       
          }
      };

  // create a new view
  view = new View('tomorrow', html, model, events);



});
