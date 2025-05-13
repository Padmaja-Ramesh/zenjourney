'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Analytics {
  totalCalls: number;
  averageDuration: number;
  commonQuestions: Array<{
    question: string;
    count: number;
  }>;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/admin/analytics');
        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const barChartData = {
    labels: analytics?.commonQuestions.map(q => q.question) || [],
    datasets: [
      {
        label: 'Number of Times Asked',
        data: analytics?.commonQuestions.map(q => q.count) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Common Questions Analysis',
      },
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48 bg-gray-700 rounded"></div>
            <div className="h-48 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>
      
      {analytics && (
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-4">Call Analytics</h2>
              <div className="space-y-4">
                <div className="bg-gray-700 rounded p-4">
                  <p className="text-gray-400 text-sm">Total Calls</p>
                  <p className="text-2xl font-bold text-white">{analytics.totalCalls}</p>
                </div>
                <div className="bg-gray-700 rounded p-4">
                  <p className="text-gray-400 text-sm">Average Duration</p>
                  <p className="text-2xl font-bold text-white">{analytics.averageDuration} minutes</p>
                </div>
              </div>
            </div>
            
            {/* Chart */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-4">Question Distribution</h2>
              <div className="h-[300px]">
                <Bar data={barChartData} options={barChartOptions} />
              </div>
            </div>
          </div>

          {/* Common Questions List */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Common Questions</h2>
            <div className="space-y-3">
              {analytics.commonQuestions.map((q, i) => (
                <div key={i} className="bg-gray-700 rounded p-3 flex justify-between items-center">
                  <span className="text-white">{q.question}</span>
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                    {q.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
