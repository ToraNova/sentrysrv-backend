'use strict';

/**
 * Lifecycle callbacks for the `alert` model.
 */

function isIterable(obj) {
	// checks for null and undefined
	if (obj == null) {
		return false;
	}
	return typeof obj[Symbol.iterator] === 'function';
}

async function deleteAttach(r){
	for(var af of r.Attachment){
		//delete the file
		const file = await strapi.plugins.upload.services.upload.fetch({ id: af.id });
		await strapi.plugins.upload.services.upload.remove(file);
	}
}

module.exports = {
	/**
	 * Triggered before user creation.
	 */
	lifecycles: {
		async beforeCreate(data) {
			const res = await strapi.query('alert').count({
				Reason_null: true,
				fence_segment: data.fence_segment
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
		async afterDelete(result, params) {
			if(!isIterable(result)){
				strapi.ssmqtt.publish('nvai/clear', JSON.stringify({fseg: result.fence_segment.id}));
				await deleteAttach(result);
				return;
			}

			//iterable
			for(var r of result){
				strapi.ssmqtt.publish('nvai/clear', JSON.stringify({fseg: r.fence_segment.id}));
				await deleteAttach(r);
			}
		},
	},
};
