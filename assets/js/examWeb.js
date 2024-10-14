document.addEventListener('DOMContentLoaded', async function() {
    // Function to fetch the logged-in user ID
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

    // Function to fetch user data by userId
    async function fetchUserData(userId) {
        try {
            const response = await fetch(`/users/get/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching user data:', error);
            return null;
        }
    }
  
    // Function to send the exam code to the user's email
    async function sendExamCode(userId, userName, userEmail, userPhone, exam) {
        try {
            emailjs.init("x_P0kqVUXbwahW2_q");
            const response = await emailjs.send('service_k3hbzro', 'template_pd1exnc', {
                id: userId,
                name: userName,
                email: userEmail,
                phone: userPhone,
                exam: exam
            });
            console.log('Email sent successfully:', response);
            alert('Exam code sent! Check your email.');
        } catch (error) {
            console.error('Failed to send email:', error);
            alert('Failed to send exam code. Please try again.');
        }
    }
    // Function to initialize the exam
    async function initializeExam(userId) {
        const startTimeElement = document.getElementById('start-time');
        const countdownTimerElement = document.getElementById('countdown-timer');
   // If userId == 0, skip setting the start time and countdown logic
   if (userId == 0) {
    startTimeElement.textContent = 'No time restrictions for this exam.';
    countdownTimerElement.textContent = 'You have unlimited time for this exam.';
    return;
}
        let startTimeWeb;

        try {
            // Fetch the start time from the backend
            const response = await fetch(`/users/get/${userId}`);
            const data = await response.json();

            if (response.ok && data.startTimeWeb) {
                // Start time found
                startTimeWeb = new Date(data.startTimeWeb);
            } else {
                // Start time not found, set a new start time
                startTimeWeb = new Date();
                await fetch(`/users/${userId}/startTimeWeb`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ startTimeWeb: startTimeWeb.toISOString() })
                });
            }
        } catch (error) {
            console.error('Error initializing exam:', error);
            return;
        }

        console.log(startTimeWeb);
        startTimeElement.textContent = `Exam started at: ${startTimeWeb.toLocaleTimeString()}`;

        // Set the exam duration (8 hours for the actual exam, use a shorter time for testing)
        const examDuration =8 * 60 * 60 * 1000; // 8 hours in milliseconds
        const endTime = new Date(startTimeWeb.getTime() + examDuration);

        function updateCountdown() {
            const now = new Date();
            const timeRemaining = endTime - now;

            if (timeRemaining <= 0) {
                countdownTimerElement.textContent = 'Time is up!';
                clearInterval(timerInterval);
                redirectToHomePage();
            } else {
                const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60);
                const seconds = Math.floor((timeRemaining / 1000) % 60);

                countdownTimerElement.textContent = `Time remaining: ${hours}h ${minutes}m ${seconds}s`;
            }
        }

        function redirectToHomePage() {
            window.location.href = '../examWeb.html'; // Change 'home.html' to the URL of your home page
        }

        // Check if the exam time is already over when the page loads
        if (new Date() > endTime) {
            redirectToHomePage();
        } else {
            const timerInterval = setInterval(updateCountdown, 1000);
            updateCountdown(); // Initial call to set the timer immediately
        }
    }

    // Fetch the logged-in user ID and initialize the exam
    const userId = await fetchLoggedInUserId();
    if (userId) {
        initializeExam(userId);
    } else {
        console.error('No logged-in user ID found');
        // Handle the case where no user ID is found (e.g., redirect to login page)
    }
    document.getElementById('requestCodeWebButton').addEventListener('click', async function() {
        try {
            const loggedInUserId = await fetchLoggedInUserId();
            if (!loggedInUserId) {
                console.log('User not logged in.');
                return;
            }
    
            // Fetch user data for the logged-in user
            const userData = await fetchUserData(loggedInUserId);
    
            // Fetch ExamButton from the database
            const response = await fetch(`/users/get/${loggedInUserId}`);
            const { ExamButton } = await response.json();
            
            // Calculate the time difference
            const now = new Date();
            const lastRequestTime = new Date(ExamButton);
            const timeDifference = now - lastRequestTime;
    
            // Check if 24 hours (86400000 milliseconds) have passed
            if (timeDifference < 86400000) {
                alert('You can only request the exam code once every 24 hours.');
                return;
            }
    
            // If 24 hours have passed, send the exam code
            const exam = 'Web Fundamentals';
            sendExamCode(userData.userId, userData.username, userData.email, userData.phone, exam);
    
            // Update ExamButton in the database
            await fetch(`/users/${loggedInUserId}/ExamButton`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ExamButton: now.toISOString() })
            });
            
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while processing your request.');
        }
    });
    // Event listener for requesting the exam code
    // document.getElementById('requestCodeWebButton').addEventListener('click', async function() {
    //     try {
    //         const loggedInUserId = await fetchLoggedInUserId();
    //         if (!loggedInUserId) {
    //             console.log('User not logged in.');
    //             return;
    //         }

    //         const userData = await fetchUserData(loggedInUserId);
    //         const exam = 'Web Fundamentals';

    //         sendExamCode(userData.userId, userData.username, userData.email, userData.phone, exam);
    //     } catch (error) {
    //         console.error('Error:', error);
    //         alert('An error occurred while processing your request.');
    //     }
    // });
   
    // Event listener for unlocking the exam
    document.getElementById('unlock_Webexam_form').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        const examCode = document.getElementById('exam_codeweb_input').value;

        switch (examCode) {
            case 'jy865dbn':
                window.location.href = '/exams/Pirates.html';
                break;
            case 'lmo9dv58':
                window.location.href = '/exams/PlushyStore.html';
                break;
            default:
                alert('Invalid exam code. Please try again.');
                break;
        }
    });

});
