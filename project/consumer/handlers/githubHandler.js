const axios = require("axios");
const { hasChanged } = require("../hashStore");

module.exports = async function (data, channel) {
  const { payload } = data;

  const repo = payload.repository?.full_name;
  if (!repo) return console.log("Invalid GitHub payload");

  try {
    const res = await axios.get(`https://api.github.com/repos/${repo}`);
    const fullData = res.data;

    if (!hasChanged(repo, fullData)) {
      console.log("GitHub no change");
      return;
    }

    channel.sendToQueue(
      "normalization_queue",
      Buffer.from(JSON.stringify({ ...data, fullData })),
      { persistent: true }
    );

    console.log("GitHub sent");
  } catch (err) {
    console.error("GitHub error:", err.message);
  }
};