'use strict';

/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
 *
 * See more details here: https://strapi.io/documentation/3.0.0-beta.x/concepts/configurations.html#cron-tasks
 */

module.exports = {
	// ping all hosts every 5 minutes
	//'* */5 * * * *': () => {

	'*/5 * * * * *': function () {
		strapi.log.info('test');
		console.log(Object.keys( strapi.plugin ))
	}
};
