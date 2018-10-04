import cdk = require('@aws-cdk/cdk');
import s3 = require('@aws-cdk/aws-s3');
 
class StaticSiteStack extends cdk.Stack {
    constructor(parent: cdk.App, id: string, props?: cdk.StackProps) {
        super(parent, id, props);

        const bucketName = 'aws-cdk-sandbox-static-site';

        const bucketResource = new s3.cloudformation.BucketResource(this, 'staticSiteResource', {
            bucketName,
            accessControl: 'PublicRead',
            websiteConfiguration: {
                indexDocument: 'index.html'
            }
        })

        new s3.cloudformation.BucketPolicyResource(this, 'staticSitePolicyResource', {
            bucket: bucketResource.bucketName,
            policyDocument: {
                Statement: [
                    {
                        Sid: 'AddPerm',
                        Effect: 'Allow',
                        Principal: '*',
                        Action: [
                            's3:GetObject'
                        ],
                        Resource: [
                            `arn:aws:s3:::${bucketResource.bucketName}/*`
                        ]
                    }
                ]
            }
        })
    }
}
class StaticSiteApp extends cdk.App {
    constructor(argv: string[]) {
        super(argv);

        new StaticSiteStack(this, 'static-site-stack')
    }
}
 
process.stdout.write(new StaticSiteApp(process.argv).run());