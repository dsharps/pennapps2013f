$(function() {

IngredientsView = Backbone.View.extend({
    
    el: $("#ingredients-list"),
    focused: null,
    num_ingredients: 0,
 
    events: {
        //"click #play-sounds-button": "play",
    },

    initialize: function(recipe){
        // _.bindAll(this, 'render','play');
        this.render(recipe);
    },

    render: function(recipe){
        var template = "<h1>Do you have ...</h1>"
                        + '\n<div id="ingredients" class="cf">'
                        + '\n<ul id="list">';
        var ingredients = recipe['ingredients'];
        for (var i = 0; i < ingredients.length; i++) {
            ingredient = ingredients[i];
            li_id = 'ingredient_' + i;
            if(i == 0) {
                //template += '\n<li id=' + li_id + '>' + ingredient + "?</li>";
                template += '\n<li id=' + li_id + ' class="focused">' + ingredient + "?</li>";
                focused = i;
            }
            else {
                //template += '\n<li id=' + li_id + ' class="hidden">' + ingredient + "?</li>";
                template += '\n<li id=' + li_id + ' class="faded">' + ingredient + "?</li>";
            }
            this.num_ingredients++;
        };
        template += "\n</ul>";
        $(this.el).html(template);
        $(this.el).css('margin-top', 0);
        $('h1').click(function() {
            reject();
        });
    }


});
});