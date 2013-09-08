$(function() {

    var timerCount = 0;
    var interval = 1000; // ms
    var numActiveTimers = 0;

    var TimerView = Backbone.View.extend({

        totalMS: 0,
        min: 0,
        extraMS: 0,
        snippet: '',

        time: 0,
        canvas: null,
        ctx: null,
        segmentsSec: 0,
        segmentsMin: 0,
        currentSegmentSec: 0,
        currentSegmentMin: 0,

        updateIntervalID: 0, 

    el: $('#Timer-list'), 
    initialize: function() {
        var timerID = timerCount;
        timerCount++;
        numActiveTimers++;

        //if time.size > 1 do some processing
        if(this.options.time.length > 1) 
        {
            totalMS = this.options.time[0] * 1000;    
        }
        else
        {
            totalMS= this.options.time[0] * 1000;
        }
        //console.log(totalMS);
        snippet = this.options.instruction;
        //totalMS = 5000;
        min = Math.floor(totalMS / 60000) - 1;
        if(min < 0)
        {
            min = 0;
        }
        extraMS = totalMS % 60000;
        //segmentsSec = totalMS/1000;
        segmentsMin = min;
        currentSegmentSec = 0;
        currentSegmentMin = 0;
        time = 0;

        updateIntervalID = 0;

      _.bindAll(this, 'render'); // fixes loss of context for 'this' within methods
       this.render(timerID, totalMS); // not all views are self-rendering. This one is.
    },

    // Performs the drawing of the timers
    drawTimer: function(TID, TMS, updateIntervalID)
    {
        segmentsSec = 60 * numActiveTimers;
        //segmentsMin = min;
        //console.log(segmentsMin);

        time+=interval/numActiveTimers;
        
        //console.log(time);
        //console.log($('#timer' + TID));
        if((time) >= TMS && $('#timer' + TID).length != 0) {
            console.log("TIMER " + TID + " IS DONE");
            if(updateIntervalID)
            {
                clearInterval(updateIntervalID);
                updateIntervalID = null;
            }


            numActiveTimers--;

            // Insert animation?

            $('#timer' + TID).remove();
            return;
        }

        canvas = $('#timercanvas' + TID)[0];
        //console.log(canvas);
        ctx = canvas.getContext('2d');

        if(canvas != null) { canvas.width = canvas.width; }
        
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
        drawSegmentSec = function(start, end) {
            // Outer - seconds
            //start = start || getTickSec(currentSegmentSec);
            //end = end || getTickSec(currentSegmentSec + 1);
            ctx.lineWidth = 20;
            ctx.strokeStyle = 'rgba(51,153,255,0.3)';
            ctx.beginPath();
            ctx.arc(120, 120, 90, 0, end);
            ctx.stroke();
            ctx.closePath();
        };
        drawSegmentMin = function(start, end) {
            // Inner - minutes
            //start = start || getTickMin(currentSegmentMin);
            //end = end || getTickMin(currentSegmentMin + 1);
            ctx.lineWidth = 20;
            ctx.strokeStyle = 'rgba(102,255,102,0.3)';
            ctx.beginPath();
            ctx.arc(120, 120, 60, 0, end);
            ctx.stroke();
            ctx.closePath();
        };

        // Seconds
        drawSegmentSec(getTickSec(currentSegmentSec), getTickSec(currentSegmentSec + 1));
        currentSegmentSec += 1;
        totalMS -= 1000 / numActiveTimers;
        if(totalMS < 0)
        {
            totalMS = 0;
        }
        if(currentSegmentSec >= 60 * numActiveTimers) 
        {
            if(canvas != null) { canvas.width = canvas.width; }
            currentSegmentSec = 0;
        }

        // Min
        if((time % 60000) == 0) {
            drawSegmentMin(getTickMin(currentSegmentMin), getTickMin(currentSegmentMin + 1));
            currentSegmentMin += 1;
            min--;
            if(min < 0) 
            {
                min = 0;
            }
        }
    },
/*
    startTimer: function(TID, TMS) {
        var displaySecs = 0;

            updateDisplayID = setInterval(function() {
            displaySecs = Math.floor(((totalMS % (1000*60*60)) % (1000*60)) / 1000);
            console.log(totalMS);
            $('#timer' + TID + ' .time-remaining').replaceWith("<p class=time-remaining>" + min + " " + displaySecs + "</p>");
            }, interval);

        // Update the timer every second (1000 ms)
        updateIntervalID = setInterval(function() { 
            self.drawTimer(TID, TMS, updateIntervalID);
            }, interval);
    },
*/


    // `render()`: Function in charge of rendering the entire view in `this.el`. Needs to be manually called by the user.
    render: function(TID, TMS){
        self = this;

        var displaySecs = 0;

        var template =
        "<div id= 'timer" + TID + "' class='timer'>"
            + "<div class='clock-container'>"
                + "<canvas class='timercanvas' id='timercanvas" + TID + "' width='240' height='240'></canvas>"
                + "<p class=time-remaining>" + min + " " + displaySecs + "</p>"
            + "</div>"
            + "<p class='snippet'>" + snippet + "</p>"
        "</div>";
        $(this.el).append(template);

        //this.startTimer(TID, TMS);

        
        updateDisplayID = setInterval(function() {
            displaySecs = Math.floor(((totalMS % (1000*60*60)) % (1000*60)) / 1000);
            //console.log(totalMS);
            $('#timer' + TID + ' .time-remaining').replaceWith("<p class=time-remaining>" + min + " " + displaySecs + "</p>");
            }, interval);

        // Update the timer every second (1000 ms)
        updateIntervalID = setInterval(function() { 
            self.drawTimer(TID, TMS, updateIntervalID);
            }, interval);
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
        var elementID = this.options.elementID;

        var template =
            "<div class='instruction' id="+elementID+">"
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
                    if (times.length === 1 && parseInt(times[0])) {
                        // handle single case
                        timeDuration = times;
                        // console.log("single num");
                    } else if (times.length > 1) {
                        // hyphen case: 5-10 minutes

                        // handle hyphen case
                        for (var j = 0; j < times.length; j++) {
                            if (!parseInt(times[i])) {
                                return;
                            }
                        }
                        timeDuration = times;
                        // console.log("num hyphen num")
                    } else {
                        return;
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
        }

        $(this.el).append(template);
    }
});

});