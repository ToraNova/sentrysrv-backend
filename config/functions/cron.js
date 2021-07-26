'use strict';

/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
 *
 * See more details here: https://strapi.io/documentation/v3.x/concepts/configurations.html#cron-tasks
 */

module.exports = {
	//every 1 minute
	'*/5 * * * *': () => {
		strapi.log.info('Ping daemon execution')
		//set every host's status to down
		strapi.query('fence-host').find({id_gt:0
		}).then( (res) => {
			for( const host of res){
				strapi.query('fence-host').update({id:host.id},
					{RepliedPing:false}
				);
			}
			strapi.ssmqtt.publish('ping/all', 'ping')
		});
	},

    // refresh the ai half-day
	//'* * * * *': async () => {
	'0 */12 * * *': async () => {
		strapi.log.info('AI all clear refresh.')
		strapi.ssmqtt.publish('nvai/re', '.')
    },

	//'* * * * *': async () => {
	'15 12 * * *': async () => { //at 12.15pm everyday
		var expr = new Date();
		expr.setMonth(expr.getMonth() - 3); //3 months ago
		//expr = expr.getTime() + 5*60000
		strapi.log.info(`Alert clearing schedule ${expr.valueOf()}`);
		var tres = [];
		for(var i=0;i<5;i++){
			tres = tres.concat( await strapi.query('alert').delete({
				created_at_lt:expr.valueOf(),
				_limit:997
			}) );
		} //4985, knex or for the fact, ANY fucking orm sucks. or it's just strapi idk
		strapi.log.info(`cleared ${tres.length} alerts from db`);
	},
};
