class Settings {
  constructor() {
    const {
      REACT_APP_REGION: region,
      REACT_APP_USER_POOL_ID: userPoolId,
      REACT_APP_USER_POOL_WEB_CLIENT_ID: userPoolWebClientId,
    } = process.env;

    this.cognito = {
      region,
      userPoolId,
      userPoolWebClientId,
    };

    console.log('cognito', this.cognito);
  }
}

module.exports = new Settings();
