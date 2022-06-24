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
                                "text": "*this is plain_text text*",
                                "emoji": true
                            },
                            "value": "value-0"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "*this is plain_text text*",
                                "emoji": true
                            },
                            "value": "value-1"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "*this is plain_text text*",
                                "emoji": true
                            },
                            "value": "value-2"
                        }
                    ],
                    "action_id": "selectStock"
                }
            }
        ],
        "submit": {
            "type": "plain_text",
            "text": "Submit"
        }
    }
    });
    return result;
  }
  catch (error) {
    logger.error(error);
  }
};

module.exports = exports;