// Alert handler module

const axios = require('axios').default
const fhandle = require('./file.js')
const lpass = require('./lpass.js') //obsolete, using model lifecycle callbacks
// see api/alert/models/alert.js

module.exports = async (topic, message, strapi) => {
	//strapi.log.info(`Alert handler`)
	//console.log(Object.keys(strapi.models)) //debugging
	//console.log(strapi.models['fence-host'])

	//console.log(strapi.models['fence-host']) //debugging
	//console.log(strapi.models['fence-host'])
	if( message.id == null || message.branch == null || message.type == null ){
		strapi.log.error(`SSMQTT Message id/branch/type field is null! (${Object.keys(message)})`)
		return
	}
	if( message.id < 1 || +message.branch < 1 || +message.type < 1 ){
		strapi.log.error(`SSMQTT Message id/branch/type field is invalid! (${Object.keys(message)})`)
		return
	}

	//const lp = await lpass(message, strapi)
	//if(!lp){
	//	strapi.log.debug(`SSMQTT Alert insertion blocked by lpass`)
	//	return
	//}
	//lp = true

	strapi.models['fence-host'].forge({
		id: message.id
	}).fetch({
		//withRelated: ['fence_segments']
		withRelated: ['fence_segments'],
		require:true
	}).then( host => {
		if( host == null ) {}
		else for(var segment of host.relations['fence_segments'].models) {
			if( segment.attributes.Branch == +message.branch
				&& +message.enum >= segment.attributes.StartElement
				&& +message.enum <= segment.attributes.EndElement){
				strapi.models['alert'].forge({
					"Reason":null,
					"OriginBranch": +message.branch,
					"fence_segment": +segment.id,
					"alert_model": +message.type,
					"Details": message.info
				}).save().then( function(a) {
					strapi.log.debug(`SSMQTT Alert inserted UUID:${a.get('id')}`)
					strapi.models['ip-camera'].query({
						where: {fence_segment: +segment.id}
					}).fetchAll().then( cams => {
						//do someting with cams here
						cams.serialize().forEach( (cam,idx) => {

//------------------------------------------------------------------------------------------------------

//do something with individual cam here
var camuser; var campass; var opt

if(cam.UseDefaultLogin){ //use model password
	camuser = cam.ip_camera_model.GlobalUsername
	campass = cam.ip_camera_model.GlobalPassword
}else{ //use individual cam password
	camuser = cam.Username; campass = cam.Password
}
if(camuser == null || campass == null){
	opt = { }
}else{ opt = { username: camuser, password: campass } }

axios({
	method:'get',
	url:`${cam.Domain}${cam.ip_camera_model.SnapPath}`,
	auth: opt,
	responseType: 'stream'
}).then( response => {
strapi.log.debug(`CAM ${camuser}:${campass}@${cam.Domain}${cam.ip_camera_model.SnapPath} ${response.status}`)

	const filemd = {
		'path': `/tmp/${cam.CameraName}`,
		'name': `${cam.CameraName}.jpg`,
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
		a.set({
			'Errors':error
		}).save()
	})

}).catch( error => {
	//save error
	strapi.log.error(`CAM AX ${error.message}`)
	a.set({
		'Errors':error
	}).save()
})

//------------------------------------------------------------------------------------------------------

						})
					})
				})
			}
		}
	})
}
