/**
 * Fucking Instagram API so Remarketing Tool Component.
 * Shota Niimi <info@uz.net>
 * copyright 2018 Shota Niimi
 */
 
function totalReplace() {
  var sheet1 = SpreadsheetApp.getActive().getSheetByName("app");
  var sheet2 = SpreadsheetApp.getActive().getSheetByName("query");

  //スクレイピングでパースしたUnixTimeDATA型へ変換
  var a1 = sheet1.getRange(3,8).getValue().replace("1519807879",unixTime2ymd);
  sheet1.getRange(3,8).setValue(a1);
  //uinflist.push(unixTime2ymd(rowdata["created_time"]));
}


//  var rangeX = getSheet.getRange("D2:D").getValues();
//  var rangeY = getSheet.getRange("I2:I").getValues();
//  
//  for(var i=0; i < rangeX.length, i < rangeY.length; i++) {
//    insertSheet.getRange(i+2,1).setValue(rangeX[i]);
//    insertSheet.getRange(i+2,2).setValue(rangeY[i]);
//  }

//  var rangeFw = getSheet2.getRange("D3").getValue();
//  var lastRow = insertSheet.getLastRow();
//  for(var i = lastRow; i >= 1; i--){ //シートの最終行を取得して「app」のフォロワー数を代入
//    var rng = insertSheet.getRange(i, 3);
//      var getLCell = rng.getValue();
//      rng.setValue(rangeFw);
//      Logger.log(getLCell);
//      break;
//  }


function scrapeHash() {  //湯快リゾートハッシュタグの総数取得しパース  
  var sheetQuery = SpreadsheetApp.getActive().getSheetByName("query");
  var lastRow = sheetQuery.getLastRow();
  
  var getUrl = 'https://www.instagram.com/explore/tags/%E6%B9%AF%E5%BF%AB%E3%83%AA%E3%82%BE%E3%83%BC%E3%83%88/';
  var response = UrlFetchApp.fetch(getUrl);
  var getBody = response.getContentText();
  var regExp  = new RegExp("count\":\s*(.*?)\s*page_info", "g" );
  var regReturn  = getBody.match(regExp);
  var regExtract  = String(regReturn).match(/[0-9]+/g, "");
  sheetQuery.getRange('D' + String(lastRow)).setValue(regExtract);
}