var express = require('express');


var server = express();
server.use(express.static(__dirname + '/dist'));
server.use(require('prerender-node').set('prerenderToken', 'ufNjZwunAfYbFzsedFe9'));

var port = 8080;
server.listen(port, function() {
    console.log('Server started port: ' + port);
});