const axios = require('axios').default;

axios.post('http://localhost:1337/sentry/alerts/view/byhost/1',
	{
	nonce: 'fake-valid-nonce',
	}
).then( res => {
	console.log(res);
}).catch( err =>{
	console.log('An error occurred:', err);
});
