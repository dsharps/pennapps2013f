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
        var instruction = this.options.instruction;

        var template =
            "<div class='instruction'>"
                + "<p>" + instruction + "</p>"
            +"</div>";

        // parse string and for every 'time' encountered. for each, make a new timer
        var words = instruction.split(' ');
        console.log(words);
        for (var i = 0; i < words.length; i++) {

            if (words[i].indexOf("minutes") != -1) {

                if (i-3 >= 0 && words[i-2] == 'to') {
                    // 'to' case: 5 to 10 minutes
                    var time1 = parseInt(words[i-1]);
                    var time2 = parseInt(words[i-3]);

                    console.log("num to num");

                } else if (i-1 >= 0) {
                    var times = words[i-1].split('-');

                    // single number: 5 minutes
                    if (times.length === 1) {
                        // create new timer
                        console.log("single num");
                    } else if (times.length > 1) {
                        // hyphen case: 5-10 minutes

                        // handle hyphen case
                        console.log("num hyphen num")
                    }

                }
            }
        }

        $(this.el).append(template);
    }
});

});