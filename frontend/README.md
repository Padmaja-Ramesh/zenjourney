# ZenJourney Travel Planner Frontend

This is the frontend application for the ZenJourney Travel Planner system. Built with Next.js and Tailwind CSS, it provides a beautiful user interface for interacting with the uAgents-based travel planning system.

## Features

- Modern UI with responsive design
- Real-time travel planning requests
- Detailed travel itineraries with cost estimates
- Seamless integration with uAgents backend

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm

### Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Open your browser and navigate to http://localhost:3000

## Usage

1. Fill out the travel planning form with:
   - Destination
   - Start and end dates
   - Budget
   - Travel preferences

2. Click "Generate Travel Plan" to submit your request

3. View your personalized travel itinerary

## Backend Integration

This frontend connects to the uAgents backend service which should be running on:
```
http://localhost:8001
```

Make sure the backend service is running before using the frontend.

## Technologies Used

- Next.js 14
- React 18
- Tailwind CSS
- TypeScript

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [uAgents Framework](https://innovationlab.fetch.ai/resources/docs/agent-communication/uagent-uagent-communication)
