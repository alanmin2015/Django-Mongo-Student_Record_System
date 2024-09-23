const csrfToken = document.querySelector("[name=csrfmiddlewaretoken]").value;

const deleteUser = (userId) => {
  fetch(`/admin/delete_user/${userId}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken
    },
  })
    .then((response) => {
      if (response.ok) {
        document.getElementById(`${userId}`).remove();
      } else {
        alert("Failed to delete user");
      }
    })
    .catch((error) => console.error("Error: ", error));
};

// Function to show the update modal
const showUpdateModal = (user) => {
  console.log('user',user)
  document.getElementById('update_user_id').value = user.id;
  document.getElementById('update_email').innerText = user.email;
  document.getElementById('update_password').value = '';
  document.getElementById('update_is_admin').checked = (user.is_admin === 'True');
  document.getElementById('update_is_superuser').checked = (user.is_superuser === 'True');

  // Show the modal
  const modal = document.getElementById('updateModal');
  modal.style.display = 'block';
};

// Function to close the modal
const closeUpdateModal = () => {
  const modal = document.getElementById("updateModal");
  modal.style.display = "none";
};

// Function to submit the updated student info
const submitUpdate = () => {
  const userId = document.getElementById('update_user_id').value;
  const password = document.getElementById('update_password').value;
  const confirm_password = document.getElementById('confirm_password').value;
  const isAdmin = document.getElementById('update_is_admin').checked;
  const isSuperuser = document.getElementById('update_is_superuser').checked;

  // Send request to update the student
  fetch(`/admin/update_user/${userId}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
    },
    body: JSON.stringify({
      password: password,
      confirm_password:confirm_password,
      is_admin: isAdmin,
      is_superuser: isSuperuser,
    }),
  })
  .then(response => response.json())
  .then((data) => {
    if (data.status === 'success') {
      alert('User updated successfully');
      closeUpdateModal();
      location.reload();
    } else {
      // Display error messages
      document.getElementById('error_message').innerText = data.message;
    }
  })
  .catch((error) => console.error("Error:", error));
};

// Event listener to close the modal when clicking outside the modal content
window.onclick = function (event) {
  const modal = document.getElementById("updateModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};


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