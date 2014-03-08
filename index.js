// -----------------------------------------------------
// This file sets up the module for tail; It does every-
// thing except detect file size changes, which is 
// implemented by the filewatcher module.
// -----------------------------------------------------
var fs = require('fs'),
	events = require('events'),
	fileWatcher = require('fileWatcher');

module.exports = {

	startTailing: function(fileName, ms) {

		var fileTailer = new events.EventEmitter(),
			watcher = fileWatcher.makeFileWatcher(fileName, ms);

		fs.stat(fileName, function(error, info) {

			var originalSize = info.size,
				currSize = originalSize;

			watcher.on('error', function(error){
				fileTailer.emit('error',error);
			});
			
			watcher.on('sizeChange', function(newSize) {
	
				var readSize = newSize - currSize;
				if (readSize > 0) {
					var stream = fs.createReadStream(fileName,{
						encoding:'utf-8',
						start:currSize,
						end:newSize
					});
					
					fileTailer.emit('stream', stream);
				}
				currSize = newSize;
			});
		
		});

		return fileTailer;
	}
};
