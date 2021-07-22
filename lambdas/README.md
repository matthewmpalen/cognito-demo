# lambdas

## Setup

```bash
npm install
npx node-lambda package
```

This will create a .zip file that can be uploaded to AWS Lambda.
This example repo has two functions,
`preSignupValidation` and `postConfirmation`. To create both
.zip files correctly, just swap the function name in `index.js`.

Note: `node-lambda` has a `deploy` command but I haven't tested
it.

## Post-Deployment

In AWS, you'll have to make sure that the Lambda functions have
1. Appropriate timeout settings (default = 3 seconds)
2. Required permissions: In this example, the attached IAM role
and Lambda policy requires Cognito permissions.
