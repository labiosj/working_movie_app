const request = require('request');
const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-2',
    endpoint: 'http://dynamodb.us-east-2.amazonaws.com',
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey
  });

exports.handler = (event, context, callback) => {
  const url = `https://www.omdbapi.com/?t=${event.queryStringParameters.title}&plot=short&apikey=${process.env.ombdapikey}`
  addToDynamoDB(event.queryStringParameters.title);
  request(url, (err,apiResponse,body)=>{
    if(err){
      throw err
    }
   
    const lambdaResponse = {
      statusCode: 200,
      body: body,
      headers: {
        "Access-Control-Allow-Origin":"*",
        "content-type": "application/json"
      }
    };
    callback(null,lambdaResponse)
  });
};

function addToDynamoDB(title){
  const docClient = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName:"MovieTable",
    Item:{
        name: 'Lambda Entry',
        type : 'HTTP',
        title: title,
        timestamp:String(new Date().getTime())
    }
  };

  docClient.put(params, function(err, data) {
    if (err) {
      console.error('Unable to add item. Error JSON:', JSON.stringify(err, null, 2));
    } else {
      console.log("Added item:", JSON.stringify(data, null, 2));
    }
  });
}
