document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "getLastResult"}, function(response) {
      const resultElement = document.getElementById('result');
      if (response && response.isPhishing !== undefined) {
        if (response.isPhishing) {
          resultElement.textContent = `¡Advertencia! Este correo podría ser phishing. (Probabilidad: ${(response.probability * 100).toFixed(2)}%)`;
          resultElement.style.backgroundColor = "#ffcccc";
        } else {
          resultElement.textContent = `Este correo parece seguro. (Probabilidad de phishing: ${(response.probability * 100).toFixed(2)}%)`;
          resultElement.style.backgroundColor = "#ccffcc";
        }
      } else {
        resultElement.textContent = "No se ha analizado ningún correo recientemente.";
        resultElement.style.backgroundColor = "#f0f0f0";
      }
    });
  });
});