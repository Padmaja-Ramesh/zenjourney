'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  total_calls: number;
  average_duration: number;
  common_questions: Array<{
    question: string;
    count: number;
  }>;
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/admin/analytics');
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAnalytics(data);
      } catch (err) {
        // Properly handle the error
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    };

    fetchAnalytics();
  }, [router]);

  const barChartData = {
    labels: analytics?.common_questions.map(q => q.question) || [],
    datasets: [
      {
        label: 'Number of Times Asked',
        data: analytics?.common_questions.map(q => q.count) || [],
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

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Call Analytics</h2>
            <div className="space-y-4">
              <div className="bg-gray-700 rounded p-4">
                <p className="text-gray-400 text-sm">Total Calls</p>
                <p className="text-2xl font-bold text-white">{analytics.total_calls}</p>
              </div>
              <div className="bg-gray-700 rounded p-4">
                <p className="text-gray-400 text-sm">Average Duration</p>
                <p className="text-2xl font-bold text-white">{analytics.average_duration} minutes</p>
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
            {analytics.common_questions.map((q, i) => (
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
    </div>
  );
}
