document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;
    const errorDiv = document.getElementById('error');

    try {
        const response = await fetch('/users/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const errorData = await response.json();
            errorDiv.textContent = errorData.error;
            errorDiv.style.color = 'red';
        } else {
            window.location.href = '/home.html'; // Redirect on successful login
        }
    } catch (error) {
        errorDiv.textContent = 'An error occurred during authentication.';
        errorDiv.style.color = 'red';
    }
});