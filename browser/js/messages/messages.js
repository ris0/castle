app.directive('messages', function() {
  return {
    restrict: 'E',
    scope: {
      data: "=",
      userId: "="
    },
    templateUrl: './js/messages/messagesDirective.html',
    link: function(scope) {
        const playerRef = gameFactory.ref().child('users').child(scope.userId);
        var playerName;

        playerRef.once('value', function(obj){
          console.log(obj);
            var indexSlice = obj.email.indexOf('@');
            playerName = obj.email.slice(0,indexSlice);

        	scope.sendMessage = function () {
              if (!scope.data.messages) { scope.data.messages = [] }
              scope.data.messages.push({
                  from: playerName,
                  sent: Date.now(),
                  content: scope.obj.msg
              });
              console.log(scope.data.messages[0].sent);
              //console.log($scope.data.messages.$watch())
              scope.obj.msg = "";
          };
        });
	   }
  }
});
