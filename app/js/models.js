"use strict";

(function ($) {
    App.models.Review = Backbone.Model.extend({
        defaults: function () {
            return {
                "rate": 0,
                "text": "default text"
            };
        },
        url: function () {
            return App.api + "reviews/" + this.get("product");
        }
    });
    App.models.Product = Backbone.Model.extend({
        defaults: function () {
            return {
                "id": 0,
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

    App.models.User = Backbone.Model.extend({

        registerUrl: function () {
            return App.api + "register/";
        },

        url: function () {
            return App.api + "login/";
        },

        defaults: function () {
            return {
                "username": "",
                "password": ""
            }
        }
    });

    App.models.Session = Backbone.Model.extend({

        defaults: function () {
            return {
                "loggedIn": false,
                "token": ""
            }
        },
        initialize: function () {

            if (Storage && sessionStorage) {
                this.supportStorage = true;

                if (this.get("token")) {
                    this.token = this.get("token");
                    this.loggedIn = true;
                }
            }
        },
        get: function (key) {
            if (this.supportStorage) {
                var data = sessionStorage.getItem(key);
                if (data && data[0] === '{') {
                    return JSON.parse(data);
                } else {
                    return data;
                }
            } else {
                return Backbone.Model.prototype.get.call(this, key);
            }
        },
        set: function (key, value) {
            if (this.supportStorage) {
                sessionStorage.setItem(key, value);
            } else {
                Backbone.Model.prototype.set.call(this, key, value);
            }
            return this;
        },
        isLogged: function () {
            return this.token;
        },
        clear: function () {
            if (this.supportStorage) {
                sessionStorage.clear();
            } else {
                Backbone.Model.prototype.clear(this);
            }
        },
        login: function (apiResponse) {
            this.token = apiResponse.token;
            this.set("token", this.token);
            this.loggedIn = true;
        },
        logout: function () {
            this.clear();
            this.loggedIn = false;
        }

    })


}(jQuery));

