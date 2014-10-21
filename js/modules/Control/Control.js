define([
  "underscore",
  "jquery"
], 

function( _, $){

  var Control = function(options){
    this.name = "Control";
    this.options = _.defaults(options, {
      $el: null
    });
    this.initialize();
    this.loadData('test1');
  }

  Control.prototype.initialize = function(){
    console.log(this.name + ": initialize");
    this.options.channel.subscribe('DATA:RENDERED', this.render, this);
  }

  Control.prototype.loadData = function(type){
    var that = this;
    var filename = (type=='test2') ? 'data-tree.json' : 'test-data.json';

    $.ajax({
      url: 'data/'+filename+'?'+"bust=" + (new Date()).getTime(),
    })
    .done(function(data) {
      that.options.channel.publish('DATA:LOADED', {type:type, data:data});
    })
    .fail(function() {
      console.log("WARNING: " + this.name + " could not fetch data");
    });

  }

  Control.prototype.render = function(type){
    var html;

    switch(type) {
      case 'test1':
        html = '<a id="test2" href="#" class="btn btn-primary">Load Exercise 2</a>';
        break;
      case 'test2':
        html = '<a id="test1" href="#" class="btn btn-primary">Load Exercise 1</a>';
        break;
    }

    this.options.$el.html(html);
    console.log('Woohoo, looks like everything is done.');

  }

  return Control;

});