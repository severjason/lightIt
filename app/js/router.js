"use strict";

(function ($) {
    var appRouter = Backbone.Router.extend({
        el:"#content",
        routes: {
            "": "home",
            "signup": "signup"
        },

        initialize: function () {
            this.appView = new App.views.App();
            this.signUpView = new App.views.SignUp();
        },

        home: function () {
            $(this.el).empty();
            $(this.el).append(this.appView.render().el);
        },

        signup: function () {
            $(this.el).empty();
            $(this.el).text('blank');
        }
    });
    
    $(document).ready(function () {
        App.router = new appRouter();
        Backbone.history.start({
            pushState: true
        });
    });
    

}(jQuery));