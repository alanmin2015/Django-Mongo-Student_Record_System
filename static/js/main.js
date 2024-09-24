// const csrfToken = document.querySelector("[name=csrfmiddlewaretoken]").value;

//Handle Logout
const logout= ()=> {
  
    fetch('/user/logout/', {
        method: 'POST',  
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken 
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Successfully logged out') {
            window.location.href = '/user/login';  // Redirect to the login page
        }
    })
    .catch(error => console.error('Error:', error));
  }

  //Handle Register
const register= ()=> {
    window.location.href = '/user/register';
  }