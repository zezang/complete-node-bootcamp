// import axios from 'axios';

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
        console.log(res)
        if (res.status === 200) {
            alert('Loggin in successfully');
            window.setTimeout(() => {
                location.assign('/')
            }, 1500)
        }
    } catch (err) {
        alert(err.message);
    }  
}


document.querySelector('.form').addEventListener('submit', e => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login( email, password );
});

