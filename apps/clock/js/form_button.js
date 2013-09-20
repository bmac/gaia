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
 * `selectOptions` - An array of values that will be used as keynames
 * in the value object returned when the input is a select multiple list.
 *
 * `template` - Text that will be parsed as HTML and inserted into the
 * document as the main button used to trigger the input. The default
 * value creates a button element with the class 'icon' and
 * 'icon-dialog'.
 *
 * `buttonId` - A string that is used as the id of the button element.
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

  // hide input
  this.input.style.position = 'absolute';
  this.input.style.opacity = 0;

  // set isSelect
  Object.defineProperty(this, 'isSelect', {
    configurable: false,
    writable: false,
    value: this.input.nodeName === 'SELECT'
  });

  this.button.addEventListener('click', this.focusInput.bind(this), false);
  if (this.isSelect) {
    input.addEventListener('change', this.refresh.bind(this), false);
  } else {
    input.addEventListener('blur', this.refresh.bind(this), false);
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
 * refresh Updates the label text on the button to reflect
 * the current value of the input.
 *
 */
FormButton.prototype.refresh = function() {
  var value = this.getValue();
  this.button.textContent = this.formatLabel(value);
};

/**
 * getValue Returns the current value of the input.
 *
 * @return {String|Object} The value of the input.
 *
 */
FormButton.prototype.getValue = function() {
  if (this.isSelect) {
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
 * getValue Returns the current value of the input.
 *
 * @return {String|Object} The value of the input.
 *
 */
FormButton.prototype.setValue = function(value) {
  if (this.isSelect) {
    if (this.input.multiple) {
      // multi select
      var selectedOptions = {};
      var options = this.input.options;
      for (var i = 0; i < options.length; i++) {
        options[i].selected = value[this.selectOptions[i]] === true;
      }
    }
    // normal select element
    Utils.changeSelectByValue(this.input, value);
  } else {
    // input element
    this.input.value = value;
  }
  // Update the text on the button to reflect the new input value
  this.refresh();
};

/**
 * An overrideable method that is called when updating the textContent
 * of the button.
 *
 * @return {String} The formatted text to display in the label.
 *
 */
FormButton.prototype.formatLabel = function(value) {
  return value;
};

FormButton.prototype._createButton = function() {
  var input = this.input;
  input.insertAdjacentHTML('afterend', this.template);
  var button = input.nextSibling;
  if (this.buttonId) {
    button.id = this.buttonId;
  }
  return button;
};

/**
 * template The template for the button element.
 *
 */
FormButton.prototype.template = '<button class="icon icon-dialog"></button>';

exports.FormButton = FormButton;

// end outer IIFE
}(this));
