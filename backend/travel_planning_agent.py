from uagents import Agent, Context, Model
from fastapi import FastAPI, Response
from datetime import datetime, timedelta
import random
import json

# Data model for travel requests (must match the request agent)
class TravelRequest(Model):
    destination: str
    start_date: str
    end_date: str
    budget: float
    preferences: str

# Create planning agent
planning_agent = Agent(
    name='Travel Planning Agent',
    port=8001,
    endpoint=['http://localhost:8001/submit']
)

# Create FastAPI app instance
app = FastAPI()

# Configure FastAPI app with CORS
@planning_agent.on_event("startup")
async def setup_fastapi(ctx: Context):
    # Add CORS middleware
    from fastapi.middleware.cors import CORSMiddleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # In production, specify actual origins
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.post("/travel/plan")
    async def handle_travel_plan(request: dict):
        try:
            # Extract request parameters
            destination = request.get("destination", "")
            start_date = request.get("start_date", "")
            end_date = request.get("end_date", "")
            budget = float(request.get("budget", 0))
            preferences = request.get("preferences", "")
            
            # Calculate number of days
            start = datetime.strptime(start_date, "%Y-%m-%d")
            end = datetime.strptime(end_date, "%Y-%m-%d")
            total_days = (end - start).days + 1
            
            # Generate daily plans
            daily_plans = {}
            for day in range(1, total_days + 1):
                daily_plans[f"Day {day}"] = create_daily_plan(day)
            
            # Create response
            response = {
                "destination": destination,
                "itinerary": daily_plans,
                "estimated_cost": budget * 0.9,  # 90% of budget
                "total_days": total_days
            }
            
            return response
            
        except Exception as e:
            return {"error": str(e)}

# Model for sending travel plans
class DailyPlan(Model):
    weather: str
    breakfast: str
    must_visit: str
    local_event: str
    dinner: str
    hotel_suggestion: str
    travel_distance: str

class TravelPlan(Model):
    destination: str
    itinerary: dict  # Changed to dict to store daily plans
    estimated_cost: float
    hotel_suggestions: list
    total_days: int

@planning_agent.on_event('startup')
async def startup_handler(ctx: Context):
    ctx.logger.info(f'Travel Planning Agent started with address: {ctx.agent.address}')

def get_random_weather():
    return f"{random.randint(15, 30)}°C, {random.choice(['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy'])}"

def get_random_hotel():
    return random.choice([
        "Grand Hotel",
        "City View Inn",
        "Riverside Hotel",
        "Central Plaza",
        "Garden Resort"
    ])

def get_random_restaurant():
    return random.choice([
        "Local Bistro",
        "Traditional Tavern",
        "Gourmet Restaurant",
        "Street Food Market",
        "Café Central"
    ])

def get_random_attraction():
    return random.choice([
        "Historic Castle",
        "Art Museum",
        "Botanical Garden",
        "City Center",
        "Local Market"
    ])

def get_random_event():
    return random.choice([
        "Art Gallery Exhibition",
        "Local Music Festival",
        "Food Market",
        "Cultural Show",
        "Historical Tour"
    ])

def create_daily_plan(day_number):
    return {
        "weather": get_random_weather(),
        "breakfast": f"{get_random_restaurant()} - Local Breakfast",
        "must_visit": f"{get_random_attraction()} - Less crowded in the morning",
        "local_event": get_random_event(),
        "dinner": f"{get_random_restaurant()} - Local Specialties",
        "hotel_suggestion": get_random_hotel(),
        "travel_distance": f"{random.randint(5, 20)} km from hotel"
    }

def create_travel_plan(request: TravelRequest) -> dict:
    """Generate a detailed travel plan based on the request"""
    
    # Calculate number of days
    start_date = datetime.strptime(request.start_date, "%Y-%m-%d")
    end_date = datetime.strptime(request.end_date, "%Y-%m-%d")
    total_days = (end_date - start_date).days + 1
    
    # Generate daily plans
    daily_plans = {}
    for day in range(1, total_days + 1):
        daily_plans[f"Day {day}"] = create_daily_plan(day)
    
    # Generate hotel suggestions
    hotel_suggestions = [get_random_hotel() for _ in range(3)]
    
    # Calculate estimated cost
    base_cost = sum(hotel["price"] for hotel in hotel_suggestions[:1]) * total_days
    estimated_cost = base_cost * 1.5  # Include food, activities, etc.
    
    return {
        "destination": request.destination,
        "itinerary": daily_plans,
        "estimated_cost": estimated_cost,
        "hotel_suggestions": hotel_suggestions,
        "total_days": total_days
    }

# Add a REST endpoint to allow external systems to request travel plans
class RestRequest(Model):
    destination: str
    start_date: str
    end_date: str
    budget: float
    preferences: str

if __name__ == "__main__":
    planning_agent.run() 