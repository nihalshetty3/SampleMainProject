const axios = require("axios");
const {hasChanged} = require("../hashStore");

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

      const fullData = response.data.repoDetails;

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