import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import { RemovalPolicy } from '@aws-cdk/core';

export class ServerlessCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?:cdk.StackProps) {
    super(scope, id, props);
			// define basic variables
	  		var dynamoDbReadWrite = 5;
        	var apiGatewayName = 'ServerlessAG';
			var tableName = 'Users';
			var lambdaVars = { 'TABLE_NAME': tableName};
			var concurrency = 5;
		
			// create dynamodb table
			const table = new dynamodb.Table(this, 'users', {
				partitionKey: { name: 'name', type: dynamodb.AttributeType.STRING},
				tableName: tableName,
				readCapacity: dynamoDbReadWrite,
				billingMode: dynamodb.BillingMode.PROVISIONED,
				removalPolicy: RemovalPolicy.DESTROY // grant cdk to delete dynamodb table
			});

			// create apigateway 
			const api = new apigw.RestApi(this, apiGatewayName);

			// the default Lambda hello entry point
			const helloLambda = new lambda.Function(this, 'HelloHandler', {
				runtime: lambda.Runtime.NODEJS_10_X,
				code: lambda.Code.fromAsset('lambda'),
				environment: lambdaVars,
				reservedConcurrentExecutions: concurrency,
				handler: 'hello.handler'
			});

			// integrate hello lambda with apigateway
			const helloapigw = new apigw.LambdaIntegration(helloLambda);
			const helloapi = api.root.addResource('hello');
			helloapi.addMethod('GET', helloapigw);

			// define create lambda
			const createLambda = new lambda.Function(this, 'CreateHandler', {
				runtime: lambda.Runtime.NODEJS_10_X,
				code: lambda.Code.fromAsset('lambda'),
				environment: lambdaVars,
				reservedConcurrentExecutions: concurrency,
				handler: 'create.handler'
			});

			// integrate create lambda with apigateway
			const createapigw = new apigw.LambdaIntegration(createLambda);
			const createapi = api.root.addResource('create');
			createapi.addMethod('POST', createapigw);

			// grant create lambda to write dynamodb
			table.grantReadWriteData(createLambda);

			// define read lambda
			const readLambda = new lambda.Function(this, 'ReadHandler', {
				runtime: lambda.Runtime.NODEJS_10_X,
				code: lambda.Code.fromAsset('lambda'),
				environment: lambdaVars,
				reservedConcurrentExecutions: concurrency,
				handler: 'read.handler'
			});

			// integrate read lambda with apigateway
			const readapigw = new apigw.LambdaIntegration(readLambda);
			const readapi = api.root.addResource('read');
			readapi.addMethod('GET', readapigw);

			// grant read lambda to read dynamodb
			table.grantReadData(readLambda);

  }
}

