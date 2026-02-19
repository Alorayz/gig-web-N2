FROM python:3.11-slim

WORKDIR /app

# Copy backend files
COPY backend/requirements.txt .

# Install dependencies with special index for emergentintegrations
RUN pip install --no-cache-dir -r requirements.txt --extra-index-url https://d33sy5i8bnduwe.cloudfront.net/simple/

COPY backend/ .

# Railway uses PORT env variable
ENV PORT=8080
EXPOSE 8080

# Start command - Railway provides PORT
CMD uvicorn server:app --host 0.0.0.0 --port ${PORT:-8080}
