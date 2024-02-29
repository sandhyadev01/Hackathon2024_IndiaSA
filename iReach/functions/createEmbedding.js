exports = async function () {
    const openai_key = context.values.get("openAI_value");
  
    // Get the cluster in MongoDB Atlas.
    const mongodb = context.services.get('mongodb-atlas');
    const db = mongodb.db('Embeddings_database'); // Replace with your database name.
    const collection = db.collection('prospects'); // Replace with your collection name.
  
    try {
      const pendingDocs = await collection.aggregate([{ $match: { new_embedding: { $exists: false }, UseCaseIndustryCombined: { $exists: true } } }]).toArray();
  
      pendingDocs.forEach(async doc => {
        // Call OpenAI API to get the embeddings.
        const url = 'https://api.openai.com/v1/embeddings';
  
        let response = await context.http.post({
          url: url,
          headers: {
            'Authorization': [`Bearer ${openai_key}`],
            'Content-Type': ['application/json']
          },
          body: JSON.stringify({
            // The field inside your document that contains the data to embed, here it is the “plot” field from the sample movie data.
            input: doc.UseCaseIndustryCombined,
            model: "text-embedding-ada-002"
          })
        });
  
        // Parse the JSON response
        let responseData = EJSON.parse(response.body.text());
  
        // Check the response status.
        if (response.statusCode === 200) {
          console.log("Successfully received embedding.");
  
          const embedding = responseData.data[0].embedding;
  
          // Update the document in MongoDB.
          const result = await collection.updateOne(
            { _id: doc._id },
            // The name of the new field you’d like to contain your embeddings.
            { $set: { new_embedding: embedding } }
          );
  
          if (result.modifiedCount === 1) {
            console.log("Successfully updated the document.");
          } else {
            console.log("Failed to update the document.");
          }
        } else {
          console.log(`Failed to receive embedding. Status code: ${response.statusCode}`);
          
          await collection.updateOne(
            { _id: doc._id },
            // The name of the new field you’d like to contain your embeddings.
            { $set: { new_embedding: "failed" } }
          );
        }
  
      });
    } catch (err) {
      console.error(err);
    }
  };
