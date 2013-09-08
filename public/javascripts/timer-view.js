$(function() {

    //var dsjafdsa = this.options.time[0];
    //if time.size > 1 do some processing
    var totalMS;
    var min;
    var extraMS;
    var MS;

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

    el: $('body'), 
    initialize: function(options) {
        /*
        if(this.options.time.length > 1) 
        {
            totalMS = this.options.time.length[0];    
        }
        else
        {
            totalMS= this.options.time.length[0];
        }
        */
        totalMS = 60000;
        min = Math.floor(totalMS / 60000);
        extraMS = totalMS % 60000;
        MS = 60000;
        segmentsSec = totalMS/1000;
        segmentsMin = min;
        //segmentsMin = 3;
        currentSegmentSec = 0;
        currentSegmentMin = 0;

      _.bindAll(this, 'render'); // fixes loss of context for 'this' within methods
       this.render(); // not all views are self-rendering. This one is.
    },

    clearCanvas: function () {
        if(canvas != null) { canvas.width = canvas.width; }
    },


    drawTimer: function()
    {
        canvas = document.getElementById('timercanvas');
        ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
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
    render: function(){
        self = this;
        var template = "<canvas id='timercanvas' style='z-index: 0;'> </canvas>"
                    + "Sample cooking clip..." 
        $(this.el).append(template);

        updateInterval = setInterval(function() { time+=interval;
            self.clearCanvas();
            self.drawTimer();
            if(time >= totalMS) {
                console.log("TIMER IS DONE");
                clearInterval(updateInterval);
            }}, interval);

        var timeDisplay = min + " " + (extraMS / 1000);
        $(this.el).append(timeDisplay);
    }
  });

  // Test TimerView
  var TimerView = new TimerView();
});



