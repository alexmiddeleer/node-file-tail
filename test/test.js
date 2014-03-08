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
	}, 500);
}

function emoteSuccess (testDesc) {
	console.log("Test Passed.");
}

function streamText (stream, cb) {
	stream.on('data',function(chunk) {
		cb(chunk.toString().trim());
	});
}

// First just create a file to test with
before(function(done){
	console.log("Creating a test file");
	makeFileGrow("Creating a file", function() {
		tailer = tailMod.startTailing(fn, 100);
		done();
	});
});

// Test to see if tailer detects file growth.  
describe('file-tail',function(){
	describe('#Basic operation', function(){
		var desc1 = "Test 1: File grows, tail emits the new text.";
		var newText = 'testing...';
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

//		var desc2 = "Test 2: File grows, tailer detects this.";
//		it(desc2, function(done) {
//			console.log(desc2);
//			listenForStream(tailer, function(sizeChange) {
//				assert((sizeChange>0),"File size is positive");
//				emoteSuccess(desc2);
//				done();
//			});
//	
//			makeFileGrow("testing... 2", function afterGrow(err) {
//				if (err) { 
//					done(err);
//				} 
//			});
//		});
//
//		var desc3 = "Test 3: File shrinks, tailer detects this.";
//		it(desc3, function(done) {
//			console.log(desc3);
//			listenForStream(tailer, function(sizeChange) {
//				assert((sizeChange<0),"File size is negative");
//				emoteSuccess(desc3);
//				done();
//			});
//	
//			makeFileShrink("testing... 3", function afterAfterShrink(err) {
//				if (err) { 
//					done(err);
//				} 
//			});
//		});
	});

	describe("controlling",function(){

	//	var desc4 = "Test 4: stop tailer"
	//	it(desc4,function(done) {
	//		console.log(desc4);
	//		tailer.stop();
	//		ignoreSizeChange(tailer, function() {
	//			emoteSuccess(desc4);
	//			done();
	//		});

	//		makeFileGrow("testing... 4", function afterGrow(err) {
	//			if (err) { 
	//				done(err);
	//			} 
	//		});
	//	});

	//	var desc5 = "Test 5: resume tailer"
	//	it(desc5,function(done) {
	//		console.log(desc5);
	//		tailer.go();
	//		listenForStream(tailer, function(sizeChange) {
	//			assert((sizeChange>0),"File size is positive");
	//			emoteSuccess(desc5);
	//			done();
	//		});

	//		makeFileGrow("testing... 5", function afterAfterShrink(err) {
	//			if (err) { 
	//				done(err);
	//			} 
	//		});
	//	});
	});

	describe('other stuff',function() {
	//	var desc6 = "Testing info()";
	//	it(desc6, function() {
	//		console.log(desc6);
	//		console.log("Size of file is: " + tailer.info().size + " bytes");
	//		assert(tailer.info().size>0,"tailer.info reports positive size");
	//	});
	//
	//	// Delete file then test to make sure tailer emits an error event
	//	var desc7 ='Testing error event emission';
	//	it(desc7, function(done) {
	//		console.log(desc7);
	//		tailer.on('error',function(e) {
	//			console.log("tailer correctly saw error: " + e);
	//			assert(e.toString()!=="","Testing error msg existence");
	//			done();
	//		});
	//		console.log("Removing test file...");
	//		fs.unlink(fn, function(e) {
	//			if(e) throw(e);
	//		});
	//	});
	});
});

