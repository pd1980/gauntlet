define([
  "underscore",
  "jquery",
  "backbone",
  "modules/Control/Control",
  "modules/Display/Display",
  "pubsub",
  "visualize"
],

function( _, $, Backbone, Control, Display, Pubsub, Visualize){

  var App = Backbone.View.extend({
    el: $('#app'),
    initialize: function() {

      this.channel = new Pubsub();

      this.viz = new Visualize(this.channel);

      this.control = new Control({
        $el: this.$el.find("#control"),
        channel: this.channel
      });

      this.display = new Display({
        $el: this.$el.find("#display"),
        channel: this.channel
      });

      this.render();

    },

    render: function() {


    },

    events: {
            "click #test1": "loadTestData",
            "click #test2": "loadTestData"
    },

    loadTestData:function(e){
        e.preventDefault();
        var target =  e.target.id;
        this.control.loadData(target);
    }

  });

 var app = new App();

});
