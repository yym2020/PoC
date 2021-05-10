"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkConstructStack = void 0;
const cdk = require("@aws-cdk/core");
const lambda = require("@aws-cdk/aws-lambda");
const apigw = require("@aws-cdk/aws-apigateway");
const dynamodb = require("@aws-cdk/aws-dynamodb");
const aws_apigateway_lambda_1 = require("@aws-solutions-constructs/aws-apigateway-lambda");
const aws_dynamodb_stream_lambda_1 = require("@aws-solutions-constructs/aws-dynamodb-stream-lambda");
const aws_kinesisfirehose_s3_1 = require("@aws-solutions-constructs/aws-kinesisfirehose-s3");
const aws_iam_1 = require("@aws-cdk/aws-iam");
class CdkConstructStack extends cdk.Stack {
    constructor(scope, id, props) {
        var _a, _b;
        super(scope, id, props);
        const apiGatewayToLambda = new aws_apigateway_lambda_1.ApiGatewayToLambda(this, 'ApiGatewayToLambda', {
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
        const kinesistos3 = new aws_kinesisfirehose_s3_1.KinesisFirehoseToS3(this, 'test-firehose-s3', {
            bucketProps: {
                autoDeleteObjects: true,
                removalPolicy: cdk.RemovalPolicy.DESTROY
            },
            kinesisFirehoseProps: {
                extendedS3DestinationConfiguration: {
                    bufferingHints: {
                        intervalInSeconds: 60 /** Set Buffer interval to 60 seconds */
                    }
                }
            }
        });
        const kinesisfirehose = kinesistos3.kinesisFirehose.attrArn; /** Get Kinesis deliveryStream Arn */
        const s3bucket = (_a = kinesistos3.s3Bucket) === null || _a === void 0 ? void 0 : _a.bucketName;
        const dynamoDBStreamToLambda = new aws_dynamodb_stream_lambda_1.DynamoDBStreamToLambda(this, 'DynamoDBStreamToLambda', {
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
        (_b = kinesisFunction.role) === null || _b === void 0 ? void 0 : _b.addManagedPolicy(aws_iam_1.ManagedPolicy.fromAwsManagedPolicyName("AmazonKinesisFirehoseFullAccess"));
        dynamoTable.grantReadWriteData(apiFunction);
        apiFunction.addEnvironment('TABLE_NAME', dynamoTable.tableName);
    }
}
exports.CdkConstructStack = CdkConstructStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLWNvbnN0cnVjdC1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNkay1jb25zdHJ1Y3Qtc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQXFDO0FBQ3JDLDhDQUE4QztBQUM5QyxpREFBaUQ7QUFDakQsa0RBQWtEO0FBQ2xELDJGQUFxRjtBQUNyRixxR0FBOEY7QUFDOUYsNkZBQXdGO0FBQ3hGLDhDQUFrRDtBQUVsRCxNQUFhLGlCQUFrQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQzlDLFlBQVksS0FBb0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7O1FBQ2xFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSwwQ0FBa0IsQ0FBQyxJQUFJLEVBQUUsb0JBQW9CLEVBQUU7WUFDNUUsbUJBQW1CLEVBQUU7Z0JBQ25CLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUM7Z0JBQ3JDLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7Z0JBQ25DLE9BQU8sRUFBRSxpQkFBaUI7YUFDM0I7WUFDRCxlQUFlLEVBQUU7Z0JBQ2Ysb0JBQW9CLEVBQUU7b0JBQ3BCLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJO2lCQUNoRDthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxXQUFXLEdBQUcsSUFBSSw0Q0FBbUIsQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUU7WUFDcEUsV0FBVyxFQUFFO2dCQUNYLGlCQUFpQixFQUFFLElBQUk7Z0JBQ3ZCLGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU87YUFDekM7WUFDRCxvQkFBb0IsRUFBRTtnQkFDcEIsa0NBQWtDLEVBQUU7b0JBQ2xDLGNBQWMsRUFBRTt3QkFDWCxpQkFBaUIsRUFBRSxFQUFFLENBQUMsd0NBQXdDO3FCQUNqRTtpQkFDSDthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxlQUFlLEdBQUcsV0FBVyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxxQ0FBcUM7UUFDbEcsTUFBTSxRQUFRLEdBQUcsTUFBQSxXQUFXLENBQUMsUUFBUSwwQ0FBRSxVQUFVLENBQUM7UUFFbEQsTUFBTSxzQkFBc0IsR0FBRyxJQUFJLG1EQUFzQixDQUFDLElBQUksRUFBRSx3QkFBd0IsRUFBRTtZQUN4RixtQkFBbUIsRUFBRTtnQkFDbkIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztnQkFDckMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztnQkFDbkMsT0FBTyxFQUFFLHVCQUF1QjtnQkFDaEMsV0FBVyxFQUFFO29CQUNYLGFBQWEsRUFBRSxlQUFlLElBQUksK0JBQStCO29CQUNqRSxZQUFZLEVBQUUsUUFBUSxJQUFJLHlCQUF5QjtpQkFDcEQ7YUFDRjtZQUNELGdCQUFnQixFQUFFO2dCQUNoQixTQUFTLEVBQUUsVUFBVTtnQkFDckIsWUFBWSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUU7Z0JBQ2pFLG1CQUFtQixFQUFFLEtBQUs7Z0JBQzFCLGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU87YUFDekM7U0FDRixDQUFDLENBQUM7UUFHSCxNQUFNLFdBQVcsR0FBRyxrQkFBa0IsQ0FBQyxjQUFjLENBQUM7UUFDdEQsTUFBTSxXQUFXLEdBQUcsc0JBQXNCLENBQUMsV0FBVyxDQUFDO1FBQ3ZELE1BQU0sZUFBZSxHQUFHLHNCQUFzQixDQUFDLGNBQWMsQ0FBQztRQUU5RCwwQ0FBMEM7UUFDMUMsTUFBQSxlQUFlLENBQUMsSUFBSSwwQ0FBRSxnQkFBZ0IsQ0FBQyx1QkFBYSxDQUFDLHdCQUF3QixDQUFDLGlDQUFpQyxDQUFDLENBQUMsQ0FBQztRQUVsSCxXQUFXLENBQUMsa0JBQWtCLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDNUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7Q0FFRjtBQS9ERCw4Q0ErREMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyBhcGlndyBmcm9tICdAYXdzLWNkay9hd3MtYXBpZ2F0ZXdheSc7XG5pbXBvcnQgKiBhcyBkeW5hbW9kYiBmcm9tICdAYXdzLWNkay9hd3MtZHluYW1vZGInO1xuaW1wb3J0IHsgQXBpR2F0ZXdheVRvTGFtYmRhIH0gZnJvbSAnQGF3cy1zb2x1dGlvbnMtY29uc3RydWN0cy9hd3MtYXBpZ2F0ZXdheS1sYW1iZGEnO1xuaW1wb3J0IHsgRHluYW1vREJTdHJlYW1Ub0xhbWJkYSB9IGZyb20gJ0Bhd3Mtc29sdXRpb25zLWNvbnN0cnVjdHMvYXdzLWR5bmFtb2RiLXN0cmVhbS1sYW1iZGEnO1xuaW1wb3J0IHsgIEtpbmVzaXNGaXJlaG9zZVRvUzMgfSBmcm9tICdAYXdzLXNvbHV0aW9ucy1jb25zdHJ1Y3RzL2F3cy1raW5lc2lzZmlyZWhvc2UtczMnO1xuaW1wb3J0IHsgIE1hbmFnZWRQb2xpY3kgfSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcblxuZXhwb3J0IGNsYXNzIENka0NvbnN0cnVjdFN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IGFwaUdhdGV3YXlUb0xhbWJkYSA9IG5ldyBBcGlHYXRld2F5VG9MYW1iZGEodGhpcywgJ0FwaUdhdGV3YXlUb0xhbWJkYScsIHtcbiAgICAgIGxhbWJkYUZ1bmN0aW9uUHJvcHM6IHtcbiAgICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KCdsYW1iZGEnKSxcbiAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzEwX1gsXG4gICAgICAgIGhhbmRsZXI6ICdyZXN0QXBpLmhhbmRsZXInXG4gICAgICB9LFxuICAgICAgYXBpR2F0ZXdheVByb3BzOiB7XG4gICAgICAgIGRlZmF1bHRNZXRob2RPcHRpb25zOiB7XG4gICAgICAgICAgYXV0aG9yaXphdGlvblR5cGU6IGFwaWd3LkF1dGhvcml6YXRpb25UeXBlLk5PTkVcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IGtpbmVzaXN0b3MzID0gbmV3IEtpbmVzaXNGaXJlaG9zZVRvUzModGhpcywgJ3Rlc3QtZmlyZWhvc2UtczMnLCB7XG4gICAgICBidWNrZXRQcm9wczoge1xuICAgICAgICBhdXRvRGVsZXRlT2JqZWN0czogdHJ1ZSxcbiAgICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWVxuICAgICAgfSxcbiAgICAgIGtpbmVzaXNGaXJlaG9zZVByb3BzOiB7XG4gICAgICAgIGV4dGVuZGVkUzNEZXN0aW5hdGlvbkNvbmZpZ3VyYXRpb246IHsgLyoqIENoYW5nZSBmaXJlaG9zZSBkZWxpdmVyeVN0cmVhbSBTMyBidWZmZXIgY29uZGl0aW9ucyAqL1xuICAgICAgICAgIGJ1ZmZlcmluZ0hpbnRzOiB7XG4gICAgICAgICAgICAgICBpbnRlcnZhbEluU2Vjb25kczogNjAgLyoqIFNldCBCdWZmZXIgaW50ZXJ2YWwgdG8gNjAgc2Vjb25kcyAqL1xuICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBcbiAgICBjb25zdCBraW5lc2lzZmlyZWhvc2UgPSBraW5lc2lzdG9zMy5raW5lc2lzRmlyZWhvc2UuYXR0ckFybjsgLyoqIEdldCBLaW5lc2lzIGRlbGl2ZXJ5U3RyZWFtIEFybiAqL1xuICAgIGNvbnN0IHMzYnVja2V0ID0ga2luZXNpc3RvczMuczNCdWNrZXQ/LmJ1Y2tldE5hbWU7XG5cbiAgICBjb25zdCBkeW5hbW9EQlN0cmVhbVRvTGFtYmRhID0gbmV3IER5bmFtb0RCU3RyZWFtVG9MYW1iZGEodGhpcywgJ0R5bmFtb0RCU3RyZWFtVG9MYW1iZGEnLCB7XG4gICAgICBsYW1iZGFGdW5jdGlvblByb3BzOiB7XG4gICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldCgnbGFtYmRhJyksXG4gICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xMF9YLFxuICAgICAgICBoYW5kbGVyOiAncHJvY2Vzc1N0cmVhbS5oYW5kbGVyJyxcbiAgICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgICBLSU5FU0lTU1RSRUFNOiBraW5lc2lzZmlyZWhvc2UgfHwgJ2RlbGl2ZXJ5IHN0cmVhbSBuYW1lIGlzIGVtcHR5JyxcbiAgICAgICAgICBTM0JVQ0tFVE5BTUU6IHMzYnVja2V0IHx8ICdzMyBidWNrZXQgbmFtZSBpcyBlbXB0eSdcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGR5bmFtb1RhYmxlUHJvcHM6IHtcbiAgICAgICAgdGFibGVOYW1lOiAnbXktdGFibGUnLFxuICAgICAgICBwYXJ0aXRpb25LZXk6IHsgbmFtZTogJ2lkJywgdHlwZTogZHluYW1vZGIuQXR0cmlidXRlVHlwZS5TVFJJTkcgfSxcbiAgICAgICAgdGltZVRvTGl2ZUF0dHJpYnV0ZTogJ3R0bCcsXG4gICAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1lcbiAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgY29uc3QgYXBpRnVuY3Rpb24gPSBhcGlHYXRld2F5VG9MYW1iZGEubGFtYmRhRnVuY3Rpb247XG4gICAgY29uc3QgZHluYW1vVGFibGUgPSBkeW5hbW9EQlN0cmVhbVRvTGFtYmRhLmR5bmFtb1RhYmxlO1xuICAgIGNvbnN0IGtpbmVzaXNGdW5jdGlvbiA9IGR5bmFtb0RCU3RyZWFtVG9MYW1iZGEubGFtYmRhRnVuY3Rpb247XG4gICAgXG4gICAgLy8gR3JhbnQgS2luZXNpcyBhY2Nlc3MgdG8gTGFtYmRhIGZ1bmN0aW9uXG4gICAga2luZXNpc0Z1bmN0aW9uLnJvbGU/LmFkZE1hbmFnZWRQb2xpY3koTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoXCJBbWF6b25LaW5lc2lzRmlyZWhvc2VGdWxsQWNjZXNzXCIpKTtcbiAgICBcbiAgICBkeW5hbW9UYWJsZS5ncmFudFJlYWRXcml0ZURhdGEoYXBpRnVuY3Rpb24pO1xuICAgIGFwaUZ1bmN0aW9uLmFkZEVudmlyb25tZW50KCdUQUJMRV9OQU1FJywgZHluYW1vVGFibGUudGFibGVOYW1lKTtcbiAgfVxuXG59XG4iXX0=