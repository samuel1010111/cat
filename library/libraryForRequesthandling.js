'use strict';

const fs = require('fs');
const path = require('path');

// MIME types for different file extensions
const MIMETYPES = {
    ".html": { "type": "text/html", "encoding": "utf8" },
    ".js": { "type": "text/javascript", "encoding": "utf8" },
    ".css": { "type": "text/css", "encoding": "utf8" },
    ".json": { "type": "application/json", "encoding": "utf8" },
    ".png": { "type": "image/png", "encoding": "binary" },
    ".jpeg": { "type": "image/jpeg", "encoding": "binary" },
    ".jpg": { "type": "image/jpeg", "encoding": "binary" },
    ".gif": { "type": "image/gif", "encoding": "binary" },
    ".ico": { "type": "image/vnd.microsoft.icon", "encoding": "binary" }
};

// Read a file and return its data and MIME type
const read = filepath => {
    const extension = path.extname(filepath).toLowerCase();
    const mime = MIMETYPES[extension] ||
        { type: 'application/octet-stream', encoding: 'binary' };

    return fs.promises.readFile(filepath, mime.encoding)
        .then(fileData => ({ fileData, mime }))
        .catch(err => err);
};

// Send a resource to the client
const send = (res, resource) => {
    res.writeHead(200, {
        'Content-Type': resource.mime.type,
        'Content-Length': Buffer.byteLength(resource.fileData, resource.mime.encoding)
    });
    res.end(resource.fileData, resource.mime.encoding);
};

// Send JSON data to the client
const sendJson = (res, jsonResource) => {
    const jsonData = JSON.stringify(jsonResource);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(jsonData);
};

// Send an error response
const sendError = (res, message, type, code = 404) => {
    res.writeHead(code, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message, type }));
};

// Check if the route starts with any of the provided routes
const isIn = (route, ...routes) => {
    for (let start of routes) {
        if (route.startsWith(start)) return true;
    }
    return false;
};

// Allowed content types for POST requests
const allowedFormats = [
    'application/x-www-form-urlencoded',
    'application/json'
];

// Get POST body data from the request
const getRequestPostBodyData = request =>
    new Promise((resolve, reject) => {
        const type = request.headers['content-type'];
        if (allowedFormats.includes(type)) {
            const databuffer = [];

            request.on('data', datapart => databuffer.push(datapart));

            request.on('end', () => {
                const data = Buffer.concat(databuffer).toString();

                if (type === 'application/json') {
                    resolve(JSON.parse(data));
                } else {
                    const params = new URLSearchParams(data);
                    const jsonResult = {};
                    params.forEach((value, key) => jsonResult[key] = value);
                    resolve(jsonResult);
                }
            });

            request.on('error', () => reject('Error in transmission'));
        } else {
            reject('Wrong Content-Type');
        }
    });

// Export the functions
module.exports = { read, send, sendJson, sendError, isIn, getRequestPostBodyData };
