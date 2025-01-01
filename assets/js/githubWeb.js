document.addEventListener('DOMContentLoaded', function() {
    const submitGithubButton = document.getElementById('submit-github');
    const githubUrlInput = document.getElementById('github-url');

    if (!submitGithubButton || !githubUrlInput) {
        console.error('GitHub submit elements not found');
        return;
    }

    submitGithubButton.addEventListener('click', async function() {
        const githubWebUrl = githubUrlInput.value;

        if (githubWebUrl) {
            try {
                const userId = await fetchLoggedInUserId(); // Ensure userId is fetched
                if (!userId) {
                    throw new Error('User ID not found');
                }

                const response = await fetch(`/users/${userId}/githubWebUrl`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ githubWebUrl })
                });

                if (!response.ok) {
                    throw new Error('Failed to submit GitHub link');
                }

                alert('GitHub link submitted successfully.');
            } catch (error) {
                console.error('Error submitting GitHub link:', error);
                alert('An error occurred while submitting the GitHub link.');
            }
        } else {
            alert('Please enter a valid GitHub URL.');
        }
    });

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
});
