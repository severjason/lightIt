'use strict';


(function ($) {
    $(document).ready(function () {

        var app = new App.views.App();
        App.session = new App.models.Session();
        app.render();

        (function () {
            var _sync = Backbone.sync;
            Backbone.sync = function (method, model, options) {
                options.beforeSend = function (xhr) {
                    xhr.setRequestHeader('X-CSRFToken', App.session.token);
                };
                return _sync(method, model, options);
            };
        })();

    })
}(jQuery));
    



