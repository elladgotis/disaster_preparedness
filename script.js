const loginContainer = document.getElementById('login-container');
const signupContainer = document.getElementById('signup-container');
const mainContainer = document.getElementById('main-container');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const signupLink = document.getElementById('signup-link');
const backToLogin = document.getElementById('back-to-login');
const signupBtn = document.getElementById('signup-btn');
const profile = document.getElementById('profile');
const profileDropdown = document.getElementById('profile-dropdown');
const content = document.getElementById('content');
const navLinks = document.querySelectorAll('nav a');
const menuToggle = document.getElementById('menu-toggle');
const nav = document.querySelector('nav');

// Persist login state across page reloads
window.addEventListener('load', () => {
    fetch('check_login.php')
        .then(res => res.json())
        .then(data => {
            if (data.loggedIn) {
                loginContainer.classList.add('hidden');
                signupContainer.classList.add('hidden');
                mainContainer.classList.remove('hidden');
                document.querySelector('.profile .username').textContent = data.username;
                loadPage('home.html');
            }
        })
        .catch(err => console.error(err));
});

// --- LOGIN ---
loginBtn.addEventListener('click', () => {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if (!user || !pass) {
        alert('Enter username and password');
        return;
    }

    fetch('login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `username=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}`
    })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                loginContainer.classList.add('hidden');
                mainContainer.classList.remove('hidden');
                document.querySelector('.profile .username').textContent = user;
                loadPage('home.html');
            } else {
                alert(data.message);
            }
        })
        .catch(err => console.error(err));
});

// --- SIGNUP LINK ---
signupLink.addEventListener('click', e => {
    e.preventDefault();
    loginContainer.classList.add('hidden');
    signupContainer.classList.remove('hidden');
});

backToLogin.addEventListener('click', e => {
    e.preventDefault();
    signupContainer.classList.add('hidden');
    loginContainer.classList.remove('hidden');
});

// --- SIGNUP ---
signupBtn.addEventListener('click', () => {
    const firstName = document.getElementById('first_name').value;
    const middleName = document.getElementById('middle_name').value;
    const lastName = document.getElementById('last_name').value;
    const email = document.getElementById('email').value;
    const username = document.getElementById('signup_username').value;
    const password = document.getElementById('signup_password').value;
    const password2 = document.getElementById('signup_password2').value;

    // Basic validation
    if (!firstName || !lastName || !email || !username || !password || !password2) {
        alert('All required fields must be filled');
        return;
    }

    if (password !== password2) {
        alert('Passwords do not match');
        return;
    }

    // Prepare data for POST
    const formData = new URLSearchParams();
    formData.append('first_name', firstName);
    formData.append('middle_name', middleName);
    formData.append('last_name', lastName);
    formData.append('email', email);
    formData.append('username', username);
    formData.append('password', password);
    formData.append('password2', password2);

    fetch('signup.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Account created! Please login.');
            signupContainer.classList.add('hidden');
            loginContainer.classList.remove('hidden');
        } else {
            alert(data.message);
        }
    })
    .catch(err => console.error(err));
});


// --- LOGOUT ---
logoutBtn.addEventListener('click', () => {
    fetch('logout.php')
        .then(() => {
            mainContainer.classList.add('hidden');
            loginContainer.classList.remove('hidden');
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
        });
});

// --- PROFILE DROPDOWN ---
profile.addEventListener('click', e => {
    profileDropdown.style.display = profileDropdown.style.display === 'flex' ? 'none' : 'flex';
});
document.addEventListener('click', e => {
    if (!profile.contains(e.target)) profileDropdown.style.display = 'none';
});

// --- NAVIGATION ---
navLinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        const page = link.getAttribute('data-page');
        if (nav.classList.contains('active')) nav.classList.remove('active');
        loadPage(page);
    });
});

function loadPage(page) {
    content.innerHTML = `<p>Loading...</p>`;
    fetch(`pages/${page}`)
        .then(res => res.text())
        .then(html => content.innerHTML = html)
        .catch(() => content.innerHTML = `<p>Page not found</p>`);
}

// --- MOBILE MENU ---
menuToggle.addEventListener('click', () => nav.classList.toggle('active'));
