// Alert handler module

const axios = require('axios').default
const axiosRetry = require('axios-retry')
const fhandle = require('./file.js')

axiosRetry(axios, {retries: 10, retryDelay: axiosRetry.exponentialDelay});

module.exports = async (topic, message, strapi) => {
	if( message.id == null || message.branch == null || message.type == null ){
		strapi.log.error(`SSMQTT Message id/branch/type field is null! (${Object.keys(message)})`)
		return;
	}
	if( message.id < 1 || +message.branch < 1 || +message.type < 1 ){
		strapi.log.error(`SSMQTT Message id/branch/type field is invalid! (${Object.keys(message)})`)
		return;
	}

	const res = await strapi.query('fence-host').findOne({ id: message.id });
	if(res === null){
		strapi.log.error(`SSMQTT fence-host with id ${message.id} does not exist!`);
		return;
	}

	for( const segment of res.fence_segments ){
		if( segment.Branch == +message.branch
		&& +message.enum >= segment.StartElement
		&& +message.enum <= segment.EndElement){

			try{
				//const res = await strapi.query('alert').count({
				//	Reason_null: true,
				//	fence_segment: segment.id
				//});
				//if(res > 0){
				//	strapi.log.warn(`SSMQTT insertion with id ${message.id} disabled by lpass`);
				//	return
				//}

				//add new alert
				const a = await strapi.query('alert').create({
					"Reason":null,
					"OriginBranch": +message.branch,
					"fence_segment": +segment.id,
					"alert_model": +message.type,
					"Details": message.details
				});
				strapi.log.debug(`SSMQTT Alert inserted UUID:${a.id}`)
				const c = await strapi.query('ip-camera').
				findOne({id:segment.ip_camera});
//------------------------------------------------------------------------------------------------
//do something with individual cam here
var camuser; var campass; var opt

if(c.UseDefaultLogin){ //use model password
	camuser = c.ip_camera_model.GlobalUsername
	campass = c.ip_camera_model.GlobalPassword
}else{ //use individual cam password
	camuser = c.Username; campass = c.Password
}
if(camuser == null || campass == null){
	opt = { }
}else{ opt = { username: camuser, password: campass } }

axios({
	method:'get',
	url:`${c.Domain}${c.ip_camera_model.SnapPath}`,
	auth: opt,
	responseType: 'stream'
}).then( response => {
strapi.log.debug(`CAM ${camuser}:${campass}@${c.Domain}${c.ip_camera_model.SnapPath} ${response.status}`)

	const filemd = {
		'path': `/tmp/${c.CameraName}`,
		'name': `${c.CameraName}.jpg`,
		'type': 'image/jpeg'
	}
	const refmd = {
		refId : a.id,
		ref : 'alert',
		field : 'Attachment'
	}

	fhandle.save( filemd, refmd, response, strapi ).then( ufile => {
		strapi.log.debug('CAM save successful')
	}).catch( error => {
		strapi.log.error(`CAM FH ${error.message}`)
		const e = (({ message, stack }) => ({ message, stack }))(error);
		strapi.query('alert').update({ id: a.id },
			{Errors:e}
		);
	})

}).catch( error => {
	//save error
	strapi.log.error(`CAM AX ${error.message}`);
	const e = (({ message, stack }) => ({ message, stack }))(error);
	strapi.query('alert').update({ id: a.id },
		{Errors:e}
	);
})
//------------------------------------------------------------------------------------------------
			}catch(err){
				strapi.log.error(`SSMQTT ${err.message}`);
			}

		}//--endif
	}//---endfor
}
