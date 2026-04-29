const axios = require("axios");
const {hasChanged} = require("../hashStore");
const {extractReadmeData} = require("../utils/readmeParser");

module.exports = async function (data , channel){
  const {payload} = data;

  const repo = payload.repository?.full_name;
  console.log("Repo received:", repo);
  if(!repo) {
    console.log("Invalid Github payload");
    return;
  }

  try{
    console.log("Calling API for full details");

    const response = await axios.post("http://localhost:4000/enrich/github" , {
      repo
    });

    console.log("ENRICHMENT RESPONSE:", Object.keys(response.data));

    const repoDetails = response.data.repoDetails;
    const readme = response.data.readme;

    console.log("=================================");
    console.log("README RECEIVED IN HANDLER:", readme?.slice(0, 100));
    console.log("=================================");



    const parsed = extractReadmeData(readme);

    console.log("PARSED README:", parsed);


      const fullData ={
        repo,
        name : repoDetails.name,
        description: repoDetails.description,
        readmeSummary : parsed.description,
        features : parsed.features,
      };

      console.log("FINAL DATA GOING TO QUEUE:", fullData);


      if(!hasChanged(repo , fullData)){
        console.log("Github data has not changed");
        return;
      }

      channel.sendToQueue(
        "normalization_queue" , 
        Buffer.from(
          JSON.stringify({
            source:"github", 
            payload ,
            fullData
          })
        ), 
        {persistent : true}
      );

      console.log("Github sent to Normalization_Queue");
  }
  catch(err){
    console.log("Github error:" , err.message);
  }
};