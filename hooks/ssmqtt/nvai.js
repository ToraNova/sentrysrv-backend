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

			// FAST BROADCAST
			strapi.connections.default.raw(`select max(id) from alerts;`).then( res => {
				var nid = res[0]['max(id)'] + 15 //ugly fix
				strapi.io.emit('map/alert/new', JSON.stringify({fence_segment:{id:message.id},Reason:null,id:nid}))

				strapi.log.debug(`SSMQTT NVAI alert received from ${message.id}`);
				strapi.connections.default.raw(`insert into alerts (id, OriginBranch, Details, fence_segment, alert_model) values (${nid}, '${message.branch}','${JSON.stringify(message.details)}','${message.id}','${message.type}');`).then( _res => {
					strapi.log.debug(`SSMQTT NVAI alert inserted on segmentID:${message.id}`)
					strapi.ssmqtt.publish('nvai/uploadreq', JSON.stringify({fseg: message.id, aid: nid}));
					strapi.log.debug(`SSMQTT NVAI alert broadcasted alertID:${nid}`)
				});
			});


			//strapi.query('alert').create({
			//	"Reason":null,
			//	"OriginBranch": +message.branch,
			//	"fence_segment": +message.id,
			//	"alert_model": +message.type,
			//	"Details": message.details
			//}).then( async res => {
			//	strapi.log.debug(`SSMQTT Alert inserted UUID:${res.id}`)
			//	strapi.ssmqtt.publish('nvai/uploadreq', JSON.stringify({fseg: message.id, aid: res.id}));
			//	//strapi.log.debug(`SSMQTT upload request on UUID:${res.id}`)
			//});

			// RAW QUERY
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
			//strapi.query('alert').create({
			//	"Reason":null,
			//	"OriginBranch": +message.branch,
			//	"fence_segment": +message.id,
			//	"alert_model": +message.type,
			//	"Details": message.details
			//}).then( res => {
			//	strapi.log.debug(`SSMQTT Alert inserted UUID:${res.id}`)
			//	strapi.ssmqtt.publish('nvai/uploadreq', JSON.stringify({fseg: message.id, aid: res.id}));
			//	strapi.log.debug(`SSMQTT upload request on UUID:${res.id}`)
			//});

			break;
		default:
	}
}
