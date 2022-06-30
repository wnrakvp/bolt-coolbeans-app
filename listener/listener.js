exports.listenerSlack = (app, googleSheets, authGoogle, spreadsheetId) => {
  const {
    getStockfromGoogleSheet,
    updateStockToGoogleSheet,
  } = require("../controller/stock");
  const authenticateUser = require("../middleware/auth");
  const { homeView } = require("../views/home");
  const { modalView, updateView } = require("../views/ticket");
  // Listen to the app_home_opened Events API event to hear when a user opens your app from the sidebar
    app.event("app_home_opened", authenticateUser, async ({ client, logger }) => {
        const currentStock = "-";
        const currentAmount = "-";
        const currentPrice = "-";
        const totalPrice = "0";
        const lastUpdated = "-";
        try {
        // await updateStockToGoogleSheet();
        await homeView(
            userId,
            client,
            currentStock,
            currentAmount,
            currentPrice,
            totalPrice,
            lastUpdated
        );
        } catch (e) {
        logger.error(e.message);
        }
    });

    app.action("getStocks", async ({ ack, payload, client, logger }) => {
        try {
        // Acknowledge the action
        await ack();
        logger.info(
            `Looking for ${payload.selected_option.value} Type in Google Sheet`
        );
        let currentStock = "";
        let currentAmount = "";
        let currentPrice = "";
        let totalPrice = 0;
        let lastUpdated = "";
        const stocks = await getStockfromGoogleSheet(
            googleSheets,
            authGoogle,
            spreadsheetId,
            payload
        );
        stocks.forEach((stock) => {
            currentStock += `${stock[0]}\n`;
            currentAmount += `${stock[2]}\n`;
            currentPrice += `0 Baht\n`;
            totalPrice += stock[3] * stock[2];
            lastUpdated = stock[3];
        });
        await homeView(
            userId,
            client,
            currentStock,
            currentAmount,
            currentPrice,
            totalPrice,
            lastUpdated
        );
        logger.info(
            `User: ${userId} has viewed your ${payload.selected_option.value} Stocks`
        );
        } catch (e) {
        logger.error(e.message);
        }
    });

    app.command("/update", async ({ ack, body, client, logger }) => {
        // Acknowledge command request
        await ack();
        await modalView(body, client, logger);
        // await say(`${command.text}`);
    });

    app.action("selectStock", async ({ ack, body, payload, client, logger }) => {
        await ack();
        // console.log(payload.selected_option.value);
        const stocks =await getStockfromGoogleSheet(
            googleSheets,
            authGoogle,
            spreadsheetId,
            payload
        );
        // console.log(stocks);
        const items = {};
        stocks.forEach((stock) => {
        console.log(stock);
        type = stock[1];
        updated = stock[3];
        items[stock[0]] = stock[2];
        });
        // console.log(items);
        await updateView(body, client, logger, type, updated, items);
    });

    app.view("updatestock", async ({ ack, payload }) => {
        await ack();
        Object.entries(payload.state.values).forEach((item) => {
        console.log(item[1].updateAmount.selected_option.value);
        });
    });

    app.action("updateAmount", async ({ ack }) => {
        await ack();
    });

    app.error(async (error) => {
    // Check the details of the error to handle cases where you should retry sending a message or stop the app
    console.error(error);
  });
};
