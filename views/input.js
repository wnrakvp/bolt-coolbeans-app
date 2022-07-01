exports = function inputView(itemName,amount) {
return {
    "type": "section",
    "text": {
        "type": "mrkdwn",
        "text": `${itemName} (Remaining : ${amount})`
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
                },
                "value": "0"
            },
            {
                "text": {
                    "type": "plain_text",
                    "text": "1",
                },
                "value": "1"
            },
            {
                "text": {
                    "type": "plain_text",
                    "text": "2",
                },
                "value": "2"
            },
            {
                "text": {
                    "type": "plain_text",
                    "text": "3",
                },
                "value": "3"
            },
            {
                "text": {
                    "type": "plain_text",
                    "text": "4",
                },
                "value": "4"
            },
            {
                "text": {
                    "type": "plain_text",
                    "text": "5",
                },
                "value": "5"
            },
            {
                "text": {
                    "type": "plain_text",
                    "text": "6",
                },
                "value": "6"
            },
            {
                "text": {
                    "type": "plain_text",
                    "text": "7",
                },
                "value": "7"
            },
            {
                "text": {
                    "type": "plain_text",
                    "text": "8",
                },
                "value": "8"
            },
            {
                "text": {
                    "type": "plain_text",
                    "text": "9",
                },
                "value": "9"
            },
            {
                "text": {
                    "type": "plain_text",
                    "text": "10",
                },
                "value": "10"
            },
            {
                "text": {
                    "type": "plain_text",
                    "text": "11",
                },
                "value": "11"
            },
            {
                "text": {
                    "type": "plain_text",
                    "text": "12",
                },
                "value": "12"
            },
            {
                "text": {
                    "type": "plain_text",
                    "text": "13",
                },
                "value": "13"
            },
            {
                "text": {
                    "type": "plain_text",
                    "text": "14",
                },
                "value": "14"
            },
            {
                "text": {
                    "type": "plain_text",
                    "text": "15",
                },
                "value": "15"
            },
            {
                "text": {
                    "type": "plain_text",
                    "text": "16",
                },
                "value": "16"
            },
            {
                "text": {
                    "type": "plain_text",
                    "text": "17",
                },
                "value": "17"
            },
            {
                "text": {
                    "type": "plain_text",
                    "text": "18",
                },
                "value": "18"
            },
            {
                "text": {
                    "type": "plain_text",
                    "text": "19",
                },
                "value": "19"
            },
            {
                "text": {
                    "type": "plain_text",
                    "text": "20",
                },
                "value": "20"
            }
        ],
        "action_id": "updateAmount"
    }
}
}

module.exports = exports;