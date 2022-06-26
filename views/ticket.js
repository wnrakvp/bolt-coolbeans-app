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
                        }
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

exports.updateView = (body, client, logger) =>{
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
            "blocks": [
                {
                    "type": "section",
                    "fields": [
                        {
                            "type": "mrkdwn",
                            "text": "*Type:*\n Main Material"
                        },
                        {
                            "type": "mrkdwn",
                            "text": "*Last Updated*\n N/A"
                        }
                    ]
                },
                {
                    "type": "divider"
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "*Coffee* (Remaining : X )"
                    },
                    "accessory": {
                        "type": "static_select",
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Select a value",
                            "emoji": true
                        },
                        "options": [
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "0",
                                    "emoji": true
                                },
                                "value": "0"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "1",
                                    "emoji": true
                                },
                                "value": "1"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "2",
                                    "emoji": true
                                },
                                "value": "2"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "3",
                                    "emoji": true
                                },
                                "value": "3"
                            }
                        ],
                        "action_id": "updateAmount"
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "*Coffee* (Remaining : X )"
                    },
                    "accessory": {
                        "type": "static_select",
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Select a value",
                            "emoji": true
                        },
                        "options": [
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "0",
                                    "emoji": true
                                },
                                "value": "0"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "1",
                                    "emoji": true
                                },
                                "value": "1"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "2",
                                    "emoji": true
                                },
                                "value": "2"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "3",
                                    "emoji": true
                                },
                                "value": "3"
                            }
                        ],
                        "action_id": "updateAmount"
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
}   catch (e) {
    logger.error(e);
}
}
module.exports = exports;