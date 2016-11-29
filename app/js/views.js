"use strict";

(function ($) {
    App.views.Product = Backbone.View.extend({
        tagName: "div",
        content: "#content",
        comments: "#comments",
        loader: ".loader",
        postReviewContainer: "#post_review_container",
        id: "product_details",
        template: '#product_template',
        initialize: function () {
            this.template = _.template($(this.template).html());
            this.model.getReviews();
            this.postReview = new App.views.PostReview({model: this.model});
        },
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            this.model.on("reviewsReceived", this.renderReviews, this);
            return this;
        },
        renderReviews: function () {
            this.renderPostReview();
            $(this.comments).children().detach();
            for (let i = this.model.reviews.length - 1; i >= 0; i--) {
                var review = new App.views.Reviews({model: this.model.reviews.models[i]});
                $(this.comments).append(review.render().el);
            }
        },
        renderPostReview: function () {
            $(this.postReviewContainer).children().detach();
            $(this.postReviewContainer).append(this.postReview.render().el);

        }
    });
    App.views.PostReview = Backbone.View.extend({
        rateId: "#post_review_rate",
        textId: "#post_review_text",
        warningId: "#post_review_warning",
        template: "#post_review",
        initialize: function () {
            this.template = _.template($(this.template).html());
        },
        render: function () {
            this.$el.html(this.template({}));
            return this;
        },
        events: {
            "click #post_review_button": "submit"
        },
        submit: function () {
            if (this.textIsEmpty()) {
                this.showWarning();
            }
            else {
                var that = this;
                var newReview = new App.models.Review({
                    product: this.model.get("id"),
                    rate: +$(this.rateId).val(),
                    text: $(this.textId).val()
                });
                newReview.save({}, {
                    success: function () {
                        this.trigger("reviewsReceived");
                        $(that.textId).val("");
                    },
                    error: function (model, response) {
                        console.log(response.responseText);
                    }
                });
            }
        },
        textIsEmpty: function () {
            return $(this.textId).val() === "";
        },
        showWarning: function () {
            $(this.warningId).show().delay(1000).queue(function () {
                $(this).stop(true, true).hide();
            });
        }
    });

    App.views.Reviews = Backbone.View.extend({
        tagName: "div",
        className: "list-group-item",
        template: '#review',
        initialize: function () {
            this.template = _.template($(this.template).html());
        },
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });
    App.views.Products = Backbone.View.extend({
        tagName: "div",
        content: "#content",
        className: "product",
        template: '#products_template',
        initialize: function () {
            this.template = _.template($(this.template).html());
        },
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        events: {
            "click": "renderProduct"
        },
        renderProduct: function () {
            let productView = new App.views.Product({model: this.model});
            $(this.content).children().detach();
            $(this.content).append(productView.render().el);
        }
    });


    App.views.SignUp = Backbone.View.extend({
        content: "#content",
        submitButtonId: "#sign_up_button",
        tagName: "div",
        userNameId: "#sigh_up_username",
        passwordId: "#sigh_up_password",
        confirmPasswordId: "#sigh_up_password_confirm",
        warningId: "div.warning",
        template: "#sign_up_template",
        initialize: function () {
            this.template = _.template($(this.template).html());
        },
        render: function () {
            this.$el.html(this.template({}));
            return this;
        },
        events: {
            "click #sign_up_button": "signUp"
        },
        signUp: function (e) {
            e.preventDefault();

            if (this.usernameIsEmpty()) {
                this.showWarning("Username filed is empty!", this.userNameId);
            }
            else if (this.passwordIsEmpty()) {
                this.showWarning("Password should`t be empty!", this.passwordId);
            }
            else if (!this.passwordsAreEqual()) {
                this.showWarning("Passwords not equal!", this.confirmPasswordId);
            }
            else {
                var newUser = new App.models.User({
                    "username": $(this.userNameId).val(),
                    "password": $(this.passwordId).val()
                });
                let that = this;
                newUser.save({}, {
                    url: newUser.registerUrl(),
                    method: "POST",
                    success: function (model, response) {
                        if (!response.success) {
                            that.showWarning(response.message);
                        }
                        App.session.login(response);
                        window.location.href = "/";
                    },
                    error: function (model, response) {
                        console.log(response);
                        that.showWarning("Server error!");
                    }
                });


            }
        },
        isEmpty: function (value) {
            return value === "";
        },
        usernameIsEmpty: function () {
            return this.isEmpty($(this.userNameId).val());
        },
        passwordIsEmpty: function () {
            return this.isEmpty($(this.passwordId).val());
        },
        passwordsAreEqual: function () {
            return $(this.passwordId).val() === $(this.confirmPasswordId).val();
        },
        showWarning: function (text, inputId) {
            $(this.warningId).show().html(text).delay(1000).queue(function () {
                $(this).stop(true, true).html("").hide();
            });
            if (inputId) {
                $(inputId).addClass("input_warning").delay(1000).queue(function () {
                    $(this).stop(true, true).removeClass("input_warning");
                });
            }

        }
    });

    App.views.Login = Backbone.View.extend({
        content: "#content",
        loginButtonId: "#login_button",
        userNameId: "#login_username",
        passwordId: "#login_password",
        tagName: "div",
        warningId: "div.warning",
        template: "#login_template",
        initialize: function () {
            this.template = _.template($(this.template).html());
        },
        render: function () {
            this.$el.html(this.template({}));
            return this;
        },
        events: {
            "click #login_button": "login"
        },
        login: function (e) {
            e.preventDefault();

            if (this.usernameIsEmpty()) {
                this.showWarning("Username filed is empty!", this.userNameId);
            }
            else if (this.passwordIsEmpty()) {
                this.showWarning("Password should`t be empty!", this.passwordId);
            }
            else {
                var user = new App.models.User({
                    "username": $(this.userNameId).val(),
                    "password": $(this.passwordId).val()
                });
                let that = this;
                user.save({}, {
                    method: "POST",
                    success: function (model, response) {
                        if (!response.success) {
                            that.showWarning(response.message);
                        }
                        else {
                            App.session.login(response);
                            window.location.href = "/";
                        }
                    },
                    error: function (model, response) {
                        console.log(response);
                        that.showWarning("Server error!");
                    }
                });
            }
        },
        isEmpty: function (value) {
            return value === "";
        },
        usernameIsEmpty: function () {
            return this.isEmpty($(this.userNameId).val());
        },
        passwordIsEmpty: function () {
            return this.isEmpty($(this.passwordId).val());
        },
        showWarning: function (text, inputId) {
            $(this.warningId).show().html(text).delay(1000).queue(function () {
                $(this).stop(true, true).html("").hide();
            });
            if (inputId) {
                $(inputId).addClass("input_warning").delay(1000).queue(function () {
                    $(this).stop(true, true).removeClass("input_warning");
                });
            }

        }
    });

    App.views.App = Backbone.View.extend({
        el: "body",
        content: "#content",
        loader: ".loader",
        productsId: "products",
        signUpButton: "#sign_up",
        loginButton: "#login",
        logoutButton: "#logout",
        initialize: function () {
            $(this.loader).show();
            this.collection = new App.collections.Products();
            this.signUpView = new App.views.SignUp();
            this.loginView = new App.views.Login();
        },
        events: {
            "click #all_products": "render",
            "click #sign_up": "renderSignUpView",
            "click #login": "renderLoginView",
            "click #logout": "logout"
        },
        render: function () {
            let that = this;
            this.hideNavButtons(App.session);
            this.collection.fetch().done(function () {
                that.renderProducts();
            });
            return this;
        },
        renderProducts: function () {
            $(this.content).children().detach();
            let productDiv = document.createElement('div');
            productDiv.id = this.productsId;
            for (let i = 0; i < this.collection.models.length; i++) {
                var view = new App.views.Products({model: this.collection.models[i]});
                $(productDiv).append(view.render().el);
            }
            $(this.loader).hide();
            $(this.content).append(productDiv);
        },
        renderSignUpView: function () {
            $(this.content).children().detach();
            $(this.content).append(this.signUpView.render().el);
        },
        renderLoginView: function () {
            $(this.content).children().detach();
            $(this.content).append(this.loginView.render().el);
        },
        hideNavButtons: function (session) {
            if (App.session.isLogged()) {
                $(this.loginButton).hide();
                $(this.logoutButton).show();
            }
        },
        logout: function () {
            App.session.logout();
            $(this.logoutButton).hide();
            $(this.loginButton).show();

        }
    });


}(jQuery));

