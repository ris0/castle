app.directive('kingsFavors', function(kingsFavorsFactory) {
  return {
    restrict: 'E',
    scope: {
      game: "=",
      favors: "="
    },
    templateUrl: './js/bonusCardsAndKingsFavors/kingsFavorsRanking.html',
      link: function(scope) {
        scope.showInfo = false;
        scope.kingsFavorsInfo = function(favor){
          scope.showInfo = !scope.showInfo;
        }
    }
  };
});
