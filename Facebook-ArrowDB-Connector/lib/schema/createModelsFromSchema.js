var Arrow = require('arrow'),
	_ = require('lodash');

/**
 * Creates models from your schema (see "fetchSchema" for more information on the schema).
 */
exports.createModelsFromSchema = function () {
	var self = this,
		models = {};

	// TODO: Iterate through the models in your schema.
	Object.keys(self.metadata.schema.objects).forEach(function (modelName) {
		var object = self.metadata.schema.objects[modelName],
			fields = {}, private = null;
		Object.keys(object).forEach(function (fieldName) {

			var field = object[fieldName];
			if (fieldName !== 'id') {
				// TODO: Define the Arrow field definitions based on the schema.
				fields[fieldName] = {
					type: field.type || String,
					required: field.required
				};
			}
		});

		models[self.name + '/' + modelName] = Arrow.Model.extend(self.name + '/' + modelName, {
			name: self.name + '/' + modelName,
			autogen: !!self.config.modelAutogen, // Controls if APIs are automatically created for this model.
			fields: fields,
			connector: self,
			logger: self.logger,
			generated: true,
			// cache Facebook attrs in the model to save a roundtrip
			"private": self.metadata.schema.private[modelName]
		});
	});

	self.models = _.defaults(self.models || {}, models);
};
