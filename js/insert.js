'use strict';

(function() {

    let numberField;
    let nameField;
    let breedField;
    let lengthField;
    let yearOfBirthField;
    let resultarea;

    document.addEventListener('DOMContentLoaded', init);

    function init() {
        resultarea = document.getElementById('resultarea');
        numberField = document.getElementById('number');
        nameField = document.getElementById('name');
        breedField = document.getElementById('breed');
        lengthField = document.getElementById('length');
        yearOfBirthField = document.getElementById('yearOfBirth');

        document.getElementById('submit').addEventListener('click', send);

        numberField.addEventListener('focus', clear);
    }

    function clear() {
        numberField.value = '';
        nameField.value = '';
        breedField.value = '';
        lengthField.value = '';
        yearOfBirthField.value = '';
        resultarea.textContent = '';
        resultarea.removeAttribute('class');
    }

    async function send() {
        const cat = {
            number: +numberField.value, // Convert to number
            name: nameField.value,
            breed: breedField.value,
            length: +lengthField.value, // Convert to number
            yearOfBirth: +yearOfBirthField.value // Convert to number
        };

        try {
            const options = {
                method: 'POST',
                body: JSON.stringify(cat),
                headers: { 'Content-Type': 'application/json' }
            };

            // Send data to the server at /addCat
            const response = await fetch('/addCat', options);

            // Check for server response errors
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Parse the JSON response from the server
            const result = await response.json();

            // Update the status on the page
            updateStatus(result);
        } catch (err) {
            // Handle any errors that occurred during fetch
            updateStatus({ message: err.message, type: 'error' });
        }
    }

    function updateStatus(status) {
        resultarea.textContent = status.message;
        resultarea.setAttribute('class', status.type);
    }

})();
