const axios = require('axios').default;

axios.post('http://localhost:1337/auth/local', {
	identifier: 'operator1',
	password: '5myXsPe4wJXQ9nU',
}).then(response => {
	// Handle success.

	//GET API. (FIND/SELECT)
	axios.get('http://localhost:1337/draw-lines', {
		headers: {
			Authorization: `Bearer ${response.data.jwt}`,
		},
	}).then(response => {
		// Handle success.
		console.log('Data: ', response.data);
	}).catch(error => {
		// Handle error.
		console.log('An error occurred:', error);
	});

	//POST API (CREATE)
	//axios.post('http://localhost:1337/draw-lines',
	//	{ //data
	//		"Data": {
	//			"startx":"1",
	//			"starty":"1",
	//			"endx":"2",
	//			"endy":"2",
	//		},
	//		"fence_segment":{
	//			"id":1
	//		},
	//	},
	//	{
	//	headers: {
	//		Authorization: `Bearer ${response.data.jwt}`,
	//	},
	//}).then(response => {
	//	// Handle success.
	//	console.log('Data: ', response.data);
	//}).catch(error => {
	//	// Handle error.
	//	console.log('An error occurred:', error);
	//});


}).catch(error => {
	// Handle error.
	console.log('An error occurred:', error);
});


