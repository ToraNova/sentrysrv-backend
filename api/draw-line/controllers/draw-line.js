'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {


	find: async (ctx) => {
		var ndlist = await strapi.models['draw-line'].query({
		}).fetchAll();
		ndlist = ndlist.toJSON();
		ctx.send(ndlist);
	},

};
