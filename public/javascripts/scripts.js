var timerCount = 0;

$(function(){
    // test
    var steps = [
        "Cook chicken for 5-10 hours.",
        "And heat rice for 30 seconds.",
        "and sit for 50 to 80 minutes. watch tv for 4-5 hours",
        "take shit out of oven",
        "voila",
        "Cook chicken for 5-10 hours.",
        "And heat rice for 30 seconds.",
        "and sit for 50 to 80 minutes. watch tv for 4-5 hours",
        "take shit out of oven",
        "voila"
    ];
    for (var i = 0; i < steps.length; i++) {
        newStepView = new InstructionView({instruction: steps[i]});
    }


    // testing push-up/down animation
    // current in css this animation happens on hover. will change fater leap stuff is
    
    // USE THIS TO PUSH LIST UP BY 150px
    $("#Instruction-list").css("top", "-=150");

    // USE THIS TO PUSH LIST DOWN BY 150px
    $("#Instruction-list").css("top", "+=150");

});