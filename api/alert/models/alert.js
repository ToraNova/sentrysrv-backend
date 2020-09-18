'use strict';

/**
 * Lifecycle callbacks for the `alert` model.
 */

module.exports = {
  // Before saving a value.
  // Fired before an `insert` or `update` query.
	beforeSave: async (model, attrs, options) => {
		//console.log(model)
		//TODO: introduce AI or a global low-pass filter here
		if(attrs.OriginBranch !== 0 && options.method == 'insert'){
			const others = await model.where({"fence_segment": attrs.fence_segment,"OriginBranch":attrs.OriginBranch,"reason":null}).fetchAll()
			if(others.length > 0){
				throw new Error('Insertion disabled by lpass.')
			}
		}
	},

// After saving a value.
// Fired after an `insert` or `update` query.
afterSave: async (model, response, options) => {

},

  // Before fetching a value.
  // Fired before a `fetch` operation.
  // beforeFetch: async (model, columns, options) => {},

  // After fetching a value.
  // Fired after a `fetch` operation.
  // afterFetch: async (model, response, options) => {},

  // Before fetching all values.
  // Fired before a `fetchAll` operation.
  // beforeFetchAll: async (model, columns, options) => {},

  // After fetching all values.
  // Fired after a `fetchAll` operation.
  // afterFetchAll: async (model, response, options) => {},

  // Before creating a value.
  // Fired before an `insert` query.
  // beforeCreate: async (model, attrs, options) => {},

// After creating a value.
// Fired after an `insert` query.
afterCreate: async (model, attrs, options) => {
	  //emit a socketio msg
	  strapi.io.emit('map/alert/new', JSON.stringify(model.attributes))
	  strapi.io.emit('focus/alert/new', JSON.stringify(model.attributes))
},

  // Before updating a value.
  // Fired before an `update` query.
  // beforeUpdate: async (model, attrs, options) => {},

// After updating a value.
// Fired after an `update` query.
afterUpdate: async (model, attrs, options) => {
	  strapi.io.emit('map/alert/update', JSON.stringify(model.attributes))
},

  // Before destroying a value.
  // Fired before a `delete` query.
  // beforeDestroy: async (model, attrs, options) => {},

	// After destroying a value.
	// Fired after a `delete` query.
	// we need to clear out the image file as well
	// TODO: we can't fix this now because strapi is still very unstable.
	//afterDestroy: async (model, attrs, options) => {
	//}
};
