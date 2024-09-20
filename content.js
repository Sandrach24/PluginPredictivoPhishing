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

// Lista de palabras clave relacionadas con contenido bancario
const palabrasClaveContenidoBancario = [
    'cuenta bancaria', 'transferencia', 'saldo', 'tarjeta de crédito', 'préstamo',
    'hipoteca', 'inversión', 'banca en línea', 'estado de cuenta', 'depósito',
    'retiro', 'interés', 'seguridad bancaria', 'PIN', 'token', 'clave dinámica',
    'banco', 'crédito', 'débito', 'ahorro', 'cuenta corriente', 'banca móvil',
    'bank account', 'transfer', 'balance', 'credit card', 'loan', 'mortgage',
    'investment', 'online banking', 'statement', 'deposit', 'withdrawal',
    'interest', 'bank security', 'PIN', 'token', 'dynamic key', 'bank',
    'credit', 'debit', 'savings', 'checking account', 'mobile banking'
];

// Lista de palabras clave de phishing bancario
const palabrasClavePhishingBancario = [
    'verificación cuenta', 'contraseña banco', 'login seguridad', 'actualización fraude',
    'suspensión cuenta', 'bloqueo acceso', 'confirmar datos', 'alerta seguridad',
    'problema inmediato', 'información personal urgente', 'verification account',
    'bank password', 'security login', 'fraud update', 'account suspended',
    'access blocked', 'confirm data', 'security alert', 'immediate problem',
    'urgent personal information', 'transacción no autorizada', 'restablecer contraseña',
    'revisión de seguridad', 'cambio de PIN', 'actualizar datos bancarios', 'bloqueo temporal',
    'activación de cuenta', 'validación de identidad', 'seguridad de cuenta', 'transferencia pendiente',
    'notificación de transacción', 'cobro no autorizado', 'confirmar actividad reciente'
];

// Lista de palabras clave promocionales
const palabrasClavePromocionales = [
    'descuento', 'oferta', 'promoción', 'venta', 'compra', 'ahorra',
    'nuevo', 'colección', 'temporada', 'exclusivo', 'limited', 'tiempo limitado',
    'envío gratis', 'regalo', 'cupón', 'código promocional', 'rebaja',
    'discount', 'sale', 'offer', 'promotion', 'buy', 'save',
    'new', 'collection', 'season', 'exclusive', 'free shipping', 'gift'
];

// Lista de dominios bancarios conocidos
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
    "sanjuancotogchoa.fin.ec", "bancopichincha.com", "pichincha.com", "bancodeloja.fin.ec", "deunaapp.com"
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

// Actualizar intentos de phishing por remitente
function updatePhishingAttempts(sender) {
    let attempts = getPhishingAttempts();
    if (attempts[sender]) {
        attempts[sender]++;
    } else {
        attempts[sender] = 1;
    }
    savePhishingAttempts(attempts);
}

// Mostrar intentos de phishing por remitente
function mostrarIntentosDePhishing() {
    const attempts = getPhishingAttempts();
    if (Object.keys(attempts).length === 0) {
        alert('No se han detectado intentos de phishing.');
        return;
    }
    let message = '';
    for (let sender in attempts) {
        message += `${sender}: ${attempts[sender]} intentos\n`;
    }
    
    const alertDiv = document.createElement('div');
    alertDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #910048;
        color: white;
        padding: 20px;
        border-radius: 10px;
        z-index: 10000;
        font-family: "Montserrat", sans-serif;
        max-width: 80%;
        width: 400px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;
    alertDiv.innerHTML = `
        <h3 style="margin-top: 0; text-align: center; font-size: 18px; font-weight: bold;">INTENTOS DE PHISHING POR REMITENTE</h3>
        <pre style="white-space: pre-wrap; word-wrap: break-word; margin-bottom: 20px; font-size: 14px;">${message}</pre>
        <button id="phishing-accept-btn" style="
            display: block;
            margin: 0 auto;
            padding: 15px 30px;
            background-color: #EAAA00;
            color: #333333;
            border: none;
            border-radius: 30px;
            font-family: 'Montserrat', sans-serif;
            font-size: 16px;
            font-weight: 700;
            line-height: 22px;
            cursor: pointer;
            transition: all 0.3s;
        ">Aceptar</button>
    `;
    document.body.appendChild(alertDiv);

    document.getElementById('phishing-accept-btn').onclick = function() {
        alertDiv.remove();
    };
}

// Función para verificar si el texto contiene palabras clave de detección
function contienePalabrasClaveDeteccion(texto) {
    return palabrasClaveContenidoBancario.some(palabra => texto.toLowerCase().includes(palabra.toLowerCase())) ||
           palabrasClavePhishingBancario.some(palabra => texto.toLowerCase().includes(palabra.toLowerCase()));
}

// Función mejorada para verificar si el correo es posiblemente bancario
function esPosibleCorreoBancario(emailSender, emailSubject, emailContent) {
    const textoCompleto = [emailSubject, emailContent].join(' ').toLowerCase();
    
    console.log('Verificando si es posible correo bancario...');
    console.log('Texto completo:', textoCompleto);

    // Verificar si contiene palabras promocionales
    const contienePromocion = palabrasClavePromocionales.some(palabra => 
        textoCompleto.includes(palabra.toLowerCase())
    );
    
    console.log('Contiene promoción:', contienePromocion);

    if (contienePromocion) {
        console.log('El correo contiene palabras promocionales, no se considera bancario.');
        return false;
    }
    
    // Verificar palabras clave bancarias
    const contienePalabrasBancarias = palabrasClaveContenidoBancario.some(palabra => 
        textoCompleto.includes(palabra.toLowerCase())
    );

    console.log('Contiene palabras bancarias:', contienePalabrasBancarias);

    return contienePalabrasBancarias;
}

// Función para verificar si un dominio es conocido
function esDominioConocido(emailSender) {
    const dominio = emailSender.split('@')[1].toLowerCase().trim();
    return listaDominiosConocidos.some(dominioConocido => dominio === dominioConocido || dominio.endsWith('.' + dominioConocido));
}

// Función para verificar si un enlace está truqueado
function esEnlaceTruqueado(emailContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(emailContent, 'text/html');
    const links = doc.querySelectorAll('a');

    for (let link of links) {
        const href = link.getAttribute('href');
        const text = link.textContent || link.innerText;
        
        if (href && text) {
            const normalizedHref = href.replace(/^https?:\/\//, '').replace(/^www\./, '').split(/[?#]/)[0];
            const normalizedText = text.replace(/^https?:\/\//, '').replace(/^www\./, '').split(/[?#]/)[0];

            if (normalizedHref !== normalizedText) {
                console.log('Enlace truqueado detectado:', href, 'Texto:', text);
                return true;
            }
        }
    }

    return false;
}

// Función para obtener el contenido del correo
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
        const emailContentElement = document.querySelector('.a3s.aiL') || document.querySelector('.a3s');
        const emailSenderElement = document.querySelector('.gD') || document.querySelector('.go');
        const emailSubjectElement = document.querySelector('h2.hP');

        if (emailContentElement) {
            emailContent = emailContentElement.innerHTML || "";
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
    }

    // Outlook
    if (window.location.hostname.includes('outlook.live.com') || window.location.hostname.includes('outlook.office.com')) {
        const emailContentElement = document.querySelector('[role="main"]') || document.querySelector('.ReadingPaneContents');
        const emailSenderElement = document.querySelector('[role="heading"][aria-level="2"]') || document.querySelector('.RPTVSenderPersona');
        const emailSubjectElement = document.querySelector('h1') || document.querySelector('.SubjectLine');
        if (emailContentElement) {
            emailContent = emailContentElement.innerHTML || "";
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
    }

    url = window.location.href;
    ip = await getUserIP();

    console.log('Contenido del correo obtenido:', { emailContent, emailSender, emailSubject });

    return {
        subject: emailSubject,
        content: emailContent,
        sender: emailSender,
        attachments: attachments,
        url: url,
        ip: ip,
        date: new Date().toISOString() // Fecha de validación
    };
}

// Función para obtener la IP del usuario
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
        return document.querySelector('.ha') !== null || document.querySelector('.adn.ads') !== null;
    }
    if (window.location.hostname.includes('outlook.live.com') || window.location.hostname.includes('outlook.office.com')) {
        return document.querySelector('[role="main"]') !== null || document.querySelector('.ReadingPaneContents') !== null;
    }
    return false;
}

// Función para eliminar el banner
function eliminarBanner() {
    const existingBanner = document.getElementById('secure-email-banner');
    if (existingBanner) {
        existingBanner.remove();
    }
}

// Función para crear el banner de seguridad
function createSecureBanner() {
    console.log('Creando banner seguro...');
    eliminarBanner();

    let emailContainer;
    if (window.location.hostname.includes('mail.google.com')) {
        emailContainer = document.querySelector('.a3s.aiL') || document.querySelector('.a3s');
    } else if (window.location.hostname.includes('outlook.live.com') || window.location.hostname.includes('outlook.office.com')) {
        emailContainer = document.querySelector('[role="main"]') || document.querySelector('.ReadingPaneContents');
    }

    if (!emailContainer) {
        console.error('No se encontró el contenedor del correo para insertar el banner.');
        return;
    }

    const banner = document.createElement('div');
    banner.id = 'secure-email-banner';
    banner.style.cssText = `
        width: 100%;
        background-color: #910048; /* Color Conche de vino */
        color: white;
        padding: 10px;
        font-family: 'Montserrat', sans-serif;
        font-size: 14px;
        font-weight: bold;
        text-align: center;
        box-sizing: border-box;
        margin-bottom: 10px;
    `;
    banner.textContent = 'CORREO SEGURO';

    emailContainer.insertBefore(banner, emailContainer.firstChild);
    console.log('Banner seguro creado e insertado.');
}

// Función para mostrar la cortina de advertencia
function showWarningCurtain() {
    console.log('Mostrando cortina de advertencia...');
    const existingCurtain = document.getElementById('phishing-warning');
    if (existingCurtain) {
        existingCurtain.remove();
    }

    let emailBodyContainer;
    if (window.location.hostname.includes('mail.google.com')) {
        emailBodyContainer = document.querySelector('.a3s.aiL') || document.querySelector('.a3s');
    } else if (window.location.hostname.includes('outlook.live.com') || window.location.hostname.includes('outlook.office.com')) {
        emailBodyContainer = document.querySelector('[role="main"]') || document.querySelector('.ReadingPaneContents');
    }

    if (emailBodyContainer) {
        const curtain = document.createElement('div');
        curtain.id = 'phishing-warning';
        curtain.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(145, 0, 72, 0.7);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            font-family: 'Montserrat', sans-serif;
        `;
        curtain.innerHTML = `
            <div style="background-color:#910048; padding:20px; border-radius:10px; text-align:center">
                <strong>¡Advertencia!</strong> Posible intento de phishing o enlace truqueado.<br>
                <button id="continue-btn" style="margin-top:10px; padding:10px 20px; font-size:14pt; background-color:#ffc107; border:none; border-radius:5px; cursor:pointer; font-family: 'Montserrat', sans-serif;">Continuar</button>
            </div>
        `;
        emailBodyContainer.style.position = 'relative';
        emailBodyContainer.appendChild(curtain);

        document.getElementById('continue-btn').onclick = function() {
            curtain.remove();
        };
        console.log('Cortina de advertencia mostrada.');
    } else {
        console.error('No se encontró el cuerpo del correo para mostrar la advertencia.');
    }
}

// Función mejorada para verificar phishing
async function checkEmailForPhishing() {
    try {
        console.log('Iniciando verificación de phishing...');

        if (!estaViendoUnCorreo()) {
            console.log('No se está viendo un correo, no se mostrará el banner.');
            eliminarBanner();
            return;
        }

        const email = await getEmailContent();
        console.log('Contenido del correo obtenido:', email);
        
        if (!email.content || !email.sender) {
            console.error('El contenido o el remitente del correo no están disponibles.');
            return;
        }

        const emailHash = btoa(encodeURIComponent(email.sender + email.subject + email.content));

        if (correosVerificados.includes(emailHash)) {
            console.log('Este correo ya ha sido verificado, no se guardará de nuevo.');
            return;
        }
        correosVerificados.push(emailHash);

        const dominioConocido = esDominioConocido(email.sender);
        console.log('Dominio conocido:', dominioConocido);

        if (dominioConocido) {
            console.log('Correo de dominio bancario conocido, mostrando banner seguro.');
            createSecureBanner();
            email.validationMessage = 'Secure email from known domain';
            email.isPhishing = false;
        } else {
            const esContenidoBancario = esPosibleCorreoBancario(email.sender, email.subject, email.content);
            console.log('¿Es contenido bancario?', esContenidoBancario);

            if (!esContenidoBancario) {
                console.log('No es contenido bancario, no se realiza verificación.');
                eliminarBanner();
                return;
            }

            const contienePalabrasPhishing = contienePalabrasClaveDeteccion(email.subject + ' ' + email.content);
            const enlaceTruqueado = esEnlaceTruqueado(email.content);

            console.log('Contiene palabras clave de phishing:', contienePalabrasPhishing);
            console.log('Enlace truqueado:', enlaceTruqueado);

            if (contienePalabrasPhishing || enlaceTruqueado) {
                console.log('Advertencia! Posible intento de phishing bancario');
                showWarningCurtain();
                updatePhishingAttempts(email.sender);
                email.validationMessage = 'Phishing detected or fake link';
                email.isPhishing = true;
            } else {
                console.log('Contenido bancario sin indicios claros de phishing.');
                eliminarBanner();
                email.validationMessage = 'No clear security issues detected';
                email.isPhishing = false;
            }
        }

        console.log("Valor de isPhishing antes de guardar en BD: ", email.isPhishing);

        await insertEmailToDatabase(email);

    } catch (error) {
        console.error('Error al verificar el correo:', error);
    }
}

async function insertEmailToDatabase(email) {
    try {
        console.log('Insertando correo en la base de datos...', email);

        const payload = {
            sender: email.sender,
            subject: email.subject,
            content: email.content,
            attachments: email.attachments,
            url: email.url,
            ip: email.ip,
            date: email.date,
            validationMessage: email.validationMessage,
            isPhishing: email.isPhishing
        };

        console.log('Payload a enviar:', payload);

        const response = await fetch('https://expensive-boiling-cylinder.glitch.me/check-phishing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
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
        } else if (window.location.hostname.includes('outlook.live.com') || window.location.hostname.includes('outlook.office.com')) {
            emailContainer = document.querySelector('[role="main"]') || document.querySelector('.ReadingPaneContents');
        }

        if (emailContainer) {
            console.log('Contenedor de correos encontrado:', emailContainer);
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    if (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0) {
                        console.log('Cambio detectado, validando correo...');
                        setTimeout(() => {
                            if (estaViendoUnCorreo()) {
                                debouncedCheckEmailForPhishing();
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

// Inicialización del script
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        observeEmailChanges();
        insertarBotonVerIntentos();
    });
} else {
    observeEmailChanges();
    insertarBotonVerIntentos();
}

// Listener para mensajes de la extensión
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "validateEmail") {
        console.log("Received message:", message);
        checkEmailForPhishing();
    }
});

// Función para insertar el botón de "Ver Intentos de Phishing"
function insertarBotonVerIntentos() {
    const existingButton = document.getElementById('view-phishing-attempts-btn');
    if (!existingButton) {
        const button = document.createElement('button');
        button.id = 'view-phishing-attempts-btn';
        button.textContent = 'Ver Intentos de Phishing';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 20px;
            background-color: #910048;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 10000;
            font-family: 'Montserrat', sans-serif;
            font-size: 14px;
            font-weight: bold;
        `;
        button.onclick = mostrarIntentosDePhishing;
        document.body.appendChild(button);
    }
}