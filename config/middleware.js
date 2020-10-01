module.exports = {
	settings: {
		cors: {
			enabled: true,
			origin:
			['http://localhost:1337', 'https://localhost:4000'],
		},
		ip: {
			enabled: false,
			whiteList: [],
			blackList: [],
		},
		xss: {
			enabled: true,
			mode: "block",
		},
		csp: {
			enabled: true,
			policy: ["block-all-mixed-content"],
		},
		hsts: {
			enabled: true,
			maxAge: 31536000,
		},
		xframe: {
			enabled: true,
			value: "SAMEORIGIN",
		},
		p3p: {
			enabled: false,
			value: "",
		},
	},
};
