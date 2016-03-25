app.directive('kingsFavors', function(kingsFavorsFactory) {
  return {
    restrict: 'E',
    scope: {
      favors: "="
    },
    templateUrl: './js/bonusCardsAndKingsFavors/kingsFavorsRanking.html',
    link: function(scope) {
      
    }
  };
});
