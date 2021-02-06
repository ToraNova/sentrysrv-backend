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

	//'* * * * *': () => {
	'15 12 * * *': () => {
		strapi.log.info('Alert clearing schedule')
		var expr = new Date();
		expr.setMonth(expr.getMonth() - 3); //3 months ago
		//expr = expr.getTime() + 5*60000
		strapi.query('alert').delete({
			created_at_lt:expr
		}).then( (res) => {
			console.log(res);
		});
	},
};
