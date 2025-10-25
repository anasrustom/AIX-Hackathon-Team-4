'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import { useLanguage } from '@/contexts/LanguageContext';

export default function DemoPage() {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header title={isArabic ? 'عرض توضيحي' : 'Demo'} />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            {isArabic ? 'شاهد كلارا في العمل' : 'See Klara in Action'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {isArabic 
              ? 'اكتشف كيف يمكن للذكاء الاصطناعي تحويل عملية إدارة العقود الخاصة بك في دقائق.'
              : 'Discover how AI can transform your contract management process in minutes.'}
          </p>
        </div>

        {/* Video Demo Placeholder */}
        <div className="mb-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="aspect-video bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl shadow-2xl flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 text-center">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 cursor-pointer">
                <svg className="w-12 h-12 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-white text-lg font-semibold">
                {isArabic ? 'عرض الفيديو التوضيحي (قريباً)' : 'Watch Demo Video (Coming Soon)'}
              </p>
              <p className="text-white/80 text-sm mt-2">
                {isArabic ? '5 دقائق • الميزات الكاملة' : '5 minutes • Full Features'}
              </p>
            </div>
          </div>
        </div>

        {/* Features Demo */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {isArabic ? '1. رفع العقد' : '1. Upload Contract'}
            </h3>
            <p className="text-gray-600 mb-4">
              {isArabic 
                ? 'ما عليك سوى سحب وإفلات ملفات PDF أو DOCX الخاصة بك. يدعم كلارا العقود باللغتين الإنجليزية والعربية.'
                : 'Simply drag and drop your PDF or DOCX files. Klara supports contracts in both English and Arabic.'}
            </p>
            <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
              <div className="flex items-center gap-3">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Contract_Agreement.pdf</p>
                  <p className="text-xs text-gray-500">2.4 MB</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="w-16 h-16 bg-secondary-100 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {isArabic ? '2. تحليل الذكاء الاصطناعي' : '2. AI Analysis'}
            </h3>
            <p className="text-gray-600 mb-4">
              {isArabic 
                ? 'يستخرج الذكاء الاصطناعي لدينا البنود الرئيسية، ويحدد المخاطر، وينشئ ملخصات في ثوانٍ.'
                : 'Our AI extracts key clauses, identifies risks, and generates summaries in seconds.'}
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-primary h-2 rounded-full animate-pulse" style={{ width: '100%' }} />
                </div>
                <span className="text-xs text-gray-600 whitespace-nowrap">100%</span>
              </div>
              <p className="text-xs text-green-600 font-semibold">
                {isArabic ? '✓ اكتمل التحليل' : '✓ Analysis Complete'}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {isArabic ? '3. كشف المخاطر' : '3. Risk Detection'}
            </h3>
            <p className="text-gray-600 mb-4">
              {isArabic 
                ? 'احصل على تنبيهات فورية حول البنود عالية المخاطر مع اقتراحات التخفيف.'
                : 'Get instant alerts about high-risk clauses with mitigation suggestions.'}
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
                  {isArabic ? 'عالي' : 'HIGH'}
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {isArabic ? 'بند المسؤولية غير المحدودة' : 'Unlimited Liability Clause'}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {isArabic ? 'تعرض مخاطر مالية كبيرة' : 'Exposes significant financial risk'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {isArabic ? '4. مساعد المحادثة الذكي' : '4. AI Chat Assistant'}
            </h3>
            <p className="text-gray-600 mb-4">
              {isArabic 
                ? 'اطرح أي سؤال حول عقودك واحصل على إجابات فورية ودقيقة.'
                : 'Ask any question about your contracts and get instant, accurate answers.'}
            </p>
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <div className="bg-white rounded-lg p-2 shadow-sm">
                <p className="text-sm text-gray-700">
                  {isArabic ? '"ما هي شروط الدفع؟"' : '"What are the payment terms?"'}
                </p>
              </div>
              <div className="bg-primary-50 rounded-lg p-2">
                <p className="text-sm text-gray-700">
                  {isArabic 
                    ? 'الدفع مستحق خلال 30 يوماً من تاريخ الفاتورة...'
                    : 'Payment is due within 30 days of invoice date...'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Demo CTA */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-12 text-center text-white mb-16 animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <h2 className="text-3xl font-bold mb-4">
            {isArabic ? 'جرب كلارا مجاناً' : 'Try Klara for Free'}
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            {isArabic 
              ? 'ابدأ تجربتك المجانية لمدة 14 يوماً اليوم. لا حاجة لبطاقة ائتمان.'
              : 'Start your 14-day free trial today. No credit card required.'}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg shadow-lg hover:scale-105 transition-all duration-300"
            >
              {isArabic ? 'ابدأ تجربتك المجانية' : 'Start Free Trial'}
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-all duration-300"
            >
              {isArabic ? 'احجز استشارة' : 'Book Consultation'}
            </Link>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
              title: isArabic ? '10× أسرع' : '10× Faster',
              description: isArabic 
                ? 'تقليل وقت مراجعة العقود من ساعات إلى دقائق'
                : 'Reduce contract review time from hours to minutes',
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              ),
              title: isArabic ? '99.5٪ دقة' : '99.5% Accuracy',
              description: isArabic 
                ? 'استخراج دقيق للبنود وتحديد المخاطر'
                : 'Precise clause extraction and risk identification',
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              ),
              title: isArabic ? 'ثنائي اللغة' : 'Bilingual',
              description: isArabic 
                ? 'دعم سلس للغتين العربية والإنجليزية'
                : 'Seamless support for Arabic and English',
            },
          ].map((benefit, index) => (
            <div 
              key={index}
              className="text-center p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${0.8 + index * 0.1}s` }}
            >
              <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
