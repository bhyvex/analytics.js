analytics.js
============

[![Build Status](https://travis-ci.org/segmentio/analytics.js.png?branch=master)](https://travis-ci.org/segmentio/analytics.js)

The hassle-free way to integrate analytics into any web application. [See the docs.](https://segment.io/libraries/analytics.js/)

Looking for an _even_ easier way to setup analytics on your website? [Check out Segment.io!](https://segment.io) It's our hosted solution that lets you add analytics services without touching any code at all.

Building
------------

Analytics.js is packaged as a [component](https://github.com/component/component). In order to build it, you will need to install component:

```shell
npm install -g component
```

We've already packaged the files as a standalone build found in `analytics.js` and `analytics.min.js`. To build the files yourself, run `make`.



PROVIDERS GLOBO.COM

Adobe Audience Manager 
======================

Initialize
----------
analytics.initialize({
	'Adobe Audience Manager' : ''
});


Track
-----
analytics.track({event : 'capturando evento'}, {nome : 'nome do usuario'})
	

Context
-------
context = {
	providers: {
		'All'              				: false,
	  'Google Analytics' 				: false,
	  'Adobe Audience Manager'	: true
	}
};
analytics.track({event : 'capturando evento'}, {nome : 'nome do usuario'}, context)


Multi Google Analytics
======================

Initialize
----------
analytics.initialize({
	'Multi Google Analytics' : {
		'homeTrackingId' : 'UA-XXXXXX-XX',
    'homeDomain' : '.globo.com',
		'produtoTrackingId' : 'UA-XXXXXX-XX',
  	'produtoDomain' : '.produto.globo.com'
	}
});

os outros metodos estão na documentação do Google Analytics. https://segment.io/libraries/analytics.js.
