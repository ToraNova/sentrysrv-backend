'use strict';

/**
 * Lifecycle callbacks for the `fence-host` model.
 */

module.exports = {

	lifecycles: {

		async afterUpdate(result, params, data){
			if(result.RepliedPing){
				strapi.io.emit('down/alert/update',JSON.stringify(result))
			}else{
				//trigger host down
				strapi.io.emit('down/alert/new',JSON.stringify(result))
			}
		},
	},
};
