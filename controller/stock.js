// Query from Google Sheet
// Read rows from spreadsheet
const fs = require('fs');
exports.updateViewinHomeTab = async (payload) => {
  try {
    const updateView = {};
    updateView.currentStock = '';
    updateView.currentAmount = '';
    updateView.currentStatus = '';
    updateView.totalPrice = 0;
    updateView.lastUpdated = '';
    const data = JSON.parse(fs.readFileSync('db.json', 'utf-8'));
    // console.log(data);
    const stocks = data.filter(
      (stock) => stock.type.value === payload.selected_option.value
    );
    stocks.forEach((item) => {
      if (parseInt(item.remaining.value) > 10) {
        updateView.currentStatus += `Okay\n`;
      } else if (parseInt(item.remaining.value) > 5 ) { 
      updateView.currentStatus += `Medium\n`;
      } else {
      updateView.currentStatus += `Need to Order !\n`;
      }
      updateView.currentStock += `${item.stock.value}\n`;
      updateView.currentAmount += `${item.remaining.value}\n`; 
      updateView.totalPrice += 0;
      updateView.lastUpdated = item.lastupdated.value;
    });
    return updateView;
  } catch (e) {
    console.log(e.message);
  }
};
exports.updateViewinModalTab = async (payload) => {
  try {
    const data = JSON.parse(fs.readFileSync('db.json', 'utf-8'));
    const stocks = data.filter(
      (stock) => stock.type.value === payload.selected_option.value
    );
    // console.log(stocks);
    const updateModal = {}
    const items = {};
    stocks.forEach((item) => {
      updateModal.type = item.type.value;
      updateModal.updated = item.lastupdated.value;
      items[item.stock.value] = item.remaining.value;
    });
    updateModal.items = items;
    // console.log(updateModal);
    return updateModal;
  } catch (e) {
    console.log(e.message);
  }
};
exports.getStockfromGoogleSheet = async (
  googleSheets,
  authGoogle,
  spreadsheetId,
  payload
) => {
  try {
    const datas = [];
    const response = await googleSheets.spreadsheets.values.get({
      auth: authGoogle,
      spreadsheetId,
      range: 'Stock Calculation!B:E',
    });
    const rows = response.data.values.filter((row) => row.length === 4);
    rows.forEach((row, i) => {
      let index = i + 2;
      datas.push({
        stock: {
          value: row[0],
          index: `B${index}`,
        },
        type: {
          value: row[1],
          index: `C${index}`,
        },
        remaining: {
          value: row[2],
          index: `D${index}`,
        },
        lastupdated: {
          value: row[3],
          index: `E${index}`,
        },
      });
    });
    fs.writeFile('db.json', JSON.stringify(datas), (err) => {
      if (err) throw err;
      console.log('db.json Sync with Google Sheet!');
    });
    return console.log('Get Stocks Completed!');
  } catch (e) {
    console.log(e.message);
  }
};

// Read and Update from spreadsheet
exports.updateStockToGoogleSheet = async (
  googleSheets,
  authGoogle,
  spreadsheetId,
  payload
) => {
  try {
    const updateData = [];
    const data = JSON.parse(fs.readFileSync('db.json', 'utf-8'));
    const stocks = data.filter(
      (stock) => stock.type.value === payload.blocks[1].fields[1].text
    );
    stocks.forEach((filterstock) => {
      updateData.push({
        range: `Stock Calculation!${filterstock.remaining.index}:${filterstock.lastupdated.index}`,
      });
    });
    Object.entries(payload.state.values).forEach((item, index) => {
      let amount = '';
      if (item[1].updateAmount.selected_option.value === null) {
        amount = stocks[index].remaining.value;
      } else {
        amount = item[1].updateAmount.selected_option.value;
      }
      updateData[index].values = [
        [
          amount,
          new Date().toISOString().slice(0, 10),
        ],
      ];
    });
    const response = await googleSheets.spreadsheets.values.batchUpdate({
      auth: authGoogle,
      spreadsheetId,
      requestBody: {
        valueInputOption: 'USER_ENTERED',
        data: updateData,
      },
    });
    console.log(response.statusText);
    return response;
  } catch (e) {
    console.log(e.message);
  }
};
