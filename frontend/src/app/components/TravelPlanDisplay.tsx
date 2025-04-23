import { FC } from 'react';

interface TravelPlan {
  destination: string;
  itinerary: string;
  estimated_cost: number;
}

interface TravelPlanDisplayProps {
  travelPlan: TravelPlan | null;
  loading: boolean;
  error: string;
}

const TravelPlanDisplay: FC<TravelPlanDisplayProps> = ({ travelPlan, loading, error }) => {
  return (
    <div className="bg-white/10 p-6 rounded-lg shadow-md h-full">
      <h2 className="text-2xl font-semibold mb-4">Your Travel Plan</h2>
      
      {error && (
        <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {loading && (
        <div className="flex justify-center items-center h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {!loading && !error && !travelPlan && (
        <div className="text-center text-gray-400 py-12">
          <p>Generate a travel plan to see details here.</p>
        </div>
      )}
      
      {travelPlan && (
        <div>
          <div className="mb-4">
            <h3 className="text-xl font-semibold">{travelPlan.destination}</h3>
            <p className="text-green-500 font-medium">
              Estimated Cost: ${travelPlan.estimated_cost.toFixed(2)}
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Itinerary:</h4>
            <div className="bg-gray-800 p-4 rounded whitespace-pre-line text-sm">
              {travelPlan.itinerary}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelPlanDisplay; 