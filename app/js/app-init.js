"use strict";

var App = {
    models: {},
    collections: {},
    views: {},
    apis: {
        apiary: "http://private-813f3-lightittest.apiary-mock.com/",
        smk: "http://smktesting.herokuapp.com/api/"
    },
    session:{},
    get api() {
        return this.apis.smk;
    }

};