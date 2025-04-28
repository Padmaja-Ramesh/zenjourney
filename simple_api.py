from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import random

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TravelRequest(BaseModel):
    destination: str
    start_date: str
    end_date: str
    budget: float
    preferences: str

def get_random_weather():
    return f"{random.randint(15, 30)}°C, {random.choice(['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy'])}"

def get_random_restaurant():
    restaurants = {
        "breakfast": [
            "Local Breakfast Cafe - Traditional morning specialties",
            "Morning Market - Fresh local produce and pastries",
            "Brunch House - International breakfast options",
            "Coffee & Bakery - Fresh pastries and coffee",
            "Street Food Market - Local breakfast delicacies"
        ],
        "dinner": [
            "Traditional Restaurant - Local specialties and wine",
            "Gourmet Bistro - Fine dining experience",
            "Local Tavern - Authentic regional dishes",
            "Modern Fusion - Contemporary takes on classics",
            "Historic Restaurant - Centuries-old recipes"
        ]
    }
    return {
        "breakfast": random.choice(restaurants["breakfast"]),
        "dinner": random.choice(restaurants["dinner"])
    }

def get_random_attraction():
    attractions = [
        {"name": "Historic Castle", "crowd_level": "Less crowded in morning", "best_time": "9:00 AM"},
        {"name": "Art Museum", "crowd_level": "Moderate crowds", "best_time": "2:00 PM"},
        {"name": "Cathedral", "crowd_level": "Busy midday", "best_time": "8:30 AM"},
        {"name": "Old Town Square", "crowd_level": "Crowded afternoons", "best_time": "10:00 AM"},
        {"name": "Royal Gardens", "crowd_level": "Peaceful mornings", "best_time": "9:30 AM"}
    ]
    return random.choice(attractions)

def get_random_event():
    events = [
        {"name": "Art Exhibition", "type": "Cultural", "duration": "2 hours"},
        {"name": "Local Music Festival", "type": "Entertainment", "duration": "3 hours"},
        {"name": "Food Market", "type": "Culinary", "duration": "Open all day"},
        {"name": "Historical Tour", "type": "Educational", "duration": "1.5 hours"},
        {"name": "Wine Tasting", "type": "Culinary", "duration": "2 hours"}
    ]
    return random.choice(events)

def get_hotels():
    hotels = [
        {
            "name": "Grand Hotel",
            "rating": 4.5,
            "price_per_night": 200,
            "amenities": ["Pool", "Spa", "Restaurant"],
            "location": "City Center"
        },
        {
            "name": "Historic Inn",
            "rating": 4.2,
            "price_per_night": 150,
            "amenities": ["Breakfast included", "Garden", "Bar"],
            "location": "Old Town"
        },
        {
            "name": "Modern Suites",
            "rating": 4.7,
            "price_per_night": 250,
            "amenities": ["Gym", "Rooftop bar", "Free parking"],
            "location": "Business District"
        }
    ]
    return hotels

def create_daily_plan(day_number):
    restaurants = get_random_restaurant()
    attraction = get_random_attraction()
    event = get_random_event()
    
    return {
        "weather": get_random_weather(),
        "breakfast": restaurants["breakfast"],
        "must_visit": {
            "attraction": attraction["name"],
            "crowd_info": attraction["crowd_level"],
            "recommended_time": attraction["best_time"]
        },
        "local_event": {
            "name": event["name"],
            "type": event["type"],
            "duration": event["duration"]
        },
        "dinner": restaurants["dinner"],
        "travel_tips": {
            "morning_activity": "Start early to avoid crowds",
            "transport": f"Public transport available every 15 minutes",
            "local_customs": "Remember to greet locals with a smile"
        }
    }

@app.post("/travel/plan")
async def create_travel_plan(request: TravelRequest):
    try:
        # Calculate number of days
        start = datetime.strptime(request.start_date, "%Y-%m-%d")
        end = datetime.strptime(request.end_date, "%Y-%m-%d")
        total_days = (end - start).days + 1
        
        # Generate daily plans
        daily_plans = {}
        for day in range(1, total_days + 1):
            daily_plans[f"Day {day}"] = create_daily_plan(day)
        
        # Get hotel suggestions
        hotels = get_hotels()
        
        # Calculate estimated costs
        daily_cost = sum(hotel["price_per_night"] for hotel in hotels) / len(hotels)
        total_cost = daily_cost * total_days * 1.5  # Including food and activities
        
        return {
            "destination": request.destination,
            "total_days": total_days,
            "itinerary": daily_plans,
            "hotel_suggestions": hotels,
            "estimated_cost": min(total_cost, request.budget),
            "travel_tips": {
                "best_time_to_visit": "Spring (March to May) or Autumn (September to November)",
                "local_transportation": "Efficient public transport available",
                "currency": "Euro (EUR)",
                "language": "German",
                "emergency_numbers": {
                    "police": "110",
                    "ambulance": "112",
                    "tourist_helpline": "030-25-00"
                }
            }
        }
        
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080) 