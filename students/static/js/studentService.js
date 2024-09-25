// Find student by Id
const searchStudentById = (studentId, callback) => {
  fetch(`/home/get_student/${studentId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.status === "success") {
        callback(data.student);
      } else {
        alert("Failed to fetch student data: " + data.message);
      }
    })
    .catch((error) => {
      console.error('Fetch error:', error);
      alert("An error occurred while fetching student data. Please try again.");
    });
};

// Show the update modal
const showStudentUpdateModal = (student) => {
  searchStudentById(student, (student) => {
    // Show the modal
    const modal = document.getElementById("updateModal");
    modal.style.display = "block";

    document.getElementById("student_id").value = student._id;
    document.getElementById("update_first_name").value = student.first_name;
    document.getElementById("update_last_name").value = student.last_name;
    document.getElementById("update_gender").value = student.gender;
    document.getElementById("update_grade").value = student.grade;
    document.getElementById("update_score").value = student.score;
  });
};

// Close the modal
const closeStudentUpdateModal = () => {
  const modal = document.getElementById("updateModal");
  modal.style.display = "none";
};

// Submit the updated student info
const submitStudentUpdate = () => {
  const formData = new FormData(document.getElementById("updateForm"));

  fetch(`/home/update_student/${formData.get("student_id")}/`, {
    method: "POST",
    headers: {
      "X-CSRFToken": csrfToken, 
    },
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        closeStudentUpdateModal();
        showStudentToastMessage('Update Success!'); 
        setTimeout(() => {
          location.reload(); 
        }, 2000)
      } else {
        alert("Failed to update student.");
      }
    })
    .catch((error) => console.error("Error:", error));
};

// Event listener to close the modal
window.onclick = function (event) {
  const modal = document.getElementById("updateModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Redirect to the studentdetail page
function viewStudentDetail(studentId) {
  window.location.href = `/home/detail/${studentId}/`;
}

// Show the Add Student Modal
const showAddStudentModal = () => {
  const modal = document.getElementById('addStudentModal');
  modal.style.display = 'block';
};

//Close the Add Student Modal
const closeAddStudentModal = () => {
  const modal = document.getElementById('addStudentModal');
  modal.style.display = 'none';
};

// Event listener to close modal 
window.onclick = function (event) {
  const modal = document.getElementById("addStudentModal");
  if (event.target == modal) {
    closeAddStudentModal();
  }
};


// Show the delete confirmation modal
let studentIdToDelete = null; 
const showStudentDeleteModal = (studentId) => {
  studentIdToDelete = studentId; 
  const modal = document.getElementById('deleteModal');
  modal.style.display = 'block';
};

// Close the delete confirmation modal
const closeStudentDeleteModal = () => {
  const modal = document.getElementById('deleteModal');
  modal.style.display = 'none'; 
  studentIdToDelete = null; 
};


const confirmStudentDelete = (studentId) => {

  fetch(`/home/delete_student/${studentId}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
    },
  })
    .then((response) => {
      if (response.ok) {
        document.getElementById(`${studentId}`).remove();
      } else {
        alert("Failed to delete student");
      }
    })
    .catch((error) => console.error("Error: ", error));
};


// Function to show the toast
function showStudentToastMessage(message) {
  const toastModal = document.getElementById('toastModal');
  const toastMessage = document.getElementById('toastMessage');
  toastMessage.innerText = message;
  toastModal.style.display = 'block';
  
  setTimeout(() => {
    toastModal.style.display = 'none';
  }, 2000);
}