from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from deepgram import DeepgramClient, PrerecordedOptions
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

# Load environment variables
load_dotenv()
DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")
GOOGLE_API_KEY = os.getenv("GEMINI_API_KEY")

# Configure clients
dg_client = DeepgramClient(api_key=DEEPGRAM_API_KEY)
genai.configure(api_key=GOOGLE_API_KEY)
# for model in genai.list_models():
#     print(model.name, "-", model.supported_generation_methods)
model = genai.GenerativeModel(("gemini-1.5-pro") )

@app.route('/agent-response', methods=['POST'])
def agent_response():
    data = request.json
    user_transcript = data.get('transcript', '')

    if not user_transcript:
        return jsonify({'response': 'Sorry, I didn’t catch that.'})

    prompt = f"You are a helpful travel assistant. The user said: '{user_transcript}'. Respond accordingly."

    try:
        response = model.generate_content(prompt)
        return jsonify({
    'transcript': user_transcript,
    'response': response.text.strip()
})
    except Exception as e:
        return jsonify({'response': f"Error processing request: {str(e)}"})


@app.route('/agent-response_audio', methods=['POST'])
def analyze_and_respond():
    data = request.json
    audio_url = data.get('audio_url')  # Ensure your frontend sends this

    if not audio_url:
        return jsonify({'error': 'Audio URL is missing'}), 400

    try:
        options = PrerecordedOptions(
            model="nova",
            smart_format=True,
            utterances=True,
            detect_language=True,
            analyze="sentiment,topics"
        )

        source = {"url": audio_url}
        response = dg_client.listen.prerecorded.v("1").transcribe_dict(source=source, options=options)

        # Extract data
        transcript = response['results']['channels'][0]['alternatives'][0]['transcript']
        utterance_data = response['results'].get('utterances', [])
        sentiment = utterance_data[0].get('sentiment', 'neutral') if utterance_data else 'neutral'
        topics = utterance_data[0].get('topics', []) if utterance_data else []

        # Gemini prompt
        prompt = (
            f"You are a helpful travel assistant. The user said: '{transcript}'. "
            f"The sentiment is '{sentiment}', and the topics include: {', '.join(topics) if topics else 'none'}. "
            f"Respond helpfully and empathetically."
        )

        gemini_response = model.generate_content(prompt)
        return jsonify({
            'transcript': transcript,
            'sentiment': sentiment,
            'topics': topics,
            'response': gemini_response.text.strip()
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/transcribe-real', methods=['POST'])
def transcribe_audio_real_time():
    try:
        data = request.json
        audio_transcript = data.get('audioTranscript')

        if not audio_transcript:
            return jsonify({'error': 'Transcript is missing'}), 400

        return jsonify({'transcript': audio_transcript})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    serve(app, host="0.0.0.0", port=8002) 
