import * as aws from "@pulumi/aws"
import * as pulumi from "@pulumi/pulumi"
import { AwsSsoDeviceAuthProvider } from 'aws-sso-device-auth-provider'

pulumi.log.warn("test test test")

const account1Credentials = await AwsSsoDeviceAuthProvider.getCredentialsForRole({
  startUrl: 'https://echobox.awsapps.com/start',
  accountName: 'Echobox Test Account',
  roleName: 'AWSAdministratorAccess-EU-West-1'
})

const account1Provider = new aws.Provider("account1Provider", {
  region: 'eu-west-1',
  accessKey: account1Credentials.accessKeyId,
  secretKey: account1Credentials.secretAccessKey,
  token: account1Credentials.sessionToken
})

export const bucket1 = new aws.s3.Bucket("bucket1", {}, {
  provider: account1Provider
})
