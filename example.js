var filename = process.argv[2];

var ft = require('./tail.js').startTailing(filename, 1000);

ft.on('stream', function(stream) {
	stream.on('data', function(chunk) {
		console.log("got a chunk of data from tail");
		console.log(chunk);
	});
});

ft.on('error', function(e) {
	console.error(e);
});
