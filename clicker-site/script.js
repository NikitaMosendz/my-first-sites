const button = document.getElementById('theme-btn');
const body = document.body;
const clickCounter = document.getElementById('click-counter');
const userName = document.getElementById('user-name');

let clicks = 0;

button.addEventListener('click', () => {
    clickCounter.textContent = `Clicks: ${++clicks}`
    
    if (body.classList.toggle('light-theme')) {
        button.textContent = 'Dark theme'
    } else {
        button.textContent = 'Light theme'
    }
})

fetch('http://localhost:3000/profile')
    .then(response => response.json())
    .then(data => {
        userName.textContent = `Hello, ${data.username}`

        clicks = data.clicks
        clickCounter.textContent = `Clicks: ${data.clicks}`
    });