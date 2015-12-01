'use strict';

function Route () {}

Route.getViewWithName = function (name) {
	//check if exists?
	return require('./JS/Views/' + name);
}

Route.getScreenWithName = function (value) {
	var path = './JS/Screens/'.concat(value);
	var obj = require(path);
	console.log(obj);
	return path;
}

module.exports = Route;