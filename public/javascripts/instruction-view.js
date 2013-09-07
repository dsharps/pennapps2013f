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
        var timeTypeList = ["hour", "min", "sec"];
        console.log(words);

        // for each word in the sentence see if it contains a time type.
        // if it does, check various cases of time type, and create a timer
        for (var i = 0; i < words.length; i++) {

            var timeType = "";
            var timeDuration = 0;

            // check current word in sentence to see if it contains a time type
            for (var j = 0; j < timeTypeList.length; j++) {
                if (words[i].indexOf(timeTypeList[j]) != -1) {
                    timeType = timeTypeList[j];
                    console.log(timeType);
                }
            }

            if (timeType == "") continue;
            else {

                if (i-3 >= 0 && (words[i-2] == 'to' || words[i-2] == '-')) {
                    // 'to' case: 5 to 10 minutes
                    var time1 = parseInt(words[i-1]);
                    var time2 = parseInt(words[i-3]);

                    // handle num to/- num case
                    console.log("num to/- num");

                } else if (i-1 >= 0) {
                    var times = words[i-1].split('-');

                    // single number: 5 minutes
                    if (times.length === 1) {

                        // handle single case
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