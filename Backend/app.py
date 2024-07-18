from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import T5Tokenizer, T5ForConditionalGeneration
from textblob import TextBlob
import pyjokes

app = Flask(__name__)
CORS(app)  # Allow all origins by default

tokenizer = T5Tokenizer.from_pretrained("google/flan-t5-xl")
model = T5ForConditionalGeneration.from_pretrained("google/flan-t5-xl")

def generate_response(input_text):
    input_ids = tokenizer(input_text, return_tensors="pt").input_ids
    output_ids = model.generate(input_ids, max_length=50, num_beams=5, early_stopping=True)
    response = tokenizer.decode(output_ids[0], skip_special_tokens=True)
    return response

@app.route('/Chatbot', methods=['POST'])
def chatbot():
    data = request.json
    user_input = data['message']
    
    bot_response = generate_response(user_input)

    blob = TextBlob(user_input)
    sentiment_score = blob.sentiment.polarity

    if sentiment_score > 0.5:
        sentiment_label = "positive"
    elif sentiment_score < -0.5:
        sentiment_label = "negative"
    else:
        sentiment_label = "neutral"

    joke = pyjokes.get_joke(language='en', category='neutral')

    return jsonify({'response': bot_response, 'sentiment': sentiment_label, 'joke': joke})

if __name__ == '__main__':
    app.run(debug=True)