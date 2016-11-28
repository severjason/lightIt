"use strict";

(function ($) {
    App.views.Product = Backbone.View.extend({
        tagName: "div",
        content: "#content",
        comments: "#comments",
        loader: ".loader",
        postReviewContainer:"#post_review_container",
        id: "product_details",
        template: '#product_template',
        initialize: function () {
            this.template = _.template($(this.template).html());
            this.model.getReviews();
            this.postReview = new App.views.PostReview({poductId:this.model.get("id")});
        },
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            this.model.on("reviewsReceived", this.renderReviews, this);
            return this;
        },
        renderReviews: function () {
            this.renderPostReview();
            $(this.comments).empty();
            for (let i = this.model.reviews.length - 1; i >= 0; i--) {
                var review = new App.views.Reviews({model: this.model.reviews.models[i]});
                $(this.comments).append(review.render().el);
            }
        },
        renderPostReview:function () {
            $(this.postReviewContainer).empty().append(this.postReview.render().el)

        }
    });
    App.views.PostReview = Backbone.View.extend({
        rateId:"#post_review_rate",
        textId:"#post_review_text",
        warningId:"#post_review_warning",
        template:"#post_review",
        initialize: function () {
            this.template = _.template($(this.template).html());
        },
        render: function () {
            this.$el.html(this.template({}));
            return this;
        },
        events: {
            "click #post_review_button" : "submit"
        },
        submit:function () {
            console.log($(this.textId).val());
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
            $(this.content).empty();
            $(this.content).append(productView.render().el);
        }
    });


    App.views.SignUp = Backbone.View.extend({
        el: "#sign_up_button",
        content: "#content",
        tagName: "div",
        template: "#sign_up_template",
        initialize: function () {
            this.template = _.template($(this.template).html());
        },
        render: function () {
            $(this.content).html(this.template({}));
            return this;
        },
        events: {
            "click": "render"
        }
    });

    App.views.Login = Backbone.View.extend({
        el: "#login_button",
        content: "#content",
        tagName: "div",
        template: "#login_template",
        initialize: function () {
            this.template = _.template($(this.template).html());
        },
        render: function () {
            $(this.content).html(this.template({}));
            return this;
        },
        events: {
            "click": "render"
        }
    });
    
    App.views.App = Backbone.View.extend({
        el: "body",
        content: "#content",
        loader: ".loader",
        productsId: "products",
        initialize: function () {
            $(this.loader).show();
            this.collection = new App.collections.Products();
            this.signUpView = new App.views.SignUp();
            this.login = new App.views.Login();
        },
        events: {
            "click #all_products": "render",
            "click #sign_up_button" : "signUp"
        },
        render: function () {
            let that = this;
            this.collection.fetch().done(function () {
                that.renderProducts();
            });
            return this;
        },
        renderProducts: function () {
            $(this.content).empty();
            let productDiv = document.createElement('div');
            productDiv.id = this.productsId;
            for (let i = 0; i < this.collection.models.length; i++) {
                var view = new App.views.Products({model: this.collection.models[i]});
                $(productDiv).append(view.render().el);
            }
            $(this.loader).hide();
            $(this.content).append(productDiv);
        },
        signUp: function () {

        }
    });


}(jQuery));

