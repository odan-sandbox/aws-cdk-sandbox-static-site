import cdk = require('@aws-cdk/cdk');
import s3 = require('@aws-cdk/aws-s3');
import cloudfront = require('@aws-cdk/aws-cloudfront');

class StaticSiteStack extends cdk.Stack {
  constructor(parent: cdk.App, id: string, props?: cdk.StackProps) {
    super(parent, id, props);

    const bucketName = 'aws-cdk-sandbox-static-site';

    const bucket = new s3.Bucket(this, bucketName, {
      bucketName
    })

    const oaiResource = new cloudfront.cloudformation.CloudFrontOriginAccessIdentityResource(this, 'staticSiteOAIResource', {
      cloudFrontOriginAccessIdentityConfig: {
        comment: 'static site'
      }
    })

    new s3.cloudformation.BucketPolicyResource(this, 'staticSitePolicyResource', {
      bucket: bucket.bucketName,
      policyDocument: {
        Statement: [
          {
            Sid: 'cdn',
            Effect: 'Allow',
            Principal: {
              AWS: `arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity ${oaiResource.cloudFrontOriginAccessIdentityId}`
            },
            Action: [
              's3:GetObject'
            ],
            Resource: [
              `arn:aws:s3:::${bucket.bucketName}/*`
            ]
          }
        ]
      }
    })

    new cloudfront.CloudFrontWebDistribution(this, 'staticSiteDistribution', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket,
            originAccessIdentity: oaiResource,
          },
          behaviors: [{ isDefaultBehavior: true }]
        }
      ]
    })
  }
}

const app = new cdk.App(process.argv)

new StaticSiteStack(app, 'static-site-stack')

process.stdout.write(app.run());
