"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerlessCdkStack = void 0;
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
            removalPolicy: core_1.RemovalPolicy.DESTROY // grant cdk to delete dynamodb table
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVybGVzcy1jZGstc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZXJ2ZXJsZXNzLWNkay1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQ0FBcUM7QUFDckMsOENBQThDO0FBQzlDLGlEQUFpRDtBQUNqRCxrREFBa0Q7QUFDbEQsd0NBQThDO0FBRTlDLE1BQWEsa0JBQW1CLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDL0MsWUFBWSxLQUFvQixFQUFFLEVBQVUsRUFBRSxLQUFxQjtRQUNqRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN6Qix5QkFBeUI7UUFDdkIsSUFBSSxpQkFBaUIsR0FBRyxDQUFDLENBQUM7UUFDdEIsSUFBSSxjQUFjLEdBQUcsY0FBYyxDQUFDO1FBQzFDLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQztRQUN4QixJQUFJLFVBQVUsR0FBRyxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUMsQ0FBQztRQUM1QyxJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUM7UUFFcEIsd0JBQXdCO1FBQ3hCLE1BQU0sS0FBSyxHQUFHLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFO1lBQy9DLFlBQVksRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFDO1lBQ2xFLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFlBQVksRUFBRSxpQkFBaUI7WUFDL0IsV0FBVyxFQUFFLFFBQVEsQ0FBQyxXQUFXLENBQUMsV0FBVztZQUM3QyxhQUFhLEVBQUUsb0JBQWEsQ0FBQyxPQUFPLENBQUMscUNBQXFDO1NBQzFFLENBQUMsQ0FBQztRQUVILHFCQUFxQjtRQUNyQixNQUFNLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBRXBELHVDQUF1QztRQUN2QyxNQUFNLFdBQVcsR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUM3RCxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1lBQ25DLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUM7WUFDckMsV0FBVyxFQUFFLFVBQVU7WUFDdkIsNEJBQTRCLEVBQUUsV0FBVztZQUN6QyxPQUFPLEVBQUUsZUFBZTtTQUN4QixDQUFDLENBQUM7UUFFSCx5Q0FBeUM7UUFDekMsTUFBTSxVQUFVLEdBQUcsSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDNUQsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0MsUUFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFFdEMsdUJBQXVCO1FBQ3ZCLE1BQU0sWUFBWSxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFO1lBQy9ELE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7WUFDbkMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztZQUNyQyxXQUFXLEVBQUUsVUFBVTtZQUN2Qiw0QkFBNEIsRUFBRSxXQUFXO1lBQ3pDLE9BQU8sRUFBRSxnQkFBZ0I7U0FDekIsQ0FBQyxDQUFDO1FBRUgsMENBQTBDO1FBQzFDLE1BQU0sV0FBVyxHQUFHLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzlELE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pELFNBQVMsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRXpDLHdDQUF3QztRQUN4QyxLQUFLLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFdkMscUJBQXFCO1FBQ3JCLE1BQU0sVUFBVSxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQzNELE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7WUFDbkMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztZQUNyQyxXQUFXLEVBQUUsVUFBVTtZQUN2Qiw0QkFBNEIsRUFBRSxXQUFXO1lBQ3pDLE9BQU8sRUFBRSxjQUFjO1NBQ3ZCLENBQUMsQ0FBQztRQUVILHdDQUF3QztRQUN4QyxNQUFNLFNBQVMsR0FBRyxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMxRCxNQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3QyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztRQUVwQyxxQ0FBcUM7UUFDckMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUVqQyxDQUFDO0NBQ0Y7QUF2RUQsZ0RBdUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgYXBpZ3cgZnJvbSAnQGF3cy1jZGsvYXdzLWFwaWdhdGV3YXknO1xuaW1wb3J0ICogYXMgZHluYW1vZGIgZnJvbSAnQGF3cy1jZGsvYXdzLWR5bmFtb2RiJztcbmltcG9ydCB7IFJlbW92YWxQb2xpY3kgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcblxuZXhwb3J0IGNsYXNzIFNlcnZlcmxlc3NDZGtTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86Y2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblx0XHRcdC8vIGRlZmluZSBiYXNpYyB2YXJpYWJsZXNcblx0ICBcdFx0dmFyIGR5bmFtb0RiUmVhZFdyaXRlID0gNTtcbiAgICAgICAgXHR2YXIgYXBpR2F0ZXdheU5hbWUgPSAnU2VydmVybGVzc0FHJztcblx0XHRcdHZhciB0YWJsZU5hbWUgPSAnVXNlcnMnO1xuXHRcdFx0dmFyIGxhbWJkYVZhcnMgPSB7ICdUQUJMRV9OQU1FJzogdGFibGVOYW1lfTtcblx0XHRcdHZhciBjb25jdXJyZW5jeSA9IDU7XG5cdFx0XG5cdFx0XHQvLyBjcmVhdGUgZHluYW1vZGIgdGFibGVcblx0XHRcdGNvbnN0IHRhYmxlID0gbmV3IGR5bmFtb2RiLlRhYmxlKHRoaXMsICd1c2VycycsIHtcblx0XHRcdFx0cGFydGl0aW9uS2V5OiB7IG5hbWU6ICduYW1lJywgdHlwZTogZHluYW1vZGIuQXR0cmlidXRlVHlwZS5TVFJJTkd9LFxuXHRcdFx0XHR0YWJsZU5hbWU6IHRhYmxlTmFtZSxcblx0XHRcdFx0cmVhZENhcGFjaXR5OiBkeW5hbW9EYlJlYWRXcml0ZSxcblx0XHRcdFx0YmlsbGluZ01vZGU6IGR5bmFtb2RiLkJpbGxpbmdNb2RlLlBST1ZJU0lPTkVELFxuXHRcdFx0XHRyZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LkRFU1RST1kgLy8gZ3JhbnQgY2RrIHRvIGRlbGV0ZSBkeW5hbW9kYiB0YWJsZVxuXHRcdFx0fSk7XG5cblx0XHRcdC8vIGNyZWF0ZSBhcGlnYXRld2F5IFxuXHRcdFx0Y29uc3QgYXBpID0gbmV3IGFwaWd3LlJlc3RBcGkodGhpcywgYXBpR2F0ZXdheU5hbWUpO1xuXG5cdFx0XHQvLyB0aGUgZGVmYXVsdCBMYW1iZGEgaGVsbG8gZW50cnkgcG9pbnRcblx0XHRcdGNvbnN0IGhlbGxvTGFtYmRhID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnSGVsbG9IYW5kbGVyJywge1xuXHRcdFx0XHRydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTBfWCxcblx0XHRcdFx0Y29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KCdsYW1iZGEnKSxcblx0XHRcdFx0ZW52aXJvbm1lbnQ6IGxhbWJkYVZhcnMsXG5cdFx0XHRcdHJlc2VydmVkQ29uY3VycmVudEV4ZWN1dGlvbnM6IGNvbmN1cnJlbmN5LFxuXHRcdFx0XHRoYW5kbGVyOiAnaGVsbG8uaGFuZGxlcidcblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBpbnRlZ3JhdGUgaGVsbG8gbGFtYmRhIHdpdGggYXBpZ2F0ZXdheVxuXHRcdFx0Y29uc3QgaGVsbG9hcGlndyA9IG5ldyBhcGlndy5MYW1iZGFJbnRlZ3JhdGlvbihoZWxsb0xhbWJkYSk7XG5cdFx0XHRjb25zdCBoZWxsb2FwaSA9IGFwaS5yb290LmFkZFJlc291cmNlKCdoZWxsbycpO1xuXHRcdFx0aGVsbG9hcGkuYWRkTWV0aG9kKCdHRVQnLCBoZWxsb2FwaWd3KTtcblxuXHRcdFx0Ly8gZGVmaW5lIGNyZWF0ZSBsYW1iZGFcblx0XHRcdGNvbnN0IGNyZWF0ZUxhbWJkYSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ0NyZWF0ZUhhbmRsZXInLCB7XG5cdFx0XHRcdHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xMF9YLFxuXHRcdFx0XHRjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQoJ2xhbWJkYScpLFxuXHRcdFx0XHRlbnZpcm9ubWVudDogbGFtYmRhVmFycyxcblx0XHRcdFx0cmVzZXJ2ZWRDb25jdXJyZW50RXhlY3V0aW9uczogY29uY3VycmVuY3ksXG5cdFx0XHRcdGhhbmRsZXI6ICdjcmVhdGUuaGFuZGxlcidcblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBpbnRlZ3JhdGUgY3JlYXRlIGxhbWJkYSB3aXRoIGFwaWdhdGV3YXlcblx0XHRcdGNvbnN0IGNyZWF0ZWFwaWd3ID0gbmV3IGFwaWd3LkxhbWJkYUludGVncmF0aW9uKGNyZWF0ZUxhbWJkYSk7XG5cdFx0XHRjb25zdCBjcmVhdGVhcGkgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgnY3JlYXRlJyk7XG5cdFx0XHRjcmVhdGVhcGkuYWRkTWV0aG9kKCdQT1NUJywgY3JlYXRlYXBpZ3cpO1xuXG5cdFx0XHQvLyBncmFudCBjcmVhdGUgbGFtYmRhIHRvIHdyaXRlIGR5bmFtb2RiXG5cdFx0XHR0YWJsZS5ncmFudFJlYWRXcml0ZURhdGEoY3JlYXRlTGFtYmRhKTtcblxuXHRcdFx0Ly8gZGVmaW5lIHJlYWQgbGFtYmRhXG5cdFx0XHRjb25zdCByZWFkTGFtYmRhID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnUmVhZEhhbmRsZXInLCB7XG5cdFx0XHRcdHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xMF9YLFxuXHRcdFx0XHRjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQoJ2xhbWJkYScpLFxuXHRcdFx0XHRlbnZpcm9ubWVudDogbGFtYmRhVmFycyxcblx0XHRcdFx0cmVzZXJ2ZWRDb25jdXJyZW50RXhlY3V0aW9uczogY29uY3VycmVuY3ksXG5cdFx0XHRcdGhhbmRsZXI6ICdyZWFkLmhhbmRsZXInXG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gaW50ZWdyYXRlIHJlYWQgbGFtYmRhIHdpdGggYXBpZ2F0ZXdheVxuXHRcdFx0Y29uc3QgcmVhZGFwaWd3ID0gbmV3IGFwaWd3LkxhbWJkYUludGVncmF0aW9uKHJlYWRMYW1iZGEpO1xuXHRcdFx0Y29uc3QgcmVhZGFwaSA9IGFwaS5yb290LmFkZFJlc291cmNlKCdyZWFkJyk7XG5cdFx0XHRyZWFkYXBpLmFkZE1ldGhvZCgnR0VUJywgcmVhZGFwaWd3KTtcblxuXHRcdFx0Ly8gZ3JhbnQgcmVhZCBsYW1iZGEgdG8gcmVhZCBkeW5hbW9kYlxuXHRcdFx0dGFibGUuZ3JhbnRSZWFkRGF0YShyZWFkTGFtYmRhKTtcblxuICB9XG59XG5cbiJdfQ==