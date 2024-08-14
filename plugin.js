function sendValidationResult(emailData) {
    fetch('http://localhost:8000/validate/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            field_name: 'email_analysis',
            validation_message: emailData.isPhishing ? 'Phishing attempt detected' : 'Email is safe',
            email_date: emailData.date,
            url: emailData.url,
            recipient: emailData.recipient,
            content: emailData.content
        })
    })
    .then(response => response.json())
    .then(data => console.log('Validation result sent:', data))
    .catch(error => console.error('Error sending validation result:', error));
}

// Escuchar mensajes de background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "validateEmail") {
        // Simular datos de correo para validación
        const emailData = {
            url: window.location.href,
            recipient: request.recipient,
            content: request.content,
            date: request.date,
            isPhishing: request.isPhishing
        };
        sendValidationResult(emailData);
    }
});
