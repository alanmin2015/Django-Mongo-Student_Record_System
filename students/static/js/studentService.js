const csrfToken = document.querySelector("[name=csrfmiddlewaretoken]").value;

const searchStudentById = (studentId, callback) => {
  console.log('Searching for student with ID:', studentId);

  fetch(`/home/get_student/${studentId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      console.log('Raw response:', response);  // Log the raw response

      // Check if the response is okay (status code 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Parse the response as JSON
      return response.json();
    })
    .then((data) => {
      console.log('Parsed data:', data);  // Log the parsed JSON data

      if (data.status === "success") {
        console.log('Student data:', data.student);  // Log the student data
        callback(data.student);
      } else {
        alert("Failed to fetch student data: " + data.message);
      }
    })
    .catch((error) => {
      // Log any errors encountered during the fetch or response handling
      console.error('Fetch error:', error);
      alert("An error occurred while fetching student data. Please try again.");
    });
};


const deleteStudent = (studentId) => {

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

// Function to show the update modal
const showUpdateModal = (student) => {
  console.log('student',student)
  searchStudentById(student, (student) => {
    console.log(2)
    // Show the modal
    const modal = document.getElementById("updateModal");
    modal.style.display = "block";

    // Pre-fill the form with the student's current info
    document.getElementById("student_id").value = student._id;
    document.getElementById("update_first_name").value = student.first_name;
    document.getElementById("update_last_name").value = student.last_name;
    document.getElementById("update_gender").value = student.gender;
    document.getElementById("update_grade").value = student.grade;
    document.getElementById("update_score").value = student.score;
  });
};

// Function to close the modal
const closeUpdateModal = () => {
  const modal = document.getElementById("updateModal");
  modal.style.display = "none";
};

// Function to submit the updated student info
const submitUpdate = () => {
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
        closeUpdateModal();
        const studentElement = document.getElementById(`${formData.get("student_id")}`);
        studentElement.innerHTML = `
          <td>${formData.get("student_id")}</td>
          <td>${formData.get("first_name")}</td>
          <td>${formData.get("last_name")}</td>
          <td>${formData.get("gender")}</td>
          <td>${formData.get("grade")}</td>
          <td>${formData.get("score")}</td>
          <td>
            <button onclick="deleteStudent('${formData.get("student_id")}')">Delete</button>
            <button onclick="showUpdateModal('${formData.get("student_id")}')">Update</button>
          </td>`;
      } else {
        alert("Failed to update student.");
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

// Redirect to the student detail page
function viewStudentDetail(studentId) {
  window.location.href = `/home/detail/${studentId}/`;
}
