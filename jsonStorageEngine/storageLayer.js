'use strict';

const path = require('path');
const { readStorage, writeStorage } = require('./readWriter'); // Corrected file name

function createStorageLayer(storageFolder, storageConfigFile) {
    const storageConfig = path.join(storageFolder, storageConfigFile);
    const { storageFile, adapterFile, primary_key } = require(storageConfig);
    const { adapt } = require(path.join(storageFolder, adapterFile));
    const storageFilePath = path.join(storageFolder, storageFile);

    async function getAllFromStorage() {
        return await readStorage(storageFilePath);
    }

    async function getFromStorage(value, key = primary_key) {
        return (await readStorage(storageFilePath)).filter(item => item[key] == value);
    }

    async function addToStorage(newObject) {
        const storage = await readStorage(storageFilePath);
        storage.push(adapt(newObject));
        return await writeStorage(storageFilePath, storage);
    }

    async function removeFromStorage(value) {
        const storage = await readStorage(storageFilePath);
        const index = storage.findIndex(item => item[primary_key] == value);
        if (index < 0) return false;
        storage.splice(index, 1);
        return await writeStorage(storageFilePath, storage);
    }

    async function getKeys() {
        const storage = await readStorage(storageFilePath);
        const keys = new Set(storage.flatMap(item => Object.keys(item)));
        return [...keys];
    }

    return {
        getAllFromStorage,
        getFromStorage,
        addToStorage,
        removeFromStorage,
        getKeys,
        primary_key
    };
}

module.exports = { createStorageLayer };
