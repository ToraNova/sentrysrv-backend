//following are pieces of literal garbage
const fetch = require('node-fetch');
const DigestFetch = require('digest-fetch')

//const client = new DigestFetch('admin', 'test123', { algorithm: 'MD5-sess' })
const client = new DigestFetch('admin', 'test123', { algorithm: 'MD5' })

const url = 'http://localhost:5000'
const options = {}
client.fetch(
	url
).then( res =>
	res.text()
).then( body =>
	console.log(body)
).catch( e =>
	console.error(e)
)
