node-file-tail
==============

A tiny, portable tail module for Node.js.  Similar to tail -F in Unix.  Extends node-file-size-watcher.  Does not rely on fs.watch, thus works in Windows. Install globally to use the command line tool.

###Usage

```js
	ft = fileTailer.startTailing('logfile.log');
	ft.on('line', function(line){
		// do stuff
	});
```

###Options 

Start tailing with just a file descriptor string, or pass in an object with these properties:

```js
startTailing({
	fd: aFileDescriptor,           // Required
	ms: aFileCheckingInterval,     // Defaults to 100 (milliseconds)
	mode: 'line',                  // The other option is 'stream'
	encoding: 'utf8'               // see Node's fs.createReadStream
	onErr: function(error){};      // immediately listen for 'error' event
});
```
###Events

 * `'error'`      -- All errors including ENOENTs are emitted through this.
 * `'tailError'`  -- `'Error'` with ENOENTs ignored; use if you don't care if the file is missing.
 * `'line'`       -- emitted whenever tailed file grows by a line (or many), unless mode is `'stream'`.
 * `'stream'`     -- If mode is `'stream'`, will emit a Node.js stream object instead of lines.  Use this if you need to preserve every byte or want to handle the details yourself.

Lastly, file-tail objects are just types of file-size-watchers, so you can use everything they have as well.  See (https://github.com/alexmiddeleer/node-file-size-watcher)

###Example

Try it out with with this little script (Use with `Node script.js fileToTail`):

```js
var fd = process.argv[2],
ft = require('file-tail').startTailing(fd);

ft.on('line', function(line) {
	console.log(line);
});
```

###CLI Usage

To use this tool on the command line, just install it globally (`npm install -g`).  Then run `nftail <filename>`. 

###Help out

Bug reports, feedback, or code contributions are appreciated.  All pull requests will be reviewed.
