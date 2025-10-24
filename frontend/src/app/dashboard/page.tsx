'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { DashboardStats, Contract } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchDashboardStats();
  }, [router]);

  const fetchDashboardStats = async () => {
    try {
      // TODO: Replace with actual API call when backend is ready
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch stats');
      
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Mock data for development
      setStats({
        total_contracts: 0,
        pending_reviews: 0,
        high_risk_contracts: 0,
        expiring_soon: 0,
        recent_uploads: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">AI CLM Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <Link href="/dashboard" className="border-b-2 border-primary-500 py-4 px-1 text-sm font-medium text-primary-600">
              Dashboard
            </Link>
            <Link href="/upload" className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Upload
            </Link>
            <Link href="/contracts" className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Contracts
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Contracts</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats?.total_contracts || 0}</dd>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Reviews</dt>
                  <dd className="mt-1 text-3xl font-semibold text-yellow-600">{stats?.pending_reviews || 0}</dd>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">High Risk</dt>
                  <dd className="mt-1 text-3xl font-semibold text-red-600">{stats?.high_risk_contracts || 0}</dd>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Expiring Soon</dt>
                  <dd className="mt-1 text-3xl font-semibold text-orange-600">{stats?.expiring_soon || 0}</dd>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Uploads */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Uploads</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            {stats?.recent_uploads && stats.recent_uploads.length > 0 ? (
              <div className="space-y-4">
                {stats.recent_uploads.map((contract) => (
                  <div key={contract.id} className="flex items-center justify-between border-b pb-4">
                    <div>
                      <Link href={`/contracts/${contract.id}`} className="text-sm font-medium text-primary-600 hover:text-primary-500">
                        {contract.title}
                      </Link>
                      <p className="text-sm text-gray-500">{contract.file_name}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      contract.status === 'completed' ? 'bg-green-100 text-green-800' :
                      contract.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      contract.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {contract.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">
                No contracts uploaded yet. <Link href="/upload" className="text-primary-600 hover:text-primary-500">Upload your first contract</Link>
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
