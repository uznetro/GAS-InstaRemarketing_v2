/**
 * Fucking Instagram API so Remarketing Tool Core.
 * Shota Niimi <info@uz.net>
 * copyright 2018 Shota Niimi
 */

//AccsessTokenが有効期限切れするので注意（期間不明）
//var url = 'https://api.instagram.com/v1/users/self/media/recent?access_token=*********:.**********.f4ec62e6f0de4a05a763217b67db7f3f';
var ENDPOINT = "https://api.instagram.com/v1";
var token    = "*********:.**********.f4ec62e6f0de4a05a763217b67db7f3f";

function getData(){

  var resultf = requestInsta('/users/self/media/recent?access_token='+ token , 'GET');      
  var result  = JSON.stringify(resultf);
  //Logger.log(result);
  
  var values = [];
  var cnt = 1;
 
  //Logger.log(resultf.object);
  for (var key in resultf){
    for (var key2 in resultf[key]["data"]){
      //Logger.log(resultf[key]["data"][key2]);
      var rowdata = resultf[key]["data"][key2];
      var uinflist = [];
      uinflist.push(rowdata["caption"]["id"]);
      if(rowdata["caption"]){
        uinflist.push(rowdata["caption"]["text"]);
      }else{
        uinflist.push("--");
      }
      uinflist.push(rowdata["link"]);
      uinflist.push(unixTime2ymd(rowdata["created_time"]));
      uinflist.push(rowdata["likes"]["count"]);
      uinflist.push(rowdata["comments"]["count"]);
      //uinflist.push(rowdata["images"]["standard_resolution"]["url"]);
      uinflist.push("=IMAGE("+'"'+rowdata["images"]["standard_resolution"]["url"]+'"'+")");
      uinflist.push(rowdata["tags"].join('／'));
      values.push(uinflist);
    }
  }

  var sheet = SpreadsheetApp.getActive().getSheetByName("activeSheet");
  var lastRow = sheet.getLastRow();//シートの最終行を取得
  //var rows = values.length;
  //var cols = uinflist.length;
  var val  = values[0];
  Logger.log(val);
  //var srange = sheet.getRange(2, 1, rows, cols);
  //srange.setValues(values[0]);
  
  //sheet.insertRows(values[0]);
  //Logger.log(val[0]);
  
  //var colA = sheet.getRange("A2:A").getValues();
  //for(var i=0; i < colA.length; i++) {
    //var colA = sheet.getRange(i,1).getValues();
    //Logger.log(colA[i]);
    //Logger.log(val[0]);
  //}
    
    for(var i = lastRow; i >= 1; i--){ //シートの最終行を取得
      var rng = sheet.getRange(i, 1);
      if(rng.getValue() != ''){
        var getLCell = rng.getValue();
        break;
      }
    }
    if (getLCell == val[0]) { //A列に同じ投稿IDがあるか判定
      Logger.log("等しい");
    } else {
      Logger.log("違う");
      sheet.appendRow(values[0]);
    }
    
} //End func getData


function copyLastRow() { //スクレイピングの関数セルコピー
  var sheet = SpreadsheetApp.getActive().getSheetByName("activeSheet");
  var lastRow = sheet.getLastRow();
  sheet.getRange(2, 9).copyTo(sheet.getRange(lastRow,9));
  sheet.getRange(2, 10).copyTo(sheet.getRange(lastRow,10));
  sheet.getRange(2, 15).copyTo(sheet.getRange(lastRow,15));
}


function btnEvent() {
  getData();
  copyLastRow();
}


function requestInsta(path, method) { // api crient get json
  var url = ENDPOINT + path;
  var urlFetchOption = {
    'method' : (method || 'get'),    
    'contentType' : 'application/json; charset=utf-8',
    'muteHttpExceptions' : true
  };

  var response = UrlFetchApp.fetch(url, urlFetchOption);
  try {
    return {
      responseCode : response.getResponseCode(),
      rateLimit : {
        limit : response.getHeaders()['X-RateLimit-Limit'],
        remaining : response.getHeaders()['X-RateLimit-Remaining'],
      },
      parseError : false,
      body : JSON.parse(response.getContentText()),
      bodyText : response.getContentText()
    };
  } catch(e) {
    return {
      responseCode : response.getResponseCode(),
      rateLimit : {
        limit : response.getHeaders()['X-RateLimit-Limit'],
        remaining : response.getHeaders()['X-RateLimit-Remaining'],
      },      
      // 何らかのエラーが発生した場合、parseError=trueにする
      parseError : true,
      // JSON.parse(response.getContent())で落ちる時があるので、そん時はbody=null返す
      // TODO:ただ、今は呼出元でnull返しの対処はしてない。。。
      body : null,
      bodyText : response.getContentText()
    };
  }
}

//
//unix time to Y-M-d-h-m-s
//
function unixTime2ymd(intTime){
    // var d = new Date( intTime );
    var d = new Date( intTime * 1000 );
    var year  = d.getFullYear();
    var month = d.getMonth() + 1;
    var day  = d.getDate();
    var hour = ( '0' + d.getHours() ).slice(-2);
    var min  = ( '0' + d.getMinutes() ).slice(-2);
    var sec   = ( '0' + d.getSeconds() ).slice(-2);
    return( year + '/' + month + '/' + day);
    //return( year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec );
}


//       walkJSON(resultf, function(key, value) {                  
//                      
//       ////投稿日 (別に取る)         
////       if(key === "created_time"){
////           console.log("投稿日" + value);       
////        }
//         
//       //キャプション
//       if(key === "caption"){
//        if(value){          
//          //console.log("タイトル" + value["text"]);
//          uinflist.push(value["text"]);
//        }else{
//          uinflist.push("");
//        }
//       }                    
//       //いいね
//       if(key === "likes" ){
//          //console.log("いいねC" + value["count"]);
//         uinflist.push(value["count"]);
//       }
//       //コメント
//       if(key === "comments"){
//          //console.log("いいねC" + value["count"]);
//         uinflist.push(value["count"]);
//       }       
//       //投稿イメージ
//       if(key === "standard_resolution"){         
//          //console.log("ImagePath" + value["url"]);
//         uinflist.push(value["url"]);
//       }
//       
//       //投稿リンク
//       if(key === "link"){
//          //console.log("投稿リンク" + value);
//         uinflist.push(value);
//          //改行カウント
//         values.push(uinflist);
//         uinflist = [];
//       }
//        
//       });

//
//再起処理
//
var walkJSON = function walkJSON(data, callback){
  for (var key in data) {
    callback(key, data[key]);
    if (typeof data[key] === "object") {
      walkJSON(data[key], callback);
    }
  }
}