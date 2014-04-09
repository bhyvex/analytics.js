//Resource center da Adobe:
//http://microsite.omniture.com/t2/help/en_US/demdex/whitepapers/dcs_int/index.html#DCS_Integration

//Exemplos de integração:
//http://microsite.omniture.com/t2/help/en_US/demdex/index.html#Send_Data_Elements_to_AudienceManager_With_DIL

var Provider  = require('../provider')
  , load      = require('load-script')


module.exports = Provider.extend({

  name : 'Adobe Audience Manager',

  key : 'partner',

  defaults : {
		partner: null,
		uuidCookie: {}
  },

  initialize : function (options, ready) {
    if (window.gDil === undefined) {
			load('//www.adobetag.com/d1/globo/live/Globo.js', ready); // http and https
		}
  },

  identify : function (userId, traits) {
    var obj = {dpid: 1491, dpuuid: userId};
    gDil.api.aamIdSync(obj);

    if (traits) {
      gDil.api.signals(traits, "c_");
      gDil.api.submit();
    }
  },

  track : function (event, properties) {
    event || (event = '');
    properties || (properties = {});

		gDil.api.signals(event, "c_");
		gDil.api.signals(properties, "c_");
		gDil.api.submit();
  }
});