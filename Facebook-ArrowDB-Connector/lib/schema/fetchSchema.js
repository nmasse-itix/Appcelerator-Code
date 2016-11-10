var FB = require('fb');

/**
 * Fetches the schema for your connector.
 *
 * For example, your schema could look something like this:
 * {
 *     objects: {
 *         person: {
 *             first_name: {
 *                 type: 'string',
 *                 required: true
 *             },
 *             last_name: {
 *                 type: 'string',
 *                 required: false
 *             },
 *             age: {
 *                 type: 'number',
 *                 required: false
 *             }
 *         }
 *     }
 * }
 *
 * @param next
 * @returns {*}
 */
exports.fetchSchema = function (next) {
	var self = this;
	// If we already have the schema, just return it.
	if (this.metadata.schema) {
		return next(null, this.metadata.schema);
	}

	var action = "get the list of all Facebook pages managed by the current user";
	self.logger.debug("Trying to " + action + "...");
	FB.api('/me/accounts', {
    access_token:   this.config.accessToken
  }, function (result) {
    if(!result || result.error) {
			self.logger.error("Could not " + action + ": " + (result != null ? result.error : ""));
      next('Got an error while trying to ' + action + ': ' + (result != null ? result.error : ""));
    } else {
			var n = result.data.length;
			self.logger.info("Successfully retrieved the list of all Facebook pages managed by the current user (" + n + " pages) !");
			self.logger.debug("Computing the schema from the facebook response...");
			var objects = {};
			var schemaCache = {};
			for (var i = 0; i < n; i++) {
				var facebookPage = result.data[i];
				var pageName = "LikesOf" + camelize(facebookPage.name);
				objects[pageName] = { "postId":   { "type": "string", "required": "true" },
				 											"postName": { "type": "string", "required": "false" },
															"userId":   { "type": "string", "required": "true" },
															"userName": { "type": "string", "required": "false" } };
				schemaCache[pageName] = { accessToken: facebookPage.access_token, pageId: facebookPage.id, name: facebookPage.name };
				self.logger.debug("New Schema: " + pageName);
			}
			var schema = { 'objects': objects, 'private': schemaCache };
			next(null, schema);
		}
  });

};

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
    return letter.toUpperCase();
  }).replace(/\s+/g, '');
}
