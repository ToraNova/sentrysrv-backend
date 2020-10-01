// Reply handler module

module.exports = (topic, message, strapi) => {
	//strapi.log.info(`Reply handler`)

	var now = new Date()
	var dstr = now.toISOString()
	strapi.query('fence-host').update({id:message.id
	},{
		RepliedPing:true,
		LastHeard: dstr
	});
}
