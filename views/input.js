exports = function inputView(itemName,amount) {
return {
    "type": "section",
    "text": {
        "type": "mrkdwn",
        "text": `*${itemName}* (Remaining : ${amount})`
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
            },
            {
                "text": {
                    "type": "plain_text",
                    "text": "4",
                    "emoji": true
                },
                "value": "4"
            },
            {
                "text": {
                    "type": "plain_text",
                    "text": "5",
                    "emoji": true
                },
                "value": "5"
            },
            {
                "text": {
                    "type": "plain_text",
                    "text": "6",
                    "emoji": true
                },
                "value": "6"
            },
            {
                "text": {
                    "type": "plain_text",
                    "text": "7",
                    "emoji": true
                },
                "value": "7"
            },
            {
                "text": {
                    "type": "plain_text",
                    "text": "8",
                    "emoji": true
                },
                "value": "8"
            },
            {
                "text": {
                    "type": "plain_text",
                    "text": "9",
                    "emoji": true
                },
                "value": "9"
            },
            {
                "text": {
                    "type": "plain_text",
                    "text": "10",
                    "emoji": true
                },
                "value": "10"
            }
        ],
        "action_id": "updateAmount"
    }
}
}

module.exports = exports;