// Función de debounce para limitar la frecuencia de llamadas a una función
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lista de palabras clave relacionadas con phishing bancario y spam en español e inglés
const palabrasClavePhishingBancario = [
    'verificación', 'cuenta', 'banco', 'contraseña', 'login', 'seguridad', 'actualización',
    'fraude', 'urgente', 'confirmar', 'suspendido', 'bloqueado', 'acceso', 'enlace',
    'hacer clic', 'credenciales', 'alerta', 'problema', 'inmediato', 'información personal',
    'verification', 'account', 'bank', 'password', 'login', 'security', 'update', 'targeta', 'credito', 'visa',
    'fraud', 'urgent', 'confirm', 'suspended', 'blocked', 'access', 'link', 'Gana', 'viaje', 'ganar',
    'click here', 'credentials', 'alert', 'problem', 'immediate', 'personal information',
    // Palabras spam
    'felicitaciones', 'has ganado', 'para ti', 'has sido seleccionado', 'querido amigo',
    'aceptamos tarjetas de crédito', 'haz clic en este enlace', 'compra ahora mismo', 'haz clic aquí para comprar',
    'congratulations', 'you have won', 'for you', 'you have been selected', 'dear friend',
    'we accept credit cards', 'click this link', 'buy now', 'click here to buy'
];

// Lista de dominios conocidos
const listaDominiosConocidos = [
    "procredit.com.ec", "bgr.com.ec", "delbank.com.ec", "bancocapital.com.ec", "produbanco.com.ec",
    "bancocemanabi.com.ec", "coopnacional.fin.ec", "d-miro.com", "bancofinca.com",
    "bancolitoral.com", "bancodesarrollo.com.ec", "dinersclub.com.ec", "visionfund.org.ec",
    "citibank.com.ec", "bde.fin.ec", "cfn.fin.ec", "banecuador.fin.ec", "biess.fin.ec",
    "bce.fin.ec", "pacifico.com.ec", "bancodelpacifico.com", "mutualistaazuay.com.ec", "mutualistaimbabura.com.ec",
    "mutualistapichincha.com.ec", "mutualistat.com", "financoop.fin.ec", "cacpeambato.fin.ec",
    "mushucruna.fin.ec", "padrejulian.fin.ec", "c15deabril.fin.ec", "c23dejulio.fin.ec",
    "c29deoctubre.fin.ec", "cooperativaandalucia.fin.ec", "cooprogreso.fin.ec", "machalabanco.com",
    "9deoctubre.fin.ec", "cotocollao.fin.ec", "oncejunio.fin.ec", "cacpebiblian.fin.ec",
    "desarrollodelospueblos.fin.ec", "elsagrario.fin.ec", "ladolorosa.fin.ec", "oscus.fin.ec",
    "cariobamba.fin.ec", "csanfrancisco.fin.ec", "santaanacoop.fin.ec", "tulcancoop.fin.ec",
    "alianzadelvalle.fin.ec", "atuntaqui.fin.ec", "cacpeco.fin.ec", "comerciocoop.fin.ec",
    "construccioncomercio.fin.ec", "cacpepastaza.fin.ec", "guarandacoop.fin.ec", "jardinazuayo.fin.ec",
    "jeep.fin.ec", "coopmego.fin.ec", "pmv.fin.ec", "coopad.fin.ec", "santarosa.fin.ec",
    "calceta.fin.ec", "chone.fin.ec", "cacpeloja.fin.ec", "csanfranciscodeasis.fin.ec",
    "csanjose.fin.ec", "cstaboada.fin.ec", "educadoreschimborazo.fin.ec", "educadorestungurahua.fin.ec",
    "cacspmec.fin.ec", "ajlcuenca.fin.ec", "crea.fin.ec", "maquitacushunchic.fin.ec",
    "jpiomora.fin.ec", "textil14marzo.fin.ec", "erco.fin.ec", "labenefica.fin.ec", "ambato.fin.ec",
    "sanjuancotogchoa.fin.ec", "bancopichincha.com", "pichincha.com", "bancodeloja.fin.ec", "deunaapp.com",
    "outlook.office.com", "yahoo.com", "google.com", "mkt.pacifico.com.ec"
];

// Lista para rastrear correos ya verificados
let correosVerificados = [];

// Funciones para guardar y obtener intentos de phishing
function getPhishingAttempts() {
    let phishingAttempts = localStorage.getItem('phishingAttempts');
    return phishingAttempts ? JSON.parse(phishingAttempts) : {};
}

function savePhishingAttempts(attempts) {
    localStorage.setItem('phishingAttempts', JSON.stringify(attempts));
}

function updatePhishingAttempts(domain) {
    let attempts = getPhishingAttempts();

    if (attempts[domain]) {
        attempts[domain]++;
    } else {
        attempts[domain] = 1;
    }

    savePhishingAttempts(attempts);
}

function mostrarIntentosDePhishing() {
    const attempts = getPhishingAttempts();
    if (Object.keys(attempts).length === 0) {
        alert('No se han detectado intentos de phishing.');
        return;
    }
    let message = 'Intentos de phishing por dominio:\n\n';
    for (let domain in attempts) {
        message += `${domain}: ${attempts[domain]} intentos\n`;
    }
    alert(message); 
}

function contienePalabrasClavePhishing(emailContent, emailSubject) {
    const textoCompleto = [emailContent, emailSubject].join(' ').toLowerCase();
    return palabrasClavePhishingBancario.some(palabra => textoCompleto.includes(palabra.toLowerCase()));
}

function esDominioConocido(emailSender) {
    const dominio = emailSender.split('@')[1].toLowerCase().trim();
    return listaDominiosConocidos.includes(dominio);
}

function esEnlaceTruqueado(emailContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(emailContent, 'text/html');
    const links = doc.querySelectorAll('a');

    for (let link of links) {
        const href = link.getAttribute('href');
        const text = link.textContent || link.innerText;
        
        if (href && text) {
            // Normalizamos las URLs para compararlas
            const normalizedHref = href.replace(/^https?:\/\//, '').replace(/^www\./, '').split(/[?#]/)[0];
            const normalizedText = text.replace(/^https?:\/\//, '').replace(/^www\./, '').split(/[?#]/)[0];

            // Verificamos si el texto visible y el href no coinciden o si la URL parece sospechosa
            if (normalizedHref !== normalizedText) {
                console.log('Enlace truqueado detectado:', href, 'Texto:', text);
                return true;
            }

            // Podemos agregar más reglas aquí para detectar URLs sospechosas
            // Por ejemplo, si la URL contiene caracteres raros, excesivas redirecciones, etc.
        }
    }

    return false;
}

async function getEmailContent() {
    let emailContent = '';
    let emailSender = '';
    let emailSubject = '';
    let attachments = [];
    let url = '';
    let ip = '';

    console.log('Obteniendo contenido del correo...');

    // Gmail
    if (window.location.hostname.includes('mail.google.com')) {
        const emailContentElement = document.querySelector('.a3s.aiL');
        const emailSenderElement = document.querySelector('.gD');
        const emailSubjectElement = document.querySelector('h2.hP');

        if (emailContentElement) {
            emailContent = emailContentElement.innerText || "";
        }
        if (emailSenderElement) {
            emailSender = emailSenderElement.getAttribute('email') || emailSenderElement.innerText || "";
        }
        if (emailSubjectElement) {
            emailSubject = emailSubjectElement.innerText || "";
        }

        document.querySelectorAll('[download_url]').forEach(attachment => {
            attachments.push(attachment.getAttribute('download_url'));
        });

        url = window.location.href;
        ip = await getUserIP();
    }

    // Outlook
    if (window.location.hostname.includes('outlook.live.com')) {
        const emailContentElement = document.querySelector('[role="main"]');
        const emailSenderElement = document.querySelector('[role="heading"][aria-level="2"]');
        const emailSubjectElement = document.querySelector('h1');
        if (emailContentElement) {
            emailContent = emailContentElement.innerText || "";
            console.log(emailContent)
        }
        if (emailSenderElement) {
            emailSender = emailSenderElement.innerText || "";
        }
        if (emailSubjectElement) {
            emailSubject = emailSubjectElement.innerText || "";
        }

        document.querySelectorAll('[role="listitem"]').forEach(attachment => {
            attachments.push(attachment.innerText);
        });

        url = window.location.href;
        ip = await getUserIP();
    }

    return {
        subject: emailSubject,
        content: emailContent,
        sender: emailSender,
        attachments: attachments,
        url: url,
        ip: ip
    };
}

async function getUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Error getting IP address:', error);
        return 'IP not available';
    }
}

function estaViendoUnCorreo() {
    if (window.location.hostname.includes('mail.google.com')) {
        return document.querySelector('.ha') !== null;
    }
    if (window.location.hostname.includes('outlook.live.com')) {
        return document.querySelector('[role="heading"][aria-level="1"]') !== null;
    }
    return false;
}

function eliminarBanner() {
    const existingBanner = document.getElementById('secure-email-banner');
    if (existingBanner) {
        existingBanner.remove();
    }
}

// Función para crear un banner de correo seguro
function createSecureBanner() {
    eliminarBanner();

    const banner = document.createElement('div');
    banner.id = 'secure-email-banner';
    banner.style.cssText = `
        position: relative;
        width: 100%;
        background-color: #800020; /* Conche de vino */
        color: white;
        padding: 10px;
        font-family: Arial, sans-serif;
        font-size: 14px;
        font-weight: bold;
        text-align: center;
        box-sizing: border-box;
    `;
    banner.textContent = 'CORREO SEGURO';

    // Buscar el contenedor del remitente para insertar el banner debajo
    const emailHeader = document.querySelector('.gE .gD'); // Selector para el remitente en Gmail
    if (emailHeader) {
        // Inserta el banner después del contenedor del remitente
        emailHeader.closest('.gE').appendChild(banner);
    } else {
        console.error('No se encontró el contenedor del remitente.');
        document.body.appendChild(banner); // Fallback en caso de que no se encuentre el remitente
    }
}

// Función para mostrar una cortina de advertencia
function showWarningCurtain() {
    // Eliminar cualquier cortina existente antes de crear una nueva
    const existingCurtain = document.getElementById('phishing-warning');
    if (existingCurtain) {
        existingCurtain.remove();
    }

    const emailBodyContainer = document.querySelector('.a3s.aiL'); // Selector del cuerpo del correo en Gmail

    if (emailBodyContainer) {
        const curtain = document.createElement('div');
        curtain.id = 'phishing-warning';
        curtain.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(145, 0, 72, 0.7); /* Rojo oscuro semi-transparente */
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        curtain.innerHTML = `
            <div style="background-color:#910048; padding:20px; border-radius:10px; text-align:center">
                <strong>¡Advertencia!</strong> Posible intento de phishing o enlace truqueado.<br>
                <button id="continue-btn" style="margin-top:10px; padding:10px 20px; font-size:14pt; background-color:#00FF00; border:none; border-radius:5px; cursor:pointer;">Continuar</button>
            </div>
        `;
        emailBodyContainer.style.position = 'relative'; // Asegurar que el contenedor sea relativo
        emailBodyContainer.appendChild(curtain);

        // Agregar evento de clic al botón "Continuar"
        document.getElementById('continue-btn').onclick = function() {
            curtain.remove(); // Eliminar la cortina del DOM al hacer clic en "Continuar"
        };
    } else {
        console.error('No se encontró el cuerpo del correo.');
    }
}

async function insertEmailToDatabase(email) {
    try {
        console.log('Insertando correo en la base de datos...', email);
        const response = await fetch('http://localhost:8000/check-phishing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(email)
        });

        if (!response.ok) {
            throw new Error(`Error al insertar el correo en la base de datos: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Correo insertado en la base de datos con éxito:', data);
    } catch (error) {
        console.error('Error al insertar el correo en la base de datos:', error);
    }
}

async function checkEmailForPhishing() {
    try {
        console.log('Verificando correo...');

        if (!estaViendoUnCorreo()) {
            console.log('No se está viendo un correo, no se mostrará el banner.');
            eliminarBanner();
            return;
        }

        const email = await getEmailContent();
        console.log(email.content);
        if (email.content && email.sender) {
            // Crear un hash único para este correo
            const emailHash = btoa(encodeURIComponent(email.sender + email.subject + email.content));

            // Verificar si este correo ya ha sido procesado
            if (correosVerificados.includes(emailHash)) {
                console.log('Este correo ya ha sido verificado.');
                return;
            }
            correosVerificados.push(emailHash);

            const dominioConocido = esDominioConocido(email.sender);
            const contienePalabrasClave = contienePalabrasClavePhishing(email.content, email.subject);
            const enlaceTruqueado = esEnlaceTruqueado(email.content);

            console.log('Dominio conocido:', dominioConocido);
            console.log('Contiene palabras clave:', contienePalabrasClave);
            console.log('Enlace truqueado:', enlaceTruqueado);

            // Mostrar cortina de advertencia solo si es phishing o hay un enlace truqueado y no es un dominio conocido
            if ((contienePalabrasClave || enlaceTruqueado) && !dominioConocido) {
                console.log('Advertencia! Posible intento de phishing');
                showWarningCurtain(); // Mostrar cortina de advertencia
                updatePhishingAttempts(email.sender.split('@')[1]); // Actualizar intentos de phishing
                email.validationMessage = 'Phishing detected or fake link';
            }
            // Mostrar banner solo si el correo es de un dominio conocido y no hay enlaces truqueados
            else if (dominioConocido && !enlaceTruqueado) {
                console.log('Correo de dominio conocido y sin enlaces truqueados, mostrando banner seguro.');
                createSecureBanner(); // Mostrar banner de correo seguro
                email.validationMessage = 'No phishing detected';
            }

            // Guardar el correo en la base de datos
            await insertEmailToDatabase(email);
        } else {
            console.error('El contenido o el remitente del correo no están disponibles.');
        }
    } catch (error) {
        console.error('Error al verificar el correo:', error);
    }
}

// Crear una versión con debounce de checkEmailForPhishing
const debouncedCheckEmailForPhishing = debounce(checkEmailForPhishing, 1000);

function observeEmailChanges() {
    console.log('Observando cambios en el DOM...');

    const emailObserverConfig = { childList: true, subtree: true };

    const checkEmailContainer = () => {
        let emailContainer = null;
        if (window.location.hostname.includes('mail.google.com')) {
            emailContainer = document.querySelector('.ae4.UI') ||
                document.querySelector('.AO') ||
                document.querySelector('.nH') ||
                document.querySelector('[role="main"]');
        } else if (window.location.hostname.includes('outlook.live.com')) {
            emailContainer = document.querySelector('[role="main"]');
        }

        if (emailContainer) {
            console.log('Contenedor de correos encontrado:', emailContainer);
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    if (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0) {
                        console.log('Cambio detectado, validando correo...');
                        setTimeout(() => {
                            if (estaViendoUnCorreo()) {
                                checkEmailForPhishing();
                            } else {
                                eliminarBanner();
                            }
                        }, 1000);
                    }
                });
            });

            observer.observe(emailContainer, emailObserverConfig);
        } else {
            console.log('No se encontró el contenedor de correos. Reintentando...');
            if (window.emailContainerAttempts === undefined) {
                window.emailContainerAttempts = 0;
            }
            window.emailContainerAttempts++;
            if (window.emailContainerAttempts < 10) {
                setTimeout(checkEmailContainer, 2000);
            } else {
                console.error('No se pudo encontrar el contenedor de correos después de varios intentos.');
            }
        }
    };

    checkEmailContainer();
}

// Función para insertar el botón en la interfaz del correo
function insertarBotonVerIntentos() {
    const emailBodyContainer = document.querySelector('.a3s.aiL'); // Selector del cuerpo del correo en Gmail

    if (emailBodyContainer) {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            justify-content: center;
            margin-top: 20px;
        `;

        const button = document.createElement('button');
        button.textContent = 'Ver Intentos de Phishing';
        button.style.cssText = `
            padding: 10px 20px;
            font-size: 14pt;
            background-color: #910048;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        `;

        button.onclick = mostrarIntentosDePhishing;

        buttonContainer.appendChild(button);
        emailBodyContainer.appendChild(buttonContainer);
    } else {
        console.error('No se encontró el cuerpo del correo para insertar el botón.');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        observeEmailChanges();
        insertarBotonVerIntentos();
    });
} else {
    observeEmailChanges();
    insertarBotonVerIntentos();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "validateEmail") {
        console.log("Received message:", message);
        checkEmailForPhishing();
    }
});
