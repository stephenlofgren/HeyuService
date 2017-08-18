/*
 * GET state.
 */

var req = null;
var res = null;

var spawn = require('child_process').spawn;

var stdout = function (data) {
        console.log('stdout: ' + data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: parseInt(data.toString().trim()).toString(2)}));
};

var stderr = function (data) {
        console.log('sterr: ' + data);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: data.toString().trim()}));
};

var close = function (code) {
        console.log('child process exited with code ' + code);
        res.end(JSON.stringify({ success: '0'}));
};

module.exports.state = function(_req, _res){
    req = _req;
    res = _res;
    //res.writeHead(501, { 'Content-Type': 'application/json' });
    var heyu  = spawn('/usr/local/bin/heyu', ['onstate', '-a']);
    heyu.stdout.on('data', stdout);
    heyu.stderr.on('data', stderr);
    heyu.on('close', close);
};
