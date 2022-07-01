const inputView = require('./input');

exports.modalView = (body, client, logger) =>{
    try {
    // Call views.open with the built-in client
    const result = client.views.open({
      // Pass a valid trigger_id within 3 seconds of receiving it
      trigger_id: body.trigger_id,
      // View payload
      view: {
        "type": "modal",
        "callback_id": "updatestock",
        "title": {
            "type": "plain_text",
            "text": "Stock Card"
        },
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "Please choose stock type"
                },
                "accessory": {
                    "type": "static_select",
                    "placeholder": {
                        "type": "plain_text",
                        "text": "Select an item",
                        "emoji": true
                    },
                    "options": [
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "Main Material",
                                "emoji": true
                            },
                            "value": "Main Material"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "Sub-Material",
                                "emoji": true
                            },
                            "value": "Sub-Material"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "Packaging",
                                "emoji": true
                            },
                            "value": "Packaging"
                        },
                    ],
                    "action_id": "selectStock"
                }
            }
        ]
    }
    });
    return result;
  }
  catch (error) {
    logger.error(error);
  }
};

exports.updateView = (body, client, logger, updateModal) =>{
    const blocks = [
		{
			"type": "section",
			"fields": [
				{
					"type": "mrkdwn",
					"text": "*Last Updated*"
				},
				{
					"type": "mrkdwn",
					"text": `${updateModal.updated}`
				}
			]
		},
		{
			"type": "section",
			"fields": [
				{
					"type": "mrkdwn",
					"text": "*Type*"
				},
				{
					"type": "mrkdwn",
					"text": `${updateModal.type}`
				}
			]
		},
		{
			"type": "divider"
		}
	];
    Object.entries(updateModal.items).forEach(([key,val]) => {
       blocks.push(inputView(key,val));
    });
    try {
    // Call views.open with the built-in client
    const result = client.views.push({
      trigger_id: body.trigger_id,
      // Pass a valid trigger_id within 3 seconds of receiving it
    //   view_id: body.view.id,
      // Pass the current hash to avoid race conditions
    //   hash: body.view.hash,
      // View payload
        view: {
            "title": {
                "type": "plain_text",
                "text": "Stock Card"
            },
            "type": "modal",
            "callback_id": "updatestock",
            "blocks": blocks,
            "submit": {
                "type": "plain_text",
                "text": "Submit"
            }
        }
    });
    return result;
}   catch (e) {
    logger.error(e.message);
}
}
module.exports = exports;