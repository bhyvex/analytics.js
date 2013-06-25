describe('Visual Website Optimizer', function () {

// Set up fake VWO data to simulate the replay.
window._vwo_exp_ids = [1];
window._vwo_exp = {
  1 : {
    comb_n : {
      1 : 'Variation'
    },
    combination_chosen : 1
  }
};

describe('initialize', function () {
  this.timeout(10000);

  it('should call ready', function () {
    var callback = sinon.spy();
    analytics.ready(callback);
    analytics.initialize({ 'Visual Website Optimizer' : true });
    expect(callback.called).to.be(true);
  });

  it('should replay when the library loads', function (done) {
    return done();

    var identify = sinon.spy(analytics, 'identify');
    analytics.initialize({ 'Visual Website Optimizer' : true });
    setTimeout(function () {
      expect(identify.calledWith({'Experiment: 1' : 'Variation'})).to.be(true);
      done();
    }, 9999);
  });
});

});