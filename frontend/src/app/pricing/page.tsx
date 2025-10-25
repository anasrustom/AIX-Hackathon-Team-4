'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { useLanguage } from '@/contexts/LanguageContext';

interface PricingTier {
  name: string;
  nameAr: string;
  price: string;
  priceAr: string;
  period: string;
  periodAr: string;
  description: string;
  descriptionAr: string;
  features: string[];
  featuresAr: string[];
  limitations?: string[];
  limitationsAr?: string[];
  cta: string;
  ctaAr: string;
  highlighted?: boolean;
  popular?: boolean;
}

export default function PricingPage() {
  const { language, t } = useLanguage();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const isArabic = language === 'ar';

  const pricingTiers: PricingTier[] = [
    {
      name: 'Starter',
      nameAr: 'المبتدئ',
      price: billingCycle === 'monthly' ? '$29' : '$24',
      priceAr: billingCycle === 'monthly' ? '٢٩$' : '٢٤$',
      period: billingCycle === 'monthly' ? '/month' : '/month, billed annually',
      periodAr: billingCycle === 'monthly' ? '/شهرياً' : '/شهرياً، يدفع سنوياً',
      description: 'Perfect for freelancers and small businesses',
      descriptionAr: 'مثالي للمستقلين والشركات الصغيرة',
      features: [
        'Up to 50 contracts/month',
        'AI-powered contract analysis',
        'Risk detection & alerts',
        'Key clause extraction',
        'Bilingual support (EN/AR)',
        'Email support',
        'Export to PDF',
        'Contract search',
      ],
      featuresAr: [
        'حتى ٥٠ عقداً شهرياً',
        'تحليل العقود بالذكاء الاصطناعي',
        'كشف المخاطر والتنبيهات',
        'استخراج البنود الرئيسية',
        'دعم ثنائي اللغة (EN/AR)',
        'دعم عبر البريد الإلكتروني',
        'التصدير إلى PDF',
        'البحث في العقود',
      ],
      cta: 'Start Free Trial',
      ctaAr: 'ابدأ التجربة المجانية',
      highlighted: false,
    },
    {
      name: 'Professional',
      nameAr: 'المحترف',
      price: billingCycle === 'monthly' ? '$99' : '$82',
      priceAr: billingCycle === 'monthly' ? '٩٩$' : '٨٢$',
      period: billingCycle === 'monthly' ? '/month' : '/month, billed annually',
      periodAr: billingCycle === 'monthly' ? '/شهرياً' : '/شهرياً، يدفع سنوياً',
      description: 'For growing legal teams and mid-sized companies',
      descriptionAr: 'للفرق القانونية النامية والشركات المتوسطة',
      features: [
        'Up to 500 contracts/month',
        'Everything in Starter, plus:',
        'Advanced AI chat assistant',
        'Contract comparison',
        'Custom templates & clauses',
        'Team collaboration (up to 10 users)',
        'Priority email & chat support',
        'API access',
        'Advanced analytics dashboard',
        'Contract lifecycle tracking',
        'Automated reminders & alerts',
      ],
      featuresAr: [
        'حتى ٥٠٠ عقد شهرياً',
        'كل ميزات المبتدئ، بالإضافة إلى:',
        'مساعد محادثة ذكي متقدم',
        'مقارنة العقود',
        'قوالب وبنود مخصصة',
        'تعاون الفريق (حتى ١٠ مستخدمين)',
        'دعم ذو أولوية عبر البريد والمحادثة',
        'الوصول إلى واجهة برمجة التطبيقات',
        'لوحة تحليلات متقدمة',
        'تتبع دورة حياة العقد',
        'تذكيرات وتنبيهات تلقائية',
      ],
      cta: 'Start Free Trial',
      ctaAr: 'ابدأ التجربة المجانية',
      highlighted: true,
      popular: true,
    },
    {
      name: 'Enterprise',
      nameAr: 'المؤسسات',
      price: 'Custom',
      priceAr: 'حسب الطلب',
      period: 'Contact us',
      periodAr: 'اتصل بنا',
      description: 'For large organizations with advanced needs',
      descriptionAr: 'للمؤسسات الكبيرة ذات الاحتياجات المتقدمة',
      features: [
        'Unlimited contracts',
        'Everything in Professional, plus:',
        'Dedicated account manager',
        'Custom AI model training',
        'Advanced security & compliance',
        'SSO & enterprise integrations',
        'Unlimited team members',
        '24/7 phone & priority support',
        'Custom SLA agreements',
        'On-premise deployment option',
        'Dedicated infrastructure',
        'Custom workflow automation',
        'White-label options',
      ],
      featuresAr: [
        'عقود غير محدودة',
        'كل ميزات المحترف، بالإضافة إلى:',
        'مدير حساب مخصص',
        'تدريب نموذج ذكاء اصطناعي مخصص',
        'أمان وامتثال متقدم',
        'تسجيل دخول موحد وتكاملات مؤسسية',
        'أعضاء فريق غير محدودين',
        'دعم هاتفي ٢٤/٧ ودعم ذو أولوية',
        'اتفاقيات مستوى خدمة مخصصة',
        'خيار النشر على الخادم المحلي',
        'بنية تحتية مخصصة',
        'أتمتة سير عمل مخصصة',
        'خيارات العلامة البيضاء',
      ],
      cta: 'Contact Sales',
      ctaAr: 'تواصل مع المبيعات',
      highlighted: false,
    },
  ];

  const faqs = [
    {
      question: 'Is there a free trial?',
      questionAr: 'هل هناك تجربة مجانية؟',
      answer: 'Yes! We offer a 14-day free trial with no credit card required. You get full access to all features of the plan you choose.',
      answerAr: 'نعم! نقدم تجربة مجانية لمدة ١٤ يوماً بدون الحاجة لبطاقة ائتمان. ستحصل على وصول كامل لجميع ميزات الخطة التي تختارها.',
    },
    {
      question: 'Can I change plans later?',
      questionAr: 'هل يمكنني تغيير الخطط لاحقاً؟',
      answer: 'Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any credits.',
      answerAr: 'بالتأكيد! يمكنك الترقية أو التخفيض في خطتك في أي وقت. التغييرات تسري فوراً، وسنقوم بتقسيم أي أرصدة بشكل متناسب.',
    },
    {
      question: 'What payment methods do you accept?',
      questionAr: 'ما طرق الدفع التي تقبلونها؟',
      answer: 'We accept all major credit cards (Visa, Mastercard, Amex), bank transfers for annual plans, and enterprise invoicing.',
      answerAr: 'نقبل جميع بطاقات الائتمان الرئيسية (فيزا، ماستركارد، أمريكان إكسبريس)، والتحويلات البنكية للخطط السنوية، والفواتير المؤسسية.',
    },
    {
      question: 'Is my data secure?',
      questionAr: 'هل بياناتي آمنة؟',
      answer: 'Yes. We use bank-level 256-bit encryption, SOC 2 Type II compliance, and never train our AI models on your data. Your contracts remain completely confidential.',
      answerAr: 'نعم. نستخدم تشفير ٢٥٦ بت على مستوى البنوك، والامتثال لمعايير SOC 2 Type II، ولا نستخدم بياناتك أبداً لتدريب نماذج الذكاء الاصطناعي. عقودك تبقى سرية تماماً.',
    },
    {
      question: 'What happens when I exceed my contract limit?',
      questionAr: 'ماذا يحدث عندما أتجاوز حد العقود؟',
      answer: 'We\'ll notify you before you reach your limit. You can either upgrade to a higher tier or purchase additional contracts at $0.75 per contract.',
      answerAr: 'سنبلغك قبل أن تصل إلى الحد الخاص بك. يمكنك إما الترقية إلى مستوى أعلى أو شراء عقود إضافية بسعر ٠.٧٥$ لكل عقد.',
    },
    {
      question: 'Do you offer refunds?',
      questionAr: 'هل تقدمون استرداد الأموال؟',
      answer: 'Yes. We offer a 30-day money-back guarantee. If you\'re not satisfied, contact us for a full refund, no questions asked.',
      answerAr: 'نعم. نقدم ضمان استرداد الأموال لمدة ٣٠ يوماً. إذا لم تكن راضياً، اتصل بنا للحصول على استرداد كامل، بدون أسئلة.',
    },
  ];

  const trustBadges = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Bank-Level Security',
      titleAr: 'أمان على مستوى البنوك',
      description: '256-bit encryption',
      descriptionAr: 'تشفير ٢٥٦ بت',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: 'GDPR Compliant',
      titleAr: 'متوافق مع GDPR',
      description: 'Privacy protected',
      descriptionAr: 'حماية الخصوصية',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'SOC 2 Type II',
      titleAr: 'SOC 2 Type II',
      description: 'Certified secure',
      descriptionAr: 'معتمد آمن',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      title: '30-Day Guarantee',
      titleAr: 'ضمان ٣٠ يوماً',
      description: 'Money back',
      descriptionAr: 'استرداد الأموال',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header title={isArabic ? 'الأسعار' : 'Pricing'} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
            {isArabic ? 'أسعار شفافة وبسيطة' : 'Simple, Transparent Pricing'}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {isArabic 
              ? 'اختر الخطة المثالية لاحتياجاتك. ابدأ بتجربة مجانية لمدة ١٤ يوماً، بدون بطاقة ائتمان.'
              : 'Choose the perfect plan for your needs. Start with a 14-day free trial, no credit card required.'}
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              {isArabic ? 'شهرياً' : 'Monthly'}
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              style={{ backgroundColor: billingCycle === 'annual' ? '#2563eb' : '#cbd5e1' }}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-gray-900' : 'text-gray-500'}`}>
              {isArabic ? 'سنوياً' : 'Annual'}
              <span className="ml-2 text-green-600 font-semibold">
                {isArabic ? 'وفّر ١٧٪' : 'Save 17%'}
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {pricingTiers.map((tier, index) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl bg-white p-8 transition-all duration-300 hover:shadow-2xl ${
                tier.highlighted 
                  ? 'border-2 border-primary-600 shadow-xl scale-105 z-10' 
                  : 'border border-gray-200 shadow-md'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-primary text-white text-sm font-semibold rounded-full shadow-lg">
                  {isArabic ? '⭐ الأكثر شعبية' : '⭐ Most Popular'}
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {isArabic ? tier.nameAr : tier.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {isArabic ? tier.descriptionAr : tier.description}
                </p>
                <div className="mb-4">
                  <span className="text-5xl font-extrabold text-gray-900">
                    {isArabic ? tier.priceAr : tier.price}
                  </span>
                  {tier.price !== 'Custom' && (
                    <span className="text-gray-600 text-sm">
                      {isArabic ? tier.periodAr : tier.period}
                    </span>
                  )}
                </div>
                {tier.price !== 'Custom' && billingCycle === 'annual' && (
                  <p className="text-sm text-green-600 font-semibold">
                    {isArabic 
                      ? `وفّر ${(parseInt(tier.price.replace('$', '')) * 12 - parseInt(tier.price.replace('$', '')) * 10).toFixed(0)}$ سنوياً`
                      : `Save $${(parseFloat(tier.price.replace('$', '')) * 2.4).toFixed(0)}/year`}
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {(isArabic ? tier.featuresAr : tier.features).map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={tier.price === 'Custom' ? '/contact' : '/signup'}
                className={`block w-full py-3 px-6 text-center font-semibold rounded-lg transition-all duration-300 ${
                  tier.highlighted
                    ? 'bg-gradient-primary text-white shadow-lg hover:shadow-xl hover:scale-105'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {isArabic ? tier.ctaAr : tier.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {trustBadges.map((badge, index) => (
              <div 
                key={index} 
                className="text-center p-6 rounded-lg bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-center text-primary-600 mb-3">
                  {badge.icon}
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  {isArabic ? badge.titleAr : badge.title}
                </h4>
                <p className="text-sm text-gray-600">
                  {isArabic ? badge.descriptionAr : badge.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise Section */}
        <div className="mb-20 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-12 text-center text-white animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {isArabic ? 'حلول مؤسسية مخصصة' : 'Custom Enterprise Solutions'}
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            {isArabic 
              ? 'هل تحتاج إلى أكثر من خططنا القياسية؟ نحن نبني حلولاً مخصصة للمؤسسات الكبيرة مع أمان متقدم، تكاملات مخصصة، ودعم مخصص.'
              : 'Need more than our standard plans? We build custom solutions for large enterprises with advanced security, custom integrations, and dedicated support.'}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:scale-105"
            >
              {isArabic ? 'احجز استشارة مجانية' : 'Book Free Consultation'}
            </Link>
            <Link
              href="/demo"
              className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-all duration-300"
            >
              {isArabic ? 'شاهد عرضاً توضيحياً' : 'Watch Demo'}
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            {isArabic ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {isArabic ? faq.questionAr : faq.question}
                </h3>
                <p className="text-gray-600">
                  {isArabic ? faq.answerAr : faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {isArabic ? 'جاهز للبدء؟' : 'Ready to get started?'}
          </h3>
          <p className="text-gray-600 mb-8">
            {isArabic 
              ? 'انضم إلى آلاف الفرق القانونية التي تثق بكلارا'
              : 'Join thousands of legal teams who trust Klara'}
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-gradient-primary text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            {isArabic ? 'ابدأ تجربتك المجانية لمدة ١٤ يوماً' : 'Start Your 14-Day Free Trial'}
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            {isArabic ? 'لا حاجة لبطاقة ائتمان • ألغِ في أي وقت' : 'No credit card required • Cancel anytime'}
          </p>
        </div>
      </div>
    </div>
  );
}
