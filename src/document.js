const request = require('request');
const xml2js = require('xml2js').parseString;

module.exports = class document {
  constructor(shopID) {
    this.resolveTable = {
      'impressum': 'Impressum',
      'agb': 'AGB',
      'html': 'Html',
      'text': 'Text',
      'html-lite': 'HtmlLite',
      'pdf': 'Pdf'
    }
    this.shopID = shopID;
  }

  resolve(name) {
    return this.resolveTable[name];
  }

  getDocument(name, format, callback) {
    this.fetch(this.resolve(name), this.resolve(format), callback)
  }

  fetch(name, format, callback) {
    var url = 'https://www.protectedshops.de/api/?Request=GetDocument&ShopId='+this.shopID+'&Document='+name+'&Format='+format;
    request
      .get(url, function(error, response, body) {
        if(response.statusCode == 200) {
          xml2js(body, function(err, result) {
            callback(result['Response']['Document']);
          });
        } else {
          callback('');
        }
      });
  }
}
