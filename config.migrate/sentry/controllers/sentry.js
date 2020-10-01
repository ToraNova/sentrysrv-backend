'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {

	alertbyhost: async (ctx) => {
		console.log(ctx.request);
		ctx.send('ok');
	},

	alertbysegment: async(ctx) => {
		console.log(ctx.request);
		ctx.send('ok');
	},

	alertview: async(ctx) => {
		//FUCK JAVASCRIPT. you stopped here. please fucking upgrade
		//this fucking strapi project because IT HAS MORE BUGS THATN MY GRANDMOTHER
		//awjdbakjwh!312kj3b1kj23
		console.log(ctx.request);
		ctx.send('ok');
	},

	alertpoll: async (ctx) => {
		console.log(ctx);
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
