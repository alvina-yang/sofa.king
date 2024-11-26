
# sofa.king

## Requirements

- Python version: > 3.9
- Node.js version: > 20

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

2. Add an OpenAI API Secret Key in the backend directory as a .env file
   ```
   OPENAI_API_KEY=YOUR SECRET KEY HERE
   ```

3. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

4. Activate the virtual environment:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS and Linux:
     ```bash
     source venv/bin/activate
     ```

5. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

6. Run the Python backend:
   ```bash
   python main.py
   ```
