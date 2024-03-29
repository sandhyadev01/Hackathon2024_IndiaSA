async function findDocuments(q) {
    const mongodb = context.services.get('mongodb-atlas');
    const db = mongodb.db('ireach');
    const collection = db.collection('prospects');
  
    try {
      const documents = await collection.aggregate([
        {
            $search: {
              index: "autocomplete_prospects",
              autocomplete: {
                query: q,
                path: "AccountName",
                fuzzy: {
                  maxEdits: 1,
                  prefixLength: 2,
                },
              },
            },
          },
        {
          "$project": {
          UseCaseDescription: 1,
          AccountName: 1,
          Industry: 1,
          AnnualRunRate: 1,
          AccountId: 1,
            "_id": 0,
          ContactName: 1,
          role: 1
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