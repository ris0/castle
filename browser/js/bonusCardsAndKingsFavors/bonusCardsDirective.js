app.directive('bonusCards', function(bonusCardsFactory) {
  return {
    restrict: 'E',
    scope: {
      cards: "="
    },
    template: '<div><pre>{{cards}}</pre></div>',
    link: function(scope) {
      
    }
  };
});
