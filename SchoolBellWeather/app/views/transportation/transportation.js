define([
  'views/view',
  'text!views/transportation/transportation.html'
], function (View, html) {

  var view, navbar, page;

  /*forecast info*/


  var transportation = new kendo.data.DataSource({
    data: [
      { title: 'Transportation', page: 'Transportation'}
    ]
  });




  var model = kendo.observable({
    transportation: transportation
  });


  var events = {
    init: function (e) {
      // store a reference to the navbar component in this view
      navbar = e.view.header.find('.km-navbar').data('kendoMobileNavBar');
      $('#notification').hide()
    },
    afterShow: function (e) {
      // pull the current page off the parameters object
      page = e.view.params.page || 'Transportation';

      // filter the data source against the current page
      transportation.filter({ field: 'page', operator: 'eq', value: page });

      // update the navbar title
      navbar.title(page);
    },
    selectTransportation: function(e){
      var type = this.element.prop("id");
      localStorage.setItem("transportation",type);
      $("#trans-settings-saved-modal").data("kendoMobileModalView").open();
    },
    closeModal: function (e) {
      $("#trans-settings-saved-modal").data("kendoMobileModalView").close();
    }
  };

  // create a new view
  view = new View('transportation', html, model, events);



});
