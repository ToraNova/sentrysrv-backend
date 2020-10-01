module.exports = ({env}) => ({
  settings: {
	ssmqtt: {
		dependencies:["strapi-hook-bookshelf"],
		enabled: env.bool("SSMQTT_ENABLE",true),
		login: env.bool("SSMQTT_LOGIN",true),
		username: env("SSMQTT_USERNAME","strapi-ssmqtt"),
		password: env("SSMQTT_PASSWORD","test123"),
		broker: env("SSMQTT_BROKER","localhost"),
		port: env.int("SSMQTT_PORT",1883)
	}

  },
});
