requireApp('clock/js/utils.js');
requireApp('clock/js/form_button.js');

suite('FormButton', function() {
  var doc, input, formButton;

  suiteSetup(function() {

  });

  suiteTeardown(function() {

  });

  setup(function() {
    doc = document.createElement('div');
    doc.innerHTML = '<input type="time" id="time-input"/>';
    input = doc.querySelectorAll('#time-input')[0];
    formButton = new FormButton(input);
  });

  teardown(function() {
    //asdfs
  });

  suite('basic functions', function() {

    setup(function() {
      doc = document.createElement('div');
      doc.innerHTML = '<input type="time" id="time-input"/>';
      input = doc.querySelectorAll('#time-input')[0];
      formButton = new FormButton(input);
    });

    test('should insert a button element into the dom', function(done) {
      var buttons = doc.querySelectorAll('button');
      assert.equal(buttons.length, 1);
      done();
    });

    test('should hide the input', function(done) {
      assert.equal(input.style.position, 'absolute');
      assert.equal(input.style.opacity, 0);
      done();
    });

    test('clicking the button should focus the input', function(done) {
      this.sinon.stub(input, 'focus');
      formButton.button.click();
      setTimeout(function() {
        assert.ok(input.focus.called);
        done();
      }, 15);
    });

    test('refresh should update the button text', function(done) {
      formButton.input.value = '10:10';
      formButton.refresh();
      assert.equal(formButton.button.textContent, '10:10');
      done();
    });

    test('formatLabel should be overrideable', function(done) {
      var formButton = new FormButton(input, {
        formatLabel: function() {
          return 'formatted label';
        }
      });
      assert.equal(formButton.formatLabel(), 'formatted label');
      done();
    });

    test('template should be overrideable', function(done) {
      var formButton = new FormButton(input, {
        template: '<span></span>'
      });
      assert.equal(formButton.button.nodeName, 'SPAN');
      done();
    });

    test('buttonId should set the id of the button', function(done) {
      var formButton = new FormButton(input, {
        buttonId: 'my-button'
      });
      assert.equal(formButton.button.id, 'my-button');
      done();
    });

  });

  suite('when the input property is an input element', function() {

    setup(function() {
      doc = document.createElement('div');
      doc.innerHTML = '<input type="time" id="time-input"/>';
      input = doc.querySelectorAll('#time-input')[0];
      formButton = new FormButton(input);
    });

    test('the blur event should update the button text', function(done) {
      formButton.input.value = '10:11';
      formButton.input.dispatchEvent(new Event('blur'));
      assert.equal(formButton.button.textContent, '10:11');
      done();
    });

    test('getValue should return the current value', function(done) {
      formButton.input.value = '10:12';
      assert.equal(formButton.getValue(), '10:12');
      done();
    });


    test('setValue should set the current value', function(done) {
      formButton.setValue('10:13');
      assert.equal(formButton.input.value, '10:13');
      done();
    });

    test('isSelect should be false', function(done) {
      assert.equal(formButton.isSelect, false);
      done();
    });
  });

  suite('when the input property is a select element', function() {

    setup(function() {
      doc = document.createElement('div');
      doc.innerHTML = ['<select id="vibrate-select"/>',
                       '<option value="1">On</option>',
                       '<option value="0">Off</option>',
                       '<option value="maybe">Maybe</option>',
                       '</select>'].join('');
      input = doc.querySelectorAll('#vibrate-select')[0];
      formButton = new FormButton(input);
    });

    test('the change event should update the button text', function(done) {
      Utils.changeSelectByValue(formButton.input, '0');
      formButton.input.dispatchEvent(new Event('change'));
      assert.equal(formButton.button.textContent, '0');
      done();
    });

    test('getValue should return the current value', function(done) {
      Utils.changeSelectByValue(formButton.input, '1');
      assert.equal(formButton.getValue(), '1');
      done();
    });


    test('setValue should set the current value', function(done) {
      formButton.setValue('maybe');
      assert.equal(formButton.input.value, 'maybe');
      done();
    });

    test('isSelect should be true', function(done) {
      assert.equal(formButton.isSelect, true);
      done();
    });
  });

  suite('when the input property is a select multiple', function() {

    setup(function() {
      doc = document.createElement('div');
      doc.innerHTML = ['<select id="repeat-select" multiple="true">',
                       '<option value="0">Monday</option>',
                       '<option value="1">Tuesday</option>',
                       '<option value="2">Wednesday</option>',
                       '<option value="3">Thursday</option>',
                       '<option value="4">Friday</option>',
                       '<option value="5">Saturday</option>',
                       '<option value="6">Sunday</option>',
                       '</select>'].join('');
      input = doc.querySelectorAll('#repeat-select')[0];
      formButton = new FormButton(input, {
        selectOptions: DAYS,
        formatLabel: JSON.stringify
      });
    });

    test('the change event should update the button text', function(done) {
      Utils.changeSelectByValue(formButton.input, '3');
      formButton.input.dispatchEvent(new Event('change'));
      assert.equal(formButton.button.textContent, '{"thursday":true}');
      done();
    });

    test('getValue should return the current value', function(done) {
      Utils.changeSelectByValue(formButton.input, '1');
      assert.deepEqual(formButton.getValue(), { tuesday: true });
      done();
    });


    test('setValue should set the current value', function(done) {
      formButton.setValue({tuesday: true, thursday: true, saturday: true});
      var options = formButton.input.options;
      assert.equal(options[0].selected, false); // monday
      assert.equal(options[1].selected, true); // tuesday
      assert.equal(options[2].selected, false); // wednesday
      assert.equal(options[3].selected, true); // tursday
      assert.equal(options[4].selected, false); // friday
      assert.equal(options[5].selected, true); // saturday
      assert.equal(options[6].selected, false); // sunday
      done();
    });

    test('isSelect should be true', function(done) {
      assert.equal(formButton.isSelect, true);
      done();
    });
  });
});
