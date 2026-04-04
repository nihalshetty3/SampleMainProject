const {pushToQueue} = require("../queue/rabitMQ");

module.exports = async function jiraConnector(req, res){
    try{
        await pushToQueue({
            source:"jira", 
            payload: req.body
        });

        res.sendStatus(200);
    }
    catch(err){
        console.log("Jira Error:", err);
        res.sendStatus(500);
    }
};