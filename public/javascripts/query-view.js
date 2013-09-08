$(function() {

QueryView = Backbone.View.extend({
    
    el: $("#query-view"),
 
    events: {
        //"click #play-sounds-button": "play",
    },

    initialize: function(recipe){
        // _.bindAll(this, 'render','play');
        this.render(recipe);
    },

    render: function(recipe){
        var template = "<div id=query-container>"
                        + "<h1>In my pantry, you will find</h1>"
                        + '\n<input type="text"></input>'
                        + "</div>"
        $(this.el).append(template);
    }


});
});