// https://developers.google.com/analytics/devguides/collection/gajs/

var Provider  = require('../provider')
  , load      = require('load-script')
  , each      = require('each')
  , type      = require('type')
  , url       = require('url')
  , canonical = require('canonical');


module.exports = Provider.extend({

  name : 'Multi Google Analytics',

  key : 'trackingId',

  defaults : {

    // Your Google Analytics Tracking ID.
    homeTrackingId : null,
		produtoTrackingId : null,		
    // Whether or not to track and initial pageview when initialized.
    homeInitialPageview : true,
   	produtoInitialPageview : true,
    // An optional domain setting, to restrict where events can originate from.
    homeDomain : null,
    produtoDomain : null,
    // Whether to anonymize the IP address collected for the user.
    anonymizeIp : false,
    // Whether to use Google Analytics's Enhanced Link Attribution feature:
    // http://support.google.com/analytics/bin/answer.py?hl=en&answer=2558867
    enhancedLinkAttribution : false,
    // The setting to use for Google Analytics's Site Speed Sample Rate feature:
    // https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiBasicConfiguration#_gat.GA_Tracker_._setSiteSpeedSampleRate
    homeSiteSpeedSampleRate : null,
    produtoSiteSpeedSampleRate : null,
    // Whether to enable GOogle's DoubleClick remarketing feature.
    doubleClick : false,
    // _setCustomVar positions ex: traitsPositions: { ESTADO: 3, FAIXA_ETARIA: 4, SEXO: 5 }
    traitsPositions: null
  },

  initialize : function (options, ready) {

    window.MultiGoogleAnalytics = window.MultiGoogleAnalytics || {};

    window._gaq = window._gaq || [];
    
		window._gaq.push(['_setAccount', options.homeTrackingId]);
    // Apply a bunch of optional settings.
    if (options.homeDomain) {
      window._gaq.push(['_setDomainName', options.homeDomain]);
    }    
		if (type(options.homeSiteSpeedSampleRate) === 'number') {
      window._gaq.push(['_setSiteSpeedSampleRate', options.homeSiteSpeedSampleRate]);
    }

    window._gaq.push(['b._setAccount', options.produtoTrackingId]);
    if (options.produtoDomain) {
      window._gaq.push(['b._setDomainName', options.produtoDomain]);
    }
    if (type(options.produtoSiteSpeedSampleRate) === 'number') {
      window._gaq.push(['b._setSiteSpeedSampleRate', options.produtoSiteSpeedSampleRate]);
    }


    if (options.enhancedLinkAttribution) {
      var protocol = 'https:' === document.location.protocol ? 'https:' : 'http:';
      var pluginUrl = protocol + '//www.google-analytics.com/plugins/ga/inpage_linkid.js';
      window._gaq.push(['_require', 'inpage_linkid', pluginUrl]);
    }
    if (options.anonymizeIp) {
      window._gaq.push(['_gat._anonymizeIp']);
    }
    if (options.homeInitialPageview) {
      var path, canon = canonical();
      if (canon) path = url.parse(canon).pathname;
      
			this.pageview(path);
    }

    window.MultiGoogleAnalytics["traitsPositions"] = options.traitsPositions;

    // URLs change if DoubleClick is on.
    if (options.doubleClick) {
      load('//stats.g.doubleclick.net/dc.js');
    } else {
      load({
        http  : 'http://www.google-analytics.com/ga.js',
        https : 'https://ssl.google-analytics.com/ga.js'
      });
    }

    // Google makes a queue so it's ready immediately.
    ready();
  },

  identify : function (userId, traits) {
    if (traits) {
      each(traits, function (key, value) {
        window._gaq.push(['_setCustomVar', window.MultiGoogleAnalytics.traitsPositions[key], key, value, 1],
                         ['b._setCustomVar', window.MultiGoogleAnalytics.traitsPositions[key], key, value, 1]);
      });
    }
  },

  track : function (event, properties) {
    properties || (properties = {});

    var value;

    // Since value is a common property name, ensure it is a number
    if (type(properties.value) === 'number') value = properties.value;

    // Try to check for a `category` and `label`. A `category` is required,
    // so if it's not there we use `'All'` as a default. We can safely push
    // undefined if the special properties don't exist. Try using revenue
    // first, but fall back to a generic `value` as well.
    window._gaq.push([
      '_trackEvent',
      properties.category || 'All',
      event,
      properties.label,
      Math.round(properties.revenue) || value,
      properties.noninteraction
    ]);
  },

  pageview : function (url) {
    window._gaq.push(['_trackPageview', url]);
    window._gaq.push(['b._trackPageview', url]);
  }
});