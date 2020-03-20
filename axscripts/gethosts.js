const axios = require('axios').default;

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNTg0NzMxNzg1LCJleHAiOjE1ODczMjM3ODV9.L3BRz-HaIR06YUfUq7Wkh2vlAKBonJGDHt_8tipnN1I';

// Request API.
axios.get('http://localhost:1337/fence-hosts', {
	headers: {
		Authorization: `Bearer ${token}`,
	},
}).then(response => {
	// Handle success.
	console.log('Data: ', response.data);
}).catch(error => {
	// Handle error.
	console.log('An error occurred:', error);
});
