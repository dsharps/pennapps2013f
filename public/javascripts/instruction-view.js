$(function() {

    var timerCount = 0;

    //var dsjafdsa = this.options.time[0];
    //if time.size > 1 do some processing
    var totalMS;
    var min;
    var extraMS;
    var MS;
    var snippet;

    var time = 0;
    var interval = 1000; // ms
    var canvas;
    var ctx;
    var segmentsSec = totalMS/1000;
    var segmentsMin = min;
    var currentSegmentSec = 0;
    var currentSegmentMin = 0;

    var updateInterval;

    var TimerView = Backbone.View.extend({

    el: $('#Timer-list'), 
    initialize: function() {
        var timerID = timerCount;
        timerCount++;
        if(this.options.time.length > 1) 
        {
            totalMS = this.options.time[0] * 1000;    
        }
        else
        {
            totalMS= this.options.time[0] * 1000;
        }
        snippet = this.options.instruction;
        //totalMS = 60000;
        min = Math.floor(totalMS / 60000);
        extraMS = totalMS % 60000;
        MS = 60000;
        segmentsSec = totalMS/1000;
        segmentsMin = min;
        //segmentsMin = 3;
        currentSegmentSec = 0;
        currentSegmentMin = 0;

      _.bindAll(this, 'render'); // fixes loss of context for 'this' within methods
       this.render(timerID); // not all views are self-rendering. This one is.
    },

    clearCanvas: function () {
        if(canvas != null) { canvas.width = canvas.width; }
    },


    drawTimer: function(TID)
    {
        canvas = $('#timercanvas' + TID)[0];
        console.log(canvas);
        ctx = canvas.getContext('2d');
        
        toRadians = function(deg) {
            return (Math.PI / 180) * deg;
        },
        getTickSec = function(num) {
            var tickSec = toRadians(360) / segmentsSec;
            return tickSec * num;
        },
        getTickMin = function(num) {
            var tickMin = toRadians(360) / segmentsMin;
            return tickMin * num;
        },
        segmentSec = function(start, end) {
            // Outer - seconds
            start = start || getTickSec(currentSegmentSec);
            end = end || getTickSec(currentSegmentSec + 1);
            ctx.lineWidth = 20;
            ctx.strokeStyle = 'rgba(51,153,255,0.3)';
            ctx.beginPath();
            ctx.arc(120, 120, 90, 0, end);
            ctx.stroke();
            ctx.closePath();
        };
        segmentMin = function(start, end) {
            // Inner - minutes
            start = start || getTickMin(currentSegmentMin);
            end = end || getTickMin(currentSegmentMin + 1);
            ctx.lineWidth = 20;
            ctx.strokeStyle = 'rgba(102,255,102,0.3)';
            ctx.beginPath();
            ctx.arc(120, 120, 60, 0, end);
            ctx.stroke();
            ctx.closePath();
        };

        // Seconds
        segmentSec(getTickSec(currentSegmentSec), getTickSec(currentSegmentSec + 1));
        currentSegmentSec += 1;

        // Min
        if((time % 60000) == 0) {
            segmentMin(getTickMin(currentSegmentMin), getTickMin(currentSegmentMin + 1));
            currentSegmentMin += 1;
        }
    },

    // `render()`: Function in charge of rendering the entire view in `this.el`. Needs to be manually called by the user.
    render: function(TID){
        self = this;
        var template =
        "<div id= 'timer" + TID + "' class='timer'>"
            + "<canvas class='timercanvas' id='timercanvas" + TID + "' width='300' height='300'></canvas>"
            + "<p class='snippet'>" + snippet + "</p>"
            + "<p class=time-remaining>" + min + " " + (extraMS / 1000) + "</p>"
        "</div>";
        $(this.el).append(template);

        updateInterval = setInterval(function() { time+=interval;
            self.clearCanvas();
            self.drawTimer(TID);
            if(time >= totalMS) {
                console.log("TIMER IS DONE");
                clearInterval(updateInterval);
            }}, interval);
    }
  });

  // Test TimerView
  //newTimerView = new TimerView();



InstructionView = Backbone.View.extend({
    
    el: $("#Instruction-list"),

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
        // console.log(words);

        // for each word in the sentence see if it contains a time type.
        // if it does, check various cases of time type, and create a timer
        for (var i = 0; i < words.length; i++) {

            var timeType = "";
            var timeDuration = [];

            // check current word in sentence to see if it contains a time type
            for (var j = 0; j < timeTypeList.length; j++) {
                if (words[i].indexOf(timeTypeList[j]) != -1) {
                    timeType = timeTypeList[j];
                    // console.log(timeType);
                }
            }

            if (timeType == "") continue;
            else {

                if (i-3 >= 0 && (words[i-2] == 'to' || words[i-2] == '-')) {
                    // 'to' case: 5 to 10 minutes
                    var time1 = parseInt(words[i-1]);
                    var time2 = parseInt(words[i-3]);

                    // handle num to/- num case
                    timeDuration = [time1, time2];
                    // console.log("num to/- num");

                } else if (i-1 >= 0) {
                    var times = words[i-1].split('-');

                    // single number: 5 minutes
                    if (times.length === 1) {

                        // handle single case
                        timeDuration = times;
                        // console.log("single num");
                    } else if (times.length > 1) {
                        // hyphen case: 5-10 minutes

                        // handle hyphen case
                        timeDuration = times;
                        // console.log("num hyphen num")
                    }

                }
            }

            // create new timer. convert all times to sec based off time type
            var timeInSeconds = [];
            switch(timeType) {
            case "hour":
                for (var j = 0; j < timeDuration.length; j++) {
                    timeInSeconds.push(timeDuration[j] * 60 * 60);
                }
                break;
            case "min":
                for (var j = 0; j < timeDuration.length; j++) {
                    timeInSeconds.push(timeDuration[j] * 60);
                }
                break;
            case "sec":
                for (var j = 0; j < timeDuration.length; j++) {
                    timeInSeconds.push(timeDuration[j] * 1);
                }
            }

            // CREATE NEW TIMER HERE.
            var params = {
                time: timeInSeconds,
                instruction: instruction
            };
            // pass params to timer object
            var newTimerView = new TimerView(params);
            // console.log(params);
        }

        $(this.el).append(template);
    }
});

});