'use strict';

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/3.0.0-beta.x/concepts/configurations.html#bootstrap
 */

// Toranova: edited for use of socketio together
module.exports = async () => {

	//uses nextTick, because strapi.server is undefined
	//for some reasons
	//see https://github.com/strapi/strapi/issues/5869
	process.nextTick( () => {
	// import socket io
	var io = require('socket.io')(strapi.server)

	// listen for user connection
	io.on('connection', function(socket){
		strapi.log.debug('client connected')

		//listen for map initial data request
		socket.on('map/init', () => {
			strapi.models['draw-line'].query({
			}).fetchAll().then( lines => {
				// sends the line data
				strapi.log.debug('map/line/data sent')
				socket.emit('map/line/data',JSON.stringify(lines))
			})

			strapi.models['alert'].where({
				Reason: null
			}).fetchAll().then( nalerts => {
				strapi.log.debug('map/alert/data sent')
				socket.emit('map/alert/data',JSON.stringify(nalerts))
			})
		})

		//listen for map initial data request
		socket.on('focus/init', () => {
			strapi.models['alert'].where({
				Reason: null
			}).fetchAll({
				withRelated: ['fence_segment','fence_segment.fence_host','Attachment','fence_host','alert_model']
			}).then( nalerts => {
				strapi.log.debug('focus/alert/data sent')
				socket.emit('focus/alert/data',JSON.stringify(nalerts))
			})
		})

		//forward this message to map/alert/highlight
		socket.on('focus/alert/highlight', (msg) => {
			console.log(typeof(msg))
			socket.broadcast.emit('map/alert/highlight', msg)
			strapi.log.debug('sync focus-map',msg)
		})


		// listen for user diconnect
		socket.on('disconnect', () => strapi.log.debug('client disconnected'))
	});

	// register socket io inside strapi main object to use it globally anywhere
	strapi.io = io
	})
};
