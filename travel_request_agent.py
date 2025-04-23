from uagents import Agent, Context, Model

# Data model for travel requests
class TravelRequest(Model):
    destination: str
    start_date: str
    end_date: str
    budget: float
    preferences: str

# Create travel request agent
request_agent = Agent(
    name='Travel Request Agent',
    port=8000,
    endpoint=['http://localhost:8000/submit']
)

# This will be replaced with the actual address of the planning agent
planning_agent_address = "agent1qtgc4vqn4ehh88hct0umnnqeg36m5722hc4e63lwy573kjtqee7qg5afmap"  # Placeholder

@request_agent.on_event('startup')
async def startup_handler(ctx: Context):
    ctx.logger.info(f'Travel Request Agent started with address: {ctx.agent.address}')

# Model for receiving planning responses
class TravelPlan(Model):
    destination: str
    itinerary: str
    estimated_cost: float

@request_agent.on_interval(period=10.0)  # Send a request every 10 seconds
async def send_travel_request(ctx: Context):
    ctx.logger.info("Sending travel request to planning agent...")
    
    # Create a travel request
    request = TravelRequest(
        destination="Tokyo, Japan",
        start_date="2023-07-01",
        end_date="2023-07-10",
        budget=2500.0,
        preferences="Cultural experiences, good food, technology"
    )
    
    # Send the request and wait for response
    response, status = await ctx.send_and_receive(
        planning_agent_address,
        request,
        response_type=TravelPlan
    )
    
    # Process the response
    if isinstance(response, TravelPlan):
        ctx.logger.info(f'Received travel plan:')
        ctx.logger.info(f'Destination: {response.destination}')
        ctx.logger.info(f'Itinerary: {response.itinerary}')
        ctx.logger.info(f'Estimated cost: ${response.estimated_cost}')
    else:
        ctx.logger.error(f'Failed to receive travel plan: {status}')

# Regular message handler for non-solicited responses
@request_agent.on_message(model=TravelPlan)
async def handle_travel_plan(ctx: Context, sender: str, msg: TravelPlan):
    ctx.logger.info(f'Received unsolicited travel plan from {sender}:')
    ctx.logger.info(f'Destination: {msg.destination}')
    ctx.logger.info(f'Itinerary: {msg.itinerary}')
    ctx.logger.info(f'Estimated cost: ${msg.estimated_cost}')

if __name__ == "__main__":
    request_agent.run() 