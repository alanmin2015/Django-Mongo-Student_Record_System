const deleteStudent=(studentId)=>{
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    console.log(`Deleting student with ID: ${studentId}`);

    fetch(`/home/delete_student/${studentId}/`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'X-CSRFToken': csrfToken
        },
    })
    .then(response=>{
        if(response.ok){
            document.getElementById(`${studentId}`).remove();
        }else{
            alert('Failed to delete student')
        }
    })
    .catch(error=>console.error('Error: ', error));
}

// Function to open the modal and populate the form with the current student info
const showUpdateModal = (studentId,firstName, lastName) => {
    // Show the modal
    const modal = document.getElementById('updateModal');
    modal.style.display = 'block';

    // Pre-fill the form with the student's current info
    document.getElementById('student_id').value = studentId;
    document.getElementById('update_first_name').value = firstName;
    document.getElementById('update_last_name').value = lastName;
};

// Function to close the modal
const closeUpdateModal = () => {
    const modal = document.getElementById('updateModal');
    modal.style.display = 'none';
};

// Function to submit the updated student info
const submitUpdate = () => {
    const studentId = document.getElementById('student_id').value;
    const firstName = document.getElementById('update_first_name').value;
    const lastName = document.getElementById('update_last_name').value;
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    // Send AJAX request to update the student
    fetch(`/home/update_student/${studentId}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
            'first_name': firstName,
            'last_name': lastName,
        })
    })
    .then(response => {
        if (response.ok) {
            // Close the modal
            closeUpdateModal();

            // Update the student in the DOM
            const studentElement = document.getElementById(`${studentId}`);
            studentElement.innerHTML = `${firstName} ${lastName} 
                <button onclick="deleteStudent('${studentId}')">Delete</button>
                <button onclick="showUpdateModal('${studentId}', '${firstName}', '${lastName}')">Update</button>`;
        } else {
            alert('Failed to update student.');
        }
    })
    .catch(error => console.error('Error:', error));
};

// Event listener to close the modal when clicking outside the modal content
window.onclick = function(event) {
    const modal = document.getElementById('updateModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};
