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
 

  var model = kendo.observable({
    schedule: schedule,
    isVisible:false,
    departure_time: localStorage.getItem('departure_time'),
    saveSchedule: function(e){
      e.preventDefault();
      localStorage.setItem('departure_time',e.data.departure_time);    
      $("#sched-settings-saved-modal").data("kendoMobileModalView").open();
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

      
    },
    closeModal: function (e) {
      $("#sched-settings-saved-modal").data("kendoMobileModalView").close();
    }
  };

  // create a new view
  view = new View('schedule', html, model, events);



});
