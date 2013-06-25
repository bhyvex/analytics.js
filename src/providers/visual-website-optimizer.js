// http://v2.visualwebsiteoptimizer.com/tools/get_tracking_code.php
// http://visualwebsiteoptimizer.com/knowledge/integration-of-vwo-with-kissmetrics/

var each = require('each')
  , inherit = require('inherit')
  , nextTick = require('next-tick')
  , Provider = require('../provider');


/**
 * Expose `VWO`.
 */

module.exports = VWO;


/**
 * `VWO` inherits from the generic `Provider`.
 */

function VWO () {
  Provider.apply(this, arguments);
}

inherit(VWO, Provider);


/**
 * Name.
 */

VWO.prototype.name = 'Visual Website Optimizer';


/**
 * Default options.
 */

VWO.prototype.defaults = {
  // Whether to replay variations into other integrations as traits.
  replay : true
};


/**
 * Initialize.
 */

VWO.prototype.initialize = function (options, ready) {
  if (options.replay) this.replay();
  ready();
};


/**
 * Replay the experiments the user has seen as traits to all other integrations.
 * Wait for the next tick to replay so that the `analytics` object and all of
 * the integrations are fully initialized.
 */

VWO.prototype.replay = function () {
  var analytics = this.analytics;
  nextTick(function () {
    experiments(function (err, traits) {
      if (traits) analytics.identify(traits);
    });
  });
};


/**
 * Get dictionary of experiment keys and variations.
 * http://visualwebsiteoptimizer.com/knowledge/integration-of-vwo-with-kissmetrics/
 *
 * @param  {Function} callback  Called with `err, experiments`.
 * @return {Object}             Dictionary of experiments and variations.
 */

function experiments (callback) {
  enqueue(function () {
    var data = {};
    var ids = window._vwo_exp_ids;
    if (!ids) return callback();
    each(ids, function (id) {
      var name = variation(id);
      if (name) data['Experiment: ' + id] = name;
    });
    callback(null, data);
  });
}


/**
 * Add a function to the VWO queue, creating one if it doesn't exist.
 *
 * @param {Function} fn  Function to enqueue.
 */

function enqueue (fn) {
  window._vis_opt_queue || (window._vis_opt_queue = []);
  window._vis_opt_queue.push(fn);
}


/**
 * Get the chosen variation's name from an experiment `id`.
 * http://visualwebsiteoptimizer.com/knowledge/integration-of-vwo-with-kissmetrics/
 *
 * @param  {String} id  ID of the experiment to read.
 * @return {String}     Variation name.
 */

function variation (id) {
  var experiments = window._vwo_exp;
  if (!experiments) return null;
  var experiment = experiments[id];
  var variationId = experiment.combination_chosen;
  return variationId ? experiment.comb_n[variationId] : null;
}