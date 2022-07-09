const { filterStockType } = require("../controller/stock");

exports.notifyToChannel = async (channelId, client, payload) => {
    const blocks = [
		{
			"type": "header",
			"text": {
				"type": "plain_text",
				"text": `Stock type: ${payload.blocks[1].fields[1].text}`,
			}
		},
        {
			"type": "section",
			"text": {
				"type": "plain_text",
				"text": `Last updated at : ${new Date().toISOString().slice(0,10)}`
			}
		},
		{
			"type": "divider"
		}
	];
    const stocks = filterStockType(payload);
    stocks.forEach((item) => {
        blocks.push(
            {
                "type": "context",
                "elements": [
                    {
                        "type": "mrkdwn",
                        "text": `*${item.stock.value}*`
                    },
                    {
                        "type": "mrkdwn",
                        "text": `Remaining : ${item.remaining.value}`
                    }
                ]
            },
        );
    });
    blocks.push({
        "type": "divider"
    },
    {
        "type": "context",
        "elements": [
            {
                "type": "plain_text",
                "text": `Created by CoolbeansAPP at ${new Date()}`
            }
        ]
    });
    const result = await client.chat.postMessage({
        channel: channelId,
        text: `Your Stock has been updated at ${new Date().toISOString().slice(0,10)}.`,
        blocks
      });
}