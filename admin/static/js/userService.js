// Function to show the delete confirmation modal
let userIdToDelete = null; 
const showDeleteModal = (userId) => {
  userIdToDelete = userId; 
  const modal = document.getElementById('deleteModal');
  modal.style.display = 'block'; 
};

// Function to close the delete confirmation modal
const closeDeleteModal = () => {
  const modal = document.getElementById('deleteModal');
  modal.style.display = 'none'; 
  userIdToDelete = null; 
};

// Function to confirm deletion and send the request
const userContainer = document.querySelector('.user-list-container');
loggedInUserId = userContainer.getAttribute('data-user-id');
const confirmDelete = () => {
  if (userIdToDelete) {
    if(userIdToDelete==loggedInUserId){
      showToastMessage("You cannot delete your own account")
      return;
    }
    fetch(`/admin/delete_user/${userIdToDelete}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken
      }
    })
      .then((response) => {
        if (response.ok) {
          document.getElementById(userIdToDelete).remove(); 
          closeDeleteModal(); 
          showToastMessage('Delete Success!'); 
        } else {
          alert("Failed to delete user");
        }
      })
      .catch((error) => console.error("Error:", error));
  }
};

// Event listener to close the modal when clicking outside the modal content
window.onclick = function (event) {
  const modal = document.getElementById("deleteModal");
  if (event.target === modal) {
    closeDeleteModal();
  }
};

// Function to show the update modal
const showUpdateModal = (user) => {
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
      closeUpdateModal();
      showToastMessage('Update Success!'); 
      setTimeout(() => {
        location.reload(); 
      }, 2000)
    } else {
      document.getElementById('error_message').innerText = data.message;
    }
  })
  .catch((error) => console.error("Error:", error));
};

// Function to show the toast
function showToastMessage(message) {
  const toastModal = document.getElementById('toastModal');
  const toastMessage = document.getElementById('toastMessage');
  toastMessage.innerText = message;
  toastModal.style.display = 'block';
  
  setTimeout(() => {
    toastModal.style.display = 'none';
  }, 2000);
}

// Event listener to close the modal when clicking outside the modal content
window.onclick = function (event) {
  const modal = document.getElementById("updateModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};




