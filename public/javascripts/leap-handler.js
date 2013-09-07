$(function() {
	var controller = new Leap.Controller({enableGestures: true});

	var activeSide = "Steps";
	var handXCoordinate = 0;
	var handYCoordinate = 0;
	var bufferzone = 60; //mm of buffer around the middle line

	var numTimers = 4;
	var timerSelectHeight = 300/numTimers;
	var timerSelectOffset = 100;
	var activeTimer = 0;
	var timerCrank = 0;
	var timerMin = [0, 0, 0, 0];

	controller.loop(function(frame){
		//console.log(frame.pointables.length);

		//Detect whether or not there are hands in frame
		if (frame.hands.length > 0) {

			//detect steps vs. timers
			handXCoordinate = frame.hands[0].stabilizedPalmPosition[0]; //x-coord of first detected hand
			handYCoordinate = frame.hands[0].stabilizedPalmPosition[1];
			if (handXCoordinate < -(bufferzone/2) && activeSide == "Steps") {
				activeSide = "Timers";
				console.log("Switched to Timers : " + handXCoordinate);
			}
			else if (handXCoordinate > (bufferzone/2) && activeSide == "Timers") {
				activeSide = "Steps";
				console.log("Switched to Steps : " + handXCoordinate);
			}

			//if in timers, pick timer in focus
			if (activeSide == "Timers") {
				var oldAT = activeTimer;
				activeTimer = Math.max(Math.min(Math.floor((handYCoordinate - timerSelectOffset)/timerSelectHeight), numTimers-1), 0);;
				if (oldAT != activeTimer) console.log("Active Timer: " + activeTimer + "| " + + timerMin[activeTimer] + ":00");
			}

			//gesture handling
			if (frame.gestures.length > 0) {
				var g = frame.gestures[0];

				if (g.type == "circle") {
					var isClockwise = false;
				    if (g.normal[2] < 0) {
				    	isClockwise = true;
				   	}

					if (activeSide == "Steps"  && g.state == "stop") {
						isClockwise ? console.log("Next step") : console.log("Previous step");
					}

					else if (activeSide == "Timers") {
						if (isClockwise) {
							if (g.state == "update" && Math.floor(g.progress) > timerCrank) {
								timerCrank = Math.floor(g.progress);
								//console.log("Cranked: " + timerCrank);
								timerMin[activeTimer]++;
								console.log("Timer: " + timerMin[activeTimer] + ":00");
							}
							else if (g.state == "stop") {
								timerCrank = Math.floor(g.progress);
								//console.log("Added: " + timerCrank);
								timerCrank = 0;
							}
						}
						else {
							if (g.state == "update" && Math.floor(g.progress) > timerCrank) {
								timerCrank = Math.floor(g.progress);
								//console.log("Cranked: " + (-1 * timerCrank));
								if (timerMin[activeTimer] > 0) {timerMin[activeTimer]--;}
								console.log("Timer: " + timerMin[activeTimer] + ":00");
							}
							else if (g.state == "stop") {
								timerCrank = -1 * Math.floor(g.progress);
								//console.log("Subtracted: " + timerCrank);
								timerCrank = 0;
							}
						}
					}
				}
				else if (g.type == "swipe") {
					if (activeSide == "Steps") {
						if (g.direction[0] < 0 && g.speed > 1200 && frame.pointables.length <= 2) {
							//console.log(g.state);
							if (g.state == "start") {
								console.log("Add new timer. Speed: " + g.speed);
							}
						}
					}
				}
				else if (g.type == "screenTap") {
					if (activeSide == "Timers") {
						console.log("Toggle Timer " + activeTimer);
					}
				}
			}
		}
	});

});