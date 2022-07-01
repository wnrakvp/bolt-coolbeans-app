// Query from Google Sheet
// Read rows from spreadsheet
const fs = require('fs');
const data = require('../db.json');
exports.getStockfromGoogleSheet = async (googleSheets,authGoogle,spreadsheetId,payload) => {
  try {
  const datas = [];
  const response = await googleSheets.spreadsheets.values.get({
    auth: authGoogle,
    spreadsheetId,
    range: "Stock Calculation!B:E",
  });
  const rows = response.data.values.filter((row) => row.length === 4);
  rows.forEach((row,i) => {
    let index = i + 2;
    datas.push(
      {
      "stock": {
        "value": row[0],
        "index": `B${index}`
      },
      "type": { 
        "value": row[1],
        "index": `C${index}`
      },
      "remaining": {
        "value": row[2],
        "index": `D${index}`
      },
      "lastupdated": {
        "value": row[3],
        "index": `E${index}`
      }
      }
    )
    });
  fs.writeFile('db.json', JSON.stringify(datas), (err) => {
    if (err) throw err;
    console.log('db.json Sync with Google Sheet!');
  });
  return data;
  } catch (e) {
  console.log(e.message);
  }
}

// Read and Update from spreadsheet
exports.updateStockToGoogleSheet = async (googleSheets,authGoogle,spreadsheetId, updateData) => {
  try {
    const response = await googleSheets.spreadsheets.values.batchUpdate({
      auth: authGoogle,
      spreadsheetId,
      requestBody: {
        valueInputOption: "USER_ENTERED",
        data: updateData,
      },
    });
    // const response = await googleSheets.spreadsheets.developerMetadata.get({
    //   auth: authGoogle,
    //   spreadsheetId,
    //   metadataId: 1,
    // });
    console.log(response.status)
    return response;
  } catch (e) {
    console.log(e.message);
  }
}
