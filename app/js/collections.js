"use strict";

(function () {
    App.collections.Products = Backbone.Collection.extend({
        model: App.models.Product,
        url: "http://private-813f3-lightittest.apiary-mock.com/products"
    });

    App.collections.Reviews = Backbone.Collection.extend({
        model: App.models.Review,
        url: function () {
          return "http://private-813f3-lightittest.apiary-mock.com/reviews/" + this.productId;  
        },
        initialize: function (productId) {
            this.productId = productId;
        }
    })
}());




