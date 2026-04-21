const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

app.post("/enrich/github", async (req, res) => {
    const { repo } = req.body;

    try {
        console.log("Received repo:", repo); 

        if (!repo || !repo.includes("/")) {
            return res.status(400).json({ error: "Invalid repo format. Expected 'owner/repository'." });
        }

        const githubRes = await axios.get(
            `https://api.github.com/repos/${repo}`,
            {
                headers: {
                    Authorization: `Bearer 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`
                }
            }
        );

        res.json({
            repoDetails: githubRes.data
        });
    } catch (err) {
        console.error("Enrichment Failed:", err.message);

        if (err.response && err.response.status === 404) {
            res.status(404).json({ error: "Repository not found. Please check the repo name." });
        } else {
            res.status(500).json({ error: "Internal Server Error. Please try again later." });
        }
    }
});

app.listen(3000, () => {
    console.log("Github enrichment service running");
});