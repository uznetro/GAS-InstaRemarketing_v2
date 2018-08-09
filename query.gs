function queryData() {//セル内関数でスクレイピングしていると、データ取得しグラフ化できない？ので
  var getSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("activeSheet");
  var getSheet2 = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("app");
  var insertSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("query");
  var rangeX = getSheet.getRange("D2:D").getValues();
  var rangeY = getSheet.getRange("I2:I").getValues();
  
  for(var i=0; i < rangeX.length, i < rangeY.length; i++) {
    insertSheet.getRange(i+2,1).setValue(rangeX[i]);
    insertSheet.getRange(i+2,2).setValue(rangeY[i]);
  }
    
  var rangeFw = getSheet2.getRange("D3").getValue();
  var lastRow = insertSheet.getLastRow();
  for(var i = lastRow; i >= 1; i--){ //シートの最終行を取得して「app」のフォロワー数を代入
    var rng = insertSheet.getRange(i, 3);
      var getLCell = rng.getValue();
      rng.setValue(rangeFw);
      Logger.log(getLCell);
      break;
  }
}