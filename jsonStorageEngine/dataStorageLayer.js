'use strict';

const { CODES, TYPES, MESSAGES } = require('./statusCodes');
const { createStorageLayer } = require('./storageLayer');

function createDataStorage(storagePath, storageConfig) {
    const {
        getAllFromStorage,
        getFromStorage,
        addToStorage,
        updateStorage,
        removeFromStorage,
        getKeys,
        primary_key,
        resource
    } = createStorageLayer(storagePath, storageConfig);

    class DataStorage {

        get CODES() {
            return CODES;
        }

        get TYPES() {
            return TYPES;
        }

        get PRIMARY_KEY() {
            return primary_key;
        }

        get KEYS() {
            return getKeys();
        }

        getAll() {
            return getAllFromStorage();
        }

        get(value, key = primary_key) {
            return getFromStorage(value, key);
        }

        insert(item) {
            return new Promise(async (resolve, reject) => {
                if (item) {
                    if (!item[primary_key]) {
                        reject(MESSAGES.NOT_INSERTED());
                    } else if ((await getFromStorage(item[primary_key])).length > 0) {
                        reject(MESSAGES.ALREADY_IN_USE(item[primary_key]));
                    } else if (await addToStorage(item)) {
                        resolve(MESSAGES.INSERT_OK(primary_key, item[primary_key]));
                    } else {
                        reject(MESSAGES.NOT_INSERTED());
                    }
                } else {
                    reject(MESSAGES.NOT_INSERTED());
                }
            });
        }

        update(item) {
            return new Promise(async (resolve, reject) => {
                if (item) {
                    const existingItem = await getFromStorage(item[primary_key]);
                    if (existingItem.length > 0) {
                        if (await updateStorage(item)) {
                            resolve(MESSAGES.UPDATE_OK(primary_key, item[primary_key]));
                        } else {
                            reject(MESSAGES.NOT_UPDATED());
                        }
                    } else {
                        reject(MESSAGES.NOT_FOUND(primary_key, item[primary_key]));
                    }
                } else {
                    reject(MESSAGES.NOT_UPDATED());
                }
            });
        }

        remove(value) {
            return new Promise(async (resolve, reject) => {
                if (!value) {
                    reject(MESSAGES.NOT_FOUND(primary_key, '--empty--'));
                } else if (await removeFromStorage(value)) {
                    resolve(MESSAGES.REMOVE_OK(primary_key, value));
                } else {
                    reject(MESSAGES.NOT_REMOVED(primary_key, value));
                }
            });
        }
    }

    return new DataStorage();
}

module.exports = { createDataStorage };
