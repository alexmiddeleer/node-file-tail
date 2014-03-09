node-file-tail
==============

A tiny, portable tail module for Node.js.  Similar to tail -F in Unix.  Extends node-file-size-watcher.  Does not rely on fs.watch, which right now works inconsistently on Windows.  

Usage:

```js
	ft = fileTailer.startTailing('logfile.log');
	ft.on('line', function(line){
		// do stuff
	});
```

Options:  

Start tailing simply with a file descriptor, or pass in an object with these properties:

```js
startTailing({
	fd: aFileDescriptor, // Required
	ms: aFileCheckingInterval, // Defaults to 100ms
	mode: 'line', // The other option is 'stream'
	encoding: 'utf8' // anything allowed by fs.createReadStream
});
```
Events -- filt-tail objects emit these events:

 * 'Error'      -- All errors including ENOENTs are emitted through this.
 * 'tailError'  -- 'Error' with ENOENTs ignored; use if you don't care if the file is missing.
 * 'line'       -- emitted whenever tailed file grows by a line (or many), unless mode is 'stream'.
 * 'stream'     -- If mode is 'stream', will emit a Node.js stream object instead of lines.  Use this if you need to preserve every byte or want to handle the details yourself.

Lastly, file-tail objects are just types of file-size-watchers, so you can use everything they have as well.  See (https://github.com/alexmiddeleer/node-file-size-watcher)

Try it out with with this little script (Use with `Node script.js fileToTail`):

```js
var fd = process.argv[2],
ft     = require('file-tail').startTailing(fd);

ft.on('line', function(line) {
	console.log(line);
});
```
