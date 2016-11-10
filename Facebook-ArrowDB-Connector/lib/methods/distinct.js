// TODO: Reference the module to connect to your data store.
var yourDataStore = /*require('your-data-store')*/{};

/**
 * Performs a query and returns a distinct result set based on the field(s).
 * @param {Arrow.Model} Model Model class to check.
 * @param {String} field Comma-separated list of fields.
 * @param {ArrowQueryOptions} [options] Query options.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the distinct values array.
 */
exports.distinct = function distinct(Model, field, options, callback) {
	// TODO: Find the distinct results for this Model from your data store.
	yourDataStore.distinct(field, options.where, function (err, results) {
		if (err) {
			return callback(err);
		}

		// TODO: Return just the distinct values array.
		callback(null, results);
	});
};
