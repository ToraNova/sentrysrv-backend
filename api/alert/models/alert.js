'use strict';

/**
 * Lifecycle callbacks for the `alert` model.
 */

module.exports = {
	/**
	 * Triggered before user creation.
	 */
	lifecycles: {
		async beforeCreate(data) {
			const res = await strapi.query('alert').count({
				fence_segment: data.fence_segment,
				Reason_null: true
			});
			if(res > 0){
				throw new Error('Insertion disabled by lpass');
			}
		},
		async afterCreate (result, data) {
			//emit a socketio msg to sync with map and focus
			strapi.io.emit('map/alert/new', JSON.stringify(result))
			strapi.io.emit('focus/alert/new', JSON.stringify(result))
		},
		async afterUpdate(result, params, data) {
			//emit a socketio update map
			strapi.io.emit('map/alert/update', JSON.stringify(result))
			strapi.ssmqtt.publish('nvai/clear', JSON.stringify({fseg: result.fence_segment.id}));
		},
	},
};
