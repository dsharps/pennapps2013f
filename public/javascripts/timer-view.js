$(function() {

    //var min = 2;
    //var dsjafdsa = this.options.time[0];
    //if time.size > 1
    var totalMS;
    var min;
    var extraMS;
    var MS;
    var time = 0;
    var interval = 1000; // ms
    var canvas;
    var ctx;

    var TimerView = Backbone.View.extend({

    el: $('body'), 
    initialize: function(){
        //totalMS = 80000;
        totalMS = 10000;
        min = Math.floor(totalMS / 60000);
        extraMS = totalMS % 60000;
        MS = 60000;

      _.bindAll(this, 'render'); // fixes loss of context for 'this' within methods
       this.render(); // not all views are self-rendering. This one is.
    },

    updateTimer: function() {
        console.log("update");
        time+=interval;
        this.clearCanvas();
        this.drawTimer();
    },

    // Draw a ring with a specified radius, width, and fill
    drawRing: function(x, y, outsideRadius, ringWidth, percentFilled, rotationAngle) {
        context.beginPath();

        context.arc(x, y, outsideRadius - ringWidth / 2, rotationAngle, (rotationAngle - 2 * Math.PI) + 2 * Math.PI * percentFilled, true);

        context.lineWidth = ringWidth;
        context.stroke();
    },

    clearCanvas: function () {
        if(canvas != null) { canvas.width = canvas.width; }
        //context.fillStyle = "#000000";
        //context.fillRect(0, 0, canvas.width, canvas.height);
    },


    drawTimer: function()
    {
        canvas = document.getElementById('timercanvas');
        ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        window.drawCircles = function(x, y) {          
            var buffer = document.createElement('canvas');
            buffer.width = canvas.width;
            buffer.height = canvas.height;
            bctx = buffer.getContext('2d');
            bctx.drawImage(canvas, 0, 0)
            
            var segmentsSec = totalMS/1000,
                segmentsMin = min,
                currentSegmentSec = 0,
                currentSegmentMin = 0,
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
                    ctx.drawImage(buffer, 0, 0);
                    ctx.beginPath();
                    ctx.arc(x, y, 90, 0, end);
                    ctx.stroke();
                    ctx.closePath();
                };
                segmentMin = function(start, end) {
                    // Inner - minutes
                    ctx.lineWidth = 20;
                    ctx.strokeStyle = 'rgba(102,255,102,0.3)';
                    start = start || getTickSec(currentSegmentMin);
                    end = end || getTickSec(currentSegmentMin + 1);
                    ctx.drawImage(buffer, 0, 0);
                    ctx.beginPath();
                    ctx.arc(x, y, 60, 0, end);
                    ctx.stroke();
                    ctx.closePath();
                };

                //function render() {
                    // split for min and seconds
                    // Seconds
                segmentSec(getTickSec(currentSegmentSec), getTickSec(currentSegmentSec + 1));
                currentSegmentSec += 1;
                if (currentSegmentSec < segmentsSec) {
                    //setTimeout(render, 1000);
                } else {
                    currentTickSec = 0;
                }

                // Min
                if(time % 60000 == 0) {
                    segmentMin(getTickMin(currentSegmentMin), getTickMin(currentSegmentMin + 1));
                    currentSegmentMin += 1;
                    if (currentSegmentMin < segmentsMin) {
                        //setTimeout(render, 60000);
                    } else {
                        currentTickMin = 0;
                    }
                }
            //};

            //render();
        };

        drawCircles(100, 100);
        //drawRing(200, 200, 90, 80, 70, 30);

        console.log(time);
        if(time >= totalMS) {
            console.log("TIMER IS DONE");
        }
        else {
            setInterval(this.updateTimer(), interval);
        }
    },

    startTimer: function()
    {

    },    
    // `render()`: Function in charge of rendering the entire view in `this.el`. Needs to be manually called by the user.
    render: function(){

      var template = "<canvas id='timercanvas' style='z-index: 0;'> </canvas>"
                    + "Sample cooking clip..." 
      $(this.el).append(template);

      setInterval(this.updateTimer(), interval);

      var timeDisplay = min + " " + (extraMS / 1000);
      $(this.el).append(timeDisplay);
    }
  });

  // Test TimerView
  var TimerView = new TimerView();
});



