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
        const startTimeJavaElement = document.getElementById('start-time');
        const countdownTimerElement = document.getElementById('countdown-timer');

        // If userId == 0, skip setting the start time and countdown logic
        if (userId == 0) {
            startTimeJavaElement.textContent = 'No time restrictions for this exam.';
            countdownTimerElement.textContent = 'You have unlimited time for this exam.';
            return;
        }

        let startTimeJava;

        try {
            // Fetch the start time from the backend
            const response = await fetch(`/users/get/${userId}`);
            const data = await response.json();
    
            if (response.ok && data.startTimeJava) {
                // Start time found
                startTimeJava = new Date(data.startTimeJava);
            } else {
                // Start time not found, set a new start time
                startTimeJava = new Date();
                await fetch(`/users/${userId}/startTimeJava`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ startTimeJava: startTimeJava.toISOString() })
                });
            }
        } catch (error) {
            console.error('Error initializing exam:', error);
            return;
        }

        console.log(startTimeJava);
        startTimeJavaElement.textContent = `Exam started at: ${startTimeJava.toLocaleTimeString()}`;

        // Set the exam duration (8 hours for the actual exam, use a shorter time for testing)
        const examDuration = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
        const endTime = new Date(startTimeJava.getTime() + examDuration);

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
            window.location.href = '../examJava.html'; // Change 'home.html' to the URL of your home page
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

    // Event listener for requesting the exam code
    document.getElementById('requestCodeJavaButton').addEventListener('click', async function() {
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
            const exam = 'Java';
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
    

    // Event listener for unlocking the exam
    document.getElementById('unlock_examJava_form').addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the default form submission

        const examCode = document.getElementById('exam_code_input').value;

            // Regular user: Validate the exam code
            switch (examCode) {
                case 'mf58zf38':
                    window.location.href = '/exams/CoursePlatform.html';
                    break;
                case 'v8df68st':
                    window.location.href = '/exams/PetShelter.html';
                    break;
                case 'etg85f58':
                    window.location.href = '/exams/PirateCrew.html';
                    break;
                case 'cf78d6f3':
                    window.location.href = '/exams/TableMaster.html';
                    break;
                default:
                    alert('Invalid exam code. Please try again.');
                    break;
            }
   
    });
});
