// Reply handler module

module.exports = (topic, message, strapi) => {
	//strapi.log.info(`Reply handler`)

	strapi.models['fence-host'].forge({
		id: message.id
	}).fetch({

	}).then( host => {
		if( host == null ) {}
		else {
			var now = new Date()
			var dstr = now.toISOString()
			host.set({
				'RepliedPing':true,
				'LastHeard': dstr
			}).save()
		}
	}).catch( err => {
		strapi.log.error('SSMQTT PingReply',err.message)
	})
}
