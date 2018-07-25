const app = angular.module('TemplateApp', ['ngRoute', 'ui.bootstrap']);

app.config(function ($routeProvider) {
    $routeProvider.when('/', {
            templateUrl: 'views/template.html',
            controller: 'TemplateController as vm'
        })
        .otherwise({
            templateUrl: 'views/error.html',
            controller: 'ErrorController as vm'
        })
});