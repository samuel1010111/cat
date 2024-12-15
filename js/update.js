'use strict';

(function () {

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

        document.getElementById('fetch').addEventListener('click', fetchCat);
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

    async function fetchCat() {
        const number = +numberField.value;
        if (isNaN(number) || number <= 0) {
            updateStatus({ message: 'Invalid cat number', type: 'error' });
            return;
        }

        try {
            const response = await fetch(`/getCat/${number}`);
            if (!response.ok) {
                throw new Error('Cat not found');
            }

            const cat = await response.json();
            populateFields(cat);
        } catch (err) {
            updateStatus({ message: err.message, type: 'error' });
        }
    }

    function populateFields(cat) {
        nameField.value = cat.name || '';
        breedField.value = cat.breed || '';
        lengthField.value = cat.length || '';
        yearOfBirthField.value = cat.yearOfBirth || '';
    }

    async function send() {
        const cat = {
            number: +numberField.value,
            name: nameField.value,
            breed: breedField.value,
            length: +lengthField.value,
            yearOfBirth: +yearOfBirthField.value
        };

        try {
            const options = {
                method: 'PUT',
                body: JSON.stringify(cat),
                headers: { 'Content-Type': 'application/json' }
            };
            const data = await fetch('/updateCat', options);
            const result = await data.json();

            updateStatus(result);
        } catch (err) {
            updateStatus({ message: err.message, type: 'error' });
        }
    } // end of send

    function updateStatus(status) {
        resultarea.textContent = status.message;
        resultarea.setAttribute('class', status.type);
    }

})();
