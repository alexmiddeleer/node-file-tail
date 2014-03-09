var fd = process.argv[2],
ft     = require('./index').startTailing(fd);

ft.on('line', function(line) {
	console.log(line);
});
