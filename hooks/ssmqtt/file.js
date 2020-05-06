// Hackish way to create file(s) from a 'download' instead of a file upload
// made for strapi sentrysrv-backend
// 28Mar2020
// Update 06May2020 due to changes in API by the buffoons who maintain the package
// author: ToraNova
// mailto: chia_jason96@live.com
//
// Sample filemd
//
// const filemd = {
// 	'path': `/tmp/${cam.CameraName}`,
// 	'name': `${cam.CameraName}.jpg`,
// 	'type': 'image/jpeg'
// }
//
// Sample refmd
//
// const refmd = {
// 	refId = a.id,
// 	ref = 'alert',
// 	field = 'Attachment'
// }
//
const fs = require('fs');

module.exports = { async save( filemd, refmd, response, strapi){

	const uplug = strapi.plugins.upload.services.upload
	//const confg = strapi.plugins.upload.config
	//data is on response.data
	//console.log(Object.keys( response ) )
	//console.log(Object.keys( response.request ) )
	//console.log(response.data)

	const writer = fs.createWriteStream( filemd.path )
	response.data.pipe(writer)

	return new Promise( (resolve, reject) =>{
		writer.on('finish', async () => {
			filemd['size'] = writer.bytesWritten
			const enhancedFile = await uplug.enhanceFile(
				filemd,
				{},
				refmd
			)
			uploadedFile = await uplug.uploadFileAndPersist(enhancedFile)

			/*
			 * Stupid idiots changed the API
			const config = await.uplug.getConfig()
			const buffers = await uplug.bufferize(filemd)
			const enhancedFiles = buffers.map(file => {
				if (file.size > config.sizeLimit) {
					reject({'message':'File size exceeded.'})
				}

				// Add details to the file to be able to create the relationships.
				refId = refmd.refId
				ref = refmd.ref
				field = refmd.field
				if (refId && ref && field) {
					//Object.assign(file, {related: [{ refId, ref, source, field, }, ],});
					Object.assign(file, {related: [{ refId, ref, field, }, ],});
				}
				//Object.assign( file,{
				//	related:[{
				//		'refId': aobj.id,
				//		'ref': 'alerts',
				//		'field':'Attachment',
				//	},
				//	],
				//})

				//// Update uploading folder path for the file.
				//if (path) { Object.assign(file, {path, }); }
				return file;
			});
			const uploadedFile = await uplug.upload(enhancedFiles, config);
			*/

			//return uploadedFile
			resolve(uploadedFile)
		})

		writer.on('error', (error) =>{
			reject(error)
		})
	})
}}
