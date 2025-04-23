from uagents import Agent, Context, Model
from fastapi import FastAPI, Response

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

# Configure FastAPI app with CORS
@planning_agent.on_event("startup")
async def setup_fastapi(ctx: Context):
    app = planning_agent.get_fastapi_app()
    
    # Add CORS middleware
    from fastapi.middleware.cors import CORSMiddleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # In production, specify actual origins
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Model for sending travel plans
class TravelPlan(Model):
    destination: str
    itinerary: str
    estimated_cost: float

@planning_agent.on_event('startup')
async def startup_handler(ctx: Context):
    ctx.logger.info(f'Travel Planning Agent started with address: {ctx.agent.address}')

@planning_agent.on_message(model=TravelRequest)
async def handle_travel_request(ctx: Context, sender: str, msg: TravelRequest):
    ctx.logger.info(f'Received travel request from {sender}:')
    ctx.logger.info(f'Destination: {msg.destination}')
    ctx.logger.info(f'Dates: {msg.start_date} to {msg.end_date}')
    ctx.logger.info(f'Budget: ${msg.budget}')
    ctx.logger.info(f'Preferences: {msg.preferences}')
    
    # Process the request and create a travel plan (in a real app, this would involve more complex logic)
    plan = create_travel_plan(msg)
    
    # Send the plan back to the requesting agent
    await ctx.send(sender, plan)

def create_travel_plan(request: TravelRequest) -> TravelPlan:
    """Generate a travel plan based on the request (simplified for this example)"""
    
    # In a real application, this function would:
    # 1. Query external APIs for flights, hotels, attractions
    # 2. Use AI to optimize an itinerary based on preferences
    # 3. Calculate costs and manage the budget
    
    if request.destination == "Tokyo, Japan":
        itinerary = """
Day 1: Arrive in Tokyo, check-in at hotel
Day 2: Visit Tsukiji Fish Market, Senso-ji Temple, and Tokyo Skytree
Day 3: Explore Shinjuku and Shibuya districts
Day 4: Day trip to Mt. Fuji
Day 5: Visit Akihabara electronics district and Tokyo National Museum
Day 6: Explore Harajuku and Meiji Shrine
Day 7: Day trip to Kamakura
Day 8: Shopping in Ginza
Day 9: Visit Tokyo Disneyland
Day 10: Departure
"""
        estimated_cost = 2300.0
    else:
        itinerary = f"Custom 10-day itinerary for {request.destination} based on your preferences: {request.preferences}"
        estimated_cost = request.budget * 0.9  # Slightly under budget
    
    return TravelPlan(
        destination=request.destination,
        itinerary=itinerary,
        estimated_cost=estimated_cost
    )

# Add a REST endpoint to allow external systems to request travel plans
class RestRequest(Model):
    destination: str
    start_date: str
    end_date: str
    budget: float
    preferences: str

@planning_agent.on_rest_post("/travel/plan", RestRequest, TravelPlan)
async def handle_rest_request(ctx: Context, request: RestRequest) -> TravelPlan:
    ctx.logger.info(f"Received REST request for travel plan to {request.destination}")
    
    # Convert REST request to our internal TravelRequest model
    travel_request = TravelRequest(
        destination=request.destination,
        start_date=request.start_date,
        end_date=request.end_date,
        budget=request.budget,
        preferences=request.preferences
    )
    
    # Use the same planning logic
    return create_travel_plan(travel_request)

if __name__ == "__main__":
    planning_agent.run() 