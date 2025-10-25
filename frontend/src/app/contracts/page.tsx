'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Contract } from '@/types';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import AIChatSidebar from '@/components/AIChatSidebar';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ContractsPage() {
  const { t } = useLanguage();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    industry: '',
    governing_law: '',
    status: '',
  });
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  useEffect(() => {
    fetchContracts();
  }, [filters]);

  const fetchContracts = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const user = localStorage.getItem('user');
      const userId = user ? JSON.parse(user).id : null;
      const queryParams = new URLSearchParams(filters as any).toString();
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contracts?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      let fetchedContracts: Contract[] = [];
      if (response.ok) {
        const data = await response.json();
        fetchedContracts = data.items || [];
      }

      // Merge with localStorage data (edited contracts) - user-specific
      const savedContracts = userId ? localStorage.getItem(`contracts_${userId}`) : null;
      if (savedContracts) {
        const localContracts = JSON.parse(savedContracts);
        // Update fetched contracts with local changes
        fetchedContracts = fetchedContracts.map(contract => {
          const localVersion = localContracts.find((c: Contract) => c.id === contract.id);
          return localVersion || contract;
        });
        
        // Add any contracts that only exist in localStorage
        localContracts.forEach((localContract: Contract) => {
          if (!fetchedContracts.find(c => c.id === localContract.id)) {
            fetchedContracts.push(localContract);
          }
        });
      }

      // Apply client-side filters
      let filteredContracts = fetchedContracts;
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredContracts = filteredContracts.filter(contract =>
          contract.title?.toLowerCase().includes(searchLower) ||
          contract.file_name?.toLowerCase().includes(searchLower) ||
          contract.summary?.toLowerCase().includes(searchLower)
        );
      }
      
      if (filters.industry) {
        filteredContracts = filteredContracts.filter(contract =>
          contract.industry?.toLowerCase() === filters.industry.toLowerCase()
        );
      }
      
      if (filters.governing_law) {
        filteredContracts = filteredContracts.filter(contract =>
          contract.governing_law === filters.governing_law
        );
      }
      
      if (filters.status) {
        filteredContracts = filteredContracts.filter(contract =>
          contract.status === filters.status
        );
      }

      setContracts(filteredContracts);
    } catch (error) {
      console.error('Error fetching contracts:', error);
      setContracts([]);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (contract: Contract) => {
    const highRisks = contract.risks?.filter(r => r.severity === 'high' || r.severity === 'critical').length || 0;
    if (highRisks > 0) return 'text-red-600';
    const mediumRisks = contract.risks?.filter(r => r.severity === 'medium').length || 0;
    if (mediumRisks > 0) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="min-h-screen bg-light-gray">
      <Header title={t('contracts.title')} />
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-72 flex-shrink-0 space-y-6">
            <div className="card animate-fade-in-up">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <h3 className="text-lg font-bold text-gray-900">{t('contracts.filters')}</h3>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('common.search')}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none rtl:left-auto rtl:right-0 rtl:pr-3">
                      <svg className="h-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      className="input pl-10 rtl:pl-4 rtl:pr-10 text-sm"
                      placeholder={t('contracts.search')}
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                  </div>
                </div>

                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('contracts.industry')}</label>
                  <select
                    className="input text-sm"
                    value={filters.industry}
                    onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
                  >
                    <option value="">{t('contracts.allIndustries')}</option>
                    <option value="technology">{t('contracts.industry.technology')}</option>
                    <option value="finance">{t('contracts.industry.finance')}</option>
                    <option value="healthcare">{t('contracts.industry.healthcare')}</option>
                    <option value="manufacturing">{t('contracts.industry.manufacturing')}</option>
                  </select>
                </div>

                <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('contracts.governingLaw')}</label>
                  <select
                    className="input text-sm"
                    value={filters.governing_law}
                    onChange={(e) => setFilters({ ...filters, governing_law: e.target.value })}
                  >
                    <option value="">{t('contracts.allLaws')}</option>
                    <option value="Qatar">Qatar</option>
                    <option value="UK">United Kingdom</option>
                    <option value="USA">United States</option>
                    <option value="UAE">UAE</option>
                  </select>
                </div>

                <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('contracts.status')}</label>
                  <select
                    className="input text-sm"
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  >
                    <option value="">{t('contracts.allStatuses')}</option>
                    <option value="completed">{t('contracts.status.completed')}</option>
                    <option value="processing">{t('contracts.status.processing')}</option>
                    <option value="pending">{t('contracts.status.pending')}</option>
                    <option value="failed">{t('contracts.status.failed')}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* AI Assistant Button */}
            <button
              onClick={() => setIsAIChatOpen(true)}
              className="card card-hover animate-fade-in-up cursor-pointer w-full"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-500 mx-auto rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth shadow-glow">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('contracts.aiAssistant')}</h3>
                <p className="text-sm text-gray-600">Ask AI about your contracts</p>
              </div>
            </button>
          </div>

          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <LoadingSpinner size="lg" />
              </div>
            ) : contracts.length === 0 ? (
              <div className="card text-center py-16 animate-fade-in">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('contracts.noContracts')}</h3>
                <p className="text-gray-600 mb-6">{t('contracts.getStarted')}</p>
                <Link href="/upload" className="btn btn-primary inline-flex">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {t('contracts.uploadContract')}
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {contracts.map((contract, index) => (
                  <Link
                    key={contract.id}
                    href={`/contracts/${contract.id}`}
                    className="card-hover block animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-smooth">
                            <svg className="w-6 h-6 text-primary-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-900 mb-2 truncate group-hover:text-primary-900 transition-smooth">
                            {contract.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {contract.summary || t('contracts.analysisInProgress')}
                          </p>
                          
                          <div className="flex flex-wrap gap-2">
                            {contract.industry && (
                              <span className="badge badge-info">
                                <svg className="w-3 h-3 mr-1 rtl:mr-0 rtl:ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                {contract.industry}
                              </span>
                            )}
                            {contract.governing_law && (
                              <span className="badge badge-primary">
                                <svg className="w-3 h-3 mr-1 rtl:mr-0 rtl:ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                </svg>
                                {contract.governing_law}
                              </span>
                            )}
                            {contract.tags?.slice(0, 2).map((tag, idx) => (
                              <span key={idx} className="badge bg-gray-100 text-gray-700">
                                {tag}
                              </span>
                            ))}
                            {contract.tags && contract.tags.length > 2 && (
                              <span className="badge bg-gray-100 text-gray-700">
                                +{contract.tags.length - 2} {t('common.more')}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <span className={`badge transition-smooth ${
                            contract.status === 'completed' ? 'badge-success' :
                            contract.status === 'processing' ? 'badge-info' :
                            contract.status === 'failed' ? 'badge-error' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {t(`contracts.status.${contract.status}`)}
                          </span>
                          
                          {contract.risks && contract.risks.length > 0 && (
                            <div className="flex items-center gap-1">
                              <svg className={`w-4 h-4 ${getRiskColor(contract)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                              <span className={`text-xs font-medium ${getRiskColor(contract)}`}>
                                {contract.risks.filter(r => r.severity === 'high' || r.severity === 'critical').length} {t('contracts.risks')}
                              </span>
                            </div>
                          )}

                          <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-900 transition-smooth mt-2 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* AI Chat Sidebar */}
      <AIChatSidebar isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} chatId="contracts" />
    </div>
  );
}
