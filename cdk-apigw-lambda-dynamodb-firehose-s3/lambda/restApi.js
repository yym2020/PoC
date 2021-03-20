const { DynamoDB } = require("aws-sdk");

const docClient = new DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;
const TTL_WINDOW = 7 * 24 * 60 * 60; 

exports.handler = async function (event) {

  const item = event.queryStringParameters;
  item.id = event.pathParameters.proxy;

  const now = new Date(); 
  item.ttl = Math.round(now.getTime() / 1000) + TTL_WINDOW;

  const response = await docClient.put({
    TableName: TABLE_NAME,
    Item: item
  }).promise();

  let statusCode = 204;
  
  if (response.err != null) {
    console.error('request: ', JSON.stringify(event, undefined, 2));
    console.error('error: ', response.err);
    statusCode = 500
  }

  return {
    statusCode: statusCode
  };
};