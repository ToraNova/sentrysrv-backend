'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {

	alertpoll: async (ctx) => {
		const par = ctx.request.url.split('?')[1].split('&')
		const fseg = par[0]
		const atyp = par[1]
		//console.log(fseg,atyp)
		const nalist = await strapi.models.alert.where({
			Reason: null,
			fence_segment: +fseg,
			alert_model: +atyp
		}).fetchAll({
		})
		if(nalist.length > 0){
			ctx.send({clear:false})
		}else{
			ctx.send({clear:true})
		}
	},
};
