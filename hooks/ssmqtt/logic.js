/*
 * Strapi-mqtt custom hook - ssmqtt (serverside mqtt)
 * allows interfacing the MQTT protocol with CMS
 * made for project sentrysrv-backend
 *
 * author: ToraNova
 * email : chia_jason96@live.com
 *
 * place this file as ./hooks/ssmqtt/logic.js
 * in the strapi project's root directory
 *
 * this file is supplementing the main hookfile, index.js
 * it implements the logic for the MQTT client
 * works together with npm's mqtt package
 *
 * to use,
 * const ssmqtt_logic = require('./logic.js')
 * client.on('message', function(topic, message) {
 * 	ssmqtt_logic( topic, message, strapi )
 * })
 *
 * mosquitto_pub -h 127.0.0.1 -p 1883 -t alert -m "{\"id\":\"2\",\"branch\":\"1\",\"mag\":\"0xFF\"}"
 */

const ahandle = require('./alert.js');
const rhandle = require('./reply.js');
const nhandle = require('./nvai.js');

module.exports = (topic, message, strapi) => {
	try{
		var jm = JSON.parse(message)
		//obtain the first level topic cat <-- ( */./. )
		var cat;
		if( topic.indexOf('/') == -1 ){
			cat = topic
		}else{
			cat = topic.substring(0, topic.indexOf('/'));
		}

		try{
			switch(cat){
				case 'alert':
					strapi.log.debug(`SSMQTT received ${message} on alert`)
					ahandle(topic, jm, strapi);
					break;
				case 'reply':
					//strapi.log.debug(`SSMQTT received ${message} on reply`)
					rhandle(topic, jm, strapi);
					break;
				case 'nvai':
					strapi.log.debug(`SSMQTT received ${message} on nvai`)
					nhandle(topic, jm, strapi);
					break;
				default:
					//donothing
					break;
			}
		}catch(err){
			strapi.log.error(`SSMQTT Failed to handle message ${err}`)
		}

	}catch(err){
		strapi.log.error(`SSMQTT Failed to parse message ${err}`)
	}
}
