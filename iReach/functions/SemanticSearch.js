async function getEmbedding(query) {
  const key = context.values.get("OpenAI-Key");
  try {
    const url = 'https://api.openai.com/v1/embeddings';

    let response = await context.http.post({
      url: url,
      headers: {
        'Authorization': [`Bearer ${key}`],
        'Content-Type': ['application/json']
      },
      body: JSON.stringify({
        input: query,
        model: "text-embedding-ada-002"
      })
    });
    
    // console.error(query);
    // console.error(key);
    
    // return response.body.text();

    return EJSON.parse(response.body.text()).data[0].embedding;

  }
  catch (e) {
    console.error(e);
  }
}

async function findSimilarDocuments(embedding) {
  const mongodb = context.services.get('mongodb-atlas');
  const db = mongodb.db('ireach');
  const collection = db.collection('prospects');

  try {
    const documents = await collection.aggregate([
      {
        "$vectorSearch": {
          "index": "vector_index",
          "queryVector": embedding,
          "path": "UseCaseDescription_embeddings",
          "numCandidates": 5,
          "limit": 5
        }
      },
      {
        "$project": {
          UseCaseDescription: 1,
          AccountName: 1,
          Industry:1,
          AnnualRunRate: 1,
          AccountId: 1,
          ContactName: 1,
          role: 1
        }
      }
    ]).toArray();

    return documents;
  }
  catch (e) {
    console.error(embedding + e);
    // console.error(e);
  }
}

exports = async function ({ query, headers, body }, response) {

  try {

    const embedding = await getEmbedding(query.s);
    const documents = await findSimilarDocuments(embedding);

    return { results: documents };
  } catch (err) {
    console.error(err);
    return [err];
  }
};
