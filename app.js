var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));


app.get('/players', function(req, res) {
    res.json([
        {
            "id": 0,
            "game" : [ 3, 6, 9, 12, 15, 18, 25, 24, 25, null, null, null, 0 ]
        },
        {
            "id": 1,
            "game" : [ 3, 6, null, null, 10, 12, 25, 24, 25, null, null, null, 0 ]
        },
        {
            "id": 2,
            "game" : [ 0, 6, 9, null, 15, 18, 25, null, 25, null, null, 50, 0 ]
        },
        {
            "id": 3,
            "game" : [ 3, 0, 0, 12, 15, 18, 0, 24, 0, null, null, null, 22 ]
        }
    ]);
});

app.post('/:user/roll', function(req, res) {
    res.json([
        {
            "seq" : 0,
            "status" : "unhold",
            "eye" : 1
        },
        {
            "seq" : 1,
            "status" : "unhold",
            "eye" : 2
        },
        {
            "seq" : 2,
            "status" : "unhold",
            "eye" : 4
        },
        {
            "seq" : 3,
            "status" : "unhold",
            "eye" : 4
        },
        {
            "seq" : 4,
            "status" : "unhold",
            "eye" : 3
        }
    ]);
});

app.post('/:user/decision', function(req, res) {
    res.json({
        "slot" : 11,
        "point" : 50
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
