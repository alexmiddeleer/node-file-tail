// requires mocha (npm install mocha -g)
var assert = require('assert'),
	fs = require('fs'),
	fn = 'test/testfile',
	tailMod = require('../index.js'),
	tailer;

function makeFileGrow (txt, cb) {
	fs.appendFile(fn, txt, function(err) {
		cb(err);
	}); 
}

function makeFileShrink (txt, cb) {
	fs.truncate(fn, 1, function(err) {
		cb(err);
	}); 
}

function listenForStream (tailer, cb) {
	var notDone = true;
	tailer.once('stream', function(stream){
		notDone = false;
		cb(stream);	
	});
	tailer.once('error',function(e) {
		if (notDone) throw(e);
	});
	setTimeout(function tooSlow() {
		if(notDone)	throw("test timed out");
	}, tailer.conf.interval * 5);
}

function emoteSuccess (testDesc) {
	console.log("Test Passed.");
}

function streamText (stream, cb) {
	stream.on('data',function(chunk) {
		console.log(chunk.toString().trim());
		cb(chunk.toString().trim());
	});
}

// First just create a file to test with
before(function(done){
	console.log("Creating a test file");
	makeFileGrow("Creating a file", function() {
		tailer = tailMod.startTailing({
			fd : fn,
			mode : "stream"
		});
		console.log('tailer config is: ' + JSON.stringify(tailer.conf));
		done();
	});
});

// Test to see if tailer detects file growth.  
describe('file-tail',function(){
	describe('#Basic operation', function(){
		var desc1 = "Test 1: File grows, tail emits the new text.",
		newText   = 'testing...';
		it(desc1, function(done) {
			console.log(desc1);
			listenForStream(tailer, function(stream) {
				streamText(stream, function(resultText) {
					assert.equal(newText,resultText);
					emoteSuccess(desc1);
					done();
				});
			});
	
			makeFileGrow(newText, function afterGrow(err) {
				if (err) { 
					done(err);
				} 
			});
		});

		var desc2 = "Test 2: File grows again, tailer again reacts correctly.";
		newText   = 'testing... 2';
		it(desc2, function(done) {
			console.log(desc2);
			listenForStream(tailer, function(stream) {
				streamText(stream, function(resultText) {
					assert.equal(newText,resultText);
					emoteSuccess(desc1);
					done();
				});
			});
	
			makeFileGrow(newText, function afterGrow(err) {
				if (err) { 
					done(err);
				} 
			});
		});
	});
	
	describe('#Line mode', function() {
		var desc = "Test 3: It should emit lines as expected."
		it(desc,function(done) {
			console.log(desc);
			var line1 = 'a couple of\n';
			var line2 = 'lines appear\n';
			var newText   = line1+line2,
			x = 0;
			tailer.removeAllListeners();
			tailer = tailMod.startTailing(fn);
			tailer.on('ready',function() {
				tailer.on('line',function(line) {
					if(x===0){
						assert.equal(line1.trim(),line);
					} else if (x === 1){
						assert.equal(line2.trim(),line);
						emoteSuccess(desc);
						done();
						tailer.stop();
					}
					x++;
				});
				makeFileGrow(newText, function afterGrow(err) {
					if (err) { 
						done(err);
					} 
				});
			});
		});
	});

	describe('#Edge cases', function() {
		var desc = "Test 4: tail should proceed normally even when started on empty file.";
		it(desc,function(done) {
			console.log(desc);
			var newTailer = tailMod.startTailing('doesNotExist.log'),
			x = 0;
			newTailer.on('error',function(e) {
				console.log(e);
				// We want to see at least 2 errors, not one then death.
				if(x>0){ 
					done();
					emoteSuccess(desc);
					newTailer.removeAllListeners();
				}
				x++;
			});
		});
	});
});

after(function(done) {
	console.log('Cleaning up test file');
	fs.unlink(fn, function(e) {
		if(e) throw(e);
		done();
	});
});
