/*
 Welcome to your new connector!
 TODO: First things first, look at the "capabilities" array TODOs down below.
 */
var _ = require('lodash'),
	semver = require('semver');

/**
 * Creates your connector for Arrow.
 */
exports.create = function (Arrow) {
	var min = '1.7.0';
	if (semver.lt(Arrow.Version || '0.0.1', min)) {
		throw new Error('This connector requires at least version ' + min + ' of Arrow; please run `appc use latest`.');
	}
	var Connector = Arrow.Connector,
		Capabilities = Connector.Capabilities;

	return Connector.extend({
		filename: module.filename,
		defaultConfig: require('fs').readFileSync(__dirname + '/../conf/example.config.js', 'utf8'),
		capabilities: [
			Capabilities.ConnectsToADataSource,

			// TODO: Each of these capabilities is optional; add the ones you want, and delete the rest.
			// (Hint: I've found it to be easiest to add these one at a time, running `appc run` for guidance.)
			Capabilities.ValidatesConfiguration,
			//Capabilities.ContainsModels,
			Capabilities.GeneratesModels,
			//Capabilities.CanCreate,
			Capabilities.CanRetrieve,
			//Capabilities.CanUpdate,
			//Capabilities.CanDelete,
			//Capabilities.AuthenticatesThroughConnector
		]
	});
};
