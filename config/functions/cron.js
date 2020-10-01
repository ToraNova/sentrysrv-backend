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
	/**
	 * Simple example.
	 * Every monday at 1am.
	 */
	'*/1 * * * *': () => {
		strapi.log.info('Ping Daemon execution')
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
};
