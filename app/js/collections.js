"use strict";

(function () {
    App.collections.Products = Backbone.Collection.extend({
        model: App.models.Product,
        url: function () {
            return App.api.smk + "products";
        }
    });

    App.collections.Reviews = Backbone.Collection.extend({
        model: App.models.Review,
        url: function () {
          return App.api.smk + "reviews/" + this.productId;
        },
        initialize: function (productId) {
            this.productId = productId;
        }
    })
}());




