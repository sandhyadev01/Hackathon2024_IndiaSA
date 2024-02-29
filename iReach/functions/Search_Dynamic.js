async function findDocuments(q) {
  const mongodb = context.services.get('mongodb-atlas');
  const db = mongodb.db('ireach');
  const collection = db.collection('prospects');

  try {
    const documents = await collection.aggregate([
        {
            $search: {
              index: "dynamic_prospects",
              text: {
                query: q,
                path: {
                  wildcard: "*"
                }
              }
            }
          },
      {
        "$limit": 5
      },
      {
        "$project": {
          UseCaseDescription: 1,
          AccountName: 1,
          Industry: 1
 //         score: { $meta: 'searchScore' }
        }
      }
    ]).toArray();

    return documents;
  }
  catch (e) {
    console.error(e);
  }
}

exports = async function ({ query, headers, body }, response) {

  try {
   
    const documents = await findDocuments(query.s);

    return { results: documents };
  } catch (err) {
    console.error(err);
    return [err];
  }
};
