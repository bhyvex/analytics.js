describe('Adobe Audience Manager', function () {

  describe('initialize', function () {
    this.timeout(10000);

    it('should call ready and load library', function (done) {
			expect(window.gDil).to.be(undefined);
			var spy  = sinon.spy();
						
      analytics.ready(spy);
      analytics.initialize({ 'Adobe Audience Manager' : test['Adobe Audience Manager'] });
		
      // When the library loads, push will be overriden.
      var interval = setInterval(function () {
        if (!window.gDil) return;
        expect(window.gDil).not.to.be(undefined);
        expect(spy.called).to.be(true);
        clearInterval(interval);
        done();
      }, 20);
    });
	});	

  describe('track', function () {
    it('should call "signals"', function () {
      var spy   = sinon.spy(window.gDil.api, 'signals');
			
      analytics.track(test.signals);
      expect(spy.called).to.be(true);

      spy.restore();
    });
		
    it('should send signals', function () {
      var stub   = sinon.stub(window.gDil.api, 'signals');
			
      analytics.track(test.adobeEvents, test.signals);
      expect(stub.calledWith({"adobeEvent":"adobe events"})).to.be(true);
      expect(stub.calledWith({"signals" : "signals"})).to.be(true);
      stub.restore();
    });		
		
    it('should call "submit"', function () {
      var spy   = sinon.spy(window.gDil.api, 'submit')
      analytics.track(test.signals);
      expect(spy.called).to.be(true);

      spy.restore();
    });
  });

  describe('identify', function () {
    it('should send all traits', function () {
      var spy   = sinon.spy(window.gDil.api, 'signals');
      var spySubmit = sinon.spy(window.gDil.api, 'submit');

      analytics.user.clear(); // Clear segment.io cookies and localstorage. Prevents intermittent test.
      analytics.identify(21321321, {
          ESTADO: "RJ",
          FAIXA_ETARIA: "Adolescente (12 a 17 anos)",
          SEXO: "Masculino"
      });

      expect(spy.getCall(0).args[0]).to.eql({ ESTADO: "RJ", FAIXA_ETARIA: "Adolescente (12 a 17 anos)", SEXO: "Masculino" });
      expect(spy.getCall(0).args[1]).to.eql("c_");
      expect(spySubmit.called).to.be(true);

      spy.restore();
      spySubmit.restore();
    });
  });
});
