var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

var players = [],
    seq = 0;




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

        if (counts.find(function (count) { return count == 2; }).value()
            && counts.find(function (count) { return count == 3; }).value()) {
            return 25;
        }

        return 0;
    },
    _.partial(contain, [[1,2,3,4], [2,3,4,5], [3,4,5,6]], 30),
    _.partial(contain, [[1,2,3,4,5], [2,3,4,5,6]], 40),
    function (eyes) { return nkind(5, eyes) ? 50 : 0; },
    total
];





app.get('/enroll', function (req, res) {
    players.push({
        id : seq,
        game : [null,null,null,null,null,null,null,null,null,null,null,null,null],
        turn : 0
    });
    
    res.json({
        id : seq++
    });
});

app.get('/players', function(req, res) {
    res.json(players);
});

app.post('/:user/roll', function(req, res) {
    
    var id = req.params.user,
        eyes = req.body,
        player = _.find(players, function (player) { return player.id == id; });
    
    if (player.turn < 3) {
        _.map(eyes, function (eye) {
            return _.extend(eye, { eye : eye.status === 'hold' ? eye.eye : Math.floor(Math.random() * 6) });
        })

        player.turn++;
    }
    
    res.json(eyes);
});

app.post('/:user/decision', function(req, res) {
    
    var id = req.params.user,
        decision = req.body;
        player = _.find(players, function (player) { return player.id == id; });
    
    player.game[decision.slot] = rules[decision.slot](_.map(decision.dices, function (dice) { return dice.eye + 1; }));
    player.turn = 0;
    
    res.json({
        slot : decision.slot,
        point : player.game[decision.slot]
    });
});


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.sendfile('views/error.html');
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.sendfile('views/error.html');
});


module.exports = app;
