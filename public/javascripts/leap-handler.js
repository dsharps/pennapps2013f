$(function() {
	var controller = new Leap.Controller({enableGestures: true});

	controller.loop(function(frame){
		//console.log(frame.pointables.length);
	});

});