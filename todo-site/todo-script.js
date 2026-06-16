const serverButton = document.getElementById('server-button');
const textField = document.getElementById('text-field');
const body = document.body;

serverButton.addEventListener('click', () => {
    fetch('http://localhost:4000/status')
        .then(response => response.json())
        .then(data => {
            textField.textContent = data.status;
    });
});

fetch('http://localhost:4000/color')
    .then(response => response.json())
    .then(data => {
        body.style.backgroundColor = data.recommendedColor;
    });