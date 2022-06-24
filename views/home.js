exports.homeView = (userId, client, currentStock, currentAmount, currentPrice, totalPrice, lastUpdated) => {
    // Call the views.publish method using the WebClient passed to listeners
    const result = client.views.publish({
      user_id: userId,
      view: {
        type: 'home',
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: 'Stock Level',
              emoji: true,
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'Please choose your Stock type',
            },
            accessory: {
              type: 'static_select',
              placeholder: {
                type: 'plain_text',
                text: 'Select an item',
                emoji: true,
              },
              options: [
                {
                  text: {
                    type: 'plain_text',
                    text: 'Coffee Beans',
                    emoji: true,
                  },
                  value: 'CoffeeBeans',
                },
                {
                  text: {
                    type: 'plain_text',
                    text: 'Dairy',
                    emoji: true,
                  },
                  value: 'Dairy',
                },
                {
                  text: {
                    type: 'plain_text',
                    text: 'Sweetened',
                    emoji: true,
                  },
                  value: 'Sweetened',
                },
                {
                  text: {
                    type: 'plain_text',
                    text: 'Packaging',
                    emoji: true,
                  },
                  value: 'Packaging',
                },
              ],
              action_id: 'getStocks',
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `*Current Items*\n${currentStock}`,
              },
              {
                type: 'mrkdwn',
                text: " ",
              },
              {
                type: 'mrkdwn',
                text: `*Amount*\n${currentAmount}`,
              },
              {
                type: 'mrkdwn',
                text: " ",
              },
              {
                type: 'mrkdwn',
                text: `*Inventory Cost*\n${currentPrice}`,
              },
            ],
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: '*Total Inventory Cost*',
              },
              {
                type: 'plain_text',
                text: `${totalPrice}  Baht`,
              },
            ],
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: '*Last Updated At*',
              },
              {
                type: 'plain_text',
                text: `${lastUpdated}`,
              },
            ],
          },
          {
            type: 'divider',
          },
        ],
      },
    });
    return result;
  };

  module.exports = exports;