'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.upload': 'Upload',
    'nav.contracts': 'Contracts',
    'nav.pricing': 'Pricing',
    'nav.logout': 'Logout',
    
    // Common
    'common.loading': 'Loading...',
    'common.welcome': 'Welcome',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.all': 'All',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.download': 'Download',
    'common.hide': 'Hide',
    'common.show': 'Show',
    'common.more': 'more',
    
    // Auth
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.email': 'Email Address',
    'auth.password': 'Password',
    'auth.fullName': 'Full Name',
    'auth.confirmPassword': 'Confirm Password',
    'auth.rememberMe': 'Remember me',
    'auth.forgotPassword': 'Forgot password?',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.signInHere': 'Sign in here',
    'auth.signUpHere': 'Sign up here',
    
    // Dashboard
    'dashboard.title': 'Klara Dashboard',
    'dashboard.subtitle': 'Your intelligent contract lifecycle management system',
    'dashboard.welcomeBack': 'Welcome back',
    'dashboard.stats.total': 'Total Contracts',
    'dashboard.stats.awaiting': 'Awaiting Review',
    'dashboard.stats.risks': 'High Risk Items',
    'dashboard.stats.expiring': 'Expiring Soon',
    'dashboard.stats.days': 'days',
    'dashboard.quickActions': 'Quick Actions',
    'dashboard.action.upload': 'Upload Contract',
    'dashboard.action.uploadDesc': 'Add new contract for AI analysis',
    'dashboard.action.view': 'View All Contracts',
    'dashboard.action.viewDesc': 'Browse and manage contracts',
    'dashboard.action.chat': 'Ask AI Assistant',
    'dashboard.action.chatDesc': 'Get instant contract insights',
    'dashboard.recentUploads': 'Recent Uploads',
    'dashboard.viewAll': 'View all contracts',
    'dashboard.noUploads': 'No contracts uploaded yet',
    'dashboard.getStarted': 'Get started by uploading your first contract',
    
    // Upload
    'upload.title': 'Upload Contract',
    'upload.dragDrop': 'Drag and drop your contract here',
    'upload.or': 'or',
    'upload.browse': 'Browse Files',
    'upload.supported': 'Supported formats: PDF, DOCX (Max 10MB)',
    'upload.uploading': 'Uploading',
    'upload.analyzing': 'Analyzing contract with AI...',
    'upload.success': 'Contract uploaded successfully!',
    'upload.error': 'Upload failed. Please try again.',
    'upload.selectFile': 'Please select a file',
    'upload.features': 'What happens next?',
    'upload.feature.extract': 'AI extracts key clauses',
    'upload.feature.analyze': 'Risk analysis performed',
    'upload.feature.summary': 'Summary generated',
    'upload.feature.chat': 'Ask questions anytime',
    
    // Contracts
    'contracts.title': 'All Contracts',
    'contracts.filters': 'Filters',
    'contracts.search': 'Search contracts...',
    'contracts.industry': 'Industry',
    'contracts.allIndustries': 'All Industries',
    'contracts.industry.technology': 'Technology',
    'contracts.industry.finance': 'Finance',
    'contracts.industry.healthcare': 'Healthcare',
    'contracts.industry.manufacturing': 'Manufacturing',
    'contracts.governingLaw': 'Governing Law',
    'contracts.allLaws': 'All Laws',
    'contracts.status': 'Status',
    'contracts.allStatuses': 'All Statuses',
    'contracts.status.completed': 'Completed',
    'contracts.status.processing': 'Processing',
    'contracts.status.pending': 'Pending',
    'contracts.status.failed': 'Failed',
    'contracts.aiAssistant': 'AI Assistant',
    'contracts.askQuestion': 'Ask about contracts...',
    'contracts.noContracts': 'No contracts found',
    'contracts.getStarted': 'Get started by uploading your first contract for AI analysis',
    'contracts.uploadContract': 'Upload Contract',
    'contracts.analysisInProgress': 'AI analysis in progress...',
    'contracts.risks': 'risks',
    'contracts.more': 'more',
    
    // Contract Detail
    'detail.backToContracts': 'Back to Contracts',
    'detail.summary': 'Summary',
    'detail.clauses': 'Key Clauses',
    'detail.risks': 'Risk Analysis',
    'detail.chat': 'Ask Questions',
    'detail.noSummary': 'Summary is being generated...',
    'detail.noClauses': 'No clauses extracted yet',
    'detail.noRisks': 'No risks identified',
    'detail.riskLevel': 'Risk Level',
    'detail.mitigation': 'Mitigation',
    
    // Risk Levels
    'risk.critical': 'Critical',
    'risk.high': 'High',
    'risk.medium': 'Medium',
    'risk.low': 'Low',
    
    // Languages
    'lang.english': 'English',
    'lang.arabic': 'العربية',
    'lang.bilingual': 'English & Arabic Support',
  },
  ar: {
    // Navigation
    'nav.dashboard': 'لوحة التحكم',
    'nav.upload': 'رفع',
    'nav.contracts': 'العقود',
    'nav.pricing': 'الأسعار',
    'nav.logout': 'تسجيل خروج',
    
    // Common
    'common.loading': 'جاري التحميل...',
    'common.welcome': 'مرحباً',
    'common.search': 'بحث',
    'common.filter': 'تصفية',
    'common.all': 'الكل',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.view': 'عرض',
    'common.download': 'تحميل',
    'common.hide': 'إخفاء',
    'common.show': 'إظهار',
    'common.more': 'المزيد',
    
    // Auth
    'auth.login': 'تسجيل الدخول',
    'auth.signup': 'إنشاء حساب',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.fullName': 'الاسم الكامل',
    'auth.confirmPassword': 'تأكيد كلمة المرور',
    'auth.rememberMe': 'تذكرني',
    'auth.forgotPassword': 'نسيت كلمة المرور؟',
    'auth.noAccount': 'ليس لديك حساب؟',
    'auth.hasAccount': 'لديك حساب بالفعل؟',
    'auth.signInHere': 'سجل دخولك هنا',
    'auth.signUpHere': 'أنشئ حسابك هنا',
    
    // Dashboard
    'dashboard.title': 'لوحة تحكم كلارا',
    'dashboard.subtitle': 'نظامك الذكي لإدارة دورة حياة العقود',
    'dashboard.welcomeBack': 'مرحباً بعودتك',
    'dashboard.stats.total': 'إجمالي العقود',
    'dashboard.stats.awaiting': 'بانتظار المراجعة',
    'dashboard.stats.risks': 'العناصر عالية المخاطر',
    'dashboard.stats.expiring': 'تنتهي قريباً',
    'dashboard.stats.days': 'أيام',
    'dashboard.quickActions': 'إجراءات سريعة',
    'dashboard.action.upload': 'رفع عقد',
    'dashboard.action.uploadDesc': 'إضافة عقد جديد للتحليل بالذكاء الاصطناعي',
    'dashboard.action.view': 'عرض جميع العقود',
    'dashboard.action.viewDesc': 'تصفح وإدارة العقود',
    'dashboard.action.chat': 'اسأل المساعد الذكي',
    'dashboard.action.chatDesc': 'احصل على رؤى فورية للعقود',
    'dashboard.recentUploads': 'آخر الملفات المرفوعة',
    'dashboard.viewAll': 'عرض جميع العقود',
    'dashboard.noUploads': 'لا توجد عقود مرفوعة بعد',
    'dashboard.getStarted': 'ابدأ برفع عقدك الأول',
    
    // Upload
    'upload.title': 'رفع عقد',
    'upload.dragDrop': 'اسحب وأفلت عقدك هنا',
    'upload.or': 'أو',
    'upload.browse': 'تصفح الملفات',
    'upload.supported': 'الصيغ المدعومة: PDF، DOCX (حد أقصى 10 ميجابايت)',
    'upload.uploading': 'جاري الرفع',
    'upload.analyzing': 'جاري تحليل العقد بالذكاء الاصطناعي...',
    'upload.success': 'تم رفع العقد بنجاح!',
    'upload.error': 'فشل الرفع. يرجى المحاولة مرة أخرى.',
    'upload.selectFile': 'يرجى تحديد ملف',
    'upload.features': 'ماذا يحدث بعد ذلك؟',
    'upload.feature.extract': 'الذكاء الاصطناعي يستخرج البنود الرئيسية',
    'upload.feature.analyze': 'يتم إجراء تحليل المخاطر',
    'upload.feature.summary': 'يتم إنشاء الملخص',
    'upload.feature.chat': 'اطرح الأسئلة في أي وقت',
    
    // Contracts
    'contracts.title': 'جميع العقود',
    'contracts.filters': 'التصفية',
    'contracts.search': 'البحث في العقود...',
    'contracts.industry': 'الصناعة',
    'contracts.allIndustries': 'جميع الصناعات',
    'contracts.industry.technology': 'التكنولوجيا',
    'contracts.industry.finance': 'المالية',
    'contracts.industry.healthcare': 'الرعاية الصحية',
    'contracts.industry.manufacturing': 'التصنيع',
    'contracts.governingLaw': 'القانون الحاكم',
    'contracts.allLaws': 'جميع القوانين',
    'contracts.status': 'الحالة',
    'contracts.allStatuses': 'جميع الحالات',
    'contracts.status.completed': 'مكتمل',
    'contracts.status.processing': 'قيد المعالجة',
    'contracts.status.pending': 'معلق',
    'contracts.status.failed': 'فشل',
    'contracts.aiAssistant': 'المساعد الذكي',
    'contracts.askQuestion': 'اسأل عن العقود...',
    'contracts.noContracts': 'لم يتم العثور على عقود',
    'contracts.getStarted': 'ابدأ برفع عقدك الأول لتحليله بالذكاء الاصطناعي',
    'contracts.uploadContract': 'رفع عقد',
    'contracts.analysisInProgress': 'التحليل بالذكاء الاصطناعي قيد التقدم...',
    'contracts.risks': 'مخاطر',
    'contracts.more': 'المزيد',
    
    // Contract Detail
    'detail.backToContracts': 'العودة إلى العقود',
    'detail.summary': 'الملخص',
    'detail.clauses': 'البنود الرئيسية',
    'detail.risks': 'تحليل المخاطر',
    'detail.chat': 'طرح الأسئلة',
    'detail.noSummary': 'جاري إنشاء الملخص...',
    'detail.noClauses': 'لم يتم استخراج بنود بعد',
    'detail.noRisks': 'لم يتم تحديد مخاطر',
    'detail.riskLevel': 'مستوى المخاطر',
    'detail.mitigation': 'التخفيف',
    
    // Risk Levels
    'risk.critical': 'حرج',
    'risk.high': 'عالي',
    'risk.medium': 'متوسط',
    'risk.low': 'منخفض',
    
    // Languages
    'lang.english': 'English',
    'lang.arabic': 'العربية',
    'lang.bilingual': 'دعم اللغتين العربية والإنجليزية',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  // Load saved language from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'ar')) {
      setLanguageState(savedLang);
    }
  }, []);

  // Update document direction and save to localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    
    // Update document direction
    if (typeof document !== 'undefined') {
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
  };

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  // Set initial direction
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
