'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import type { Contract } from '@/types';
import AIChatSidebar from '@/components/AIChatSidebar';

export default function ContractDetailPage() {
  const params = useParams();
  const contractId = params.id as string;
  
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'risks' | 'clauses' | 'parties'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editedContract, setEditedContract] = useState<Contract | null>(null);
  const [showAddModal, setShowAddModal] = useState<'party' | 'date' | 'risk' | 'clause' | null>(null);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  useEffect(() => {
    if (contractId) {
      fetchContractDetails();
    }
  }, [contractId]);

  const fetchContractDetails = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      // Fetch from API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contracts/${contractId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const contractData = await response.json();
        setContract(contractData);
        setEditedContract(contractData);
      } else {
        console.error('Failed to fetch contract:', response.status);
      }
    } catch (error) {
      console.error('Error fetching contract details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (editedContract) {
      try {
        const token = localStorage.getItem('access_token');
        
        // Prepare update data - only send changed fields
        const updateData: any = {};
        if (editedContract.title !== contract?.title) updateData.title = editedContract.title;
        if (editedContract.status !== contract?.status) updateData.status = editedContract.status;
        if (editedContract.governing_law !== contract?.governing_law) updateData.governing_law = editedContract.governing_law;
        if (editedContract.jurisdiction !== contract?.jurisdiction) updateData.jurisdiction = editedContract.jurisdiction;
        if (editedContract.industry !== contract?.industry) updateData.industry = editedContract.industry;
        if (editedContract.contract_type !== contract?.contract_type) updateData.contract_type = editedContract.contract_type;
        if (editedContract.summary !== contract?.summary) updateData.summary = editedContract.summary;
        if (editedContract.purpose !== contract?.purpose) updateData.purpose = editedContract.purpose;
        if (editedContract.scope !== contract?.scope) updateData.scope = editedContract.scope;
        
        // Update contract in database
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contracts/${contractId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update contract');
        }
        
        // Refresh contract data from server
        await fetchContractDetails();
        setIsEditing(false);
        
        console.log('✅ Contract updated successfully in database');
      } catch (error) {
        console.error('❌ Error updating contract:', error);
        alert('Failed to save changes. Please try again.');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditedContract(contract);
    setIsEditing(false);
  };

  const updateContractField = (field: keyof Contract, value: any) => {
    if (editedContract) {
      setEditedContract({ ...editedContract, [field]: value });
    }
  };

  const addParty = (party: any) => {
    if (editedContract) {
      const newParty = {
        id: Date.now().toString(),
        contract_id: contractId,
        ...party
      };
      setEditedContract({
        ...editedContract,
        parties: [...(editedContract.parties || []), newParty]
      });
    }
  };

  const removeParty = (partyId: string) => {
    if (editedContract) {
      setEditedContract({
        ...editedContract,
        parties: editedContract.parties?.filter(p => p.id !== partyId) || []
      });
    }
  };

  const addKeyDate = (date: any) => {
    if (editedContract) {
      const newDate = {
        id: Date.now().toString(),
        contract_id: contractId,
        ...date
      };
      setEditedContract({
        ...editedContract,
        key_dates: [...(editedContract.key_dates || []), newDate]
      });
    }
  };

  const removeKeyDate = (dateId: string) => {
    if (editedContract) {
      setEditedContract({
        ...editedContract,
        key_dates: editedContract.key_dates?.filter(d => d.id !== dateId) || []
      });
    }
  };

  const addRisk = async (risk: any) => {
    try {
      const token = localStorage.getItem('access_token');
      
      // Add risk to database
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contracts/${contractId}/risks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(risk),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add risk');
      }
      
      // Refresh contract data to get the new risk with proper ID
      await fetchContractDetails();
      console.log('✅ Risk added successfully to database');
    } catch (error) {
      console.error('❌ Error adding risk:', error);
      alert('Failed to add risk. Please try again.');
    }
  };

  const removeRisk = async (riskId: string) => {
    try {
      const token = localStorage.getItem('access_token');
      
      // Delete risk from database
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contracts/${contractId}/risks/${riskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete risk');
      }
      
      // Refresh contract data
      await fetchContractDetails();
      console.log('✅ Risk deleted successfully from database');
    } catch (error) {
      console.error('❌ Error deleting risk:', error);
      alert('Failed to delete risk. Please try again.');
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
  const displayContract = isEditing ? editedContract : contract;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Link href="/contracts" className="text-sm text-primary-600 hover:text-primary-500 mb-2 inline-block">
                ← Back to Contracts
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">{displayContract?.title}</h1>
              <p className="text-sm text-gray-600 mt-1">{displayContract?.file_name}</p>
            </div>
            <div className="flex items-center gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-smooth"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-smooth"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <>
                  <span className={`px-4 py-2 text-sm font-medium rounded-full ${
                    displayContract?.status === 'completed' ? 'bg-green-100 text-green-800' :
                    displayContract?.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    displayContract?.status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {displayContract?.status}
                  </span>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-smooth flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Contract
                  </button>
                </>
              )}
            </div>
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
                {/* Status Selector (when editing) */}
                {isEditing && (
                  <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Contract Status</h2>
                    <select
                      value={editedContract?.status}
                      onChange={(e) => updateContractField('status', e.target.value)}
                      className="input"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                )}

                {/* Summary */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Contract Summary</h2>
                  <div className="prose max-w-none">
                    {isEditing ? (
                      <textarea
                        value={editedContract?.summary || ''}
                        onChange={(e) => updateContractField('summary', e.target.value)}
                        className="input min-h-[100px]"
                        placeholder="Enter contract summary..."
                      />
                    ) : (
                      <p className="text-gray-700">{displayContract?.summary || 'AI summary will appear here after processing.'}</p>
                    )}
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Purpose</p>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedContract?.purpose || ''}
                            onChange={(e) => updateContractField('purpose', e.target.value)}
                            className="input mt-1"
                            placeholder="Enter purpose..."
                          />
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">{displayContract?.purpose || 'N/A'}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Scope</p>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedContract?.scope || ''}
                            onChange={(e) => updateContractField('scope', e.target.value)}
                            className="input mt-1"
                            placeholder="Enter scope..."
                          />
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">{displayContract?.scope || 'N/A'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Information Grid */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Governing Law</h3>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedContract?.governing_law || ''}
                        onChange={(e) => updateContractField('governing_law', e.target.value)}
                        className="input"
                        placeholder="Enter governing law..."
                      />
                    ) : (
                      <p className="text-lg font-semibold text-gray-900">{displayContract?.governing_law || 'N/A'}</p>
                    )}
                  </div>
                  <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Jurisdiction</h3>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedContract?.jurisdiction || ''}
                        onChange={(e) => updateContractField('jurisdiction', e.target.value)}
                        className="input"
                        placeholder="Enter jurisdiction..."
                      />
                    ) : (
                      <p className="text-lg font-semibold text-gray-900">{displayContract?.jurisdiction || 'N/A'}</p>
                    )}
                  </div>
                </div>

                {/* Industry & Type */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Industry</h3>
                    {isEditing ? (
                      <select
                        value={editedContract?.industry || ''}
                        onChange={(e) => updateContractField('industry', e.target.value)}
                        className="input"
                      >
                        <option value="">Select industry...</option>
                        <option value="Technology">Technology</option>
                        <option value="Finance">Finance</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Retail">Retail</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <p className="text-lg font-semibold text-gray-900">{displayContract?.industry || 'N/A'}</p>
                    )}
                  </div>
                  <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Contract Type</h3>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedContract?.contract_type || ''}
                        onChange={(e) => updateContractField('contract_type', e.target.value)}
                        className="input"
                        placeholder="Enter contract type..."
                      />
                    ) : (
                      <p className="text-lg font-semibold text-gray-900">{displayContract?.contract_type || 'N/A'}</p>
                    )}
                  </div>
                </div>

                {/* Financial Terms */}
                {displayContract?.financial_terms && displayContract.financial_terms.length > 0 && (
                  <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Financial Terms</h2>
                    <div className="space-y-3">
                      {displayContract.financial_terms.map((term) => (
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
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900">All Risks</h2>
                  {isEditing && (
                    <button
                      onClick={() => setShowAddModal('risk')}
                      className="px-3 py-1.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-smooth flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Risk
                    </button>
                  )}
                </div>
                {displayContract?.risks && displayContract.risks.length > 0 ? (
                  <div className="space-y-4">
                    {displayContract.risks.map((risk) => (
                      <div key={risk.id} className="border rounded-lg p-4 relative">
                        {isEditing && (
                          <button
                            onClick={() => removeRisk(risk.id)}
                            className="absolute top-2 right-2 text-red-600 hover:text-red-700"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                        <div className="flex items-start justify-between mb-2 pr-8">
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
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Contracting Parties</h2>
                    {isEditing && (
                      <button
                        onClick={() => setShowAddModal('party')}
                        className="px-3 py-1.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-smooth flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Party
                      </button>
                    )}
                  </div>
                  {displayContract?.parties && displayContract.parties.length > 0 ? (
                    <div className="space-y-3">
                      {displayContract.parties.map((party) => (
                        <div key={party.id} className="border rounded-lg p-4 relative">
                          {isEditing && (
                            <button
                              onClick={() => removeParty(party.id)}
                              className="absolute top-2 right-2 text-red-600 hover:text-red-700"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                          <p className="font-medium text-gray-900 pr-8">{party.name}</p>
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
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Key Dates</h2>
                    {isEditing && (
                      <button
                        onClick={() => setShowAddModal('date')}
                        className="px-3 py-1.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-smooth flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Date
                      </button>
                    )}
                  </div>
                  {displayContract?.key_dates && displayContract.key_dates.length > 0 ? (
                    <div className="space-y-3">
                      {displayContract.key_dates.map((dateItem) => (
                        <div key={dateItem.id} className="flex justify-between items-center border-b pb-3 relative">
                          {isEditing && (
                            <button
                              onClick={() => removeKeyDate(dateItem.id)}
                              className="absolute top-0 right-0 text-red-600 hover:text-red-700"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                          <div className="pr-8">
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

          {/* Sidebar - AI Assistant Button */}
          <div className="col-span-1">
            <button
              onClick={() => setIsAIChatOpen(true)}
              className="bg-white shadow rounded-lg p-6 sticky top-4 w-full hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-500 mx-auto rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth shadow-glow">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Ask Klara AI</h3>
                <p className="text-sm text-gray-600">Get instant insights about this contract</p>
              </div>
            </button>
          </div>
        </div>
      </main>

      {/* Add Party Modal */}
      {showAddModal === 'party' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add Party</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              addParty({
                name: formData.get('name'),
                type: formData.get('type'),
                role: formData.get('role'),
              });
              setShowAddModal(null);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Party Name</label>
                  <input type="text" name="name" required className="input" placeholder="Enter party name..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select name="type" required className="input">
                    <option value="individual">Individual</option>
                    <option value="organization">Organization</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select name="role" required className="input">
                    <option value="client">Client</option>
                    <option value="vendor">Vendor</option>
                    <option value="partner">Partner</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button type="button" onClick={() => setShowAddModal(null)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  Add Party
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Date Modal */}
      {showAddModal === 'date' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add Key Date</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              addKeyDate({
                date_type: formData.get('date_type'),
                date: formData.get('date'),
                description: formData.get('description'),
              });
              setShowAddModal(null);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Type</label>
                  <select name="date_type" required className="input">
                    <option value="effective_date">Effective Date</option>
                    <option value="expiration_date">Expiration Date</option>
                    <option value="renewal_date">Renewal Date</option>
                    <option value="milestone">Milestone</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" name="date" required className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                  <input type="text" name="description" className="input" placeholder="Enter description..." />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button type="button" onClick={() => setShowAddModal(null)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  Add Date
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Risk Modal */}
      {showAddModal === 'risk' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add Risk</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              addRisk({
                title: formData.get('title'),
                description: formData.get('description'),
                severity: formData.get('severity'),
                risk_type: formData.get('risk_type'),
                recommendation: formData.get('recommendation'),
              });
              setShowAddModal(null);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Risk Title</label>
                  <input type="text" name="title" required className="input" placeholder="Enter risk title..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea name="description" required className="input" rows={3} placeholder="Describe the risk..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                  <select name="severity" required className="input">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Risk Type</label>
                  <select name="risk_type" required className="input">
                    <option value="missing_clause">Missing Clause</option>
                    <option value="unusual_clause">Unusual Clause</option>
                    <option value="non_standard">Non-Standard</option>
                    <option value="inconsistency">Inconsistency</option>
                    <option value="compliance">Compliance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recommendation (optional)</label>
                  <textarea name="recommendation" className="input" rows={2} placeholder="Enter recommendation..." />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button type="button" onClick={() => setShowAddModal(null)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  Add Risk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Chat Sidebar */}
      <AIChatSidebar isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} chatId={`contract-${contractId}`} />
    </div>
  );
}
