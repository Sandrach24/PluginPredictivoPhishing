chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "checkEmail") {
    console.log('Received request:', request);

    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => {
        const userIP = data.ip;

        // Agregar lógica para identificar correos sospechosos si es necesario
        const isSuspicious = false; // Determina esto según tu lógica adicional

        // Registro de depuración
        console.log('Enviando datos al servidor con el siguiente payload:');
        console.log({
          id: request.id,
          text: request.content,
          subject: request.subject,
          sender: request.sender,
          attachments: request.attachments,
          url: request.url,
          date: request.date,
          ip: userIP,
          initialPhishingStatus: isSuspicious
        });

        fetch('https://expensive-boiling-cylinder.glitch.me/check-phishing', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: request.id,
            text: request.content,
            subject: request.subject,
            sender: request.sender,
            attachments: request.attachments,
            url: request.url,
            date: request.date,
            ip: userIP,
            initialPhishingStatus: isSuspicious,
            action: 'validateAndStore'
          }),
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Received response from backend:', data);

          const isPhishing = data.isPhishing;
          const probability = data.probability || 0;

          chrome.storage.local.get({ phishingCount: 0, phishingDomains: [] }, (result) => {
            if (isPhishing) {
              const newPhishingCount = result.phishingCount + 1;
              const newPhishingDomains = [...result.phishingDomains, request.sender.split('@')[1]];

              chrome.storage.local.set({ phishingCount: newPhishingCount, phishingDomains: newPhishingDomains });
            }

            chrome.tabs.sendMessage(sender.tab.id, {
              action: "showResult",
              isPhishing: isPhishing,
              probability: probability
            });

            sendResponse({ success: true, isPhishing: isPhishing, probability: probability });
          });
        })
        .catch(error => {
          console.error('Error:', error);
          let errorMessage = error.message;
          if (error.message.includes('HTTP error! status: 404')) {
            errorMessage = 'El servidor de verificación no está disponible. Asegúrate de que el servidor local esté en funcionamiento en http://localhost:8000';
          }

          chrome.tabs.sendMessage(sender.tab.id, {
            action: "showResult",
            isPhishing: false,
            probability: 0,
            message: "Error al verificar el correo: " + errorMessage
          });

          sendResponse({ success: false, error: errorMessage });
        });

        return true; // Indica que la respuesta se enviará de forma asincrónica
      })
      .catch(error => {
        console.error('Error getting IP address:', error);
        sendResponse({ success: false, error: 'Error getting IP address' });
      });

    return true; // Indica que la respuesta se enviará de forma asincrónica
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ phishingCount: 0, phishingDomains: [] });
});
