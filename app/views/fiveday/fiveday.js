define([
  'views/view',
  'text!views/fiveday/fiveday.html'
], function (View, html) {

  var view, navbar, body, page;

  
  var fiveday = new kendo.data.DataSource({
    data: [
      { title: 'Five Day', page: 'Five Day'}
    ]
  });

  var days = new kendo.data.DataSource({
    data: [
      { name: 'Tomorrow', url: '#tomorrow'  },
      { name: 'Five Day Forecast', url: '#fiveday'  }
    ]
  });

  var model = kendo.observable({
    fiveday: fiveday,
    days: days
  });

  var events = {
    init: function (e) {

      // store a reference to the navbar component in this view
      navbar = e.view.header.find('.km-navbar').data('kendoMobileNavBar');

    },
    afterShow: function (e) {

      // pull the current page off the parameters object
      page = e.view.params.page || 'Five Day Forecast';
      
      // filter the data source against the current page
      fiveday.filter({ field: 'page', operator: 'eq', value: page });

      // update the navbar title
      
        navbar.title(page);

       

 
    }
  };

  // create a new view
  view = new View('fiveday', html, model, events);



});
