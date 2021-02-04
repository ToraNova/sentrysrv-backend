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
			//TODO
			strapi.query('alert').create({
				"Reason":null,
				"OriginBranch": +message.branch,
				"fence_segment": +message.id,
				"alert_model": +message.type,
				"Details": message.details
			}).then( res => {
				strapi.ssmqtt.publish('nvai/uploadreq', JSON.stringify({fseg: message.id, aid: res.id}));
				strapi.log.debug(`SSMQTT Alert inserted UUID:${res.id}`)
			});
			break;
		default:
	}
}
