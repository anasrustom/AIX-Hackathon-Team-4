'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import type { Contract } from '@/types';

export default function ContractDetailPage() {
  const params = useParams();
  const contractId = params.id as string;
  
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'risks' | 'clauses' | 'parties'>('overview');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ question: string; answer: string }>>([]);

  useEffect(() => {
    if (contractId) {
      fetchContractDetails();
    }
  }, [contractId]);

  const fetchContractDetails = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      // TODO: Replace with actual API call when backend is ready
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contracts/${contractId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setContract(data);
      }
    } catch (error) {
      console.error('Error fetching contract details:', error);
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
        body: JSON.stringify({
          contract_id: contractId,
          message: chatMessage,
        }),
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

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading contract...</div>;
  }

  if (!contract) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-500 mb-4">Contract not found</p>
        <Link href="/contracts" className="text-primary-600 hover:text-primary-500">
          Back to Contracts
        </Link>
      </div>
    );
  }

  const topRisks = contract.risks?.filter(r => r.severity === 'high' || r.severity === 'critical').slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/contracts" className="text-sm text-primary-600 hover:text-primary-500 mb-2 inline-block">
                ← Back to Contracts
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">{contract.title}</h1>
              <p className="text-sm text-gray-600 mt-1">{contract.file_name}</p>
            </div>
            <span className={`px-4 py-2 text-sm font-medium rounded-full ${
              contract.status === 'completed' ? 'bg-green-100 text-green-800' :
              contract.status === 'processing' ? 'bg-blue-100 text-blue-800' :
              contract.status === 'failed' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {contract.status}
            </span>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 text-sm font-medium border-b-2 ${
                activeTab === 'overview'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('risks')}
              className={`py-4 px-1 text-sm font-medium border-b-2 ${
                activeTab === 'risks'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Risk Analysis
            </button>
            <button
              onClick={() => setActiveTab('clauses')}
              className={`py-4 px-1 text-sm font-medium border-b-2 ${
                activeTab === 'clauses'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Clauses
            </button>
            <button
              onClick={() => setActiveTab('parties')}
              className={`py-4 px-1 text-sm font-medium border-b-2 ${
                activeTab === 'parties'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Parties & Dates
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="col-span-2 space-y-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <>
                {/* Summary */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Contract Summary</h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-700">{contract.summary || 'AI summary will appear here after processing.'}</p>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Purpose</p>
                        <p className="mt-1 text-sm text-gray-900">{contract.purpose || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Scope</p>
                        <p className="mt-1 text-sm text-gray-900">{contract.scope || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Information Grid */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Governing Law</h3>
                    <p className="text-lg font-semibold text-gray-900">{contract.governing_law || 'N/A'}</p>
                  </div>
                  <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Jurisdiction</h3>
                    <p className="text-lg font-semibold text-gray-900">{contract.jurisdiction || 'N/A'}</p>
                  </div>
                </div>

                {/* Financial Terms */}
                {contract.financial_terms && contract.financial_terms.length > 0 && (
                  <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Financial Terms</h2>
                    <div className="space-y-3">
                      {contract.financial_terms.map((term) => (
                        <div key={term.id} className="flex justify-between items-start border-b pb-3">
                          <div>
                            <p className="font-medium text-gray-900">{term.term_type}</p>
                            {term.description && <p className="text-sm text-gray-600">{term.description}</p>}
                          </div>
                          <p className="text-lg font-semibold text-gray-900">
                            {term.currency} {term.amount.toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Top 5 Risks */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Top 5 Risks</h2>
                  {topRisks.length > 0 ? (
                    <div className="space-y-3">
                      {topRisks.map((risk) => (
                        <div key={risk.id} className="border-l-4 border-red-500 pl-4 py-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{risk.title}</p>
                              <p className="text-sm text-gray-600 mt-1">{risk.description}</p>
                              {risk.recommendation && (
                                <p className="text-sm text-blue-600 mt-2">💡 {risk.recommendation}</p>
                              )}
                            </div>
                            <span className={`ml-4 px-2 py-1 text-xs font-medium rounded ${
                              risk.severity === 'critical' ? 'bg-red-100 text-red-800' :
                              risk.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                              risk.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {risk.severity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No high-severity risks identified.</p>
                  )}
                </div>
              </>
            )}

            {/* Risk Analysis Tab */}
            {activeTab === 'risks' && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">All Risks</h2>
                {contract.risks && contract.risks.length > 0 ? (
                  <div className="space-y-4">
                    {contract.risks.map((risk) => (
                      <div key={risk.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-gray-900">{risk.title}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            risk.severity === 'critical' ? 'bg-red-100 text-red-800' :
                            risk.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                            risk.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {risk.severity}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{risk.description}</p>
                        <p className="text-xs text-gray-500">Type: {risk.risk_type}</p>
                        {risk.clause_reference && (
                          <p className="text-xs text-gray-500">Reference: {risk.clause_reference}</p>
                        )}
                        {risk.recommendation && (
                          <div className="mt-3 bg-blue-50 p-3 rounded">
                            <p className="text-sm text-blue-900">
                              <strong>Recommendation:</strong> {risk.recommendation}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No risks identified yet.</p>
                )}
              </div>
            )}

            {/* Clauses Tab */}
            {activeTab === 'clauses' && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Contract Clauses</h2>
                <p className="text-gray-500 text-sm">Clause extraction coming soon...</p>
              </div>
            )}

            {/* Parties & Dates Tab */}
            {activeTab === 'parties' && (
              <>
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Contracting Parties</h2>
                  {contract.parties && contract.parties.length > 0 ? (
                    <div className="space-y-3">
                      {contract.parties.map((party) => (
                        <div key={party.id} className="border rounded-lg p-4">
                          <p className="font-medium text-gray-900">{party.name}</p>
                          <div className="flex gap-4 mt-2">
                            <span className="text-sm text-gray-600">Type: {party.type}</span>
                            <span className="text-sm text-gray-600">Role: {party.role}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No parties identified yet.</p>
                  )}
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Key Dates</h2>
                  {contract.key_dates && contract.key_dates.length > 0 ? (
                    <div className="space-y-3">
                      {contract.key_dates.map((dateItem) => (
                        <div key={dateItem.id} className="flex justify-between items-center border-b pb-3">
                          <div>
                            <p className="font-medium text-gray-900">{dateItem.date_type.replace('_', ' ')}</p>
                            {dateItem.description && <p className="text-sm text-gray-600">{dateItem.description}</p>}
                          </div>
                          <p className="text-sm font-semibold text-gray-900">{new Date(dateItem.date).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No key dates identified yet.</p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Sidebar - Mini Chat */}
          <div className="col-span-1">
            <div className="bg-white shadow rounded-lg p-4 sticky top-4">
              <h3 className="font-medium text-gray-900 mb-4">Ask about this contract</h3>
              
              {/* Chat History */}
              <div className="h-96 overflow-y-auto mb-4 space-y-3">
                {chatHistory.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">
                    Ask questions about this contract
                  </p>
                ) : (
                  chatHistory.map((chat, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-blue-900">{chat.question}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">{chat.answer}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input */}
              <div className="space-y-2">
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none"
                  placeholder="e.g., What is the penalty for late delivery?"
                  rows={3}
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAskQuestion();
                    }
                  }}
                />
                <button
                  onClick={handleAskQuestion}
                  disabled={!chatMessage.trim()}
                  className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium disabled:opacity-50"
                >
                  Ask Question
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
