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

	delete strapi.plugins['users-permissions'].config.jwt.expiresIn; //disable login expiry

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

			strapi.models['alert'].query( qb =>{
				qb.where('Reason',null)
				qb.limit(100)
			}).fetchAll().then( nalerts => {
				strapi.log.debug('map/alert/data sent')
				socket.emit('map/alert/data',JSON.stringify(nalerts))
			})
		})

		//listen for map initial data request
		socket.on('focus/init', async (msg) => {
			if(msg){
				msg = JSON.parse(msg)
			}else{
				msg = {count: 10}
			}

			const res = await strapi.query('alert').find({
				Reason_null:true,
				_limit: msg.count || 10
			});
			socket.emit('focus/alert/data', JSON.stringify(res));
		})

		socket.on('focus/live', async (msg) => {
			msg = JSON.parse(msg)

			if( msg.command == 'stop' ){
				var livecom = {
					fsegid: null,
					video: msg.vnum,
					mode: msg.command,
					url:null,
				}
				strapi.ssmqtt.publish('camlive', JSON.stringify(livecom))
				return
			}

			const seg = await strapi.query('fence-segment').findOne({ id: msg.fseg || 0});
			if(seg === null ){
				strapi.log.warn(`focus/live segment id ${msg.fset} doesn\'t exist`);
			}

			if(seg.ip_camera === null){
				//no cameras
			}else{
				const e = await strapi.query('ip-camera').findOne({ id: seg.ip_camera.id});
				//craft a MQTT packet
				var nopro = e.Domain.split(/:(.+)/)[1]
				var livecom = {
					fsegid: msg.fseg,
					video: msg.vnum,
					mode: msg.command,
					url:`rtsp:${nopro}${e.ip_camera_model.StreamPath}`,
				}
				if(e.UseDefaultLogin){
					livecom.user = e.ip_camera_model.GlobalUsername
					livecom.pass = e.ip_camera_model.GlobalPassword
				}else{
					livecom.user = e.Username
					livecom.pass = e.Password
				}
				strapi.ssmqtt.publish('camlive', JSON.stringify(livecom))
			}
		})

		//forward this message to map/alert/highlight
		socket.on('focus/alert/highlight', (msg) => {
			socket.broadcast.emit('map/alert/highlight', msg)
			strapi.log.debug('sync focus-map',msg)
		})

		//list for down initial data request
		socket.on('down/init', () => {
			strapi.models['draw-line'].query({
			}).fetchAll().then( lines => {
				// sends the line data
				strapi.log.debug('down/line/data sent')
				socket.emit('down/line/data',JSON.stringify(lines))
			})

			strapi.models['fence-host'].where({
				RepliedPing: false
			}).fetchAll({
			}).then( nhosts => {
				strapi.log.debug('down/alert/data sent')
				socket.emit('down/alert/data',JSON.stringify(nhosts))
			})
		})


		// listen for user diconnect
		socket.on('disconnect', () => strapi.log.debug('client disconnected'))
	});

	// register socket io inside strapi main object to use it globally anywhere
	strapi.io = io
	})
};
