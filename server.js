var app = require('http').createServer(handler),
	io = require('socket.io').listen(app),
	fs = require('fs'),
	url = require('url'),
	qstring = require('querystring'),
	documentroot = 'contents/';

	app.listen(8012);

	function handler(req, res){
		var fileName;
		var reqObj = url.parse(req.url);
		if (req.url != '/favicon.ico') {
			var tmppath = reqObj.pathname.replace(/^[\/]/, '');
			if (!tmppath) {
				fileName = documentroot + "index.html";
			} else {
				fileName = documentroot + tmppath;
			}
			console.log(fileName);
			fs.readFile(fileName, function (err, data) {
				console.log(err);
				if (err) {
					res.writeHead(500);
					return res.end('Error loading ' + fileName);
				}
				res.writeHead(200);
				res.end(data);
			});
		}
	}

io.sockets.on('connection', function (socket) {
	console.log('Socket created...');
	socket.emit('Initialdata', { Message: 'world' });
	socket.on('sendMessage', function (data) {
		socket.broadcast.emit('recieveMessage', data);
	});
});
