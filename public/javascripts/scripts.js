var timerCount = 0;
URL_PATH = 'http://localhost:3000'

var scrollIngredientsUp = function() {
    var focused = $(".focused")
    focused.addClass("hidden");
    var self = this;
    setTimeout(function() {
        var parent = focused.parent();
        var m = parent.css('margin-top').replace(/px/g, '');
        var h = focused.height();
        parent.css('margin-top', m - h);
        focused.removeClass('focused');
        var next = focused.next();
        if(next.length==0) {
            // no more ingredients
            alert("render recipe");
        }
        else {
            // another li ingredient
            focused.next().addClass('focused');
            focused.next().removeClass('faded');
        }
    }, 1000);
};

$(function(){
    var path = URL_PATH + "/recipes/random"
    var recipes = [];
    // Get random recipe and render ingredients view
    $.get(path, function(recipe) {
        var ingredientsView = new IngredientsView(recipe);
        //$(".faded").css("text-align", "left");
        $(".focused").hover(function() {
            scrollIngredientsUp();
        });
    });



    // test
//    var steps = [
//        "Cook chicken for 5-10 hours.",
//        "And heat rice for 30 seconds.",
//        "and sit for 50 to 80 minutes. watch tv for 4-5 hours",
//        "take shit out of oven",
//        "voila",
//        "Cook chicken for 5-10 hours.",
//        "And heat rice for 30 seconds.",
//        "and sit for 50 to 80 minutes. watch tv for 4-5 hours",
//        "take shit out of oven",
//        "voila"
//    ];
//    for (var i = 0; i < steps.length; i++) {
//        newStepView = new InstructionView({instruction: steps[i]});
//    }
//
//    // testing push-up/down animation
//    // current in css this animation happens on hover. will change fater leap stuff is
//    
//    // USE THIS TO PUSH LIST UP BY 150px
//    $("#Instruction-list").css("top", "-=150");
//
//    // USE THIS TO PUSH LIST DOWN BY 150px
//    $("#Instruction-list").css("top", "+=150");
//
//    // USE THESE TO ANIMATE ENLARGING INSTRUCTIONS
//    // $("#SOME-INSTRUCTION-ID").addClass("active");
//    // $("#SOME-INSTRUCTION-ID").removeClass("active");
//    
//    // An example of how it animates (remove this later when incorporated into leap stuff)
//    $(".instruction").hover(function() {
//        $(this).addClass("active");
//    },
//    function() {
//        $(this).removeClass("active");
//    });
});