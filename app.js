document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Form submission handler
    const form = document.getElementById('zloop-form');
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const loader = submitBtn.querySelector('.loader');
    const formMessage = document.getElementById('form-message');

    // IMPORTANT: Replace this URL with your Google Apps Script Web App URL after you set it up.
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyWJbnpNzAIan-B38KMZjITticmQkkwLeh_TqqkHNNHw2gnJ57utpB070PFrmCug76ynA/exec';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Form Validation & Data Extraction
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        data.needs_vps = formData.get('needs_vps') === 'on' ? 'Yes' : 'No';
        data.timestamp = new Date().toISOString();

        // UI State: Loading
        btnText.classList.add('hidden');
        loader.classList.remove('hidden');
        submitBtn.disabled = true;
        formMessage.className = 'form-message hidden';

        // Check if URL is configured
        if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE') {
            setTimeout(() => {
                showFormMessage('Configuration required: Please add your Google Script URL in app.js', 'error');
                resetBtn();
            }, 1000);
            return;
        }

        try {
            // We use no-cors mode for Google Apps Script to avoid CORS errors on the frontend.
            // Note: with no-cors, we can't read the response properly, so we assume success if it doesn't throw.
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            // If we reach here without a network error, assume success
            showFormMessage('Successfully connected! We will contact you shortly.', 'success');
            form.reset();

        } catch (error) {
            console.error('Error submitting form:', error);
            showFormMessage('Connection failed. Please try again later.', 'error');
        } finally {
            resetBtn();
        }
    });

    function showFormMessage(msg, type) {
        formMessage.textContent = msg;
        formMessage.className = `form-message ${type}`;
    }

    function resetBtn() {
        btnText.classList.remove('hidden');
        loader.classList.add('hidden');
        submitBtn.disabled = false;
    }
});
