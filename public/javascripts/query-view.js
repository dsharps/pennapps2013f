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
                        + "<h1>In my pantry, you would find...</h1>"
                        + '\n<input type="text" placeholder="Food"></input>'
                        + "</br>"
                        + "</br>"
                        + "</br>"
                        + "</br>"
                        + "</br>"
                        + "</br>"
                        + "</br>"
                        + "<img src='img/messless_logo.png' style='width: 400px; float: right; position: absolute; bottom: 20px; right: 40px'>"
                        + "</div>"
        $(this.el).append(template);
    }


});
});