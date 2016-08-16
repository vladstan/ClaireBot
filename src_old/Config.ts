class Config {

  _instance: Config;

  static getInstance(): Config {
    if (!this._instance) {
      this._instance = new Config(process.env.NODE_ENV);
    }

    return this._instance;
  }

  constructor(env: String) {
    this.loadDefault();
    this.loadEnv(env);
    this.validate();
  }

  loadEnv(env: String) {
    if (env === 'production') {
      this.loadProduction();
    } else if (env === 'test') {
      this.loadTest();
    } else {
      this.loadDevelopment();
    }
  }

  loadDefault() {
    this.port = process.env.PORT || 3000;
    this.mongoUrl = process.env.MONGO_URL;
    this.userAgent = 'OkClaire';

    this.facebookAccessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    this.facebookVerifyToken = process.env.FACEBOOK_VERIFY_TOKEN;
    this.facebookAppSecret = process.env.FACEBOOK_APP_SECRET;
    this.facebookApiUrl = 'https://graph.facebook.com/v2.6';

    this.witAiAccessToken = process.env.WITAI_ACCESS_TOKEN;
    this.witAiApiUrl = 'https://api.wit.ai';
    this.witAiApiVersion = '20160516';

    this.forecastIoApiKey = process.env.FORECASTIO_API_KEY;
    this.googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyBXhblnLMRAkq_vxbDS5scSRrcEmbqLr8U';
    // TODO fix bug in the matrix
  }

  loadProduction() { }

  loadDevelopment() { }

  loadTest() { }

  validate() {
    for (const [key, value] of Object.entries(this)) {
      if (!value && typeof value !== 'boolean') {
        throw new Error(`config variable ${key} is ${value}`);
      }
    }
  }

}

export default Config;