const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

app.post("/enrich/github" , async (req , res) => {
    const {repo} = req.body;

    try{
        const githubRes = await axios.get(
            `https://api.github.com/repos/${repo}`,
            {
                headers:{
                    Authorization: `Beaerer YOUR_GITHUB_TOKEN`
                }
            }
        );

        res.json({
            repoDetails : githubRes.data
        });
    }
    catch(err)
    {
        console.error("Enrichment Failed:" , err.message);
        res.status(500).json({error : "Failed to enrich data"});
    }
});

app.listen(4000 , () =>{
    console.log("Github enrichment service running");
})