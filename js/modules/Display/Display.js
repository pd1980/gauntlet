define([
  "underscore",
  "jquery"
], 

function( _, $){

  var Display = function(options){
    this.name = "Display";
    this.options = _.defaults(options, {
      $el: null
    });
    this.initialize();
  }

  Display.prototype.initialize = function(){
    console.log(this.name + ": initialize");
    this.options.channel.subscribe('DATA:LOADED', this.render, this);
  }

  Display.prototype.templates = function(type) {
    switch(type) {
      case 'pie':
        return {
              main: _.template([
                              '<h3>Exercise 1</h3>',
                              '<% $.each(items, function(index, item){ %>',
                                '<div class="box">',
                                  '<div class="command"><%= command(item) %></div>',
                                  '<div class="data"><%= data({index:index, item:item}) %></div>',
                                  '<div class="tags"><%= tags(item) %></div>',
                                '</div>',
                              '<% }) %>',
                      ].join('')),

              command: _.template('<%= command %>'),

              data:  _.template('<div id="data-pie-<%= index %>" class="visualize-pie"></div>'),

              tags: _.template('<%= tags.join("<br />") %>')
        }
        break;

      case 'tree':
        return {
              main: _.template([
                              '<h3>Exercise 2</h3>',
                              '<% $.each(items, function(index, item){ %>',
                                '<div class="box">',
                                  '<p><%= item.name %></p>',
                                  '<div id="data-tree-<%= index %>" class="visualize-tree"></div>',
                                '</div>',
                              '<% }) %>',
                      ].join(''))
        }
        break;

    }

  }

  Display.prototype.render = function(data){
    var type = data.type;
    var data = data.data;
    var template, length, i;

    switch(type){
      case 'test1':
        template = this.templates('pie');
        length = data.length;
        this.options.$el.html(template.main({
          items:   data,
          command: template.command,
          data:    template.data,
          tags:    template.tags
        }));
        for(i=0; i<length; i++) {
          this.options.channel.publish("VISUALIZE:PIE", {data:data[i].data, domId: "#data-pie-"+i});
        }
        break;

      case 'test2':
        template = this.templates('tree');
        length = data.length;
        this.options.$el.html(template.main({
          items:   data
        }));
        for(i=0; i<length; i++) {
          this.options.channel.publish("VISUALIZE:TREE", {data:data[i], domId: "#data-tree-"+i});
        }
        break;
    }

    this.options.channel.publish("DATA:RENDERED", type);
  }

  return Display;

});
