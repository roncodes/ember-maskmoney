import TextField from '@ember/component/text-field';
import { once } from '@ember/runloop';
import { observer, computed, set, get } from '@ember/object';
import $ from 'jquery';

const jQuery = $ || window.$;

export default TextField.extend({
  prefix: '',
  suffix: '',
  affixesStay: false,
  thousands: ',',
  decimal: '.',
  precision: 2,
  allowZero: true,
  allowNegative: false,
  allowDecimal: true,

  options: computed('prefix', 'suffix', 'affixesStay', 'thousands', 'decimal', 'precision', 'allowZero', 'allowNegative', 'allowDecimal', function() {
    return {
      prefix: get(this, 'prefix'),
      suffix: get(this, 'suffix'),
      affixesStay: get(this, 'affixesStay'),
      thousands: get(this, 'thousands'),
      decimal: get(this, 'decimal'),
      precision: get(this, 'precision'),
      allowZero: get(this, 'allowZero'),
      allowNegative: get(this, 'allowNegative'),
      allowDecimal: get(this, 'allowDecimal')
    };
  }),

  didInsertElement() {
    once(() => {
      jQuery(this.element).maskMoney(get(this, 'options'));
      if((get(this, 'allowZero') && (get(this, 'number') !== undefined)) || get(this, 'number')){
        this.notifyPropertyChange('number');
      }
    });
    this._super(...arguments);
  },

  willDestroyElement() {
    jQuery(this.element).maskMoney('destroy');
    this._super(...arguments);
  },

  setMask: observer('options', function(){
    jQuery(this.element).maskMoney(get(this, 'options'));
    jQuery(this.element).maskMoney('mask');
  }),

  setMaskedValue: observer('number', 'precision', 'decimal', function(){
    let number = parseFloat(get(this, 'number') || 0).toFixed(get(this, 'precision'));
    let val = number.toString().replace('.', get(this, 'decimal'));
    jQuery(this.element).val(val);
    jQuery(this.element).maskMoney('mask');
  }),

  setUnmaskedValue: observer('value', 'allowDecimal', function() {
    if(get(this, 'allowDecimal')){
      set(this, 'number', jQuery(this.element).maskMoney('unmasked')[0]);
    } else {
      set(this, 'number', get(this, 'value').replace(/[^0-9]/g, ''));
    }
  })
});
