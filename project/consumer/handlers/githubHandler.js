const { hasChanged } = require("../hashStore");

module.exports = async function (data, channel) {
  const { payload } = data;

  const repo = payload.repository?.full_name;
  if (!repo) {
    console.log("Invalid GitHub payload");
    return;
  }

  try {
    const fullData = {
      repository: payload.repository,
      commits: payload.commits,
      head_commit: payload.head_commit,
      pusher: payload.pusher,
      ref: payload.ref
    };

    if (!hasChanged(repo, fullData)) {
      console.log("GitHub no change");
      return;
    }

    channel.sendToQueue(
      "normalization_queue",
      Buffer.from(
        JSON.stringify({
          source: "github",
          repo,
          fullData
        })
      ),
      { persistent: true }
    );

    console.log("GitHub sent to normalization_queue");
  } catch (err) {
    console.error("GitHub error:", err.message);
  }
};