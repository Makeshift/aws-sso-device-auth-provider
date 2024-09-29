import * as pulumi from "@pulumi/pulumi"
import * as aws from "@pulumi/aws"

const account1Provider = new aws.Provider("account1Provider", {
  
})

export const bucket1 = new aws.s3.Bucket("bucket1", {}, {

})
