/*
 * Strapi-mqtt custom hook - ssmqtt (serverside mqtt)
 * allows interfacing the MQTT protocol with CMS
 * made for project sentrysrv-backend
 *
 * author: ToraNova
 * email : chia_jason96@live.com
 *
 * place this file as ./hooks/ssmqtt/index.js
 * in the strapi project's root directory
 *
 * then, enable the hook by editing ./config/hook.json
 * {
 * ... ,
 * "ssmqtt": {
 * 	"enabled": true,
 * 	"dependencies":["strapi-hook-bookshelf"],
 * 	"login": true,
 * 	"username": "strapi-ssmqtt",
 * 	"password": "test123",
 * 	"broker": "localhost",
 * 	"port": "1883"
 * }
 * ...
 * }
 */

const fs = require('fs')
const path = require('path')
const mqtt = require('mqtt')
const ssmqtt_logic = require('./logic.js')
const schedule = require("node-schedule");

var subscription = ['ping/server','alert/+','alert','reply/+']

module.exports = strapi => { return {

	defaults: {
	// config object
	},

	async initialize() {
		const { login, username, password, broker, port } = strapi.config.hook.ssmqtt

		var conn_opt = { clientId : 'mqtt-serverside-1',
				 clean : true,
				 keepalive : 60 }

		if (login === true || login === 1) {
			//login mode
			strapi.log.info(`SSMQTT Login Mode: ${username}`)
			conn_opt['username'] = username
			conn_opt['password'] = password
		}else{
			strapi.log.info('SSMQTT Anon Mode')
		}

		//connect
		var client = mqtt.connect(`mqtt://${broker}:${port}`,conn_opt)

		//callbacks
		client.on('connect', function (connack) {
			strapi.log.info(`SSMQTT Connected to broker connack.rc:${connack.returnCode}`)
			//subscribe to subscriptions
			subscription.forEach(element => {
				client.subscribe(element, function (err) {
					if (err) {
						strapi.log.error(`SSMQTT Subscription error ${error}`)
					}
				})
			})
		})

		client.on('error',function(error) {
			strapi.log.info(`SSMQTT ${error}`)
		})

		client.on('message', function(topic, message) {
			ssmqtt_logic( topic, message, strapi )
		})

		var rule = new schedule.RecurrenceRule()
		//rule.minute = 40
		rule.second = 10
		const pingd = schedule.scheduleJob(rule, function(){
			strapi.log.info('SSMQTT Ping Daemon execution')
			//set every host's status to down
			strapi.models['fence-host'].fetchAll().then( async function(hosts){
				for await (const host of hosts) {
					host.set('RepliedPing',false).save()
				}
				client.publish('ping/all', 'ping')
			})
		})

	},
}}
