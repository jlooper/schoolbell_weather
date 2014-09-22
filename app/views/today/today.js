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
      { name: 'Five Day Forecast', url: '#fiveday'  }
    ]
  });

  var model = kendo.observable({
    today: today,
    days: days
  });

  var events = {
    init: function (e) {

      // store a reference to the navbar component in this view
      navbar = e.view.header.find('.km-navbar').data('kendoMobileNavBar');

    },
    afterShow: function (e) {

      // pull the current page off the parameters object
      page = e.view.params.page || 'Today';
      type = e.view.params.type || '';
      day = e.view.params.day || '';

      // filter the data source against the current page
      today.filter({ field: 'page', operator: 'eq', value: page });

      // update the navbar and refresh divs
        navbar.title(page);

        //refresh these divs from local storage
        
        $('.current_temp').html(localStorage.getItem('current_temp'));
        $('.current').addClass(localStorage.getItem('current_icon'));
        $('.departure_temp').html(localStorage.getItem('departure_temp'));
        $('.departure').addClass(localStorage.getItem('departure_icon'));
      
      $('.transportation').attr("src","img/"+localStorage.getItem("transportation")+".png");

    }
  };

  // create a new view
  view = new View('today', html, model, events);



});
