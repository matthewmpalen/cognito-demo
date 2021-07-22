const validEmailTypes = ['valid', 'disposable'];

const preSignupValidation = async (event, context, callback) => {
  const { request = {} } = event;
  const { userAttributes = {} } = request;
  const { email } = userAttributes;
  if (!email) {
    return callback('"email" required', null);
  }

  const { PreSignupSettings } = require('./settings');
  const settings = new PreSignupSettings();
  const NeverBounce = require('neverbounce');
  const nbClient = new NeverBounce({ apiKey: settings.neverbounce.apiKey });

  let resp;

  try {
    resp = await nbClient.single.check(email);
  } catch (e) {
    console.error(email, 'Neverbounce failed', e);
    return callback('invalid email', null);
  }

  const { response = {} } = resp;
  const { result = 'invalid' } = response;

  if (!validEmailTypes.includes(result)) {
    console.error(email, resp);
    return callback('invalid email', null);
  }

  console.log(email, resp);

  // Verify user in Cognito
  event.response.autoConfirmUser = true;
  event.response.autoVerifyEmail = true;

  callback(null, event);
};

const postConfirmation = async (event, context, callback) => {
  const { userName, userPoolId, region } = event;
  if (!userName) {
    return callback('"userName" required', null);
  }

  if (!userPoolId) {
    return callback('"UserPoolId" required', null);
  }

  const AWS = require('aws-sdk');
  const cognitoIsp = new AWS.CognitoIdentityServiceProvider({
    region,
  });

  const params = {
    GroupName: 'Tier0',
    Username: userName,
    UserPoolId: userPoolId,
  };

  try {
    const resp = await cognitoIsp.adminAddUserToGroup(params).promise();
    console.log(userName, resp);
    return callback(null, event);
  } catch (e) {
    console.error(userName, e);
    return callback('Could not add user to Tier0', null);
  }
};

module.exports = {
  preSignupValidation,
  postConfirmation,
};
