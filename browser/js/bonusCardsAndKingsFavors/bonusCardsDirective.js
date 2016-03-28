app.directive('bonusCards', function(bonusCardsFactory) {
  return {
    restrict: 'E',
    scope: {
      cards: "=",
      points: "="
    },
    templateUrl: './js/bonusCardsAndKingsFavors/bonusCards.html',
    link: function(scope) {
      	scope.showInfo = false;
	    scope.bonusCardsInfo = function(card){
	      console.log(card.description);
	      scope.showInfo = !scope.showInfo;
	    }
    }
  };
});
