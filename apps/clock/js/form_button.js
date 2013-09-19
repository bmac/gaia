// outer IIFE
(function(exports) {
'use strict';

/**
 * A FormButton is a button that triggers an input. The test
 * of the currently selected value will display on the buttons's face.
 *
 * The `config` paramater supports the following optional proterties.
 * `formatLabel` - A function that is given the current value of the input
 * and should return a string which will be used as the textContent of
 * the button.
 *
 * `onChange` - A function which will be called with the new value of the
 * input every time it changes.
 *
 * `selectOptions` - An array of values that will be used as keynames
 * in the value object returned when the input is a select multiple list.
 *
 * @constructor
 * @param {HTMLElement} input The input element to trigger.
 * @param {Object} config An optional config object.
 *
 */
function FormButton(input, config) {
  config = config || {};
  Utils.extend(this, config);

  this.input = input;
  this.button = this._createButton();


  this._hideInput();

  this.button.addEventListener('click', this.focusInput.bind(this), false);
  if (this.isSelect()) {
    input.addEventListener('change', this.handleSelectChange.bind(this), false);
  } else {
    input.addEventListener('blur', this.handleSelectChange.bind(this), false);
  }
}

/**
 * focusInput Triggers a focus event on the input associated with this
 * FormButton.
 *
 * @param {Object} event an event object.
 */
FormButton.prototype.focusInput = function(event) {
  event.preventDefault();
  var menu = this.input;
  setTimeout(function() { menu.focus(); }, 10);
};

/**
 * refreshButtonLabel Updates the label text on the button to reflect
 * the current value of the input.
 *
 */
FormButton.prototype.refreshButtonLabel = function(value) {
  value = (value !== undefined) ? value : this.getInputValue();
  this.button.textContent = this.formatLabel(value);
};

/**
 * getInputValue Returns the current value of the input.
 *
 * @return {String|Object} The value of the input.
 *
 */
FormButton.prototype.getInputValue = function() {
  if (this.isSelect()) {
    if (this.input.multiple) {
      var selectedOptions = {};
      var options = this.input.options;
      for (var i = 0; i < options.length; i++) {
        if (options[i].selected) {
          selectedOptions[this.selectOptions[i]] = true;
        }
      }
      return selectedOptions;
    }
    if (this.input.selectedIndex !== -1) {
      return Utils.getSelectedValue(this.input);
    }
    return '';
  }
  // input node
  return this.input.value;
};

/**
 * getInputValue Returns the current value of the input.
 *
 * @return {String|Object} The value of the input.
 *
 */
FormButton.prototype.isSelect = function() {
  return this.input.nodeName === 'SELECT';
};

/**
 * An event handler that is called when the input is changed.
 *
 * @return {String|Object} The value of the input.
 *
 */
FormButton.prototype.handleSelectChange = function(event) {
  this.onChange(this.getInputValue());
  this.refreshButtonLabel();
};

/**
 * An overrideable method that is called when updating the textContent
 * of the button.
 *
 * @return {String|Object} The value of the input.
 *
 */
FormButton.prototype.formatLabel = function(value) {
  return value;
};

/**
 * An overrideable method that is called whenever the value of the
 * input changes.
 *
 * @return {String|Object} The value of the input.
 *
 */
FormButton.prototype.onChange = function() {};

FormButton.prototype._hideInput = function() {
  this.input.style.position = 'absolute';
  this.input.style.opacity = 0;
};

FormButton.prototype._createButton = function() {
  // var button = this._renderButtonTemplate();
  // this.input.parentNode.insertBefore( button, this.input );
  this.input.insertAdjacentHTML('afterend', this.template);
  var button = this.input.nextSibling;
  return button;
};

FormButton.prototype.template = '<button class="icon icon-dialog"></button>';

exports.FormButton = FormButton;

// end outer IIFE
}(this));
