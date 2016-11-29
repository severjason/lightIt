"use strict";

(function () {
    App.collections.Products = Backbone.Collection.extend({
        model: App.models.Product,
        url: function () {
            return App.api + "products/";
        }
    });

    App.collections.Reviews = Backbone.Collection.extend({
        model: App.models.Review,
        url: function () {
          return App.api + "reviews/" + this.product;
        },
        initialize: function (productId) {
            this.product = productId;
        }
    })
}());




