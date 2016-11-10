// TODO: Reference the module to connect to your data store.
var FB = require('fb');


/**
 * Connects to your data store; this connection can later be used by your connector's methods.
 * @param next
 */
exports.connect = function (next) {
	// Note: Our current context, aka "this", is a reference to your connector.
	var self = this;

	connection = FB.extend({ "appId": this.config.appId, "appSecret": this.config.appSecret });
	self.logger.debug("Trying to validate our Facebook access_token by calling the /me endpoint...");
	FB.api('/me', {
    fields:         'name,id',
    access_token:   this.config.accessToken
  }, function (result) {
    if(!result || result.error) {
			self.logger.error("Facebook error: " + (result != null ? result.error : ""));
      next('Got an error while validating the access_token on /me: ' + (result != null ? result.error : ""));
    } else {
			self.logger.info("Successfully validated our access_token ! Facebook response = " + JSON.stringify(result));
			next();
		}
  });

};
