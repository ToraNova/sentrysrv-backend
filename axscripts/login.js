const axios = require('axios').default;

axios.post('http://localhost:1337/auth/local', {
	identifier: 'Testuser',
	password: 'strapiPassword',
}).then(response => {
	// Handle success.
	console.log('Well done!');
	console.log('User profile', response.data.user);
	console.log('User token', response.data.jwt);
}).catch(error => {
	// Handle error.
	console.log('An error occurred:', error);
});
