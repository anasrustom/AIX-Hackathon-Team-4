'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ContactPage() {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    plan: 'enterprise',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual form submission
    console.log('Form submitted:', formData);
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header title={isArabic ? 'اتصل بنا' : 'Contact Us'} />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {isArabic ? 'شكراً لتواصلك!' : 'Thank You!'}
            </h2>
            <p className="text-gray-600 mb-8">
              {isArabic 
                ? 'تلقينا رسالتك وسيتواصل معك فريقنا خلال 24 ساعة.'
                : 'We received your message and our team will contact you within 24 hours.'}
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-6 py-3 bg-gradient-primary text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
            >
              {isArabic ? 'العودة إلى لوحة التحكم' : 'Back to Dashboard'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header title={isArabic ? 'اتصل بنا' : 'Contact Us'} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Column - Info */}
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              {isArabic ? 'دعنا نتحدث' : "Let's Talk"}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {isArabic 
                ? 'هل أنت مستعد لتحويل إدارة العقود الخاصة بك؟ تواصل معنا واكتشف كيف يمكن لكلارا مساعدة مؤسستك.'
                : 'Ready to transform your contract management? Get in touch and discover how Klara can help your organization.'}
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {isArabic ? 'البريد الإلكتروني' : 'Email'}
                  </h3>
                  <p className="text-gray-600">sales@klara-ai.com</p>
                  <p className="text-sm text-gray-500">
                    {isArabic ? 'سنرد خلال 24 ساعة' : 'We reply within 24 hours'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {isArabic ? 'الهاتف' : 'Phone'}
                  </h3>
                  <p className="text-gray-600">+966 XX XXX XXXX</p>
                  <p className="text-sm text-gray-500">
                    {isArabic ? 'الأحد - الخميس، 9ص - 6م' : 'Sun-Thu, 9am-6pm KSA'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {isArabic ? 'المكتب' : 'Office'}
                  </h3>
                  <p className="text-gray-600">
                    {isArabic 
                      ? 'الرياض، المملكة العربية السعودية'
                      : 'Riyadh, Saudi Arabia'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">
                {isArabic ? '💡 هل تحتاج إلى مساعدة فورية؟' : '💡 Need Immediate Help?'}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {isArabic 
                  ? 'تحقق من مركز المساعدة أو ابدأ محادثة مع مساعد الذكاء الاصطناعي الخاص بنا.'
                  : 'Check out our help center or start a chat with our AI assistant.'}
              </p>
              <Link
                href="/dashboard"
                className="text-primary-600 font-semibold text-sm hover:text-primary-700"
              >
                {isArabic ? 'زيارة مركز المساعدة →' : 'Visit Help Center →'}
              </Link>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {isArabic ? 'أرسل لنا رسالة' : 'Send us a message'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? 'الاسم الكامل' : 'Full Name'} *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder={isArabic ? 'أدخل اسمك' : 'Enter your name'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? 'البريد الإلكتروني' : 'Email'} *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder={isArabic ? 'you@company.com' : 'you@company.com'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? 'الشركة' : 'Company'}
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder={isArabic ? 'اسم شركتك' : 'Your company name'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? 'رقم الهاتف' : 'Phone Number'}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder={isArabic ? '+966 XX XXX XXXX' : '+966 XX XXX XXXX'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? 'أنا مهتم بـ' : "I'm interested in"} *
                </label>
                <select
                  name="plan"
                  required
                  value={formData.plan}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                >
                  <option value="enterprise">{isArabic ? 'خطة المؤسسات' : 'Enterprise Plan'}</option>
                  <option value="professional">{isArabic ? 'خطة المحترف' : 'Professional Plan'}</option>
                  <option value="starter">{isArabic ? 'خطة المبتدئ' : 'Starter Plan'}</option>
                  <option value="demo">{isArabic ? 'طلب عرض توضيحي' : 'Request a Demo'}</option>
                  <option value="other">{isArabic ? 'أخرى' : 'Other'}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? 'الرسالة' : 'Message'} *
                </label>
                <textarea
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                  placeholder={isArabic ? 'أخبرنا عن احتياجاتك...' : 'Tell us about your needs...'}
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-primary text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                {isArabic ? 'إرسال الرسالة' : 'Send Message'}
              </button>

              <p className="text-xs text-gray-500 text-center">
                {isArabic 
                  ? 'بإرسال هذا النموذج، فإنك توافق على سياسة الخصوصية الخاصة بنا.'
                  : 'By submitting this form, you agree to our privacy policy.'}
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
