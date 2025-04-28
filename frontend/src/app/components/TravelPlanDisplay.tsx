import { FC, useState } from 'react';

interface DailyPlan {
  weather: string;
  breakfast: string;
  must_visit: {
    attraction: string;
    crowd_info: string;
    recommended_time: string;
  };
  local_event: {
    name: string;
    type: string;
    duration: string;
  };
  dinner: string;
  travel_tips: {
    morning_activity: string;
    transport: string;
    local_customs: string;
  };
}

interface TravelPlan {
  destination: string;
  itinerary: { [key: string]: DailyPlan };
  estimated_cost: number;
  hotel_suggestions?: Array<{
    name: string;
    rating: number;
    price_per_night: number;
    amenities: string[];
    location: string;
  }>;
  travel_tips?: {
    best_time_to_visit: string;
    local_transportation: string;
    currency: string;
    language: string;
    emergency_numbers: {
      police: string;
      ambulance: string;
      tourist_helpline: string;
    };
  };
}

interface TravelPlanDisplayProps {
  travelPlan: TravelPlan | null;
  loading: boolean;
  error: string;
}

const TravelPlanDisplay: FC<TravelPlanDisplayProps> = ({ travelPlan, loading, error }) => {
  const [currentDay, setCurrentDay] = useState<number>(1);
  const totalDays = travelPlan ? Object.keys(travelPlan.itinerary).length : 0;

  const handlePrevDay = () => {
    setCurrentDay(prev => Math.max(prev - 1, 1));
  };

  const handleNextDay = () => {
    setCurrentDay(prev => Math.min(prev + 1, totalDays));
  };

  const getCurrentDayPlan = () => {
    if (!travelPlan) return null;
    const dayKey = `Day ${currentDay}`;
    return travelPlan.itinerary[dayKey];
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-8 rounded-xl shadow-lg border border-gray-700/50">
      <h2 className="text-2xl font-bold text-white mb-8 text-center">Your Travel Plan</h2>
      
      {error && (
        <div className="p-6 mb-6 bg-red-900/50 border border-red-500 text-red-200 rounded-lg">
          <p className="mb-2">{error}</p>
        </div>
      )}
      
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {travelPlan && !loading && (
        <div>
          <div className="mb-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">{travelPlan.destination}</h3>
            <p className="text-green-400 font-medium text-lg">
              Estimated Cost: ${travelPlan.estimated_cost.toFixed(2)}
            </p>
          </div>
          
          {/* Day Navigation */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={handlePrevDay}
              disabled={currentDay === 1}
              className="px-6 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous Day
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => (
                <button
                  key={day}
                  onClick={() => setCurrentDay(day)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentDay === day
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  } transition-colors`}
                >
                  {day}
                </button>
              ))}
            </div>
            <button
              onClick={handleNextDay}
              disabled={currentDay === totalDays}
              className="px-6 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              Next Day
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {/* Current Day's Plan */}
          {getCurrentDayPlan() && (
            <div className="space-y-6">
              <div className="bg-gray-700/30 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold text-white">Day {currentDay}</h4>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                    {getCurrentDayPlan()?.weather}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <h5 className="font-semibold text-yellow-400">Morning Activities</h5>
                      </div>
                      <p className="text-gray-200 mb-2">Breakfast: {getCurrentDayPlan()?.breakfast}</p>
                      <div className="mt-3">
                        <p className="font-medium text-blue-400 mb-1">Must Visit:</p>
                        <p className="text-gray-200">{getCurrentDayPlan()?.must_visit.attraction}</p>
                        <p className="text-sm text-gray-400 mt-1">Crowd Info: {getCurrentDayPlan()?.must_visit.crowd_info}</p>
                        <p className="text-sm text-gray-400">Recommended Time: {getCurrentDayPlan()?.must_visit.recommended_time}</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <h5 className="font-semibold text-purple-400">Local Event</h5>
                      </div>
                      <p className="text-gray-200 mb-1">{getCurrentDayPlan()?.local_event.name}</p>
                      <p className="text-sm text-gray-400">Type: {getCurrentDayPlan()?.local_event.type}</p>
                      <p className="text-sm text-gray-400">Duration: {getCurrentDayPlan()?.local_event.duration}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                        <h5 className="font-semibold text-green-400">Evening</h5>
                      </div>
                      <p className="text-gray-200">Dinner: {getCurrentDayPlan()?.dinner}</p>
                    </div>
                    
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <h5 className="font-semibold text-red-400">Travel Tips</h5>
                      </div>
                      <ul className="space-y-2 text-gray-200">
                        <li>• {getCurrentDayPlan()?.travel_tips.morning_activity}</li>
                        <li>• {getCurrentDayPlan()?.travel_tips.transport}</li>
                        <li>• {getCurrentDayPlan()?.travel_tips.local_customs}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Hotel Suggestions */}
          {travelPlan.hotel_suggestions && (
            <div className="mt-12">
              <h4 className="text-xl font-bold text-white mb-6 text-center">Recommended Hotels</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {travelPlan.hotel_suggestions.map((hotel, index) => (
                  <div key={index} className="bg-gray-700/30 p-6 rounded-lg">
                    <h5 className="font-bold text-white text-lg mb-2">{hotel.name}</h5>
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < hotel.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-green-400 font-medium mb-2">${hotel.price_per_night}/night</p>
                    <p className="text-gray-400 mb-3">{hotel.location}</p>
                    <div className="flex flex-wrap gap-2">
                      {hotel.amenities.map((amenity, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* General Travel Tips */}
          {travelPlan.travel_tips && (
            <div className="mt-12">
              <h4 className="text-xl font-bold text-white mb-6 text-center">General Travel Tips</h4>
              <div className="bg-gray-700/30 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-blue-400 mb-2">Best Time to Visit</h5>
                      <p className="text-gray-200">{travelPlan.travel_tips.best_time_to_visit}</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-blue-400 mb-2">Local Transportation</h5>
                      <p className="text-gray-200">{travelPlan.travel_tips.local_transportation}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-blue-400 mb-2">Currency & Language</h5>
                      <p className="text-gray-200">Currency: {travelPlan.travel_tips.currency}</p>
                      <p className="text-gray-200">Language: {travelPlan.travel_tips.language}</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-blue-400 mb-2">Emergency Numbers</h5>
                      <ul className="space-y-1 text-gray-200">
                        <li>Police: {travelPlan.travel_tips.emergency_numbers.police}</li>
                        <li>Ambulance: {travelPlan.travel_tips.emergency_numbers.ambulance}</li>
                        <li>Tourist Helpline: {travelPlan.travel_tips.emergency_numbers.tourist_helpline}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TravelPlanDisplay; 