"use strict";

(function ($) {
    App.views.Product = Backbone.View.extend({
        tagName: "div",
        content:"#content",
        id: "product_details",
        template: '#product_template',
        initialize: function () {
            this.template = _.template($(this.template).html());

        },
        render: function () {
            let that = this;
            this.$el.html(this.template(this.model.toJSON()));
            this.model.getReviews().then(function () {
                that.renderReviews();
            });
            return this;
        },
        renderReviews: function () {
            console.log(this.model);
            console.log(this.model.reviews.length);
        }
    });

    App.views.Reviews = Backbone.View.extend({
        
    });
    App.views.Products = Backbone.View.extend({
        tagName: "div",
        content:"#content",
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
            let productView = new App.views.Product({model:this.model});
            $(this.content).empty();
            $(this.content).append(productView.render().el);
        }
    });



    App.views.SignUp = Backbone.View.extend({
        el:"#sign_up_button",
        content:"#content",
        tagName:"div",
        template:"#sign_up_template",
        initialize: function () {
            this.template = _.template($(this.template).html());
        },
        render: function () {
            $(this.content).html(this.template({}));
            return this;
        },
        events: {
            "click" : "render"
        }
    });
    
    
    App.views.App = Backbone.View.extend({
        el: "body",
        content:"#content",
        loader:"#loader",
        productsId: "products",
        initialize: function () {
            $(this.loader).show();
            this.collection = new App.collections.Products();
        },
        events: {
            "click #all_products" : "render"
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
        }
    });



}(jQuery));

