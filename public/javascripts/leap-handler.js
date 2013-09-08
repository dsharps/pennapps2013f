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

	var selfTimer;
	var otherTimer;
	var canSwipeUp = true;
	var canSwipeDown = true;

	var gestureCount = 0;
	setInterval(function() {
		gestureCount = 0;
	}, 1000);

	var dominantDirection = function(normal) {
		var m = Math.max(Math.abs(normal[0]), Math.abs(normal[1]), Math.abs(normal[2]));
		if (m == Math.abs(normal[0])) {return 0;}
		else if (m == Math.abs(normal[1])) {return 1;}
		else {return 2};
	}

	controller.loop(function(frame){
		//console.log(frame.pointables.length);
		if (phase == "Query") {

		}
		else if (phase == "Ingredients") {
			if (frame.hands.length > 0) {
				if (frame.gestures.length > 0) {
					var g = frame.gestures[0];
					if (g.type == "swipe") {
						if (dominantDirection(g.direction) == 0 && g.speed > 1000) { // we know it's a horizontal swipe
							scrollIngredientsUp();
						}
						else if (dominantDirection(g.direction) == 1 && g.direction[1] < 0 && frame.pointables.length > 2 && g.speed > 1000) {
							reject();
						}
					}
				}
			}
		}
		else if (phase == "Instructions") {
			for (var i = 0; i < frame.gestures.length; i++) {
				if (frame.gestures[i].state == "start") {
					gestureCount++;
				}
			}
			if (gestureCount > 15 && frame.hands.length == 2) {
				alert("Order a fuckin' pizza!");
				gestureCount = 0;
			}

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
					if (g.type == "keyTap") {
						for (var i = 0; i < frame.gestures.length; i++) {
							if (frame.gestures[i] != "keyTap") {
								g = frame.gestures[i];
								break;
							}
						}
					}

					if (g.type == "circle") {
						var isClockwise = false;
					    if (g.normal[2] < 0) {
					    	isClockwise = true;
					   	}

						if (activeSide == "Steps"  && g.state == "stop") {
							if (isClockwise) {
								console.log("Next step (old)");

								// $("#Instruction-list").css("top", "-=" + $("#instruction"+activeInstruction).height());
								// $("#instruction"+activeInstruction).removeClass("active");
								// activeInstruction++;
								// $("#instruction"+activeInstruction).addClass("active");

							}
							else {
								console.log("Previous step (old)");

								// $("#Instruction-list").css("top", "+=" + $("#instruction"+activeInstruction).height());
								// $("#instruction"+activeInstruction).removeClass("active");
								// activeInstruction--;
								// $("#instruction"+activeInstruction).addClass("active");
							}
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
							if (dominantDirection(g.direction) == 1 && g.state == "start") { //mostly going up
								if (g.direction[1] > 0 && canSwipeUp && g.speed > 1200 && activeInstruction < instructions.length-1) {
									clearTimeout(otherTimer);
									console.log("Next step (up)");
									//console.log($("#instruction"+activeInstruction).height());
									if ($("#instruction"+activeInstruction).height() > 0 && $("#instruction"+(activeInstruction + 1)).height() > 0) {
										$("#Instruction-list").css("top", "-=" + (30 + ($("#instruction"+activeInstruction).height() + $("#instruction"+(activeInstruction+1)).height())/2));
										$("#instruction"+activeInstruction).removeClass("active");
										activeInstruction++;
										$("#instruction"+activeInstruction).addClass("active");
									}
									
									canSwipeDown = false; //disable down swipes for 3/4 of a second
									otherTimer = setTimeout(function() {
										canSwipeDown = true;
									}, 750);

									canSwipeUp = false; //disable up swipes for 1/10 of a second - combats double-triggers
									selfTimer = setTimeout(function() {
										canSwipeUp = true;
									}, 100);
								}
								else if (g.direction[1] < 0 && canSwipeDown && g.speed > 1200 && activeInstruction > 0){
									clearTimeout(otherTimer);
									console.log("Previous step (down)");
									
									if ($("#instruction"+activeInstruction).height() > 0 && $("#instruction"+(activeInstruction-1)).height() > 0) {
										$("#Instruction-list").css("top", "+=" + (30 + ($("#instruction"+activeInstruction).height() + $("#instruction"+(activeInstruction-1)).height())/2));
										$("#instruction"+activeInstruction).removeClass("active");
										activeInstruction--;
										$("#instruction"+activeInstruction).addClass("active");
									}
									
									canSwipeUp = false; //disable down swipes for 3/4 of a second
									otherTimer = setTimeout(function() {
										canSwipeUp = true;
									}, 750);

									canSwipeDown = false; //disable down swipes for 1/10 of a second - combats double-triggers
									selfTimer = setTimeout(function() {
										canSwipeDown = true;
									}, 100);
								}
							}
							else if (dominantDirection(g.direction) == 0 && g.speed > 1200 && g.state == "start" && frame.pointables.length <= 2) {
								//console.log(g.state);
								if (g.direction[0] < 0) {
									console.log("Add new timer. Speed: " + g.speed);
								}
							}
							//console.log("Normal: " + g.direction[0] + ", " + g.direction[1] + ", " + g.direction[2] + ". Speed: " + g.speed);
						}
					}
					else if (g.type == "screenTap") {
						if (activeSide == "Timers") {
							console.log("Toggle Timer " + activeTimer);
						}
					}
				}
			}
		}
	});

});