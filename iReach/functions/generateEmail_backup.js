
exports = async function({ query, headers, body }, response){
  // This default function will get a value and find a document in MongoDB
  // To see plenty more examples of what you can do with functions see: 
  // https://www.mongodb.com/docs/atlas/app-services/functions/
  
    const openai_key = context.values.get("OpenAI-Key");
    const url = 'https://api.openai.com/v1/chat/completions';

    let newresponse = await context.http.post({
      url: url,
      headers: {
        'Authorization': [`Bearer ${openai_key}`],
        'Content-Type': ['application/json']
      },
      body: JSON.stringify({
        "messages": [
      {
        "role": "user",
        "content": "What is capital of india"
      }
    ],
        model: "gpt-3.5-turbo"
      })
    });
    
    
  

  // Find the name of the MongoDB service you want to use (see "Linked Data Sources" tab)
  var serviceName = "mongodb-atlas";
  const { accountId, prompt } = query;

  // Update these to reflect your db/collection
  var dbName = "ireach";
  var prospects = "prospects";
  var proofpoints = "proofpoints";
  var features = "features";

  // Get a collection from the context
  var prospectsColl = context.services.get(serviceName).db(dbName).collection(prospects);
  var proofpointsColl = context.services.get(serviceName).db(dbName).collection(proofpoints);
  var featuresColl = context.services.get(serviceName).db(dbName).collection(features);

  var findResult;
  try {
    // Get a value from the context (see "Values" tab)
    // Update this to reflect your value's name.
    //var valueName = "value_name";
    //var value = context.values.get(valueName);

    // Execute a FindOne in MongoDB 
    prospectsResult = await prospectsColl.findOne(
      { "AccountId": accountId },{"UseCaseDescription_embeddings":1,"ContactName":1,"_id":0}
    );
    
    const qv_prospects = prospectsResult.UseCaseDescription_embeddings;
    
    const featurePipe = [
    {
      '$vectorSearch': {
        'queryVector': qv_prospects, 
        'path': 'description_embeddings', 
        'numCandidates': 15, 
        'index': 'default', 
        'limit': 1
      }
    }, {
      '$project': {
        'description': 1, 
        '_id': 0,
        "score": { "$meta": "vectorSearchScore" }
      }
    }
  ];
    
    
    const featureCursor = featuresColl.aggregate(featurePipe);
    const llmfeatureResult = await featureCursor.toArray();
    
    const proofpointPipe = [
    {
      '$vectorSearch': {
        'queryVector': qv_prospects, 
        'path': 'brief_description_embeddings', 
        'numCandidates': 60, 
        'index': 'default', 
        'limit': 3
      }
    }, {
      '$project': {
        'brief_description': 1, 
        '_id': 0,
        'name':1,
        'link':1,
        "score": { "$meta": "vectorSearchScore" }
      }
    }
  ];
  const proofpointsCursor = proofpointsColl.aggregate(proofpointPipe);
  const llmproofpointsResult = await proofpointsCursor.toArray();
    

    //console.log(qv_features)
    //return { ppresult: llmproofpointsResult, fresult:llmfeatureResult};
    //return {"pleasework" : newresponse.body.Data.choices[0].message.content }
    return {"asa":EJSON.parse(newresponse.body.text())}

  } catch(err) {
    console.log("Error occurred while executing findOne:", err.message);

    return { error: err.message };
  }

  // To call other named functions:
  // var result = context.functions.execute("function_name", arg1, arg2);

  
};