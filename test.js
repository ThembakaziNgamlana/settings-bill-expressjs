const assert = require('assert');
const { expect } = require('chai'); 
const SettingsBill = require('./settings-bill');

describe('SettingsBill', function () {
  let settingsBill;

  beforeEach(function () {
    settingsBill = SettingsBill();
  });

  it('should set and get settings correctly', function () {
    const settings = {
      smsCost: 1.5,
      callCost: 2.0,
      warningLevel: 20,
      criticalLevel: 30,
    };
    settingsBill.setSettings(settings);

    const actualSettings = settingsBill.getSettings();
    expect(actualSettings).to.deep.equal(settings);
  });

  it('should record an action and calculate totals correctly', function () {
    settingsBill.setSettings({
      smsCost: 1.5,
      callCost: 2.0,
      warningLevel: 20,
      criticalLevel: 30,
    });

    settingsBill.recordAction('sms');
    settingsBill.recordAction('call');
    settingsBill.recordAction('sms');

    const smsTotal = settingsBill.getTotal('sms');
    const callTotal = settingsBill.getTotal('call');
    const grandTotal = settingsBill.grandTotal();

    expect(smsTotal).to.equal(3.0);
    expect(callTotal).to.equal(2.0);
    expect(grandTotal).to.equal(5.0);
  });

  it('should check if warning level is reached', function () {
    settingsBill.setSettings({
      smsCost: 1.5,
      callCost: 2.0,
      warningLevel: 5,
      criticalLevel: 10,
    });

    settingsBill.recordAction('sms');
    settingsBill.recordAction('call');

    const reachedWarningLevel = settingsBill.hasReachedWarningLevel();
    expect(reachedWarningLevel, true);
  });

  it('should check if critical level is reached', function () {
    settingsBill.setSettings({
      smsCost: 1.5,
      callCost: 2.0,
      warningLevel: 5,
      criticalLevel: 10,
    });

    settingsBill.recordAction('sms');
    settingsBill.recordAction('call');
    settingsBill.recordAction('sms');
    settingsBill.recordAction('call');

    const reachedCriticalLevel = settingsBill.hasReachedCriticalLevel();
    expect(reachedCriticalLevel, true);
  });



  it('should return totals object', function () {
    settingsBill.setSettings({
      smsCost: 1.5,
      callCost: 2.0,
      warningLevel: 20,
      criticalLevel: 30,
    });

    settingsBill.recordAction('sms');
    settingsBill.recordAction('call');
    settingsBill.recordAction('sms');

    const totals = settingsBill.totals();

    assert.deepStrictEqual(totals, {
      smsTotal: 3.0,
      callTotal: 2.0,
      grandTotal: 5.0,
    });
  });
});
