app.directive('bonusCards', function(bonusCardsFactory) {
  return {
    restrict: 'E',
    scope: {
      cards: "="
    },
    templateUrl: './js/bonusCardsAndKingsFavors/bonusCards.html',
    link: function(scope) {
      
    }
  };
});
