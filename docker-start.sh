#!/bin/bash
echo "Starting Task Management App with Docker..."

# Build and start containers
docker-compose up --build -d

echo "Services are starting..."
echo " Backend API: http://localhost:8000"
echo " Frontend: http://localhost:5173"
echo " PHPMyAdmin: http://localhost:8080"
echo ""
echo " To view logs: docker-compose logs -f"
echo "To stop: docker-compose down"
