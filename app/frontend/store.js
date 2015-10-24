'use strict'

import Dispatcher from './dispatcher'
import events from 'events'
import actions from './actions'

// Event's available for registration
const ANY_CHANGE = 'ANY_CHANGE'
const DEVICE_STATE = 'DEVICE_STATE'

// Device States
const STATE_NO_DEVICE = 'STATE_NO_DEVICE'
const STATE_DEVICE_SELECTED = 'STATE_DEVICE_SELECTED'
const STATE_DEVICE_READY = 'STATE_DEVICE_READY'

let EventEmitter = events.EventEmitter

let _devices = {}
let _deviceState = STATE_NO_DEVICE
let _currentlySelectedUUID = null

class Store extends EventEmitter {
  constructor() {
    super()
  }

  emitChange(evt) {
    this.emit(evt)
  }

  addChangeListener(evt, callback) {
    this.on(evt, callback)
  }

  removeChangeListener(evt, callback) {
    this.removeListener(evt, callback)
  }

  getDevices() {
    return _devices
  }

  getSelectedDevice() {
    if (_currentlySelectedUUID)
      return _devices[_currentlySelectedUUID]
    else
      console.log('No device is currently selected!')
  }

  getDeviceState() {
    return _deviceState
  }

  getDeviceInformation() {
    let d = this.getSelectedDevice()
  }

}

Dispatcher.register(function (action) {

  switch (action.actionType) {

    case actions.DEVICE_FOUND:
      let d = action.device
      d.selected = false
      _devices[d.uuid] = d
      store.emitChange(ANY_CHANGE)
      break

    case actions.CLEAR_DEVICES:
      _devices = {}
      store.emitChange(ANY_CHANGE)
      break

    case actions.SELECT_DEVICE:
      for (let i in _devices)
        _devices[i].selected = false
      _devices[action.uuid].selected = true
      _currentlySelectedUUID = action.uuid
      _deviceState = STATE_DEVICE_SELECTED
      store.emitChange(ANY_CHANGE)
      store.emitChange(DEVICE_STATE)
      break

    default:
      console.log(`No registered handler for ${action.actionType}`)
  }
});

let store = new Store()
module.exports = {
  store: store,
  ANY_CHANGE: ANY_CHANGE,
  DEVICE_STATE: DEVICE_STATE,
  STATE_NO_DEVICE: STATE_NO_DEVICE,
  STATE_DEVICE_SELECTED: STATE_DEVICE_SELECTED,
  STATE_DEVICE_READY: STATE_DEVICE_READY
}
