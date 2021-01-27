"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const lambda = require("@aws-cdk/aws-lambda");
const apigw = require("@aws-cdk/aws-apigateway");
const dynamodb = require("@aws-cdk/aws-dynamodb");
const core_1 = require("@aws-cdk/core");
class ServerlessCdkStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // define basic variables
        var dynamoDbReadWrite = 5;
        var apiGatewayName = 'ServerlessAG';
        var tableName = 'Users';
        var lambdaVars = { 'TABLE_NAME': tableName };
        var concurrency = 5;
        // create dynamodb table
        const table = new dynamodb.Table(this, 'users', {
            partitionKey: { name: 'name', type: dynamodb.AttributeType.STRING },
            tableName: tableName,
            readCapacity: dynamoDbReadWrite,
            billingMode: dynamodb.BillingMode.PROVISIONED,
            removalPolicy: core_1.RemovalPolicy.DESTROY
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
exports.ServerlessCdkStack = ServerlessCdkStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVybGVzcy1jZGstc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZXJ2ZXJsZXNzLWNkay1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFxQztBQUNyQyw4Q0FBOEM7QUFDOUMsaURBQWlEO0FBQ2pELGtEQUFrRDtBQUNsRCx3Q0FBOEM7QUFFOUMsTUFBYSxrQkFBbUIsU0FBUSxHQUFHLENBQUMsS0FBSztJQUMvQyxZQUFZLEtBQW9CLEVBQUUsRUFBVSxFQUFFLEtBQXFCO1FBQ2pFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3pCLHlCQUF5QjtRQUN2QixJQUFJLGlCQUFpQixHQUFHLENBQUMsQ0FBQztRQUN0QixJQUFJLGNBQWMsR0FBRyxjQUFjLENBQUM7UUFDMUMsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDO1FBQ3hCLElBQUksVUFBVSxHQUFHLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBQyxDQUFDO1FBQzVDLElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQztRQUVwQix3QkFBd0I7UUFDeEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUU7WUFDL0MsWUFBWSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUM7WUFDbEUsU0FBUyxFQUFFLFNBQVM7WUFDcEIsWUFBWSxFQUFFLGlCQUFpQjtZQUMvQixXQUFXLEVBQUUsUUFBUSxDQUFDLFdBQVcsQ0FBQyxXQUFXO1lBQzdDLGFBQWEsRUFBRSxvQkFBYSxDQUFDLE9BQU87U0FDcEMsQ0FBQyxDQUFDO1FBRUgscUJBQXFCO1FBQ3JCLE1BQU0sR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFFcEQsdUNBQXVDO1FBQ3ZDLE1BQU0sV0FBVyxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQzdELE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7WUFDbkMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztZQUNyQyxXQUFXLEVBQUUsVUFBVTtZQUN2Qiw0QkFBNEIsRUFBRSxXQUFXO1lBQ3pDLE9BQU8sRUFBRSxlQUFlO1NBQ3hCLENBQUMsQ0FBQztRQUVILHlDQUF5QztRQUN6QyxNQUFNLFVBQVUsR0FBRyxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUM1RCxNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMvQyxRQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztRQUV0Qyx1QkFBdUI7UUFDdkIsTUFBTSxZQUFZLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUU7WUFDL0QsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDO1lBQ3JDLFdBQVcsRUFBRSxVQUFVO1lBQ3ZCLDRCQUE0QixFQUFFLFdBQVc7WUFDekMsT0FBTyxFQUFFLGdCQUFnQjtTQUN6QixDQUFDLENBQUM7UUFFSCwwQ0FBMEM7UUFDMUMsTUFBTSxXQUFXLEdBQUcsSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDOUQsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDakQsU0FBUyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFekMsd0NBQXdDO1FBQ3hDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUV2QyxxQkFBcUI7UUFDckIsTUFBTSxVQUFVLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUU7WUFDM0QsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDO1lBQ3JDLFdBQVcsRUFBRSxVQUFVO1lBQ3ZCLDRCQUE0QixFQUFFLFdBQVc7WUFDekMsT0FBTyxFQUFFLGNBQWM7U0FDdkIsQ0FBQyxDQUFDO1FBRUgsd0NBQXdDO1FBQ3hDLE1BQU0sU0FBUyxHQUFHLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzFELE1BQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRXBDLHFDQUFxQztRQUNyQyxLQUFLLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBRWpDLENBQUM7Q0FDRjtBQXZFRCxnREF1RUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyBhcGlndyBmcm9tICdAYXdzLWNkay9hd3MtYXBpZ2F0ZXdheSc7XG5pbXBvcnQgKiBhcyBkeW5hbW9kYiBmcm9tICdAYXdzLWNkay9hd3MtZHluYW1vZGInO1xuaW1wb3J0IHsgUmVtb3ZhbFBvbGljeSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuXG5leHBvcnQgY2xhc3MgU2VydmVybGVzc0Nka1N0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzpjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXHRcdFx0Ly8gZGVmaW5lIGJhc2ljIHZhcmlhYmxlc1xuXHQgIFx0XHR2YXIgZHluYW1vRGJSZWFkV3JpdGUgPSA1O1xuICAgICAgICBcdHZhciBhcGlHYXRld2F5TmFtZSA9ICdTZXJ2ZXJsZXNzQUcnO1xuXHRcdFx0dmFyIHRhYmxlTmFtZSA9ICdVc2Vycyc7XG5cdFx0XHR2YXIgbGFtYmRhVmFycyA9IHsgJ1RBQkxFX05BTUUnOiB0YWJsZU5hbWV9O1xuXHRcdFx0dmFyIGNvbmN1cnJlbmN5ID0gNTtcblx0XHRcblx0XHRcdC8vIGNyZWF0ZSBkeW5hbW9kYiB0YWJsZVxuXHRcdFx0Y29uc3QgdGFibGUgPSBuZXcgZHluYW1vZGIuVGFibGUodGhpcywgJ3VzZXJzJywge1xuXHRcdFx0XHRwYXJ0aXRpb25LZXk6IHsgbmFtZTogJ25hbWUnLCB0eXBlOiBkeW5hbW9kYi5BdHRyaWJ1dGVUeXBlLlNUUklOR30sXG5cdFx0XHRcdHRhYmxlTmFtZTogdGFibGVOYW1lLFxuXHRcdFx0XHRyZWFkQ2FwYWNpdHk6IGR5bmFtb0RiUmVhZFdyaXRlLFxuXHRcdFx0XHRiaWxsaW5nTW9kZTogZHluYW1vZGIuQmlsbGluZ01vZGUuUFJPVklTSU9ORUQsXG5cdFx0XHRcdHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWVxuXHRcdFx0fSk7XG5cblx0XHRcdC8vIGNyZWF0ZSBhcGlnYXRld2F5IFxuXHRcdFx0Y29uc3QgYXBpID0gbmV3IGFwaWd3LlJlc3RBcGkodGhpcywgYXBpR2F0ZXdheU5hbWUpO1xuXG5cdFx0XHQvLyB0aGUgZGVmYXVsdCBMYW1iZGEgaGVsbG8gZW50cnkgcG9pbnRcblx0XHRcdGNvbnN0IGhlbGxvTGFtYmRhID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnSGVsbG9IYW5kbGVyJywge1xuXHRcdFx0XHRydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTBfWCxcblx0XHRcdFx0Y29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KCdsYW1iZGEnKSxcblx0XHRcdFx0ZW52aXJvbm1lbnQ6IGxhbWJkYVZhcnMsXG5cdFx0XHRcdHJlc2VydmVkQ29uY3VycmVudEV4ZWN1dGlvbnM6IGNvbmN1cnJlbmN5LFxuXHRcdFx0XHRoYW5kbGVyOiAnaGVsbG8uaGFuZGxlcidcblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBpbnRlZ3JhdGUgaGVsbG8gbGFtYmRhIHdpdGggYXBpZ2F0ZXdheVxuXHRcdFx0Y29uc3QgaGVsbG9hcGlndyA9IG5ldyBhcGlndy5MYW1iZGFJbnRlZ3JhdGlvbihoZWxsb0xhbWJkYSk7XG5cdFx0XHRjb25zdCBoZWxsb2FwaSA9IGFwaS5yb290LmFkZFJlc291cmNlKCdoZWxsbycpO1xuXHRcdFx0aGVsbG9hcGkuYWRkTWV0aG9kKCdHRVQnLCBoZWxsb2FwaWd3KTtcblxuXHRcdFx0Ly8gZGVmaW5lIGNyZWF0ZSBsYW1iZGFcblx0XHRcdGNvbnN0IGNyZWF0ZUxhbWJkYSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ0NyZWF0ZUhhbmRsZXInLCB7XG5cdFx0XHRcdHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xMF9YLFxuXHRcdFx0XHRjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQoJ2xhbWJkYScpLFxuXHRcdFx0XHRlbnZpcm9ubWVudDogbGFtYmRhVmFycyxcblx0XHRcdFx0cmVzZXJ2ZWRDb25jdXJyZW50RXhlY3V0aW9uczogY29uY3VycmVuY3ksXG5cdFx0XHRcdGhhbmRsZXI6ICdjcmVhdGUuaGFuZGxlcidcblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBpbnRlZ3JhdGUgY3JlYXRlIGxhbWJkYSB3aXRoIGFwaWdhdGV3YXlcblx0XHRcdGNvbnN0IGNyZWF0ZWFwaWd3ID0gbmV3IGFwaWd3LkxhbWJkYUludGVncmF0aW9uKGNyZWF0ZUxhbWJkYSk7XG5cdFx0XHRjb25zdCBjcmVhdGVhcGkgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgnY3JlYXRlJyk7XG5cdFx0XHRjcmVhdGVhcGkuYWRkTWV0aG9kKCdQT1NUJywgY3JlYXRlYXBpZ3cpO1xuXG5cdFx0XHQvLyBncmFudCBjcmVhdGUgbGFtYmRhIHRvIHdyaXRlIGR5bmFtb2RiXG5cdFx0XHR0YWJsZS5ncmFudFJlYWRXcml0ZURhdGEoY3JlYXRlTGFtYmRhKTtcblxuXHRcdFx0Ly8gZGVmaW5lIHJlYWQgbGFtYmRhXG5cdFx0XHRjb25zdCByZWFkTGFtYmRhID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnUmVhZEhhbmRsZXInLCB7XG5cdFx0XHRcdHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xMF9YLFxuXHRcdFx0XHRjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQoJ2xhbWJkYScpLFxuXHRcdFx0XHRlbnZpcm9ubWVudDogbGFtYmRhVmFycyxcblx0XHRcdFx0cmVzZXJ2ZWRDb25jdXJyZW50RXhlY3V0aW9uczogY29uY3VycmVuY3ksXG5cdFx0XHRcdGhhbmRsZXI6ICdyZWFkLmhhbmRsZXInXG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gaW50ZWdyYXRlIHJlYWQgbGFtYmRhIHdpdGggYXBpZ2F0ZXdheVxuXHRcdFx0Y29uc3QgcmVhZGFwaWd3ID0gbmV3IGFwaWd3LkxhbWJkYUludGVncmF0aW9uKHJlYWRMYW1iZGEpO1xuXHRcdFx0Y29uc3QgcmVhZGFwaSA9IGFwaS5yb290LmFkZFJlc291cmNlKCdyZWFkJyk7XG5cdFx0XHRyZWFkYXBpLmFkZE1ldGhvZCgnR0VUJywgcmVhZGFwaWd3KTtcblxuXHRcdFx0Ly8gZ3JhbnQgcmVhZCBsYW1iZGEgdG8gcmVhZCBkeW5hbW9kYlxuXHRcdFx0dGFibGUuZ3JhbnRSZWFkRGF0YShyZWFkTGFtYmRhKTtcblxuICB9XG59XG5cbiJdfQ==