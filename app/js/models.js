"use strict";

(function () {
    App.models.Review = Backbone.Model.extend({
        defaults: function() {
            return {
                "text": "",
                "rate": 0
            };
        },
        url: function () {
            return App.api.smk + "/reviews/" + this.productId;
        }
    });
    App.models.Product = Backbone.Model.extend({
        defaults: function() {
            return {
                "img": "default.png",
                "text": "Description",
                "title": "unknown product"
            };
        },
        getReviews: function () {
            let that = this;
            var productReview = new App.collections.Reviews(this.get("id"));
             return productReview.fetch().done(function () {
                that.reviews = productReview;
                that.trigger("reviewsReceived");
            });
        }
    });


}());

