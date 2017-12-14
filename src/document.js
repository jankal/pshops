const axios = require('axios');
const parseString = require('xml2js').parseString;

module.exports = class Document {
  constructor(shopID) {
    this.resolveTable = {
      'impressum': 'Impressum',
      'agb': 'AGB',
      'datenschutz': 'Datenschutz',
      'widerruf': 'Widerruf',
      'versandinfo': 'Versandinfo',
      'batteriegesetz': 'Batteriegesetz',
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

  getDocument(name, format) {
    return this.fetch(this.resolve(name), this.resolve(format));
  }

  fetch(name, format) {
    const shopID = this.shopID;
    return new Promise(function (resolve, reject) {
      axios.get('https://www.protectedshops.de/api/', {
        params: {
          Request: 'GetDocument',
          ShopId: shopID,
          'Document': name,
          Format: format
        }
      }).then(function (response) {
        if(response.status == 200) {
          parseString(response.data, function (error, result) {
            if (error) {
              reject(error);
            } else {
              resolve(result['Response']['Document'][0]);
            }
          });
        }
      }).catch(function (error) {
        reject(error);
      });
    });
  }
}
