/*jslint node: true */
"use strict";

var req = null;
var res = null;

var spawn = require('child_process').spawn;
var util = require('util');

var stdout = function (data) {
        console.log('stdout: ' + data);
        if(!res.headerSent){
		res.writeHead(200, { 'Content-Type': 'application/json' });
	}
	res.end(JSON.stringify({ message: data.toString().trim() }));
};

var stderr = function (data) {
        console.log('sterr: ' + data);
        if(!res.headerSent){
		res.writeHead(400, { 'Content-Type': 'application/json' });
	}
	res.end(JSON.stringify({ message: data.toString().trim() }));
};

var close = function (code) {
        console.log('child process exited with code ' + code);
        //res.end(JSON.stringify({ success: '0'}));
};

var heyuPower = function (cmd) {
    console.log(JSON.stringify(util.inspect(req.body)));
    var houseCode = req.body.HouseCode;
    var deviceCode = req.body.DeviceCode;
    console.log('housecode ' + houseCode);
    console.log('devicecode ' + deviceCode);
    console.log('cmd ' + cmd);
    var heyu  = spawn('/usr/local/bin/heyu', [cmd, houseCode + deviceCode]);

    heyu.stdout.on('data', stdout);

    heyu.stderr.on('data', stderr);

    heyu.on('close', close);
};

var heyuDim = function () {
    console.log(JSON.stringify(util.inspect(req.body)));
    var houseCode = req.body.HouseCode;
    var deviceCode = req.body.DeviceCode;
    var dimValue = req.body.dimValue;
    console.log('housecode ' + houseCode);
    console.log('devicecode ' + deviceCode);
    console.log('dimValue ' + dimValue);
    var heyu  = spawn('/usr/local/bin/heyu', ['dimb', houseCode + deviceCode, dimValue]);

    heyu.stdout.on('data', stdout);

    heyu.stderr.on('data', stderr);

    heyu.on('close', close);
};

module.exports.turnOn = function (_req, _res) {
    console.log('turnOn route success');
    req = _req;
    res = _res;
    heyuPower('on');
};

module.exports.turnOff = function (_req, _res) {
    console.log('turnOff route success');
    req = _req;
    res = _res;
    heyuPower('off');
};

module.exports.dim = function (_req, _res) {
    console.log('dim route success');
    req = _req;
    res = _res;
    heyuDim();
};
