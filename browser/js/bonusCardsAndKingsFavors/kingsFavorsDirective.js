app.directive('kingsFavors', function(kingsFavorsFactory) {
  return {
    restrict: 'E',
    scope: {
      game: "=",
      favors: "="
    },
    templateUrl: './js/bonusCardsAndKingsFavors/kingsFavorsRanking.html',
    link: function(scope) {
    	console.log(scope.game)
    }
  };
});
