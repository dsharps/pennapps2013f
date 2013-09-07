$(function() {

InstructionView = Backbone.View.extend({
    
    el: $("#instruction-list"),
 
    events: {
        //"click #play-sounds-button": "play",
    },

    initialize: function(){
        // _.bindAll(this, 'render','play');
        this.render();
    },

    render: function(){

        // string
        var instruction = this.options.instruction;

        // parse string and for every 'time' encountered. for each, make a new timer


        var template =
            "<div>"
                + "<p>test</p>"
            +"</div>";

        $(this.el).append(template);
    }
});

});