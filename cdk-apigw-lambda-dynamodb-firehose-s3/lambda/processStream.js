const AWS = require('aws-sdk');
const firehose = new AWS.Firehose();
const firehoseDeliveryName = process.env.KINESISSTREAM.split("/")[1];

exports.handler = function(event, context, callback) {

  event.Records.forEach(function(record){
    
    if (record.eventName == "REMOVE") {

      var params = {
        DeliveryStreamName: firehoseDeliveryName,
        Record: { /** required */
          Data: Buffer.from('event') || 'My test data' /**  Strings will be Base-64 encoded on your behalf */ /* required */
        }
      };
      firehose.putRecord(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
      });
      
    }
    else {
      console.log("Display EventName", record.eventName)
    }
  });

  callback(null, "error");
};