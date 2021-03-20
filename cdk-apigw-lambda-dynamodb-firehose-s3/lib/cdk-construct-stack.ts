import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import { ApiGatewayToLambda } from '@aws-solutions-constructs/aws-apigateway-lambda';
import { DynamoDBStreamToLambda } from '@aws-solutions-constructs/aws-dynamodb-stream-lambda';
import {  KinesisFirehoseToS3 } from '@aws-solutions-constructs/aws-kinesisfirehose-s3';
import {  ManagedPolicy } from '@aws-cdk/aws-iam';

export class CdkConstructStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const apiGatewayToLambda = new ApiGatewayToLambda(this, 'ApiGatewayToLambda', {
      lambdaFunctionProps: {
        code: lambda.Code.fromAsset('lambda'),
        runtime: lambda.Runtime.NODEJS_10_X,
        handler: 'restApi.handler'
      },
      apiGatewayProps: {
        defaultMethodOptions: {
          authorizationType: apigw.AuthorizationType.NONE
        }
      }
    });
    const kinesistos3 = new KinesisFirehoseToS3(this, 'test-firehose-s3', {
      bucketProps: {
        autoDeleteObjects: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY
      },
      kinesisFirehoseProps: {
        extendedS3DestinationConfiguration: { /** Change firehose deliveryStream S3 buffer conditions */
          bufferingHints: {
               intervalInSeconds: 60 /** Set Buffer interval to 60 seconds */
           }
        }
      }
    });
    
    const kinesisfirehose = kinesistos3.kinesisFirehose.attrArn; /** Get Kinesis deliveryStream Arn */
    const s3bucket = kinesistos3.s3Bucket?.bucketName;

    const dynamoDBStreamToLambda = new DynamoDBStreamToLambda(this, 'DynamoDBStreamToLambda', {
      lambdaFunctionProps: {
        code: lambda.Code.fromAsset('lambda'),
        runtime: lambda.Runtime.NODEJS_10_X,
        handler: 'processStream.handler',
        environment: {
          KINESISSTREAM: kinesisfirehose || 'delivery stream name is empty',
          S3BUCKETNAME: s3bucket || 's3 bucket name is empty'
        }
      },
      dynamoTableProps: {
        tableName: 'my-table',
        partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
        timeToLiveAttribute: 'ttl',
        removalPolicy: cdk.RemovalPolicy.DESTROY
      }
    });


    const apiFunction = apiGatewayToLambda.lambdaFunction;
    const dynamoTable = dynamoDBStreamToLambda.dynamoTable;
    const kinesisFunction = dynamoDBStreamToLambda.lambdaFunction;
    
    // Grant Kinesis access to Lambda function
    kinesisFunction.role?.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("AmazonKinesisFirehoseFullAccess"));
    
    dynamoTable.grantReadWriteData(apiFunction);
    apiFunction.addEnvironment('TABLE_NAME', dynamoTable.tableName);
  }

}
