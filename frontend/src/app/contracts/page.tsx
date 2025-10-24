'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Contract } from '@/types';

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    industry: '',
    governing_law: '',
    status: '',
  });
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ question: string; answer: string }>>([]);

  useEffect(() => {
    fetchContracts();
  }, [filters]);

  const fetchContracts = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const queryParams = new URLSearchParams(filters as any).toString();
      
      // TODO: Replace with actual API call when backend is ready
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contracts?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setContracts(data.items || []);
      } else {
        setContracts([]);
      }
    } catch (error) {
      console.error('Error fetching contracts:', error);
      setContracts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!chatMessage.trim()) return;

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ message: chatMessage }),
      });

      if (response.ok) {
        const data = await response.json();
        setChatHistory([...chatHistory, { question: chatMessage, answer: data.response }]);
        setChatMessage('');
      }
    } catch (error) {
      console.error('Error asking question:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">All Contracts</h1>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <Link href="/dashboard" className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Dashboard
            </Link>
            <Link href="/upload" className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Upload
            </Link>
            <Link href="/contracts" className="border-b-2 border-primary-500 py-4 px-1 text-sm font-medium text-primary-600">
              Contracts
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white shadow rounded-lg p-4 space-y-4">
              <h3 className="font-medium text-gray-900">Filters</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Search contracts..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={filters.industry}
                  onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
                >
                  <option value="">All Industries</option>
                  <option value="technology">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="manufacturing">Manufacturing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Governing Law</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={filters.governing_law}
                  onChange={(e) => setFilters({ ...filters, governing_law: e.target.value })}
                >
                  <option value="">All Laws</option>
                  <option value="Qatar">Qatar</option>
                  <option value="UK">UK</option>
                  <option value="USA">USA</option>
                  <option value="UAE">UAE</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="processing">Processing</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>

            {/* Mini Chat */}
            <div className="mt-6 bg-white shadow rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Ask about Contracts</h3>
                <button
                  onClick={() => setShowChat(!showChat)}
                  className="text-primary-600 hover:text-primary-700 text-sm"
                >
                  {showChat ? 'Hide' : 'Show'}
                </button>
              </div>

              {showChat && (
                <div className="space-y-3">
                  {/* Chat History */}
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {chatHistory.map((chat, idx) => (
                      <div key={idx} className="text-sm">
                        <div className="bg-blue-50 p-2 rounded mb-1">
                          <p className="font-medium text-blue-900">{chat.question}</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-gray-700">{chat.answer}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="Ask a question..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                    />
                    <button
                      onClick={handleAskQuestion}
                      className="px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm"
                    >
                      Ask
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contracts List */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-12">Loading contracts...</div>
            ) : contracts.length === 0 ? (
              <div className="bg-white shadow rounded-lg p-12 text-center">
                <p className="text-gray-500 mb-4">No contracts found.</p>
                <Link href="/upload" className="text-primary-600 hover:text-primary-500">
                  Upload your first contract
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {contracts.map((contract) => (
                  <Link
                    key={contract.id}
                    href={`/contracts/${contract.id}`}
                    className="block bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{contract.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{contract.summary || 'Processing...'}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          {contract.industry && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                              {contract.industry}
                            </span>
                          )}
                          {contract.governing_law && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                              {contract.governing_law}
                            </span>
                          )}
                          {contract.tags?.map((tag, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="ml-4 flex flex-col items-end">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full mb-2 ${
                          contract.status === 'completed' ? 'bg-green-100 text-green-800' :
                          contract.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          contract.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {contract.status}
                        </span>
                        {contract.risks && contract.risks.length > 0 && (
                          <span className="text-xs text-red-600">
                            {contract.risks.filter(r => r.severity === 'high' || r.severity === 'critical').length} high risks
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
