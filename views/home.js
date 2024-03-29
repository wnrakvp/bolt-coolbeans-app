exports.homeView = (userId, client, view) => {
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
        // {
        //   type: 'section',
        //   text: {
        //     type: 'mrkdwn',
        //     text: ' ',
        //   },
        //   accessory: {
        //     type: 'button',
        //     text: {
        //       type: 'plain_text',
        //       text: 'Refresh',
        //     },
        //     style: 'primary',
        //     action_id: 'refresh',
        //   },
        // },
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
                  text: 'Main Material',
                  emoji: true,
                },
                value: 'Main Material',
              },
              {
                text: {
                  type: 'plain_text',
                  text: 'Sub-Material',
                  emoji: true,
                },
                value: 'Sub-Material',
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
              text: `*Current Items*\n${view.currentStock}`,
            },
            {
              type: 'mrkdwn',
              text: ' ',
            },
            {
              type: 'mrkdwn',
              text: `*Remaining*\n${view.currentAmount}`,
            },
            {
              type: 'mrkdwn',
              text: ' ',
            },
            {
              type: 'mrkdwn',
              text: `*Status*\n${view.currentStatus}`,
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
              text: `${view.totalPrice}  Baht`,
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
              text: `${view.lastUpdated}`,
            },
          ],
        },
        {
          type: 'divider',
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Anything wrong? Please click this button',
          },
          accessory: {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Update Stock',
            },
            style: 'danger',
            action_id: 'update',
          },
        },
      ],
    },
  });
  return result;
};
