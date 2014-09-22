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

  var days = new kendo.data.DataSource({
    data: [
      { name: 'Tomorrow', url: '#tomorrow'  },
      { name: 'Five Day Forecast', url: '#fiveday'  }
    ]
  });

  var model = kendo.observable({
    tomorrow: tomorrow,
    days: days
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
        //$('.current_temp').html(localStorage.getItem('current_temp'));
        //$('.current').addClass(localStorage.getItem('current_icon'));
        //$('.departure_temp').html(localStorage.getItem('departure_temp'));
        //$('.departure').addClass(localStorage.getItem('departure_icon'));
      
 
    }
  };

  // create a new view
  view = new View('tomorrow', html, model, events);



});
