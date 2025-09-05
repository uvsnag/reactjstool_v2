import config from '../../../common/config.js';
import _ from 'lodash';
import {  KEY_GOOGLE_SHEET_NM } from '../../../common/common.js';

export const load = (callback, sheet) => {
window.gapi.client.load("sheets", "v4", () => {
  window.gapi.client.sheets.spreadsheets.values
    .get({
      spreadsheetId: localStorage.getItem(KEY_GOOGLE_SHEET_NM) ? localStorage.getItem(KEY_GOOGLE_SHEET_NM): config.spreadsheetId,
      range: _.isEmpty(sheet)? config.notify.sheetDefault:sheet
    })
    .then(
      response => {
        const data = response.result.values;
        console.log(data)
        const items = data.filter(item => !_.isEmpty(item))
        .map(item => ({
          eng: item[0],
          vi: item[1],
          customDefine: item[2],
        })) || [];
        callback({
          items
        });
      },
      response => {
        callback(false, response.result.error);
      }
    );
});
}

export const loadListenSheet = (callback, sheet) => {
window.gapi.client.load("sheets", "v4", () => {
  window.gapi.client.sheets.spreadsheets.values
    .get({
      spreadsheetId: localStorage.getItem(KEY_GOOGLE_SHEET_NM) ? localStorage.getItem(KEY_GOOGLE_SHEET_NM): config.spreadsheetId,
      range: _.isEmpty(sheet)? config.notify.sheetDefault:sheet
    })
    .then(
      response => {
        const data = response.result.values;
        console.log(data)
        const items = data.filter(item => !_.isEmpty(item))
        .map(item => ({
          eng: item[0],
          vi: item[1],
          classItem: item[2],
        })) || [];
        callback({
          items
        });
      },
      response => {
        callback(false, response.result.error);
      }
    );
});
}
