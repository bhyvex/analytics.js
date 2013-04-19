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
			load('http://www.adobetag.com/d1/globo/live/Globo.js', ready);
		}
		
    // Adobe Audience Manager just uses a queue, so it's ready right away.
    ready();
  },

  track : function (event, properties) {
    event || (event = '');
    properties || (properties = {});

		gDil.api.signals(event, "c_")
		gDil.api.signals(properties, "c_")
		gDil.api.submit();
  }
});