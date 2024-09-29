import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3"
import { AwsSsoDeviceAuthProvider } from 'aws-sso-device-auth-provider'

const s3Client = new S3Client({
  region: 'eu-west-1',
  credentials: await AwsSsoDeviceAuthProvider.getAwsCredentialIdentityProviderForRole({
    startUrl: 'https://echobox.awsapps.com/start',
    accountId: '060610571733',
    roleName: 'AWSReadOnlyAccess'
  })
})

console.log(await s3Client.send(new ListBucketsCommand({})))
