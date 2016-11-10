var FB = require('fb'),
    Arrow = require('arrow'),
    _ = require('lodash');

/**
 * Queries for particular model records.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {ArrowQueryOptions} options Query options.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the model records.
 * @throws {Error} Failed to parse query options.
 */
exports.query = function (Model, options, callback) {
	var self = this;
	var query = {
		/**
		 * A dictionary of the fields to include, such as { first_name: 1 }
		 */
		//sel: Model.translateKeysForPayload(options.sel),
		/**
		 * A dictionary of the fields to exclude, such as { last_name: 0 }
		 */
		//unsel: Model.translateKeysForPayload(options.unsel),
		/**
		 * A dictionary of fields to search by, ignoring keys that aren't specified in our model, and including "id",
		 * such as { first_name: 'Daws%', last_name: 'Toth' }
		 */
		//where: _.pick(Model.translateKeysForPayload(options.where), Model.payloadKeys().concat(['id'])),
		/**
		 * A dictionary of fields to order by, with a direction, such as { first_name: 1, last_name: -1 } where 1 is
		 * ascending and -1 is descending.
		 */
		//order: Model.translateKeysForPayload(options.order),
		/**
		 * A number indicating how far to skip through the results before returning them, such as 0 or 100, as well
		 * as a limit on how many to return, such as 10 or 20. Alternatively, use options.page and options.per_page.
		 * Arrow translates these for you.
		 *
		 * For example, a skip of 50 and a limit of 10 is equivalent to a page of 5 and a per_page of 10.
		 */
		//skip: options.skip,
		//limit: options.limit,
		access_token:   this.config.accessToken,
	};

	self.logger.debug("--> query(" + Model.name + ", " + JSON.stringify(options) + ")");
	self.logger.info("Fetching Facebook posts and likes for page '" + Model.private.name + "'...");
	FB.api("/" + Model.private.pageId + "/posts?fields=likes{id,name},id,message&limit=" + options.limit + "&offset=" + options.skip, query, function (result) {
    if(!result || result.error) {
			self.logger.error("Facebook error: " + (result != null ? result.error : ""));
      callback('Got an error while Trying to find all likes of ' + Model.name + ": " + (result != null ? result.error : ""));
    } else {
			self.logger.info("Successfully found all likes for page '" + Model.private.name + "': " + JSON.stringify(result));
			var results = result.data;
			var array = [];
			for (var p = 0; p < results.length; p++) {
				var post = results[p];
				var postId = post.id;
				var postName = post.message;

				var likes = post.likes.data;
				for (var l = 0; l < likes.length; l++) {
					var like = likes[l];
					var instance = Model.instance({postId: postId, postName: postName, userId: like.id, userName: like.name}, true);
					//instance.setPrimaryKey(String(results[c].id));
					array.push(instance);
				}
			}

			// Turn the array of instances in to a collection, and return it.
			callback(null, new Arrow.Collection(Model, array));
		}
  });

};
