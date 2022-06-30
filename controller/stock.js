// Query from Google Sheet
// Read rows from spreadsheet
exports.getStockfromGoogleSheet = async (googleSheets,authGoogle,spreadsheetId,payload) => {
  try {
  const response = await googleSheets.spreadsheets.values.get({
    auth: authGoogle,
    spreadsheetId,
    range: "Stock Calculation!B:E",
  });
  // const responses = getRows.data.values.forEach((response) => {
  //   console.log(response.indexOf(payload.selected_option.value));
  // });
  const stocks = response.data.values.filter((item) => {
    if (item.includes(payload.selected_option.value)) {
      return item;
    }
  });
  return stocks;
  } catch (e) {
  console.log(e.message);
  }
}

// Read and Update from spreadsheet
exports.updateStockToGoogleSheet = async (googleSheets,authGoogle,spreadsheetId) => {
  try {
    const response = await googleSheets.spreadsheets.values.batchUpdate({
      auth: authGoogle,
      spreadsheetId,
      requestBody: {
        valueInputOption: "USER_ENTERED",
        data: [
          {
            range: "Stock Calculation!A49:B49",
            values: [["Test", "Test"]],
          },
        ],
      },
    });
    // const response = await googleSheets.spreadsheets.developerMetadata.get({
    //   auth: authGoogle,
    //   spreadsheetId,
    //   metadataId: 1,
    // });
    console.log(response)
    return response;
  } catch (e) {
    console.log(e.message);
  }
}
