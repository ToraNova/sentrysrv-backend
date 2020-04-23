// Low pass, check if there is an alert on the same segment with reason 'null',
// if yes, then return false, else return true
// RETURN FALSE if BLOCK
// RETURN TRUE if ALLOW

module.exports = async (message, strapi) => {
	try{
		const hosts = await strapi.models['fence-host'].forge({id: message.id})
			.fetch({withRelated: ['fence_segments'],require:true})

		for(var segment of hosts.relations['fence_segments'].models) {
			if( segment.attributes.Branch == +message.branch ){
				//obtained the segment ID
				try{
					const alerts = await strapi.models['alert']
						.where({"fence_segment": +segment.id})
						.fetchAll({require:true})
					if(typeof alerts[Symbol.iterator] === 'function') {
						for(a of alerts){
							if( a.attributes.Reason == null ) {
								return false
							}
						}
						return true
					}else{
						return alerts.attributes.Reason != null
					}
				}catch(err){
					if(err.message == "EmptyResponse"){
						//no alerts
						return true
					}
					strapi.log.error(`SSMQTT LPASS inner alert ${err}`)
					return false
				}
			}
		}
		//error also
		strapi.log.error(`SSMQTT LPASS alert with invalid branch ${message.branch} on host ${message.id}`)
		return false
	}catch(err){
		// not suppose to be here
		strapi.log.error(`SSMQTT LPASS error ${err}`)
		return false
	}
}
