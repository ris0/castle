app.config(function ($stateProvider) {

    // Register our *gridtesting* state.
    $stateProvider.state('gridtesting', {
        url: '/gridtesting',
        controller: 'AboutController',
        templateUrl: 'js/gridtesting/gridtesting.html'
    });

});

app.controller('AboutController', function ($scope, FullstackPics) {

    // Images of beautiful Fullstack people.
    $scope.images = _.shuffle(FullstackPics);

});