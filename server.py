import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # Щоб сайт міг звертатися до сервера

# Встав сюди свій ключ з Google AI Studio
genai.configure(api_key="AIzaSyCbM6g_Lgy9VSofcAtPkKTdyIh9T0M5suA")
model = genai.GenerativeModel('gemini-1.5-flash')

@app.route('/ask', methods=['POST'])
def ask():
    data = request.json
    user_message = data.get("message")
    
    try:
        # Додаємо інструкцію, щоб він знав, хто він
        prompt = f"Ти асистент Пилиповицької гімназії. Відповідай коротко і чітко. Питання: {user_message}"
        response = model.generate_content(prompt)
        return jsonify({"reply": response.text})
    except Exception as e:
        return jsonify({"reply": "Помилка зв'язку з мозком Gemini..."}), 500

if __name__ == '__main__':
    app.run(port=5000)
