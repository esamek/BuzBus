



var init = function(data){

    function positionSuccess(position){
        socket.emit('initWithLocation', {'location': position});
    }

    function positionError(error) {
        var errors = {
            1: "Authorization fails", // permission denied
            2: "Can\'t detect your location", //position unavailable
            3: "Connection timeout" // timeout
        };
        alert("Error:" + errors[error.code]);
    }

    if(navigator && navigator.geolocation){
        navigator.geolocation.getCurrentPosition(positionSuccess, positionError, { enableHighAccuracy: true });
    }
}





var handleIncomeStops = function(data){

    var stops = JSON.parse(data.data).Stops;
    var $select = $('<select />');
    var template = "<option value='<%=id %>'> <%=name %> </option>";

    var entry = _.template(template);

    var options = [];

    _.each(stops, function(value, key, list){
        var name = value.Name;
        var id = value.StopID;
        $select.append(
            entry({'name' : name, 'id': id})
        );

    });
    $select.prepend(
                entry({'name' : "Choose a Stop", 'id': null})
            );

    $('body').append($select);

    $select.on('change', function(){
        var stop = $select.val();

        socket.emit('getNextBus',{'stop':stop});
    });
};




var handleNextBus = function(data){
    console.log( JSON.parse(data.data) );
};






// ROUTES
var socket = io.connect('http://localhost:8080');
socket.on('init', init );
socket.on('incoming_stops', handleIncomeStops );
socket.on('incoming_nextbus', handleNextBus );

