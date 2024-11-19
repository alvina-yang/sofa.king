
# sofa.king

# Project Setup

## Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
   
2. Install dependencies:
   ```bash
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and go to:
   ```
   http://localhost:3000
   ```

## Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS and Linux:
     ```bash
     source venv/bin/activate
     ```

4. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

5. Install Ollama:
   Follow the instructions at [Ollama's official website](https://ollama.ai/download) to install Ollama for your operating system.

6. Pull the Llama 3.1 model:
   ```bash
   ollama pull llama3.1
   ```

7. Start the Ollama server:
   ```bash
   ollama serve
   ```

8. Run the Python backend:
   ```bash
   python main.py
   ```
