'use strict';

const CODES = {
    PROGRAM_ERROR: 0,
    NOT_FOUND: 1,
    INSERT_OK: 2,
    NOT_INSERTED: 3,
    ALREADY_IN_USE: 4,
    REMOVE_OK: 5,
    NOT_REMOVED: 6,
    UPDATE_OK: 7,
    NOT_UPDATED: 8,
    SEARCH_NO_RESULTS: 9
};

const TYPES = {
    ERROR: 'error',
    INFO: 'info'
};

const MESSAGES = {
    PROGRAM_ERROR: () => ({
        message: 'Sorry! There was an error in the program.',
        code: CODES.PROGRAM_ERROR,
        type: TYPES.ERROR
    }),
    NOT_FOUND: (key, value) => ({
        message: `No cat found with ${key} ${value}.`,
        code: CODES.NOT_FOUND,
        type: TYPES.INFO
    }),
    INSERT_OK: (key, value) => ({
        message: `Cat with ${key} ${value} was successfully added.`,
        code: CODES.INSERT_OK,
        type: TYPES.INFO
    }),
    NOT_INSERTED: () => ({
        message: 'Cat was not added.',
        code: CODES.NOT_INSERTED,
        type: TYPES.ERROR
    }),
    ALREADY_IN_USE: value => ({
        message: `Cat with the identifier ${value} already exists.`,
        code: CODES.ALREADY_IN_USE,
        type: TYPES.ERROR
    }),
    REMOVE_OK: (key, value) => ({
        message: `Cat with ${key} ${value} was successfully removed.`,
        code: CODES.REMOVE_OK,
        type: TYPES.INFO
    }),
    NOT_REMOVED: (key, value) => ({
        message: `No cat was removed with ${key} ${value}.`,
        code: CODES.NOT_REMOVED,
        type: TYPES.ERROR
    }),
    UPDATE_OK: (key, value) => ({
        message: `Cat with ${key} ${value} was successfully updated.`,
        code: CODES.UPDATE_OK,
        type: TYPES.INFO
    }),
    NOT_UPDATED: () => ({
        message: 'Cat was not updated.',
        code: CODES.NOT_UPDATED,
        type: TYPES.ERROR
    }),
    SEARCH_NO_RESULTS: () => ({
        message: 'No results found for the search criteria.',
        code: CODES.SEARCH_NO_RESULTS,
        type: TYPES.INFO
    })
};

module.exports = { CODES, TYPES, MESSAGES };
