/* eslint-disable no-console */
import localforage from 'localforage';

const APP_VERSION = 2.1;
const STORAGE_KEY = 'settings';
const STORAGE_NAME = 'pomodori-v2.1.0-storage';

const configStorage = () => {
  localforage.config({
    driver: localforage.LOCALSTORAGE,
    name: STORAGE_NAME,
    version: APP_VERSION,
  });
};

const loadSettings = () => (
  new Promise((resolve, reject) => {
    localforage.getItem(STORAGE_KEY)
      .then((value) => {
        console.log('User settings loaded succesfully: ', value);
        resolve(value);
      })
      .catch((err) => {
        console.log('User settings loaded unsuccesfully: ', err);
        reject(err);
      });
  })
);

const saveSettings = (settings) => {
  localforage.setItem(STORAGE_KEY, settings)
    .then(() => {
      console.log('Saving user settings...');
      return localforage.getItem(STORAGE_KEY);
    })
    .then((value) => {
      console.log('User settings saved succesfully: ', value);
    })
    .catch((err) => {
      console.log('User settings saved unsuccesfully: ', err);
    });
};

export default {
  configStorage,
  loadSettings,
  saveSettings,
};
