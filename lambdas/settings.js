class AWSSettings {
  constructor() {
    const {
      AWS_IAM_ACCESS_KEY,
      AWS_IAM_SECRET_ACCESS_KEY,
    } = process.env;

    if (!AWS_IAM_ACCESS_KEY) {
      throw new Error('Missing "AWS_IAM_ACCESS_KEY"')
    }

    if (!AWS_IAM_SECRET_ACCESS_KEY) {
      throw new Error('Missing "AWS_IAM_SECRET_ACCESS_KEY"')
    }

    this.accessKey = AWS_IAM_ACCESS_KEY;
    this.secretKey = AWS_IAM_SECRET_ACCESS_KEY;
  }
}

class NeverbounceSettings {
  constructor() {
    const { NEVERBOUNCE_API_KEY } = process.env;
    if (!NEVERBOUNCE_API_KEY) {
      throw new Error('Missing "NEVERBOUNCE_API_KEY"')
    }

    this.apiKey = NEVERBOUNCE_API_KEY;
  }
}

class PreSignupSettings {
  constructor() {
    this.neverbounce = new NeverbounceSettings();
  }
}

module.exports = {
  PreSignupSettings,
};
