
const showError = (type, msg) => {
    hideError();

    const markup = `<div class ="alert alert--${type}">${msg}</div>`;
    
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(hideError, 2000);
};

const hideError = () => {
    const el = document.querySelector('.alert');
    if (el) el.parentElement.removeChild(el);
}

//type is either 'password' or 'data'
const updateData = async (data, type) => {
    try {
        const {name, email} = data
        const url = type === 'password' ? 'http://localhost:3000/api/v1/users/updateMyPassword' : 'http://localhost:3000/api/v1/users/updateMe';
        console.log(name, email)
        const res = await fetch(url, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
        if (res.status === 200) {
            showError('sucess', `${type.toUpperCase()} change successful`);
            window.setTimeout(() => {
                location.assign('/me')
            }, 1500)
        }
    } catch(err) {
        showError('error', err.message)
    }
}

const userForm = document.querySelector('.form-user-data');

if (userForm) {
    userForm.addEventListener('submit', e => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        updateData({name, email}, 'account');
    });
}