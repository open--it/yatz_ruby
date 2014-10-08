(function () {
    
    var myId = 2,
        pollingInterval = 5000,
        dices = [],
        models = {
            me : {},
            players : []
        };
        
    
    angular.module('YahtzeeApp', []);
    
    angular.module('YahtzeeApp').controller('MainCtrl', function ($scope, $q, $timeout, $interval, DiceSvc) {
        
        var total = function (eyes) { return _.reduce(eyes, function (sum, eye) { return sum + eye; }, 0); },
            upper = function (n, eyes) { return _.chain(eyes).filter(function (eye) { return eye == n; }).reduce(function (sum, eye) { return sum + eye; }, 0).value(); },
            nkind = function (n, eyes) { return _.chain(eyes).countBy(function (eye) { return eye; }).find(function (count) { return count >= n; }).value(); },
            akind = function (n, eyes) { return nkind(n, eyes) ? total(eyes) : 0; },
            contain = function (sets, score, eyes) {
                return _.some(sets, function (set) {
                    return _.isEmpty(_.difference(set, eyes));
                }) ? score : 0;
            };
        
        
        var rules = [
            _.partial(upper, 1),
            _.partial(upper, 2),
            _.partial(upper, 3),
            _.partial(upper, 4),
            _.partial(upper, 5),
            _.partial(upper, 6),
            _.partial(akind, 3),
            _.partial(akind, 4),
            function (eyes) {
                var counts = _.chain(eyes).countBy(function (eye) { return eye; });

                if (counts.find(function (count) { return count = 2; }).value()
                    && counts.find(function (count) { return count = 3; }).value()) {
                    return 25;
                }

                return 0;
            },
            _.partial(contain, [[1,2,3,4], [2,3,4,5], [3,4,5,6]], 30),
            _.partial(contain, [[1,2,3,4,5], [2,3,4,5,6]], 40),
            function (eyes) { return nkind(5, eyes) ? 50 : 0; },
            total
        ];
        
        var eyes = null;
        
        $scope.isFilled = function (slot) {
            return models.me.game[slot] !== null;
        };
        
        $scope.getClass = function (slot) {
            return models.me.game && { done : (models.me.game[slot] != null), slot : (models.me.game[slot] == null) };
        };
        
        $scope.roll = function () {
            _.each(dices, function (dice) { return dice.rolling(); });

            var deferred = $q.defer(),
                rolled = $q.defer();

            DiceSvc.rollingDice(rolled);
            $timeout(deferred.resolve, 1000);

            $q.all([rolled.promise, deferred.promise]).then(function (results) {

                var rolledEyes = results[0];

                _.each(rolledEyes, function (eye) {
                    return $timeout(function () {
                        dices[eye.seq].stop(eye.eye);
                    }, Math.floor(Math.random() * 3) * 150);
                });
                
                eyes = _.chain(rolledEyes).sortBy(function (eye) { return eye.seq; }).map(function (eye) { return eye.eye + 1; }).value();
            });
        };
        
        $scope.done = function (slot) {
            console.log(rules[slot](eyes));
            DiceSvc.decisionSlot(slot, eyes);
            eyes = null;
        };
        
        $scope.models = models;
        
        $scope.getPoint = function (slot) {
            return !models.me.game ? null : models.me.game[slot] !== null ? models.me.game[slot] : eyes !== null ? rules[slot](eyes) : null;
        };
        
        $scope.explanations = [
            'Count and Add Only Aces',
            'Count and Add Only Twos',
            'Count and Add Only Threes',
            'Count and Add Only Fours',
            'Count and Add Only Fives',
            'Count and Add Only Sixes',
            'If Upper Total score is 63 or over then Score 35',
            'Add Total Of All Dice',
            'Add Total Of All Dice',
            'SCORE 25',
            'SCORE 30',
            'SCORE 40',
            'SCORE 50',
            'Score Total Of All 5 Dice'
        ];

    });
    
    
    
    
    angular.module('YahtzeeApp')
    .service('DiceSvc', function ($http, PlayerSvc) {
        
        var svc = this;
        
        svc.rollingDice = function (rolled) {
            $http.get('/json/roll.json').success(function (result) {
                rolled.resolve(result);
                PlayerSvc.getPlayers();
            });
        };
        
        
        
        svc.decisionSlot = function (slot, eyes) {
            $http.get('/json/decision.json').success(function () {
                PlayerSvc.getPlayers();
            });
        };
        
        
        
    })
    .service('PlayerSvc', function ($http, $interval) {
        
        var svc = this;
        
        svc.getPlayers = function () {
            $http.get('/json/players.json').success(function(players) {
                models.me = _.find(players, function (player) { return myId === player.id });
                models.players = _.difference(players, models.me);
            });
        };
        
        svc.getPlayers();
        $interval(svc.getPlayers, pollingInterval);
    });
    
    
    
    
    angular.module('YahtzeeApp')
    .directive('dice', function () {
        
        return {
            restrict: 'E',
            template: '<div class="dice"></div>',
            link: function (scope, element, attrs) {
                var dice = new Dice(element.find('.dice'));
                
                dices.push(dice);
                
                element.on('click', function () {
                    dice.toggle();
                });
            }
        };
    });
})();