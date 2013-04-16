var io = require('socket.io');
var express = require('express');
var request = require('request');

var API_KEY = "89ezy26n7qurebea9pe2e2ku";


var app = express()
  , server = require('http').createServer(app)
  , io = io.listen(server);


app.get('/', function(req,res){
    res.sendfile('index.html');
});



app.get('/js/:file', function(req,res){
    res.sendfile(__dirname + '/js/' + req.params.file);
});










server.listen(8080);

io.sockets.on('connection', function (socket) {

    socket.emit('init', { hello: 'sir' });

    var getBusStops = function(lat,lon,radius){
        var url = "http://api.wmata.com/Bus.svc/json/JStops?lat="+ lat +"&lon="+ lon +"&radius="+ radius +"&api_key=" + API_KEY;
        var req = request(url,function(error,response,body){
            if (!error && response.statusCode == 200) {
               socket.emit('incoming_stops', {'data': body});
            }else {
                return error;
            }
        });

    };

    var getNextBus = function(id){
      var url = "http://api.wmata.com/NextBusService.svc/json/JPredictions?StopID=" + id + "&api_key=" + API_KEY;
      var req = request(url,function(error,response,body){
            if (!error && response.statusCode == 200) {
               socket.emit('incoming_nextbus', {'data': body});
            }else {
                return error;
            }
        });

    }





  socket.on('initWithLocation', function (data) {

    var LAT  = data.location.coords.latitude;
    var LONG = data.location.coords.longitude;
    var R    = 500;

    getBusStops(LAT,LONG,R);

  });


  socket.on('getNextBus', function(data){
    getNextBus(data.stop);

  })



});



