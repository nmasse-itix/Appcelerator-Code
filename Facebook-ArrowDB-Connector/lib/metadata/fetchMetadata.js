var Arrow = require('arrow');

/**
 * Fetches metadata describing your connector's proper configuration.
 * @param next
 */
exports.fetchMetadata = function fetchMetadata(next) {
	next(null, {
		fields: [
			Arrow.Metadata.Text({
				name: 'accessToken',
				description: 'A Facebook access_token, that you can get with the "get-oauth-token.sh".',
				required: true
			})
		]
	});
};
