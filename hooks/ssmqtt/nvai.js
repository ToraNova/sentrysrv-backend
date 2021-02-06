// Reply handler module

module.exports = (topic, message, strapi) => {
	//strapi.log.info(`Reply handler`)

	if( topic.indexOf('/') == -1 ){
		cat = topic
	}else{
		//get after nvai/*
		cat = topic.substring(topic.indexOf('/')+1, topic.length);
	}
	switch(cat){
		case 'init':
			for( const sid of message.fsegs ){
				strapi.query('alert').find({
					fence_segment: sid,
					Reason_null: true
				}).then( (res) => {
					if(res.length < 1){
						strapi.ssmqtt.publish('nvai/clear', JSON.stringify({fseg: sid}));
					}
				})
			}
			break;
		case 'alert':

			// RAW QUERY (also possibility of slow)
			//strapi.log.debug(`SSMQTT NVAI alert received from ${message.id}`);
			//strapi.connections.default.raw(`insert into alerts (OriginBranch, Details, fence_segment, alert_model) values ('${message.branch}','${JSON.stringify(message.details)}','${message.id}','${message.type}');`).then( _res => {

			//	strapi.log.debug(`SSMQTT NVAI alert inserted on segmentID:${message.id}`)
			//	strapi.query('alert').findOne({
			//		fence_segment: +message.id,
			//		Reason_null: true
			//	}).then( res => {
			//		strapi.ssmqtt.publish('nvai/uploadreq', JSON.stringify({fseg: message.id, aid: res.id}));
			//		strapi.io.emit('map/alert/new', JSON.stringify(res))
			//		strapi.io.emit('focus/alert/new', JSON.stringify(res))
			//		strapi.log.debug(`SSMQTT NVAI alert broadcasted alertID:${res.id}`)
			//	});
			//});

			// DEFAULT
			strapi.query('alert').create({
				"Reason":null,
				"OriginBranch": +message.branch,
				"fence_segment": +message.id,
				"alert_model": +message.type,
				"Details": message.details
			}).then( res => {
				strapi.ssmqtt.publish('nvai/uploadreq', JSON.stringify({fseg: message.id, aid: res.id}));
			 	strapi.log.debug(`SSMQTT NVAI alert broadcasted alertID:${res.id}`)
			});

			break;
		default:
	}
}
