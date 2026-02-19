FROM python:3.11-slim

WORKDIR /app

# Copy backend files
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

# Expose port
EXPOSE 8080

# Start command
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8080"]
