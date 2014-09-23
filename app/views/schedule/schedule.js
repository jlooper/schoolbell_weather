define([
  'views/view',
  'text!views/schedule/schedule.html'
], function (View, html) {

  var view, navbar, page;

  var schedule = new kendo.data.DataSource({
    data: [
      { title: 'Schedule', page: 'Schedule'}
    ]
  });

  var days = new kendo.data.DataSource({
    data: [
      { name: 'Tomorrow', url: '#tomorrow'  },
      { name: 'Five Days', url: '#fiveday'  }
    ]
  });

  var model = kendo.observable({
    schedule: schedule,
    days: days,
    departure_time: localStorage.getItem('departure_time'),
    saveSchedule: function(e){
      e.preventDefault();
      localStorage.setItem('departure_time',e.data.departure_time);
      alert("Setting Saved!")
    }
  });

  var events = {
    init: function (e) {
      // store a reference to the navbar component in this view
      navbar = e.view.header.find('.km-navbar').data('kendoMobileNavBar');
    },
    afterShow: function (e) {
      // pull the current page off the parameters object
      page = e.view.params.page || 'Schedule';

      // filter the data source against the current page
      schedule.filter({ field: 'page', operator: 'eq', value: page });

      // update the navbar title
      navbar.title(page);

      //forecast.io data here
    }
  };

  // create a new view
  view = new View('schedule', html, model, events);



});
