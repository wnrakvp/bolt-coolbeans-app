exports.listenerSlack = (app, googleSheets, authGoogle, spreadsheetId) => {
  const {
    getStockfromGoogleSheet,
    updateStockToGoogleSheet,
  } = require("../controller/stock");
  const fs = require('fs');
  const authenticateUser = require("../middleware/auth");
  const { homeView } = require("../views/home");
  const { modalView, updateView } = require("../views/ticket");
  // Listen to the app_home_opened Events API event to hear when a user opens your app from the sidebar
    app.event("app_home_opened", authenticateUser, async ({ client, logger }) => {
        const initialView = {};
        initialView.currentStock = "-";
        initialView.currentAmount = "-";
        initialView.currentPrice = "-";
        initialView.totalPrice = "0";
        initialView.lastUpdated = "-";
        try {
        await getStockfromGoogleSheet(googleSheets, authGoogle, spreadsheetId);
        await homeView(
            userId,
            client,
            initialView
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
            `Looking for ${payload.selected_option.value} Type in db.json`
        );
        const updateView = {};
        updateView.currentStock = "";
        updateView.currentAmount = "";
        updateView.currentPrice = "";
        updateView.totalPrice = 0;
        updateView.lastUpdated = "";
        const data = JSON.parse(fs.readFileSync('db.json','utf-8'));
        // console.log(data);
        const stocks = data.filter((stock) => stock.type.value === payload.selected_option.value);
        stocks.forEach((item) => {
            updateView.currentStock += `${item.stock.value}\n`;
            updateView.currentAmount += `${item.remaining.value}\n`;
            updateView.currentPrice += `0 Baht\n`;
            updateView.totalPrice += 0;
            updateView.lastUpdated = item.lastupdated.value;
        });
        await homeView(
            userId,
            client,
            updateView
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
        await getStockfromGoogleSheet(googleSheets, authGoogle, spreadsheetId);
        await modalView(body, client, logger);
        // await say(`${command.text}`);
    });

    app.action("selectStock", async ({ ack, body, payload, client, logger }) => {
        await ack();
        // console.log(payload.selected_option.value);
        const data = JSON.parse(fs.readFileSync('db.json','utf-8'));
        const stocks = data.filter((stock) => stock.type.value === payload.selected_option.value);
        // console.log(stocks);
        const items = {};
        stocks.forEach((item) => {
        type = item.type.value;
        updated = item.lastupdated.value;
        items[item.stock.value] = item.remaining.value;
        });
        // console.log(items);
        await updateView(body, client, logger, type, updated, items);
    });

    app.view("updatestock", async ({ ack, payload }) => {
        await ack();
        const updateData = [];
        const data = JSON.parse(fs.readFileSync('db.json','utf-8'));
        const stocks = data.filter((stock) => stock.type.value === payload.blocks[1].fields[1].text);
        stocks.forEach((filterstock) => {
            updateData.push({"range" : `Stock Calculation!${filterstock.remaining.index}:${filterstock.lastupdated.index}`})
        });
        Object.entries(payload.state.values).forEach((item, index) => {
            updateData[index].values = [[item[1].updateAmount.selected_option.value,new Date().toISOString().slice(0,10)]];
        });
        // console.log(updateData);
        await updateStockToGoogleSheet(googleSheets, authGoogle, spreadsheetId, updateData);
    });

    app.action("updateAmount", async ({ ack }) => {
        await ack();
    });

    app.error(async (error) => {
    // Check the details of the error to handle cases where you should retry sending a message or stop the app
    console.error(error);
  });
};
