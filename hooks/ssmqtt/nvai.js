// Reply handler module

module.exports = (topic, message, strapi) => {
	//strapi.log.info(`Reply handler`)

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
}
