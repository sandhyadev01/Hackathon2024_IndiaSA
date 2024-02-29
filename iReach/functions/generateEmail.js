
exports = async function({ query, headers, body }, response){
  // This default function will get a value and find a document in MongoDB
  // To see plenty more examples of what you can do with functions see: 
  // https://www.mongodb.com/docs/atlas/app-services/functions/
  

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
    
    const qv_features = prospectsResult.UseCaseDescription_embeddings;
    
    const featurePipe = [
    {
      '$vectorSearch': {
        'queryVector': qv_features, 
        'path': 'description_embeddings', 
        'numCandidates': 15, 
        'index': 'default', 
        'limit': 1
      }
    }, {
      '$project': {
        'description': 1, 
        '_id': 0
      }
    }
  ];
    
    
    const featureCursor = featuresColl.aggregate(featurePipe);
    const llmfeatureResult = await featureCursor.toArray();
    
    const agg3 = [
    {
      '$vectorSearch': {
        'queryVector': qv_features, 
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
        'link':1
      }
    }
  ];
  const proofpointsCursor = proofpointsColl.aggregate(featurePipe);
  const llmproofpointsResult = await proofpointsCursor.toArray();
  
    
    

    console.log(qv_features)
    return { result: llmproofpointsResult };

  } catch(err) {
    console.log("Error occurred while executing findOne:", err.message);

    return { error: err.message };
  }

  // To call other named functions:
  // var result = context.functions.execute("function_name", arg1, arg2);

  
};