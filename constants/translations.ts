export type Language = 'en' | 'hi' | 'mr';

interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}

const translations: Translations = {
  // Common
  'loading': {
    en: 'Loading...',
    hi: 'लोड हो रहा है...',
    mr: 'लोड होत आहे...'
  },
  'error': {
    en: 'Error',
    hi: 'त्रुटि',
    mr: 'त्रुटी'
  },
  'success': {
    en: 'Success',
    hi: 'सफलता',
    mr: 'यश'
  },
  'cancel': {
    en: 'Cancel',
    hi: 'रद्द करें',
    mr: 'रद्द करा'
  },
  'ok': {
    en: 'OK',
    hi: 'ठीक है',
    mr: 'ठीक आहे'
  },
  'next': {
    en: 'Next',
    hi: 'अगला',
    mr: 'पुढे'
  },
  'skip': {
    en: 'Skip',
    hi: 'छोड़ें',
    mr: 'वगळा'
  },

  // Onboarding
  'onboarding.slide1.title': {
    en: 'Smart Crop Detection',
    hi: 'स्मार्ट फसल पहचान',
    mr: 'स्मार्ट पीक ओळख'
  },
  'onboarding.slide1.subtitle': {
    en: 'AI-Powered Plant Health Analysis',
    hi: 'AI-संचालित पौधे स्वास्थ्य विश्लेषण',
    mr: 'AI-चालित वनस्पती आरोग्य विश्लेषण'
  },
  'onboarding.slide1.description': {
    en: 'Take a photo of your crops and get instant AI-powered analysis to detect pests, diseases, and health issues with high accuracy.',
    hi: 'अपनी फसलों की तस्वीर लें और कीटों, बीमारियों और स्वास्थ्य समस्याओं का पता लगाने के लिए तत्काल AI-संचालित विश्लेषण प्राप्त करें।',
    mr: 'तुमच्या पिकांचा फोटो घ्या आणि कीटक, रोग आणि आरोग्य समस्या शोधण्यासाठी तत्काळ AI-चालित विश्लेषण मिळवा।'
  },
  'onboarding.slide2.title': {
    en: 'Treatment Recommendations',
    hi: 'उपचार सुझाव',
    mr: 'उपचार शिफारसी'
  },
  'onboarding.slide2.subtitle': {
    en: 'Organic & Chemical Solutions',
    hi: 'जैविक और रासायनिक समाधान',
    mr: 'सेंद्रिय आणि रासायनिक उपाय'
  },
  'onboarding.slide2.description': {
    en: 'Get personalized treatment recommendations with detailed instructions, dosages, and safety guidelines for both organic and chemical solutions.',
    hi: 'जैविक और रासायनिक दोनों समाधानों के लिए विस्तृत निर्देश, खुराक और सुरक्षा दिशानिर्देशों के साथ व्यक्तिगत उपचार सुझाव प्राप्त करें।',
    mr: 'सेंद्रिय आणि रासायनिक दोन्ही उपायांसाठी तपशीलवार सूचना, डोस आणि सुरक्षा मार्गदर्शनासह वैयक्तिक उपचार शिफारसी मिळवा।'
  },
  'onboarding.slide3.title': {
    en: 'Learn & Grow',
    hi: 'सीखें और बढ़ें',
    mr: 'शिका आणि वाढा'
  },
  'onboarding.slide3.subtitle': {
    en: 'Educational Resources',
    hi: 'शैक्षिक संसाधन',
    mr: 'शैक्षणिक संसाधने'
  },
  'onboarding.slide3.description': {
    en: 'Access a comprehensive library of farming guides, videos, and expert tips to improve your agricultural knowledge and practices.',
    hi: 'अपने कृषि ज्ञान और प्रथाओं को बेहतर बनाने के लिए खेती गाइड, वीडियो और विशेषज्ञ सुझावों की एक व्यापक लाइब्रेरी तक पहुंच प्राप्त करें।',
    mr: 'तुमचे कृषी ज्ञान आणि पद्धती सुधारण्यासाठी शेती मार्गदर्शक, व्हिडिओ आणि तज्ञ टिपांच्या व्यापक लायब्ररीमध्ये प्रवेश मिळवा।'
  },
  'onboarding.getStarted': {
    en: 'Get Started',
    hi: 'शुरू करें',
    mr: 'सुरुवात करा'
  },

  // Tabs
  'tabs.home': {
    en: 'Home',
    hi: 'होम',
    mr: 'मुख्यपृष्ठ'
  },
  'tabs.detect': {
    en: 'Detect',
    hi: 'पहचान',
    mr: 'ओळख'
  },
  'tabs.history': {
    en: 'History',
    hi: 'इतिहास',
    mr: 'इतिहास'
  },
  'tabs.learn': {
    en: 'Learn',
    hi: 'सीखें',
    mr: 'शिका'
  },
  'tabs.settings': {
    en: 'Settings',
    hi: 'सेटिंग्स',
    mr: 'सेटिंग्ज'
  },

  // Home
  'home.greeting.morning': {
    en: 'Good Morning',
    hi: 'सुप्रभात',
    mr: 'सुप्रभात'
  },
  'home.greeting.afternoon': {
    en: 'Good Afternoon',
    hi: 'नमस्कार',
    mr: 'नमस्कार'
  },
  'home.greeting.evening': {
    en: 'Good Evening',
    hi: 'शुभ संध्या',
    mr: 'शुभ संध्या'
  },
  'home.greeting.night': {
    en: 'Good Night',
    hi: 'शुभ रात्रि',
    mr: 'शुभ रात्री'
  },
  'home.subtitle': {
    en: 'Protecting your crops with smart technology',
    hi: 'स्मार्ट तकनीक से अपनी फसलों की सुरक्षा',
    mr: 'स्मार्ट तंत्रज्ञानाने तुमच्या पिकांचे संरक्षण'
  },
  'home.totalScans': {
    en: 'Total Scans',
    hi: 'कुल स्कैन',
    mr: 'एकूण स्कॅन'
  },
  'home.issuesFound': {
    en: 'Issues Found',
    hi: 'समस्याएं मिलीं',
    mr: 'समस्या आढळल्या'
  },
  'home.quickActions': {
    en: 'Quick Actions',
    hi: 'त्वरित कार्य',
    mr: 'त्वरित कृती'
  },
  'home.recentActivity': {
    en: 'Recent Activity',
    hi: 'हाल की गतिविधि',
    mr: 'अलीकडील क्रियाकलाप'
  },
  'home.viewAll': {
    en: 'View All',
    hi: 'सभी देखें',
    mr: 'सर्व पहा'
  },

  // Actions
  'actions.scanNow': {
    en: 'Scan Now',
    hi: 'अभी स्कैन करें',
    mr: 'आता स्कॅन करा'
  },
  'actions.history': {
    en: 'History',
    hi: 'इतिहास',
    mr: 'इतिहास'
  },

  // Detection
  'detect.title': {
    en: 'Crop Detection',
    hi: 'फसल पहचान',
    mr: 'पीक ओळख'
  },
  'detect.subtitle': {
    en: 'Take a photo to analyze your crops',
    hi: 'अपनी फसलों का विश्लेषण करने के लिए एक तस्वीर लें',
    mr: 'तुमच्या पिकांचे विश्लेषण करण्यासाठी फोटो घ्या'
  },
  'detect.cameraPermission.title': {
    en: 'Camera Permission Required',
    hi: 'कैमरा अनुमति आवश्यक',
    mr: 'कॅमेरा परवानगी आवश्यक'
  },
  'detect.cameraPermission.description': {
    en: 'We need access to your camera to take photos of your crops for analysis.',
    hi: 'विश्लेषण के लिए आपकी फसलों की तस्वीरें लेने के लिए हमें आपके कैमरे तक पहुंच की आवश्यकता है।',
    mr: 'विश्लेषणासाठी तुमच्या पिकांचे फोटो घेण्यासाठी आम्हाला तुमच्या कॅमेऱ्यात प्रवेश हवा.'
  },
  'detect.cameraPermission.grant': {
    en: 'Grant Permission',
    hi: 'अनुमति दें',
    mr: 'परवानगी द्या'
  },
  'detect.reviewTitle': {
    en: 'Review Image',
    hi: 'छवि की समीक्षा करें',
    mr: 'प्रतिमा पुनरावलोकन'
  },
  'detect.analysisQuestion': {
    en: 'What would you like to detect?',
    hi: 'आप क्या पहचानना चाहते हैं?',
    mr: 'तुम्हाला काय ओळखायचे आहे?'
  },
  'detect.pestDetection': {
    en: 'Pest Detection',
    hi: 'कीट पहचान',
    mr: 'कीटक ओळख'
  },
  'detect.pestDescription': {
    en: 'Identify harmful insects and pests',
    hi: 'हानिकारक कीड़े और कीटों की पहचान करें',
    mr: 'हानिकारक कीटक आणि किडे ओळखा'
  },
  'detect.diseaseDetection': {
    en: 'Disease Detection',
    hi: 'रोग पहचान',
    mr: 'रोग ओळख'
  },
  'detect.diseaseDescription': {
    en: 'Detect plant diseases and infections',
    hi: 'पौधों की बीमारियों और संक्रमण का पता लगाएं',
    mr: 'वनस्पती रोग आणि संक्रमण शोधा'
  },
  'detect.analyzeImage': {
    en: 'Analyze Image',
    hi: 'छवि का विश्लेषण करें',
    mr: 'प्रतिमा विश्लेषण करा'
  },
  'detect.analyzing': {
    en: 'Analyzing your crop...',
    hi: 'आपकी फसल का विश्लेषण कर रहे हैं...',
    mr: 'तुमच्या पिकाचे विश्लेषण करत आहे...'
  },
  'detect.processingSteps.processing': {
    en: 'Processing image...',
    hi: 'छवि प्रसंस्करण...',
    mr: 'प्रतिमा प्रक्रिया...'
  },
  'detect.processingSteps.analyzing': {
    en: 'Analyzing patterns...',
    hi: 'पैटर्न का विश्लेषण...',
    mr: 'नमुने विश्लेषण...'
  },
  'detect.processingSteps.generating': {
    en: 'Generating results...',
    hi: 'परिणाम तैयार कर रहे हैं...',
    mr: 'परिणाम तयार करत आहे...'
  },
  'detect.results': {
    en: 'Detection Results',
    hi: 'पहचान परिणाम',
    mr: 'ओळख परिणाम'
  },
  'detect.confidence': {
    en: 'Confidence',
    hi: 'विश्वास',
    mr: 'विश्वास'
  },
  'detect.description': {
    en: 'Description',
    hi: 'विवरण',
    mr: 'वर्णन'
  },
  'detect.symptoms': {
    en: 'Symptoms',
    hi: 'लक्षण',
    mr: 'लक्षणे'
  },
  'detect.treatments': {
    en: 'Treatments',
    hi: 'उपचार',
    mr: 'उपचार'
  },
  'detect.organic': {
    en: 'Organic',
    hi: 'जैविक',
    mr: 'सेंद्रिय'
  },
  'detect.chemical': {
    en: 'Chemical',
    hi: 'रासायनिक',
    mr: 'रासायनिक'
  },
  'detect.preventive': {
    en: 'Preventive Measures',
    hi: 'निवारक उपाय',
    mr: 'प्रतिबंधात्मक उपाय'
  },
  'detect.treatmentDetails.dosage': {
    en: 'Dosage',
    hi: 'खुराक',
    mr: 'डोस'
  },
  'detect.treatmentDetails.frequency': {
    en: 'Frequency',
    hi: 'आवृत्ति',
    mr: 'वारंवारता'
  },
  'detect.treatmentDetails.safety': {
    en: 'Safety',
    hi: 'सुरक्षा',
    mr: 'सुरक्षा'
  },
  'detect.scanAnother': {
    en: 'Scan Another Crop',
    hi: 'दूसरी फसल स्कैन करें',
    mr: 'दुसरे पीक स्कॅन करा'
  },

  // Severity levels
  'severity.low': {
    en: 'Low',
    hi: 'कम',
    mr: 'कमी'
  },
  'severity.medium': {
    en: 'Medium',
    hi: 'मध्यम',
    mr: 'मध्यम'
  },
  'severity.high': {
    en: 'High',
    hi: 'उच्च',
    mr: 'उच्च'
  },

  // Confidence levels
  'confidence.veryhigh': {
    en: 'Very High',
    hi: 'बहुत उच्च',
    mr: 'खूप उच्च'
  },
  'confidence.high': {
    en: 'High',
    hi: 'उच्च',
    mr: 'उच्च'
  },
  'confidence.good': {
    en: 'Good',
    hi: 'अच्छा',
    mr: 'चांगला'
  },
  'confidence.fair': {
    en: 'Fair',
    hi: 'ठीक',
    mr: 'ठीक'
  },
  'confidence.low': {
    en: 'Low',
    hi: 'कम',
    mr: 'कमी'
  },

  // History
  'history.title': {
    en: 'Detection History',
    hi: 'पहचान इतिहास',
    mr: 'ओळख इतिहास'
  },
  'history.subtitle': {
    en: 'detections recorded',
    hi: 'पहचान रिकॉर्ड की गई',
    mr: 'ओळख नोंदवली'
  },
  'history.summary': {
    en: 'Summary',
    hi: 'सारांश',
    mr: 'सारांश'
  },
  'history.highRisk': {
    en: 'High Risk',
    hi: 'उच्च जोखिम',
    mr: 'उच्च जोखीम'
  },
  'history.mediumRisk': {
    en: 'Medium Risk',
    hi: 'मध्यम जोखिम',
    mr: 'मध्यम जोखीम'
  },
  'history.lowRisk': {
    en: 'Low Risk',
    hi: 'कम जोखिम',
    mr: 'कमी जोखीम'
  },
  'history.filters.all': {
    en: 'All',
    hi: 'सभी',
    mr: 'सर्व'
  },
  'history.filters.pests': {
    en: 'Pests',
    hi: 'कीट',
    mr: 'कीटक'
  },
  'history.filters.diseases': {
    en: 'Diseases',
    hi: 'रोग',
    mr: 'रोग'
  },
  'history.sortBy': {
    en: 'Sort by:',
    hi: 'इसके अनुसार क्रमबद्ध करें:',
    mr: 'यानुसार क्रमवारी लावा:'
  },
  'history.sortOptions.date': {
    en: 'Date',
    hi: 'दिनांक',
    mr: 'दिनांक'
  },
  'history.sortOptions.severity': {
    en: 'Severity',
    hi: 'गंभीरता',
    mr: 'गंभीरता'
  },
  'history.treatmentStatus.applied': {
    en: 'Treatment Applied',
    hi: 'उपचार लागू',
    mr: 'उपचार लागू'
  },
  'history.treatmentStatus.pending': {
    en: 'Treatment Pending',
    hi: 'उपचार लंबित',
    mr: 'उपचार प्रलंबित'
  },
  'history.empty.title': {
    en: 'No Detections Yet',
    hi: 'अभी तक कोई पहचान नहीं',
    mr: 'अद्याप कोणतीही ओळख नाही'
  },
  'history.empty.description': {
    en: 'Start scanning your crops to see detection history here.',
    hi: 'यहां पहचान इतिहास देखने के लिए अपनी फसलों को स्कैन करना शुरू करें।',
    mr: 'येथे ओळख इतिहास पाहण्यासाठी तुमच्या पिकांचे स्कॅनिंग सुरू करा.'
  },

  // Learn
  'learn.title': {
    en: 'Learning Hub',
    hi: 'शिक्षा केंद्र',
    mr: 'शिक्षण केंद्र'
  },
  'learn.subtitle': {
    en: 'Expand your farming knowledge',
    hi: 'अपने खेती के ज्ञान का विस्तार करें',
    mr: 'तुमचे शेती ज्ञान वाढवा'
  },
  'learn.featured': {
    en: 'Featured Content',
    hi: 'विशेष सामग्री',
    mr: 'वैशिष्ट्यीकृत सामग्री'
  },
  'learn.searchPlaceholder': {
    en: 'Search learning resources...',
    hi: 'शिक्षा संसाधन खोजें...',
    mr: 'शिक्षण संसाधने शोधा...'
  },
  'learn.categories.all': {
    en: 'All',
    hi: 'सभी',
    mr: 'सर्व'
  },
  'learn.categories.pestManagement': {
    en: 'Pest Management',
    hi: 'कीट प्रबंधन',
    mr: 'कीटक व्यवस्थापन'
  },
  'learn.categories.diseasePrevention': {
    en: 'Disease Prevention',
    hi: 'रोग निवारण',
    mr: 'रोग प्रतिबंध'
  },
  'learn.categories.organicFarming': {
    en: 'Organic Farming',
    hi: 'जैविक खेती',
    mr: 'सेंद्रिय शेती'
  },
  'learn.categories.seasonalCare': {
    en: 'Seasonal Care',
    hi: 'मौसमी देखभाल',
    mr: 'हंगामी काळजी'
  },
  'learn.contentTypes.all': {
    en: 'All',
    hi: 'सभी',
    mr: 'सर्व'
  },
  'learn.contentTypes.videos': {
    en: 'Videos',
    hi: 'वीडियो',
    mr: 'व्हिडिओ'
  },
  'learn.contentTypes.guides': {
    en: 'Guides',
    hi: 'गाइड',
    mr: 'मार्गदर्शक'
  },
  'learn.resources': {
    en: 'resources available',
    hi: 'संसाधन उपलब्ध',
    mr: 'संसाधने उपलब्ध'
  },
  'learn.languages': {
    en: 'languages',
    hi: 'भाषाएं',
    mr: 'भाषा'
  },
  'learn.downloaded': {
    en: 'Downloaded',
    hi: 'डाउनलोड किया गया',
    mr: 'डाउनलोड केले'
  },
  'learn.download': {
    en: 'Download',
    hi: 'डाउनलोड',
    mr: 'डाउनलोड'
  },
  'learn.empty.title': {
    en: 'No Resources Found',
    hi: 'कोई संसाधन नहीं मिला',
    mr: 'कोणतेही संसाधन सापडले नाही'
  },
  'learn.empty.description': {
    en: 'Try adjusting your search or filter criteria.',
    hi: 'अपने खोज या फ़िल्टर मानदंड को समायोजित करने का प्रयास करें।',
    mr: 'तुमचे शोध किंवा फिल्टर निकष समायोजित करण्याचा प्रयत्न करा.'
  },

  // Settings
  'settings.title': {
    en: 'Settings',
    hi: 'सेटिंग्स',
    mr: 'सेटिंग्ज'
  },
  'settings.subtitle': {
    en: 'Customize your app experience',
    hi: 'अपने ऐप अनुभव को अनुकूलित करें',
    mr: 'तुमचा अॅप अनुभव सानुकूलित करा'
  },
  'settings.sections.userPreferences': {
    en: 'User Preferences',
    hi: 'उपयोगकर्ता प्राथमिकताएं',
    mr: 'वापरकर्ता प्राधान्ये'
  },
  'settings.sections.appSettings': {
    en: 'App Settings',
    hi: 'ऐप सेटिंग्स',
    mr: 'अॅप सेटिंग्ज'
  },
  'settings.sections.dataManagement': {
    en: 'Data Management',
    hi: 'डेटा प्रबंधन',
    mr: 'डेटा व्यवस्थापन'
  },
  'settings.sections.support': {
    en: 'Support',
    hi: 'सहायता',
    mr: 'समर्थन'
  },
  'settings.language': {
    en: 'Language',
    hi: 'भाषा',
    mr: 'भाषा'
  },
  'settings.languages.english': {
    en: 'English',
    hi: 'अंग्रेजी',
    mr: 'इंग्रजी'
  },
  'settings.languages.hindi': {
    en: 'Hindi',
    hi: 'हिंदी',
    mr: 'हिंदी'
  },
  'settings.languages.marathi': {
    en: 'Marathi',
    hi: 'मराठी',
    mr: 'मराठी'
  },
  'settings.units': {
    en: 'Units',
    hi: 'इकाइयां',
    mr: 'एकके'
  },
  'settings.units.metric': {
    en: 'Metric',
    hi: 'मीट्रिक',
    mr: 'मेट्रिक'
  },
  'settings.units.imperial': {
    en: 'Imperial',
    hi: 'इंपीरियल',
    mr: 'इम्पीरियल'
  },
  'settings.notifications': {
    en: 'Notifications',
    hi: 'सूचनाएं',
    mr: 'सूचना'
  },
  'settings.notificationsDesc': {
    en: 'Receive alerts and updates',
    hi: 'अलर्ट और अपडेट प्राप्त करें',
    mr: 'अलर्ट आणि अपडेट मिळवा'
  },
  'settings.theme': {
    en: 'Theme',
    hi: 'थीम',
    mr: 'थीम'
  },
  'settings.themes.light': {
    en: 'Light',
    hi: 'हल्का',
    mr: 'हलका'
  },
  'settings.themes.dark': {
    en: 'Dark',
    hi: 'गहरा',
    mr: 'गडद'
  },
  'settings.themes.auto': {
    en: 'Auto',
    hi: 'स्वचालित',
    mr: 'स्वयंचलित'
  },
  'settings.dataUsage': {
    en: 'Data Usage',
    hi: 'डेटा उपयोग',
    mr: 'डेटा वापर'
  },
  'settings.dataUsageOptions.low': {
    en: 'Low',
    hi: 'कम',
    mr: 'कमी'
  },
  'settings.dataUsageOptions.medium': {
    en: 'Medium',
    hi: 'मध्यम',
    mr: 'मध्यम'
  },
  'settings.dataUsageOptions.high': {
    en: 'High',
    hi: 'उच्च',
    mr: 'उच्च'
  },
  'settings.detectionHistory': {
    en: 'Detection History',
    hi: 'पहचान इतिहास',
    mr: 'ओळख इतिहास'
  },
  'settings.detectionHistoryDesc': {
    en: 'detections stored',
    hi: 'पहचान संग्रहीत',
    mr: 'ओळख संग्रहित'
  },
  'settings.downloadedContent': {
    en: 'Downloaded Content',
    hi: 'डाउनलोड की गई सामग्री',
    mr: 'डाउनलोड केलेली सामग्री'
  },
  'settings.downloadedContentDesc': {
    en: 'Manage offline content',
    hi: 'ऑफ़लाइन सामग्री प्रबंधित करें',
    mr: 'ऑफलाइन सामग्री व्यवस्थापित करा'
  },
  'settings.clearData': {
    en: 'Clear Data',
    hi: 'डेटा साफ़ करें',
    mr: 'डेटा साफ करा'
  },
  'settings.clearDataDesc': {
    en: 'Remove all detection history',
    hi: 'सभी पहचान इतिहास हटाएं',
    mr: 'सर्व ओळख इतिहास काढा'
  },
  'settings.clearHistoryDialog.title': {
    en: 'Clear History',
    hi: 'इतिहास साफ़ करें',
    mr: 'इतिहास साफ करा'
  },
  'settings.clearHistoryDialog.message': {
    en: 'Are you sure you want to clear all detection history? This action cannot be undone.',
    hi: 'क्या आप वाकई सभी पहचान इतिहास साफ़ करना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।',
    mr: 'तुम्हाला खरोखर सर्व ओळख इतिहास साफ करायचा आहे का? ही क्रिया पूर्ववत केली जाऊ शकत नाही.'
  },
  'settings.clearHistoryDialog.clear': {
    en: 'Clear',
    hi: 'साफ़ करें',
    mr: 'साफ करा'
  },
  'settings.help': {
    en: 'Help & FAQ',
    hi: 'सहायता और FAQ',
    mr: 'मदत आणि FAQ'
  },
  'settings.helpDesc': {
    en: 'Get help and answers',
    hi: 'सहायता और उत्तर प्राप्त करें',
    mr: 'मदत आणि उत्तरे मिळवा'
  },
  'settings.contact': {
    en: 'Contact Support',
    hi: 'सहायता से संपर्क करें',
    mr: 'समर्थनाशी संपर्क साधा'
  },
  'settings.contactDesc': {
    en: 'Reach out for assistance',
    hi: 'सहायता के लिए संपर्क करें',
    mr: 'सहाय्यासाठी संपर्क साधा'
  },
  'settings.privacy': {
    en: 'Privacy Policy',
    hi: 'गोपनीयता नीति',
    mr: 'गोपनीयता धोरण'
  },
  'settings.privacyDesc': {
    en: 'How we protect your data',
    hi: 'हम आपके डेटा की सुरक्षा कैसे करते हैं',
    mr: 'आम्ही तुमचा डेटा कसा संरक्षित करतो'
  },
  'settings.version': {
    en: 'Version',
    hi: 'संस्करण',
    mr: 'आवृत्ती'
  },
  'settings.copyright': {
    en: '© 2024 AgriShield. All rights reserved.',
    hi: '© 2024 AgriShield. सभी अधिकार सुरक्षित।',
    mr: '© 2024 AgriShield. सर्व हक्क राखीव.'
  }
};

export const getTranslation = (language: Language, key: string): string => {
  const translation = translations[key];
  if (!translation) {
    console.warn(`Translation missing for key: ${key}`);
    return key;
  }
  return translation[language] || translation.en || key;
};