'use strict';


function config () {}

config.getSlackUserListURL = function () {
	var configConstants = require('./configConstants');

	return "https://slack.com/api/users.list?token=" + configConstants.getToken();
}


module.exports = config;