module.exports = ({ env }) => ({
	host: env('HOST', '0.0.0.0'),
	port: env.int('PORT', 1337),
	admin: {
		auth: {
			secret: env('ADMIN_JWT_SECRET', '9f9d8700a89bd909b95ab342db6e2239'),
		},
	},
	cron: {
		enabled: true,
	}
});
