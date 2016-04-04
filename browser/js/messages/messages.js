app.directive('messages', function(gameFactory) {
    return {
        restrict: 'E',
        scope: {
            data: "=",
            userId: "="
        },
        templateUrl: './js/messages/messagesDirective.html',
        link: function(scope) {
            console.log(data);
            const playerRef = gameFactory.ref().child('users').child(userId);
            var playerName;

            scope.sendMessage = function () {
                var indexSlice = obj.email.indexOf('@');
                playerName = obj.email.slice(0,indexSlice);

                if (!scope.data.messages) { scope.data.messages = [] }
                scope.data.messages.push({
                    from: playerName,
                    sent: Date.now(),
                    content: scope.obj.msg
                });
            scope.obj.msg = "";
            };

        }
    }
});
3