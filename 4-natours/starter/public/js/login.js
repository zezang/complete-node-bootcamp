// import axios from 'axios';

const showAlert = (type, msg) => {
    hideAlert();

    const markup = `<div class ="alert alert--${type}">${msg}</div>`;
    
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(hideAlert, 2000);
};

const hideAlert = () => {
    const el = document.querySelector('.alert');
    if (el) el.parentElement.removeChild(el);
}


const login = async (email, password) => {
    try {
        const res = await fetch('http://localhost:3000/api/v1/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email : email,
            password: password
        })  
    });
        if (res.status === 200) {
            showAlert('sucess', 'Logged in successfully');
            window.setTimeout(() => {
                location.assign('/')
            }, 1500)
        }
        else throw new Error('Incorrect login information')
    } catch (err) {
        showAlert('error', err.message);
    }  
}

const form = document.querySelector('.form--login');

if (form) {
    document.querySelector('.form').addEventListener('submit', e => {
        e.preventDefault();
    
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
    
        login( email, password );
    });
}

const logout = async() => {
    try {
        const res = await fetch('http://localhost:3000/api/v1/users/logout');

        if (res.status === 200) location.reload(true);
    } catch (err) {
        showAlert('error', 'Error logging out')
    }
}

const logOutBtn = document.querySelector('.nav__el--logout');
if (logOutBtn) logOutBtn.addEventListener('click', logout);