from flask import Flask, request, jsonify
import joblib
import os
import numpy as np
from urllib.parse import urlparse, quote
from sklearn.feature_extraction.text import TfidfVectorizer
import re
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import nltk
import requests

nltk.download('punkt')
nltk.download('stopwords')

app = Flask(__name__)

current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, 'model', 'random_forest_model.pkl')
vectorizer_path = os.path.join(current_dir, 'model', 'vectorizer.pkl')
selector_path = os.path.join(current_dir, 'model', 'selector.pkl')

assert os.path.exists(model_path), f"El archivo {model_path} no existe."
assert os.path.exists(vectorizer_path), f"El archivo {vectorizer_path} no existe."
assert os.path.exists(selector_path), f"El archivo {selector_path} no existe."

model = joblib.load(model_path)
vectorizer = joblib.load(vectorizer_path)
selector = joblib.load(selector_path)

print("Modelo, vectorizador y selector cargados exitosamente.")

dominios_conocidos = [
    "procredit.com.ec", "bgr.com.ec", "delbank.com.ec", "bancocapital.com.ec",
    # ... (otros dominios)
]

palabras_clave_phishing_bancario = [
    'account', 'cuenta', 'login', 'iniciar sesión', 'verify', 'verificar', 'password', 
    'contraseña', 'update', 'actualizar', 'secure', 'seguro', 'bank', 'banco', 'banking', 
    'bancario', 'ssn', 'número de seguridad social', 'social security', 'seguridad social', 
    'urgent', 'urgente', 'immediate action', 'acción inmediata', 'limited time', 'tiempo limitado', 
    'click here', 'haz clic aquí', 'reset', 'restablecer', 'confirm', 'confirmar', 'security alert', 
    'alerta de seguridad', 'important notice', 'aviso importante', 'your account', 'tu cuenta', 
    'billing', 'facturación', 'invoice', 'factura', 'payment', 'pago', 'access', 'acceso', 
    'suspend', 'suspender', 'notification', 'notificación', 'compromised', 'comprometido', 
    'action required', 'acción requerida', 'failure', 'fallo', 'attempt', 'intento', 'unauthorized', 
    'no autorizado', 'fraud', 'fraude', 'phishing', 'suplantación', 'credential', 'credencial', 
    'confidential', 'confidencial', 'ATM', 'cajero automático', 'credit card', 'tarjeta de crédito', 
    'debit card', 'tarjeta de débito', 'transaction', 'transacción', 'statement', 'estado de cuenta', 
    'overdraft', 'sobregiro', 'loan', 'préstamo', 'wire transfer', 'transferencia bancaria'
]

def extract_url_features(url):
    features = []
    features.append(len(url))
    features.append(url.count('-'))
    features.append(url.count('.'))
    features.append(sum(c.isdigit() for c in url))
    features.append(sum(c.isalpha() for c in url))
    features.append(url.count('/'))
    features.append(url.count('http'))
    features.append(url.count('https'))
    features.append(url.count('www'))
    features.append(url.count('@'))
    features.append(len(url.split('.')))
    features.append(int('secure' in url.lower()))
    features.append(int('account' in url.lower()))
    features.append(int('update' in url.lower()))
    features.append(int('login' in url.lower()))
    features.append(int(bool(re.search(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', url))))
    features.append(int(bool(re.search(r'[A-Za-z0-9]{32,}', url))))
    return features

def es_dominio_conocido(dominio):
    return any(conocido in dominio for conocido in dominios_conocidos)

def contiene_palabras_clave_bancario(texto):
    texto = texto.lower()
    return any(palabra in texto for palabra in palabras_clave_phishing_bancario)

def preprocess_text(text):
    text = text.lower()
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    tokens = word_tokenize(text)
    stop_words = set(stopwords.words('english')) | set(stopwords.words('spanish'))
    tokens = [word for word in tokens if word not in stop_words]
    return ' '.join(tokens)

def predecir(texto, tipo, remitente=None):
    if tipo == 'url':
        if es_dominio_conocido(texto):
            return [0], 0.0

        if contiene_palabras_clave_bancario(texto):
            return [1], 1.0

        features = extract_url_features(texto)
        X_tfidf = vectorizer.transform([texto])
        X_combined = np.hstack((np.array(features).reshape(1, -1), X_tfidf.toarray()))
    else:
        if remitente and es_dominio_conocido(remitente):
            return [0], 0.0

        if contiene_palabras_clave_bancario(texto):
            return [1], 1.0

        texto_preprocesado = preprocess_text(texto)
        X_tfidf = vectorizer.transform([texto_preprocesado])
        X_combined = X_tfidf

    X_selected = selector.transform(X_combined)
    prediccion = model.predict(X_selected)
    probabilidad = model.predict_proba(X_selected)[0][1]
    return prediccion, probabilidad

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json(force=True)
        if 'url' in data:
            texto = data['url']
            tipo = 'url'
            remitente = data.get('sender', None)
            prediccion, probabilidad = predecir(texto, tipo, remitente)
        elif 'text' in data:
            texto = data['text']
            tipo = 'text'
            remitente = data.get('sender', None)
            prediccion, probabilidad = predecir(texto, tipo, remitente)
        elif 'file' in data:
            file_content = data['file']
            tipo = 'file'
            prediccion, probabilidad = predecir(file_content, tipo)
        else:
            return jsonify(error="Debe proporcionar una 'url', 'text' o 'file' para la predicción."), 400
        
        resultado = 'phishing' if prediccion[0] == 1 else 'no phishing'
        return jsonify(prediccion=resultado, probabilidad=float(probabilidad))
    except Exception as e:
        return jsonify(error=str(e)), 400

@app.route('/store-validation', methods=['POST'])
def store_validation():
    try:
        data = request.get_json(force=True)
        print('Store Validation Data:', data)
        # Aquí puedes agregar la lógica para almacenar la validación en la base de datos
        return jsonify(success=True)
    except Exception as e:
        return jsonify(error=str(e)), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
