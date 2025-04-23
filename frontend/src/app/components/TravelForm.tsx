import { FC, FormEvent, useState } from 'react';

interface TravelFormProps {
  onSubmit: (formData: {
    destination: string;
    start_date: string;
    end_date: string;
    budget: number;
    preferences: string;
  }) => void;
  loading: boolean;
}

const TravelForm: FC<TravelFormProps> = ({ onSubmit, loading }) => {
  const [destination, setDestination] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [budget, setBudget] = useState<string>('');
  const [preferences, setPreferences] = useState<string>('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      destination,
      start_date: startDate,
      end_date: endDate,
      budget: parseFloat(budget),
      preferences,
    });
  };

  return (
    <div className="bg-white/10 p-6 rounded-lg shadow-md h-full">
      <h2 className="text-2xl font-semibold mb-4">Plan Your Trip</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="destination" className="block text-sm font-medium mb-1">
            Destination
          </label>
          <input
            type="text"
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-black"
            placeholder="e.g. Tokyo, Japan"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-black"
              required
            />
          </div>
          
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium mb-1">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-black"
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="budget" className="block text-sm font-medium mb-1">
            Budget (USD)
          </label>
          <input
            type="number"
            id="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-black"
            placeholder="e.g. 2500"
            min="1"
            required
          />
        </div>
        
        <div>
          <label htmlFor="preferences" className="block text-sm font-medium mb-1">
            Travel Preferences
          </label>
          <textarea
            id="preferences"
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-black"
            placeholder="e.g. Cultural experiences, good food, technology"
            rows={3}
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? 'Generating Plan...' : 'Generate Travel Plan'}
        </button>
      </form>
    </div>
  );
};

export default TravelForm; 