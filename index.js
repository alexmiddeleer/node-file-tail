// -----------------------------------------------------
// This file sets up the module for tail; It does every-
// thing except detect file size changes, which is 
// implemented by the filewatcher module.
// -----------------------------------------------------
var fs = require('fs'),
	fileWatcher = require('file-size-watcher');

module.exports = {

	startTailing: function(options) {

		var fd  = typeof options == "string" ? options : "";
		options = typeof options == "object" ? options : {};

		options.interval = options.interval  || 100;
		options.mode     = options.mode      || 'lines';
		options.onErr    = options.onErr     || null;
		options.onReady  = options.onReady   || null;
		
		// Allow null encoding for raw binary (want to write a unit test for this case? :D).
		options.encoding = typeof options.encoding == "undefined" ? 'utf-8' : options.encoding;

		fd          = fd || options.fd;
		var ms      = options.interval,
		mode        = options.mode,
		encoding    = options.encoding,
		fileTailer  = fileWatcher.watch(fd, ms, options.OnErr, options.onReady);

		fileTailer.conf = options; // expose these to user.

		// Convenience event.  Also prevents halts if user is not catching errors
		fileTailer.on('error',function(e) {
			if (!(e.code && e.code == "ENOENT")) {
				fileTailer.emit('tailError', e);
			};
		});

		fileTailer.on('sizeChange', function(newSize, oldSize) {

			if ((newSize-oldSize) > 0) {
				var stream = fs.createReadStream(fd,{
					encoding:encoding,
					start:oldSize,
					end:newSize
				});
				
				if (mode == "lines") {
					stream.on('data', function(chunk) {
						var lines = chunk.toString().trim().split('\n');	
						for( var i = 0; i < lines.length; i++ ){
							fileTailer.emit('line', lines[i]);
						}
					});
				} else {
					fileTailer.emit('stream', stream);
				}
			}
		});

		return fileTailer;
	}
};
