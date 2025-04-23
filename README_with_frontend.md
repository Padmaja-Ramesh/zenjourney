# ZenJourney - Travel Planning Agent System

A travel planning application built using the uAgents framework from fetch.ai with a Next.js frontend. This application demonstrates agent-to-agent communication patterns in a practical use case.

## Project Overview

This project consists of:

### Backend
- **Travel Request Agent**: Sends travel planning requests with destination, dates, budget, and preferences
- **Travel Planning Agent**: Processes requests and generates travel itineraries

### Frontend
- **Next.js UI**: Modern responsive interface for submitting travel planning requests
- **Travel Itinerary Display**: Beautiful presentation of travel plans with cost estimates

The system demonstrates both asynchronous and synchronous communication between agents, as well as REST API integration for the frontend.

## Getting Started

### Prerequisites

#### Backend
- Python 3.8 or higher
- pip package manager

#### Frontend
- Node.js 18 or higher
- npm package manager

### Installation

#### Backend
1. Clone this repository
2. Create a virtual environment and activate it:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

#### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Running the Backend

You can run the agents together using the Bureau:

```bash
source venv/bin/activate
python run_travel_agents.py
```

Or run them separately in different terminals:

```bash
# Terminal 1
source venv/bin/activate
python travel_planning_agent.py

# Terminal 2
source venv/bin/activate
python travel_request_agent.py
```

### Running the Frontend

```bash
cd frontend
npm run dev
```

The frontend will be available at http://localhost:3000

## API Access

The Travel Planning Agent exposes a REST API endpoint at:
`http://localhost:8001/travel/plan`

You can use curl to send requests:

```bash
curl -d '{"destination":"Paris, France", "start_date":"2023-08-01", "end_date":"2023-08-07", "budget":2000.0, "preferences":"Art, history, cuisine"}' -H "Content-Type: application/json" -X POST http://localhost:8001/travel/plan
```

Or use the REST client script:

```bash
source venv/bin/activate
python rest_client.py "Paris, France" 2023-08-01 2023-08-07 2000 "Art, history, cuisine"
```

## Features

- Agent-to-agent communication using both send and send_and_receive methods
- REST API endpoints for integration with external systems
- Data modeling with uAgents Models
- Event-based architecture with handlers for messages and events
- Modern React frontend with responsive design
- Real-time travel planning requests

## Project Structure

```
zenjourney/
├── .git/
├── frontend/              # Next.js frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   │   
│   │   ├── public/
│   │   ├── package.json
│   │   └── README.md
│   ├── travel_request_agent.py  # Agent that sends travel requests
│   ├── travel_planning_agent.py # Agent that processes requests and generates plans
│   ├── run_travel_agents.py     # Script to run both agents using Bureau
│   ├── rest_client.py           # CLI client for the REST API
│   ├── requirements.txt         # Python dependencies
│   └── README.md               # This file
```

## Based On
This project follows the uAgent to uAgent communication patterns described in the [fetch.ai documentation](https://innovationlab.fetch.ai/resources/docs/agent-communication/uagent-uagent-communication). 