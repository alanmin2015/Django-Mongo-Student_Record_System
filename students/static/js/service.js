const searchStudentById = (studentId, callback) => {
  fetch(`/get_student/${studentId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status == "success") {
        callback(data.student);
      } else {
        alert("Failed to fetch student data");
      }
    })
    .catch((error) => console.error("Error", error));
};

const deleteStudent = (studentId) => {
  const csrfToken = document.querySelector("[name=csrfmiddlewaretoken]").value;

  fetch(`/delete_student/${studentId}/`, {
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
  searchStudentById(student, (student) => {
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
  const studentId = document.getElementById("student_id").value;
  const firstName = document.getElementById("update_first_name").value;
  const lastName = document.getElementById("update_last_name").value;
  const gender = document.getElementById("update_gender").value;
  const grade = document.getElementById("update_grade").value;
  const score = document.getElementById("update_score").value;
  const csrfToken = document.querySelector("[name=csrfmiddlewaretoken]").value;

  // Send AJAX request to update the student
  fetch(`/update_student/${studentId}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
    },
    body: JSON.stringify({
      first_name: firstName,
      last_name: lastName,
      gender: gender,
      grade: grade,
      score: score,
    }),
  })
    .then((response) => {
      if (response.ok) {
        // Close the modal
        closeUpdateModal();

        // Update the student in the DOM
        const studentElement = document.getElementById(`${studentId}`);
        studentElement.innerHTML = ` <td>${studentId}</td>
        <td>${firstName}</td>
        <td>${lastName}</td>
        <td>${gender}</td>
        <td>${grade}</td>
        <td>${score}</td>
        <td>
            <button onclick="deleteStudent('${studentId}')">Delete</button>
            <button onclick="showUpdateModal('${studentId}')">Update</button>
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
