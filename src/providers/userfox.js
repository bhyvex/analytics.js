// https://www.userfox.com/docs/

var Provider = require('../provider')
  , extend   = require('extend')
  , load     = require('load-script')
  , isEmail  = require('is-email');


module.exports = Provider.extend({

  name : 'userfox',

  key : 'clientId',

  defaults : {
    // userfox's required key.
    clientId : null
  },

  initialize : function (options, ready) {
    window._ufq = window._ufq || [];
    load('//d2y71mjhnajxcg.cloudfront.net/js/userfox-stable.js');

    // userfox creates its own queue, so we're ready right away.
    ready();
  },

  identify : function (userId, traits) {
    if (!traits.email) return;

    // Initialize the library with the email now that we have it.
    window._ufq.push(['init', {
      clientId : this.options.clientId,
      email    : traits.email
    }]);

    // Record traits to "track" if we have the required signup date `created`.
    // userfox takes `signup_date` as a string of seconds since the epoch.
    if (traits.created) {
      traits.signup_date = (traits.created.getTime() / 1000).toString();
      delete traits.created;
      window._ufq.push(['track', traits]);
    }
  }

});
