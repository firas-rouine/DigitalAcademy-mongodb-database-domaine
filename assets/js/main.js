// Get all the copy to clipboard buttons
const clipboardButtons = document.querySelectorAll('.btn-clipboard');
let currentPage = 0;
const rowsPerPage = 20;
let logsData = [];
let usersData = [];
let currentPageLogs = 0;
const rowsPerPageLogs = 20;

// Add click event listeners to each button
clipboardButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Find the code element associated with the clicked button
    const codeElement = button.closest('.highlight').querySelector('pre');

    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = codeElement.textContent;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';

    // Append the textarea to the document body
    document.body.appendChild(textarea);

    // Select and copy the text inside the textarea
    textarea.select();
    document.execCommand('copy');

    // Remove the textarea from the document body
    document.body.removeChild(textarea);

    console.log('Text copied to clipboard successfully!');
  });
});

// Function to fetch user data
async function fetchUserData(userId) {
  console.log('Fetching data for userId:', userId); // Log the userId
  try {
    const response = await fetch(`/users/get/${userId}`);
    console.log('Response status:', response.status); // Log response status
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    const userData = await response.json();
    console.log('User data received:', userData); // Log the received user data
    return userData;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null; // Return null if there is an error
  }
}

// Function to fetch logged-in user ID
async function fetchLoggedInUserId() {
  try {
    const response = await fetch('/getLoggedInUserId');
    if (!response.ok) {
      throw new Error('Failed to fetch logged-in user ID');
    }
    const { userId } = await response.json();
    return userId;
  } catch (error) {
    console.error('Error fetching logged-in user ID:', error);
    return null;
  }
}

// // Function to display user activity logs
// function displayLogs(logs) {
//   // const logsContainer = document.createElement('div');
//   // logsContainer.innerHTML = `
//   //     <h1>User Activity Logs</h1>
//   //     <table class="table">
//   //         <thead>
//   //             <tr>
//   //                 <th>Usergg ID</th>
//   //                 <th>Username</th>
//   //                 <th>Email</th>
//   //                 <th>Timestamp</th>
//   //             </tr>
//   //         </thead>
//   //         <tbody id="logsTableBody"></tbody>
//   //     </table>
//   // `;

//   const tableBody = logsContainer.querySelector('#logsTableBody');
//   tableBody.innerHTML = '';

//   logs.forEach(log => {
//       // Format the timestamp to show only date and time
//       const timestamp = new Date(log.timestamp);
//       const formattedTimestamp = `${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString()}`;
//       console.log("ggggggggggggggg",formattedTimestamp);

//       const logElement = document.createElement('tr');
//       logElement.innerHTML = `
//           <td>${log.userId}</td>
//           <td>${log.username}</td>
//           <td>${log.email}</td>
//           <td>${formattedTimestamp}</td>
//       `;
//       tableBody.appendChild(logElement);
//   });

//   const existingContainer = document.getElementById('logsContainer');
//   existingContainer.innerHTML = ''; // Clear any previous content
//   existingContainer.appendChild(logsContainer);
// }

// Function to validate and send email
function validateAndSend() {
  const email = document.getElementById('email_addr').value;
  const phone = document.getElementById('phone_input').value;
  const name = document.getElementById('name_input').value;
  // const coupon = document.getElementById('coupon_input').value;
  const emailInput = document.getElementById('email_addr');
  const phoneInput = document.getElementById('phone_input');
  const nameInput = document.getElementById('name_input');

  const emailError = document.getElementById('email_error');
  const phoneError = document.getElementById('phone_error');
  const nameError = document.getElementById('name_error');

  // Validate email format if provided
  if (email.trim() === '') {
    emailInput.classList.add('is-invalid');
    emailError.textContent = 'Email is required.';
    return;
  } else if (!isValidEmail(email)) {
    emailInput.classList.add('is-invalid');
    emailError.textContent = 'Please enter a valid email address.';
    return;
  } else {
    emailInput.classList.remove('is-invalid');
    emailError.textContent = '';
  }

  // Validate phone format if provided
  if (phone.trim() === '') {
    phoneInput.classList.add('is-invalid');
    phoneError.textContent = 'Phone is required.';
    return;
  } else if (!isValidPhone(phone)) {
    phoneInput.classList.add('is-invalid');
    phoneError.textContent = 'Please enter a valid phone number.';
    return;
  } else {
    phoneInput.classList.remove('is-invalid');
    phoneError.textContent = '';
  }

  // Validate name if provided
  if (name.trim() === '') {
    nameInput.classList.add('is-invalid');
    nameError.textContent = 'Full Name is required.';
    return;
  } else {
    nameInput.classList.remove('is-invalid');
    nameError.textContent = '';
  }

  // Proceed to send email or handle form submission
  sendEmail();
}

// Function to check email format
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Function to check phone number format
function isValidPhone(phone) {
  const regex = /^\D*(?:\d\D*){8}$/;
  return regex.test(phone);
}

// Function to send email using EmailJS
function sendEmail() {
  emailjs.init("x_P0kqVUXbwahW2_q");

  const formData = {
    id: document.getElementById('pack_select').value,
    email: document.getElementById('email_addr').value,
    name: document.getElementById('name_input').value,
    phone: document.getElementById('phone_input').value,
    coupon: document.getElementById('coupon_input').value,
    message: document.getElementById('message').value
  };

  emailjs.send("service_804ea5m", "template_psqnpmd", formData)
    .then(response => {
      console.log("Email sent:", response);
      showSuccessPopup(); // Show success popup
    })
    .catch(error => {
      console.error("Email failed to send:", error);
      showErrorPopup(); // Show error popup
    });
}

// Function to show success popup
function showSuccessPopup() {
  const popup = document.getElementById('success-popup');
  popup.classList.add('success');
  popup.style.display = 'block';
  setTimeout(() => {
    popup.style.display = 'none';
    closeModal();
  }, 3000); // Hide after 3 seconds
}

// Function to show error popup
function showErrorPopup() {
  const popup = document.getElementById('error-popup');
  popup.classList.add('error');
  popup.style.display = 'block';
  setTimeout(() => {
    popup.style.display = 'none';
  }, 3000); // Hide after 3 seconds
}

// Function to close modal
function closeModal() {
  const modal = document.getElementById('popupModal');
  const modalInstance = bootstrap.Modal.getInstance(modal);
  modalInstance.hide();
}

// Function to copy text to clipboard
function setupClipboard() {
  const clipboardButtons = document.querySelectorAll('.btn-clipboard');

  clipboardButtons.forEach(button => {
    button.addEventListener('click', () => {
      const codeElement = button.closest('.highlight').querySelector('pre');
      const textarea = document.createElement('textarea');
      textarea.value = codeElement.textContent;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';

      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);

      console.log('Text copied to clipboard successfully!');
    });
  });
}

// Function to handle DOMContentLoaded
document.addEventListener('DOMContentLoaded', async function () {
  try {
    const loggedInUserId = await fetchLoggedInUserId(); // Fetch logged-in user ID
    if (!loggedInUserId) {
      console.log('User not logged in.');
      return;
    }

    const userData = await fetchUserData(loggedInUserId); // Fetch user data for the logged-in user
    console.log("userData", userData);
    console.log("loggedInUserId", loggedInUserId);

    // Always create the top bar if the user status is pack1
    if (userData && userData.status === 'pack1') {
      createTopBar(); // Create the top bar for pack1 users
    }

    if (userData) {
      const tracks_list = document.getElementById('tracks_list');
      if (!tracks_list) {
        console.error('Element with ID "tracks_list" not found.');
        return;
      }

      // Check user's access level and load appropriate content
      if (userData.status === 'pack3') {
        loadContent('/data/courses.txt', tracks_list);
      } else if (userData.status === 'pack1') {
        loadContent('/data/javafree.txt', tracks_list);
      } else if (userData.status === 'pack2') {
        loadContent('/data/pack2.txt', tracks_list);
      } else {
        console.log('User does not have access to relevant content.');
        tracks_list.innerHTML = '<p>No access to relevant content.</p>';
      }
    } else {
      console.log('Failed to load user data.');
      tracks_list.innerHTML = '<p>Failed to load user data.</p>';
    }

    // Set up clipboard functionality
    setupClipboard();
  } catch (error) {
    console.error('Error handling DOMContentLoaded:', error);
  }
});

// Function to create the top bar
function createTopBar() {
  const topBar = document.createElement("div");
  topBar.id = "topBar";
  topBar.innerHTML = "<p>Free for 10 days</p>";

  // Append the top bar to the body at the top
  document.body.insertBefore(topBar, document.body.firstChild);

  // Apply styles to the top bar
  const style = document.createElement('style');
  style.innerHTML = `
    #topBar {
      width: 100%;
      background-color: black;
      color: #fff;
      text-align: center;
      padding: 10px 0;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1000;
    }
    body {
      padding-top: 50px; /* Adjust based on the height of the top bar */
    }
  `;
  document.head.appendChild(style);
}


// Function to create the top bar
function createTopBar() {
  const topBar = document.createElement("div");
  topBar.id = "topBar";
  topBar.innerHTML = "<p>Free for 10 days</p>";

  // Append the top bar to the body at the top
  document.body.insertBefore(topBar, document.body.firstChild);

  // Apply styles to the top bar
  const style = document.createElement('style');
  style.innerHTML = `
    #topBar {
        width: 100%;
        background-color: black;
        color: #fff;
        text-align: center;
        padding: 10px 0;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 999;
    }
    #topBar p {
        margin: 0;
        font-size: 1.3rem;
        animation: blink 2s infinite;
    }
    @keyframes blink {
        0%, 100% { color: red; }
        50% { color: #fff; }
    }
    body {
        padding-top: 50px; /* Adjust based on the height of the top bar */
    }
  `;
  document.head.appendChild(style);
}

// Function to load content based on user status
function loadContent(url, tracks_list) {
  fetch(url)
    .then(response => response.text())
    .then(data => {
      tracks_list.innerHTML = data;
    })
    .catch(error => console.error(`Error fetching data from ${url}:`, error));
}




function sendExamCode(userId,userName,userEmail,userphone,exam) {
  
  emailjs.init("x_P0kqVUXbwahW2_q");
  emailjs.send('service_k3hbzro', 'template_pd1exnc', {
      id: userId,
      name: userName,
      email: userEmail,
      phone: userphone,
      exam:exam
      
  }).then((response) => {
      alert('Exam code sent! Check your email.');
  }, (error) => {
      console.error('Failed to send email:', error);
      alert('Failed to send exam code. Please try again.');
  });
}

/*************************home.html*********************************/



document.addEventListener('DOMContentLoaded', () => {
  // Fetch users when the page loads
  fetchUsers();

  // Handle edit button click
  document.querySelector('#usersTable').addEventListener('click', async (e) => {
    if (e.target.classList.contains('edit-btn')) {
      const userId = e.target.getAttribute('data-id');
      try {
        const response = await fetch(`/users/get/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
        const user = await response.json();

        // Populate the form fields in the modal with user data
        document.getElementById('editUserId').value = user.userId;
        document.getElementById('editUsername').value = user.username;
        document.getElementById('editEmail').value = user.email;
        document.getElementById('editPassword').value = '';
        document.getElementById('editPhone').value = user.phone;
        document.getElementById('editStatus').value = user.status;
        document.getElementById('editcoupon').value = user.coupon;

        // Show the modal
        $('#editUserModal').modal('show');
      } catch (error) {
        console.error('Error:', error);
      }
    }
  });

  // Handle edit form submission
  document.getElementById('editUserForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission

    const userId = document.getElementById('editUserId').value;
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries()); // Convert form data to an object

    try {
      const response = await fetch(`/users/update/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        alert('User updated successfully!');
        this.reset(); // Reset the form fields
        $('#editUserModal').modal('hide'); // Hide the modal after successful submission
        fetchUsers(); // Refresh the list after update
      } else {
        const error = await response.json();
        alert('Failed to update user: ' + error.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating the user.');
    }
  });

  // Handle add form submission
  document.getElementById('addUserForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries()); // Convert form data to an object

    try {
      const response = await fetch('/users/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const result = await response.json();
        alert('User added successfully!');
        this.reset(); // Reset the form fields
        $('#addUserModal').modal('hide'); // Hide the modal after successful submission
        fetchUsers(); // Refresh the list after addition
      } else {
        const error = await response.json();
        alert('Failed to add user: ' + error.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding the user.');
    }
  });

  // Function to fetch users and populate the table

  
  async function fetchUsers(page) {
    try {
      const response = await fetch('/users/getall');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      usersData = await response.json();
      
      displayUsers(page); // Display users for the current page
      setupPagination(usersData.length); // Set up pagination based on the total users
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }
  
  function displayUsers(page=0) {
    const tableBody = document.querySelector('#usersTable tbody');
    tableBody.innerHTML = ''; // Clear any existing rows
    
    // Calculate start and end index for the current page
    const start = (page) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedUsers = usersData.slice(start, end);
    
    // Populate the table with paginated user data
    paginatedUsers.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.userId}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td>${user.status}</td>
        <td>${user.coupon}</td>
        <td>${user.startTimeJava ? new Date(user.startTimeJava).toLocaleString() : ''}</td>
        <td>${user.startTimeWeb ? new Date(user.startTimeWeb).toLocaleString() : ''}</td>
        <td><a href="${user.githubJavaUrl}" target="_blank">${user.githubJavaUrl}</a></td>
        <td><a href="${user.githubWebUrl}" target="_blank">${user.githubWebUrl}</a></td>
        <td>
        <div class="btn-group">
          <button class="btn btn-primary edit-btn" data-id="${user.userId}">Edit</button>
          <button class="btn btn-primary delete-btn" data-id="${user.userId}">Delete</button>
        </td>
        </div>
      `;
      tableBody.appendChild(row);
    });
    
    // Add event listeners for delete buttons after rows are created
    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', async (e) => {
        const userId = e.target.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this user?')) {
          try {
            const response = await fetch(`/users/delete/${userId}`, {
              method: 'DELETE',
            });
            if (response.ok) {
              fetchUsers(currentPage); // Refresh the list after deletion
            } else {
              alert('Failed to delete user');
            }
          } catch (error) {
            console.error('Error:', error);
          }
        }
      });
    });
  }
  
  function setupPagination(totalUsers) {
    const totalPages = Math.ceil(totalUsers / rowsPerPage);
    const paginationElement = document.querySelector('#pagination');
    paginationElement.innerHTML = ''; // Clear existing pagination buttons
  
    // Set the maximum number of visible page numbers based on screen width
    const maxVisiblePages = window.innerWidth <= 600 ? 3 : 5; // 3 on smaller screens, 5 on larger screens
    const halfRange = Math.floor(maxVisiblePages / 2);
  
    // Determine start and end page numbers based on the current page
    let startPage = Math.max(0, currentPage - halfRange);
    let endPage = Math.min(totalPages - 1, currentPage + halfRange);
  
    // Adjust if the start or end page is out of bounds
    if (currentPage <= halfRange) {
      endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
    }
    if (currentPage >= totalPages - halfRange) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }
  
    // Add "Previous" button
    if (currentPage > 0) {
      const prevLi = document.createElement('li');
      prevLi.classList.add('page-item');
      prevLi.innerHTML = `<a class="page-link" href="#">Previous</a>`;
      prevLi.addEventListener('click', (event) => {
        event.preventDefault();
        currentPage--;
        displayUsers(currentPage);
        setupPagination(totalUsers);
      });
      paginationElement.appendChild(prevLi);
    }
  
    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      const li = document.createElement('li');
      li.classList.add('page-item');
      li.innerHTML = `<a class="page-link" href="#">${i + 1}</a>`; // Display 1-based page numbers
  
      if (i === currentPage) {
        li.classList.add('active');
      }
  
      li.addEventListener('click', (event) => {
        event.preventDefault();
        currentPage = i;
        displayUsers(currentPage);
        setupPagination(totalUsers);
      });
  
      paginationElement.appendChild(li);
    }
  
    // Add "Next" button
    if (currentPage < totalPages - 1) {
      const nextLi = document.createElement('li');
      nextLi.classList.add('page-item');
      nextLi.innerHTML = `<a class="page-link" href="#">Next</a>`;
      nextLi.addEventListener('click', (event) => {
        event.preventDefault();
        currentPage++;
        displayUsers(currentPage);
        setupPagination(totalUsers);
      });
      paginationElement.appendChild(nextLi);
    }
  }
  
  // Add a resize event listener to make pagination responsive on screen resize
  window.addEventListener('resize', () => setupPagination(totalUsers));
  
  

  
  // Call fetchUsers to populate the table when the page loads
  fetchUsers();
  
});

document.addEventListener('DOMContentLoaded', async function () {
  try {
    const loggedInUserId = await fetchLoggedInUserId(); // Fetch logged-in user ID
    if (!loggedInUserId) {
      console.log('User not logged in.');
      return;
    }

    const userData = await fetchUserData(loggedInUserId); // Fetch user data for the logged-in user
    console.log("userData", userData);
    console.log("loggedInUserId", loggedInUserId);

    // Show or hide the Manage Users section based on userId
    const manageUsersSection = document.getElementById('manageUsersSection');
    if ((userData && userData.userId === '00') || (userData && userData.userId === '01')) {
      manageUsersSection.style.display = 'block';
    } else {
      manageUsersSection.style.display = 'none';
    }

    // Fetch and display logs
    await fetchAndDisplayLogs();

    // Other existing logic...

    // Set up clipboard functionality
    setupClipboard();
  } catch (error) {
    console.error('Error handling DOMContentLoaded:', error);
  }
});

async function fetchAndDisplayLogs() {
  try {
    const response = await fetch('/users/logs'); // Adjust the URL if needed
    if (!response.ok) {
      throw new Error('Failed to fetch logs');
    }
    logsData = await response.json(); // Fetch logs and store them
    displayLogs(currentPageLogs); // Display logs for the first page
    setupPaginationLogs(logsData.length); // Setup pagination based on the total logs
  } catch (error) {
    console.error('Error fetching logs:', error);
  }
}

function displayLogs(page=0 ) {
  const logsTableBody = document.querySelector('#logsTable tbody');
  logsTableBody.innerHTML = ''; // Clear existing rows

  // Calculate start and end index for the current page
  const start = (page) * rowsPerPageLogs;
  const end = start + rowsPerPageLogs-1;
  const paginatedLogs = logsData.slice(start, end);

  // Populate the table with paginated log data
  paginatedLogs.forEach(log => {
    const row = document.createElement('tr');
    const date = new Date(log.timestamp);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();

    row.innerHTML = `
      <td>${log.userId}</td>
      <td>${log.username}</td>
      <td>${log.email}</td>
      <td>${log.phone}</td>
      <td>${formattedDate} ${formattedTime}</td>
    `;

    logsTableBody.appendChild(row);
  });
}

function setupPaginationLogs(totalLogs) {
  const totalPages = Math.ceil(totalLogs / rowsPerPageLogs);
  const paginationElement = document.querySelector('#paginationLogs');
  paginationElement.innerHTML = ''; // Clear existing pagination buttons

  // Determine how many pages to show based on screen width
  const maxVisiblePages = window.innerWidth <= 600 ? 3 : 5; // Show fewer pages on smaller screens

  // Calculate the range of pages to display
  const halfRange = Math.floor(maxVisiblePages / 2);
  let startPage = Math.max(0, currentPageLogs - halfRange);
  let endPage = Math.min(totalPages - 1, currentPageLogs + halfRange);

  // Adjust if the start or end page goes out of bounds
  if (currentPageLogs <= halfRange) {
    endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
  }
  if (currentPageLogs >= totalPages - halfRange) {
    startPage = Math.max(0, endPage - maxVisiblePages + 1);
  }

  // Add "Previous" button
  if (currentPageLogs > 0) {
    const prevLi = document.createElement('li');
    prevLi.classList.add('page-item');
    prevLi.innerHTML = `<a class="page-link" href="#">Previous</a>`;
    prevLi.addEventListener('click', (event) => {
      event.preventDefault();
      currentPageLogs--;
      displayLogs(currentPageLogs);
      setupPaginationLogs(totalLogs);
    });
    paginationElement.appendChild(prevLi);
  }

  // Add page numbers
  for (let i = startPage; i <= endPage; i++) {
    const li = document.createElement('li');
    li.classList.add('page-item');
    li.innerHTML = `<a class="page-link" href="#">${i}</a>`;

    if (i === currentPageLogs) {
      li.classList.add('active');
    }

    li.addEventListener('click', (event) => {
      event.preventDefault();
      currentPageLogs = i;
      displayLogs(currentPageLogs);
      setupPaginationLogs(totalLogs);
    });

    paginationElement.appendChild(li);
  }

  // Add "Next" button
  if (currentPageLogs < totalPages - 1) {
    const nextLi = document.createElement('li');
    nextLi.classList.add('page-item');
    nextLi.innerHTML = `<a class="page-link" href="#">Next</a>`;
    nextLi.addEventListener('click', (event) => {
      event.preventDefault();
      currentPageLogs++;
      displayLogs(currentPageLogs);
      setupPaginationLogs(totalLogs);
    });
    paginationElement.appendChild(nextLi);
  }
}

// Add a resize event listener to update pagination on screen resize
window.addEventListener('resize', () => setupPaginationLogs(totalLogs));


// Call the function to fetch and display logs when the page loads
fetchAndDisplayLogs();
