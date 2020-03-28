const axios = require('axios').default;

var now = new Date()
//var dstr = now.toLocaleDateString() + now.toLocaleTimeString()
var dstr = now.toISOString()

axios.post('http://localhost:1337/auth/local', {
	identifier: 'operator1',
	password: '5myXsPe4wJXQ9nU',
}).then(response => {
	// Handle success.
	// Request API.
	console.log(response.data.jwt)

	axios.get('http://localhost:1337/alerts',{
		headers: {
			Authorization: `Bearer ${response.data.jwt}`,
		},
	}).then(response => {
		// Handle success.
		console.log('Data: ', response.data);
		console.log('Att: ', response.data[0].Attachment);
	}).catch(error => {
		// Handle error.
		console.log('An error occurred:', error);
	});

}).catch(error => {
	// Handle error.
	console.log('An error occurred:', error);
});
