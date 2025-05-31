import os
import re
import numpy as np
import pickle
import nltk

from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences

import warnings
warnings.filterwarnings("ignore", message="Compiled the loaded model, but the compiled metrics have yet to be built")

import logging
logging.getLogger('absl').setLevel(logging.ERROR)

# Set your custom nltk_data path (edit if needed)
nltk_data_path = os.path.join(os.getcwd(), "working", "nltk_data")

# Ensure directory exists
os.makedirs(nltk_data_path, exist_ok=True)

# Force nltk to use this path
nltk.data.path.clear()
nltk.data.path.append(nltk_data_path)

# Set environment variable for nltk to help with downloads
os.environ["NLTK_DATA"] = nltk_data_path

# print("Using NLTK data path:", nltk.data.path)

# Required NLTK resources
required_nltk_packages = ['punkt', 'punkt_tab', 'stopwords', 'wordnet', 'omw-1.4']

for package in required_nltk_packages:
    try:
        # punkt is a tokenizer, others are corpora
        resource_path = f'tokenizers/{package}' if package.startswith('punkt') else f'corpora/{package}'
        nltk.data.find(resource_path)
    except LookupError:
        print(f"Downloading NLTK package: {package}")
        nltk.download(package, download_dir=nltk_data_path)

# Load tokenizer
with open('./working/tokenizer.pkl', 'rb') as f:
    tokenizer = pickle.load(f)

# Load model
model = load_model('./working/fake_news_model.h5')

# Label mapping
label_map = ['FAKE', 'REAL']

# Preprocess function
def process_text(text):
    # Basic cleanup
    text = re.sub(r'\s+', ' ', text, flags=re.I)
    text = re.sub(r'\W', ' ', str(text))
    text = re.sub(r'\s+[a-zA-Z]\s+', ' ', text)
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    text = text.lower()

    # Tokenize
    words = word_tokenize(text)

    # Lemmatize
    lemmatizer = WordNetLemmatizer()
    words = [lemmatizer.lemmatize(word) for word in words]

    # Remove stopwords and short words
    stop_words = set(stopwords.words("english"))
    words = [word for word in words if word not in stop_words and len(word) > 3]

    return ' '.join(words)

def predict(test_news):
    maxlen = 150
    processed = [process_text(news) for news in test_news]
    sequences = tokenizer.texts_to_sequences(processed)
    padded = pad_sequences(sequences, maxlen=maxlen)

    predictions = model.predict(padded, verbose=0)
    result = []
    for i, pred in enumerate(predictions):
        confidence = np.max(pred)
        label = label_map[np.argmax(pred)]
        result.append({'label': label, 'confidence': confidence})
    
    return result

if __name__ == "__main__":
    filename = "testcases.bin"
    with open(filename, 'rb') as file:
        data = pickle.load(file)

    fakeNews = data['fakeNews']
    realNews = data['realNews']

    test_news = fakeNews + realNews

    for i, prediction in enumerate(predict(test_news)):
        newsType = 'Fake' if i < len(fakeNews) else 'Real'
        label = prediction['label']
        confidence = prediction['confidence']
        print(f"\n{newsType} News: {test_news[i][:60]}...\nPrediction: {label} ({confidence * 100:.2f}% confidence)")
