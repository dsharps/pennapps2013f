var timerCount = 0;
var recipes = [];
var ingredientsView = null;
var query = '';
URL_PATH = 'http://localhost:3000'

var instructions = [];
var activeInstruction = 0;

var phase = "Query";

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
            phase = "Instructions";
            var chosenRecipe = recipes[0];
            for (var i = 0; i < chosenRecipe.text.length; i++) {
               newStepView = new InstructionView({instruction: chosenRecipe.text[i], elementID: ('instruction'+i)});
               instructions[i] = newStepView;
            }
            $("#instruction"+activeInstruction).addClass("active");

            $('html, body').animate({
                scrollTop: $("#Instruction-list-container").offset().top
            }, 700);
        }
        else {
            // another li ingredient
            focused.next().addClass('focused');
            focused.next().removeClass('faded');
        }
    }, 1000);
};

var reject = function() {
    var rejected = $('#list');
    rejected.addClass('rejected');
    setTimeout(function() {
        rejected.remove();
        //ingredientsView.remove();
        $("#ingredients-list").html('');
        $("#ingredients").css('margin-top', '-100%');
        recipes = _.rest(recipes);
        var path = URL_PATH + "/recipes/random"
        if(recipes.length == 0) {
            $.get(path, function(recipe) {
                recipes.push(recipe);
                ingredientsView = new IngredientsView(recipes[0]);
            });
        }
        else {
            ingredientsView = new IngredientsView(recipes[0]);
            var path = URL_PATH + "/recipes/random" + query;
            $.get(path, function(recipe) {
                recipes.push(recipe);
            });
        }
    }, 1000);
};

var moveToIngredientsView = function(query) {
    phase = "Ingredients";
    var path = URL_PATH + "/recipes/random" + query;
    // Get random recipe and render ingredients view
    $.get(path, function(recipe) {
        recipes.push(recipe);
        $.get(path, function(recipe) {
            recipes.push(recipe);
            ingredientsView = new IngredientsView(recipes[0]);
            $("li").click(function() {
                var classNames = $(this).attr('class').split(/\s+/);
                for(var i = 0; i < classNames.length; i ++) {
                    if(classNames[i] == "focused") {
                        scrollIngredientsUp();
                    }
                }
            });
        });
    });
};

$(function(){
    var queryView = new QueryView();
    $(document).keypress(function(e) {
        console.log(e);
        if (e.which == 13) {
            // Enter pressed; catch query and move to next view
            var text = $('input').val();
            if(text != '') {
                query = '?allowedIngredient[]=' + text;
            }
            queryView.remove();
            moveToIngredientsView(query);
        }
    });

    $(document).keydown(function(e){
        if (e.keyCode == 38) { //up
            $("#Instruction-list").css("top", "-=" + (30 + ($("#instruction"+activeInstruction).height() + $("#instruction"+(activeInstruction+1)).height())/2));
            $("#instruction"+activeInstruction).removeClass("active");
            activeInstruction++;
            $("#instruction"+activeInstruction).addClass("active");
            return false;
        } else if (e.keyCode == 40) { //down
            $("#Instruction-list").css("top", "+=" + (30 + ($("#instruction"+activeInstruction).height() + $("#instruction"+(activeInstruction-1)).height())/2));
            $("#instruction"+activeInstruction).removeClass("active");
            activeInstruction--;
            $("#instruction"+activeInstruction).addClass("active");
            return false;
        }
    });

});

//var instructions = [];
//var activeInstruction = 0;
//$(function(){
//    // test
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
//        newStepView = new InstructionView({instruction: steps[i], elementID: ('instruction'+i)});
//        instructions[i] = newStepView;
//    }
//    $("#instruction"+activeInstruction).addClass("active");
//});