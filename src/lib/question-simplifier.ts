import { IDualPaneQuestion } from '@/models/Assessment';

export interface SimplifiedQuestionInfo {
  scenarioTitle: string;
  scenarioSummary: string;
  subjectivePromptTitle?: string;
  subjectivePromptGuide?: string;
  helpfulQuestions?: string[];
  simplifiedOptions?: Record<string, string>;
}

// ============================================================================
// Distinct, plain-language simplified question statements in English, Hindi, and Kannada.
// Every single question has its own human-friendly summary so that users clicking
// "Simplify Question" see specific, plain-word explanations instead of repeated category copy.
// ============================================================================
export const SIMPLIFIED_QUESTION_MAP: Record<string, { en: string; hi: string; kn: string }> = {
  // --------------------------------------------------------------------------
  // OPENNESS TO EXPERIENCE (ocean_o1 to ocean_o6)
  // --------------------------------------------------------------------------
  ocean_o1: {
    en: 'Do you naturally like trying out brand new tools, experimenting with creative tech, and exploring new methods even when the current setup works fine?',
    hi: 'क्या आपको मौजूदा सिस्टम ठीक चलने पर भी नए टूल्स, नई तकनीक और नए तरीकों को आजमाना स्वाभाविक रूप से पसंद है?',
    kn: 'ಪ್ರಸ್ತುತ ವ್ಯವಸ್ಥೆ ಸರಿಯಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿದ್ದರೂ ಸಹ, ಹೊಸ ಸಾಧನಗಳು ಮತ್ತು ನೂತನ ತಂತ್ರಜ್ಞಾನಗಳನ್ನು ಪ್ರಯೋಗಿಸಲು ನೀವು ಇಷ್ಟಪಡುತ್ತೀರಾ?',
  },
  ocean_o2: {
    en: 'When tackling an open-ended business problem with no fixed rules, clear roadmap, or past examples, do you feel energized rather than stressed?',
    hi: 'जब किसी काम में कोई तय नियम, स्पष्ट योजना या पुराना उदाहरण न हो, तो क्या आप परेशान होने के बजाय नई संभावनाएं तलाशने के लिए प्रेरित होते हैं?',
    kn: 'ಯಾವುದೇ ಸ್ಪಷ್ಟ ನಿಯಮಗಳು ಅಥವಾ ಹಿಂದಿನ ಉದಾಹರಣೆಗಳಿಲ್ಲದ ಸವಾಲು ಎದುರಾದಾಗ, ನೀವು ಆತಂಕಗೊಳ್ಳದೆ ಹೊಸ ಪರಿಹಾರಗಳನ್ನು ಹುಡುಕಲು ಉತ್ಸುಕರಾಗುತ್ತೀರಾ?',
  },
  ocean_o3: {
    en: 'Do you frequently question old workplace routines and standard procedures to see if there is a faster, smarter way to work?',
    hi: 'क्या आप काम के पुराने नियमों और प्रक्रियाओं पर अक्सर विचार करते हैं ताकि पता चल सके कि क्या कोई बेहतर और तेज़ तरीका संभव है?',
    kn: 'ಕೆಲಸದ ಹಳೆಯ ನಿಯಮಗಳು ಸಂಸ್ಥೆಯ ವೇಗವನ್ನು ಕುಂಠಿತಗೊಳಿಸುತ್ತಿವೆಯೇ ಎಂದು ಪರಿಶೀಲಿಸಿ, ಉತ್ತಮ ವಿಧಾನಗಳನ್ನು ಕಂಡುಕೊಳ್ಳಲು ನೀವು ಪ್ರಶ್ನಿಸುತ್ತೀರಾ?',
  },
  ocean_o4: {
    en: 'Do you enjoy borrowing clever ideas from outside domains—like design, psychology, or business—to solve everyday challenges at work?',
    hi: 'क्या आप अपने काम की समस्याओं को सुलझाने के लिए अन्य क्षेत्रों (जैसे डिज़ाइन, मनोविज्ञान या व्यवसाय) के विचारों को लागू करना पसंद करते हैं?',
    kn: 'ನಿಮ್ಮ ಕೆಲಸದ ಸವಾಲುಗಳನ್ನು ಪರಿಹರಿಸಲು ಇತರ ಕ್ಷೇತ್ರಗಳ (ವಿನ್ಯಾಸ, ಮನೋವಿಜ್ಞಾನ ಅಥವಾ ವ್ಯವಹಾರ) ನವೀನ ಆಲೋಚನೆಗಳನ್ನು ಬಳಸಲು ನೀವು ಇಷ್ಟಪಡುತ್ತೀರಾ?',
  },
  ocean_o5: {
    en: 'When project goals or company priorities change unexpectedly, do you quickly adapt and embrace the shift as an opportunity to learn?',
    hi: 'जब प्रोजेक्ट की योजनाएं अचानक बदल जाती हैं, तो क्या आप विरोध करने के बजाय इसे नया सीखने का अच्छा अवसर मानते हैं?',
    kn: 'ಯೋಜನೆಯ ಆದ್ಯತೆಗಳು ಅನಿರೀಕ್ಷಿತವಾಗಿ ಬದಲಾದಾಗ, ನೀವು ನಿರಾಶೆಗೊಳ್ಳದೆ ಅದನ್ನು ಹೊಸ ಕಲಿಕೆಯ ಉತ್ತಮ ಅವಕಾಶವಾಗಿ ಸ್ವೀಕರಿಸುತ್ತೀರಾ?',
  },
  ocean_o6: {
    en: 'When regular troubleshooting hits a dead end, do you enjoy leading creative, unconventional brainstorms to find unexpected solutions?',
    hi: 'जब सामान्य तरीके काम नहीं करते, तो क्या आप लीक से हटकर नए और अनोखे विचारों पर टीम के साथ मंथन करने में आनंद लेते हैं?',
    kn: 'ಸಾಮಾನ್ಯ ಪರಿಹಾರಗಳು ವಿಫಲವಾದಾಗ, ಹೊಸ ರೀತಿಯ ಸೃಜನಾತ್ಮಕ ಆಲೋಚನೆಗಳನ್ನು ಚರ್ಚಿಸಿ ಅನಿರೀಕ್ಷಿತ ಪರಿಹಾರ ಕಂಡುಕೊಳ್ಳಲು ನೀವು ಮುಂಚೂಣಿಯಲ್ಲಿರುತ್ತೀರಾ?',
  },

  // --------------------------------------------------------------------------
  // CONSCIENTIOUSNESS (ocean_c1 to ocean_c6)
  // --------------------------------------------------------------------------
  ocean_c1: {
    en: 'Do you thoroughly double-check details, test tricky corner cases, and review documentation before considering any task finished?',
    hi: 'क्या आप किसी भी काम को पूरा मानने से पहले बारीकियों की दोबारा जांच करते हैं, संभावित गलतियों को परखते हैं और दस्तावेज पूरे करते हैं?',
    kn: 'ಯಾವುದೇ ಕೆಲಸ ಮುಗಿಯಿತು ಎಂದು ತೀರ್ಮಾನಿಸುವ ಮೊದಲು ಅದರ ಸಣ್ಣ ವಿವರಗಳು, ದೋಷಗಳು ಮತ್ತು ದಾಖಲೆಗಳನ್ನು ನೀವು ಕೂಲಂಕಷವಾಗಿ ಮರುಪರಿಶೀಲಿಸುತ್ತೀರಾ?',
  },
  ocean_c2: {
    en: 'When you commit to a delivery deadline, can teammates and managers count on you to deliver on time without needing to micromanage you?',
    hi: 'जब आप किसी समय-सीमा की जिम्मेदारी लेते हैं, तो क्या टीम आप पर पूरा भरोसा कर सकती है कि काम बिना किसी निगरानी के समय पर पूरा होगा?',
    kn: 'ನೀವು ಒಂದು ಗಡುವನ್ನು ಒಪ್ಪಿಕೊಂಡಾಗ, ಯಾವುದೇ ಮೇಲ್ವಿಚಾರಣೆಯಿಲ್ಲದೆ ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ಕೆಲಸ ಪೂರ್ಣಗೊಳ್ಳುತ್ತದೆ ಎಂದು ತಂಡವು ನಿಮ್ಮನ್ನು ನಂಬಬಹುದೇ?',
  },
  ocean_c3: {
    en: 'Do you keep your tasks, workspace, notes, and documents systematically organized so you never lose track or feel overwhelmed?',
    hi: 'क्या आप अपने कार्यों की सूची, फाइलों और कार्यक्षेत्र को हमेशा व्यवस्थित रखते हैं ताकि कभी कोई भ्रम या काम का दबाव न बने?',
    kn: 'ಗೊಂದಲಕ್ಕೆ ಒಳಗಾಗದಂತೆ ನಿಮ್ಮ ಕೆಲಸಗಳು, ಟಿಪ್ಪಣಿಗಳು ಮತ್ತು ದಾಖಲೆಗಳನ್ನು ನೀವು ಯಾವಾಗಲೂ ಅಚ್ಚುಕಟ್ಟಾಗಿ ಮತ್ತು ವ್ಯವಸ್ಥಿತವಾಗಿ ಇರಿಸಿಕೊಳ್ಳುತ್ತೀರಾ?',
  },
  ocean_c4: {
    en: 'Do you consistently resist distractions and push yourself to finish tough, high-impact tasks first before tackling easy chores?',
    hi: 'क्या आप ध्यान भटकाने वाली चीजों से बचकर पहले सबसे कठिन और महत्वपूर्ण कार्यों को पूरा करने में अनुशासित रहते हैं?',
    kn: 'ಗಮನ ಬೇರೆಡೆ ಸೆಳೆಯುವ ವಿಷಯಗಳಿಂದ ದೂರವಿದ್ದು, ಸುಲಭದ ಕೆಲಸಗಳಿಗಿಂತ ಮೊದಲು ಕಠಿಣ ಹಾಗೂ ಮಹತ್ವದ ಜವಾಬ್ದಾರಿಗಳನ್ನು ಮುಗಿಸಲು ಆದ್ಯತೆ ನೀಡುತ್ತೀರಾ?',
  },
  ocean_c5: {
    en: 'Even when rushing against tight deadlines, do you strictly follow security rules, quality standards, and policies without cutting corners?',
    hi: 'समय की भारी कमी होने पर भी, क्या आप शॉर्टकट लिए बिना सभी सुरक्षा नियमों, गुणवत्ता मानकों और नीतियों का सख्ती से पालन करते हैं?',
    kn: 'ಸಮಯದ ತೀವ್ರ ಒತ್ತಡವಿದ್ದರೂ ಸಹ, ನಿಯಮಗಳನ್ನು ಮುರಿಯದೆ ಗುಣಮಟ್ಟದ ಮಾನದಂಡಗಳು ಮತ್ತು ಸುರಕ್ಷತಾ ನಿಯಮಗಳನ್ನು ತಪ್ಪದೇ ಪಾಲಿಸುತ್ತೀರಾ?',
  },
  ocean_c6: {
    en: 'Before kicking off a major initiative, do you proactively prepare backup plans and contingency steps in case something goes wrong?',
    hi: 'किसी बड़े प्रोजेक्ट को शुरू करने से पहले, क्या आप संभावित बाधाओं के लिए पहले से ही बैकअप और आपातकालीन योजना तैयार रखते हैं?',
    kn: 'ದೊಡ್ಡ ಕೆಲಸವನ್ನು ಪ್ರಾರಂಭಿಸುವ ಮುನ್ನವೇ, ಸಮಸ್ಯೆಗಳು ಎದುರಾದರೆ ಏನು ಮಾಡಬೇಕೆಂಬ ಪರ್ಯಾಯ ಬ್ಯಾಕಪ್ ಯೋಜನೆಯನ್ನು ಮುಂಚಿತವಾಗಿ ಸಿದ್ಧಪಡಿಸುತ್ತೀರಾ?',
  },

  // --------------------------------------------------------------------------
  // EXTRAVERSION (ocean_e1 to ocean_e6)
  // --------------------------------------------------------------------------
  ocean_e1: {
    en: 'When a group meeting gets stuck, loses direction, or falls silent, do you naturally step in to facilitate and align everyone?',
    hi: 'जब किसी मीटिंग में चर्चा भटक जाए या सन्नाटा छा जाए, तो क्या आप आगे बढ़कर बातचीत को सही दिशा में ले जाने की पहल करते हैं?',
    kn: 'ತಂಡದ ಸಭೆಯಲ್ಲಿ ಗೊಂದಲ ಉಂಟಾದಾಗ ಅಥವಾ ದಿಕ್ಕು ತಪ್ಪಿದಾಗ, ನೀವು ಮುಂದೆ ಬಂದು ಎಲ್ಲರನ್ನೂ ಒಂದುಗೂಡಿಸಿ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತೀರಾ?',
  },
  ocean_e2: {
    en: 'Do you do your best thinking by debating live with teammates and collaborating closely, rather than working in isolation for days?',
    hi: 'क्या अकेले लंबे समय तक सोचने के बजाय, टीम के साथ खुलकर चर्चा करने और विचार-विमर्श करने से आपके सर्वश्रेष्ठ विचार सामने आते हैं?',
    kn: 'ದಿನಗಟ್ಟಲೆ ಒಂಟಿಯಾಗಿ ಕೆಲಸ ಮಾಡುವುದಕ್ಕಿಂತ ತಂಡದೊಂದಿಗೆ ಮುಕ್ತವಾಗಿ ಚರ್ಚಿಸಿ ಸಹಯೋಗದಲ್ಲಿ ತೊಡಗಿದಾಗ ನಿಮಗೆ ಹೆಚ್ಚು ಉತ್ತಮ ಆಲೋಚನೆಗಳು ಹೊಳೆಯುತ್ತವೆಯೇ?',
  },
  ocean_e3: {
    en: 'Do you feel comfortable and confident speaking up with an opposing viewpoint in meetings with senior leaders or important clients?',
    hi: 'क्या आप वरिष्ठ अधिकारियों या ग्राहकों के साथ बैठकों में अपनी असहमत राय को भी आत्मविश्वास और स्पष्टता के साथ रखने में सहज महसूस करते हैं?',
    kn: 'ಹಿರಿಯ ಅಧಿಕಾರಿಗಳು ಅಥವಾ ಗ್ರಾಹಕರೊಂದಿಗಿನ ಸಭೆಯಲ್ಲಿ ನಿಮ್ಮ ಭಿನ್ನ ನಿಲುವನ್ನು ಧೈರ್ಯವಾಗಿ ಮತ್ತು ಆತ್ಮವಿಶ್ವಾಸದಿಂದ ವ್ಯಕ್ತಪಡಿಸಲು ನೀವು ಸಿದ್ಧರಿರುತ್ತೀರಾ?',
  },
  ocean_e4: {
    en: 'Do you proactively reach out to colleagues across different departments to understand what they do and build strong professional connections?',
    hi: 'क्या आप अन्य विभागों के सहकर्मियों से समय-समय पर संपर्क स्थापित करते हैं ताकि उनके काम को समझ सकें और अच्छे संबंध बना सकें?',
    kn: 'ಬೇರೆ ವಿಭಾಗಗಳ ಸಹೋದ್ಯೋಗಿಗಳೊಂದಿಗೆ ನಿರಂತರ ಸಂಪರ್ಕ ಬೆಳೆಸಿ, ಅವರ ಕೆಲಸವನ್ನು ಅರ್ಥಮಾಡಿಕೊಂಡು ಉತ್ತಮ ಸಂಬಂಧಗಳನ್ನು ರೂಪಿಸಲು ನೀವು ಆಸಕ್ತಿ ಹೊಂದಿದ್ದೀರಾ?',
  },
  ocean_e5: {
    en: 'Do you consciously bring positive energy, celebrate milestones, and lift your team’s spirits during stressful, exhausting sprints?',
    hi: 'क्या आप कठिन समय में टीम का उत्साह बढ़ाने, सकारात्मक माहौल बनाने और छोटी जीतों का जश्न मनाने का सचेत प्रयास करते हैं?',
    kn: 'ಕಠಿಣ ಮತ್ತು ಒತ್ತಡದ ದಿನಗಳಲ್ಲಿಯೂ ತಂಡದ ನೈತಿಕ ಸ್ಥೈರ್ಯವನ್ನು ಹೆಚ್ಚಿಸಲು ಮತ್ತು ಸಕಾರಾತ್ಮಕ ವಾತಾವರಣ ನಿರ್ಮಿಸಲು ನೀವು ಪ್ರಯತ್ನಿಸುತ್ತೀರಾ?',
  },
  ocean_e6: {
    en: 'Do you look forward to presenting product demos, tech talks, and project retrospectives in front of large audiences across the organization?',
    hi: 'क्या आप कंपनी के बड़े समूहों के सामने प्रोजेक्ट के नतीजे, डेमो या तकनीकी प्रस्तुतियां देने के लिए उत्साहित रहते हैं?',
    kn: 'ಸಂಸ್ಥೆಯ ದೊಡ್ಡ ಸಭೆಗಳ ಮುಂದೆ ನಿಮ್ಮ ಪ್ರಾಜೆಕ್ಟ್‌ನ ಡೆಮೊ, ತಾಂತ್ರಿಕ ಮಾಹಿತಿ ಅಥವಾ ಪ್ರಸ್ತುತಿಗಳನ್ನು ನೀಡಲು ನೀವು ಉತ್ಸುಕರಾಗಿರುತ್ತೀರಾ?',
  },

  // --------------------------------------------------------------------------
  // AGREEABLENESS (ocean_a1 to ocean_a6)
  // --------------------------------------------------------------------------
  ocean_a1: {
    en: 'When disagreements get heated during project reviews or debates, is your natural instinct to de-escalate tension and find common ground?',
    hi: 'जब काम को लेकर तीखी बहस या असहमति होती है, तो क्या आपका पहला प्रयास तनाव को शांत कर साझा सहमति बनाना होता है?',
    kn: 'ಕೆಲಸದ ವಿಚಾರದಲ್ಲಿ ಬಿಸಿಬಿಸಿ ವಾದ-ವಿವಾದಗಳು ನಡೆದಾಗ, ಪರಿಸ್ಥಿತಿಯನ್ನು ತಿಳಿಗೊಳಿಸಿ ಎಲ್ಲರಿಗೂ ಒಪ್ಪಿಗೆಯಾಗುವ ಸಮಾನ ಪರಿಹಾರ ಹುಡುಕಲು ನೀವು ಯತ್ನಿಸುತ್ತೀರಾ?',
  },
  ocean_a2: {
    en: 'Are you genuinely glad to set aside your own hours to help an unblocked colleague or mentor a junior teammate without feeling annoyed?',
    hi: 'क्या आप किसी अटके हुए साथी की मदद करने या कनिष्ठ सहयोगी को सिखाने के लिए बिना किसी चिड़चिड़ाहट के अपना समय समर्पित करते हैं?',
    kn: 'ಸಹೋದ್ಯೋಗಿಯ ತೊಂದರೆಯನ್ನು ಬಗೆಹರಿಸಲು ಅಥವಾ ಕಿರಿಯ ಸದಸ್ಯರಿಗೆ ಮಾರ್ಗದರ್ಶನ ನೀಡಲು ಕಿರಿಕಿರಿಯಿಲ್ಲದೆ ನಿಮ್ಮ ಸಮಯವನ್ನು ಸಂತೋಷದಿಂದ ನೀಡುತ್ತೀರಾ?',
  },
  ocean_a3: {
    en: 'When a teammate makes a serious mistake, do you focus entirely on fixing it together constructively rather than blaming anyone?',
    hi: 'जब किसी सहकर्मी से कोई बड़ी गलती हो जाती है, तो क्या आप दोष मढ़ने के बजाय मिलकर समस्या का समाधान निकालने पर ध्यान देते हैं?',
    kn: 'ತಂಡದ ಸದಸ್ಯರಿಂದ ಗಂಭೀರ ತಪ್ಪು ಸಂಭವಿಸಿದಾಗ, ಅವರನ್ನು ದೂಷಿಸುವ ಬದಲು ಒಟ್ಟಾಗಿ ಸಮಸ್ಯೆಯನ್ನು ಸರಿಪಡಿಸಲು ಸಂಪೂರ್ಣ ಗಮನ ನೀಡುತ್ತೀರಾ?',
  },
  ocean_a4: {
    en: 'Can you easily put your ego aside and enthusiastically support a teammate’s solution if it turns out to be better than your own?',
    hi: 'यदि किसी सहकर्मी का विचार आपके विचार से बेहतर साबित हो, तो क्या आप अहंकार छोड़कर खुशी-खुशी उनके समाधान का समर्थन करते हैं?',
    kn: 'ನಿಮ್ಮ ಪ್ರಸ್ತಾಪಕ್ಕಿಂತ ಸಹೋದ್ಯೋಗಿಯ ಆಲೋಚನೆ ಹೆಚ್ಚು ಶ್ರೇಷ್ಠವೆನಿಸಿದಾಗ, ನಿಮ್ಮ ಅಹಂ ಬದಿಗಿಟ್ಟು ಅದನ್ನು ಸಂತೋಷದಿಂದ ಒಪ್ಪಿಕೊಳ್ಳುತ್ತೀರಾ?',
  },
  ocean_a5: {
    en: 'Do you naturally give colleagues the benefit of the doubt and assume good intentions, even when their tone sounds hurried or blunt?',
    hi: 'क्या आप सहकर्मियों के इरादों पर सकारात्मक विश्वास रखते हैं, भले ही उनकी बात करने की शैली थोड़ी कठोर या संक्षिप्त लगे?',
    kn: 'ಸಹೋದ್ಯೋಗಿಗಳ ಮಾತು ಕೆಲವೊಮ್ಮೆ ಕಟುವಾಗಿ ಕಂಡರೂ, ಅವರ ಉದ್ದೇಶ ಒಳ್ಳೆಯದೇ ಆಗಿರುತ್ತದೆ ಎಂದು ನೀವು ನಂಬುತ್ತೀರಾ?',
  },
  ocean_a6: {
    en: 'Are you genuinely happy when your entire team gets the spotlight for a win, without needing special individual recognition for yourself?',
    hi: 'क्या आप व्यक्तिगत प्रशंसा पाने के बजाय पूरी टीम को सफलता का श्रेय मिलने से सचमुच खुश और संतुष्ट रहते हैं?',
    kn: 'ವೈಯಕ್ತಿಕ ಪ್ರಶಂಸೆಗಿಂತ ಇಡೀ ತಂಡದ ಒಟ್ಟಾರೆ ಯಶಸ್ಸು ಮತ್ತು ಮನ್ನಣೆಗೆ ನೀವು ಹೆಚ್ಚು ಸಂತೋಷಪಡುತ್ತೀರಾ?',
  },

  // --------------------------------------------------------------------------
  // EMOTIONAL STABILITY (ocean_n1 to ocean_n6)
  // --------------------------------------------------------------------------
  ocean_n1: {
    en: 'When an unexpected crisis erupts and critical systems fail, do you stay level-headed and think clearly without feeling panicked?',
    hi: 'जब अचानक कोई बड़ा संकट आ जाए और सिस्टम फेल हो जाए, तो क्या आप घबराने के बजाय पूरी तरह शांत रहकर स्पष्ट सोच पाते हैं?',
    kn: 'ಅನಿರೀಕ್ಷಿತ ತಾಂತ್ರಿಕ ವೈಫಲ್ಯ ಅಥವಾ ತುರ್ತು ಪರಿಸ್ಥಿತಿ ಎದುರಾದಾಗ, ನೀವು ಗಾಬರಿಗೊಳ್ಳದೆ ಮನಸ್ಸನ್ನು ಶಾಂತವಾಗಿಟ್ಟುಕೊಂಡು ಸ್ಪಷ್ಟ ನಿರ್ಧಾರ ಕೈಗೊಳ್ಳುತ್ತೀರಾ?',
  },
  ocean_n2: {
    en: 'When receiving blunt or critical feedback on your work, can you take it calmly and objectively without feeling hurt or defensive?',
    hi: 'जब आपके काम पर सीधी और सख्त आलोचना की जाती है, तो क्या आप बुरा मानने या बचाव करने के बजाय उसे शांति से सीखते हैं?',
    kn: 'ನಿಮ್ಮ ಕೆಲಸದ ಮೇಲೆ ಯಾರಾದರೂ ಕಟುವಾದ ಟೀಕೆ ಮಾಡಿದಾಗ, ನೀವು ಕೋಪಗೊಳ್ಳದೆ ಅಥವಾ ಮನನೋಯಿಸಿಕೊಳ್ಳದೆ ಅದನ್ನು ವಸ್ತುನಿಷ್ಠವಾಗಿ ಸ್ವೀಕರಿಸುತ್ತೀರಾ?',
  },
  ocean_n3: {
    en: 'During intense crunches with tight deadlines, does your quality of work and mental focus stay consistent instead of degrading under pressure?',
    hi: 'भारी दबाव और कड़ी समय-सीमा के दिनों में भी, क्या आपका ध्यान और काम की गुणवत्ता स्थिर बनी रहती है?',
    kn: 'ಅತ್ಯಂತ ಕಠಿಣ ಗಡುವು ಮತ್ತು ಕೆಲಸದ ಒತ್ತಡವಿರುವಾಗಲೂ, ನಿಮ್ಮ ಏಕಾಗ್ರತೆ ಮತ್ತು ಕೆಲಸದ ಗುಣಮಟ್ಟ ಕುಸಿಯದೆ ಸ್ಥಿರವಾಗಿರುತ್ತದೆಯೇ?',
  },
  ocean_n4: {
    en: 'If a project you poured weeks of hard work into fails or gets canceled, do you bounce back quickly and channel energy into the next goal?',
    hi: 'यदि आपकी हफ्तों की मेहनत का कोई प्रोजेक्ट रद्द या असफल हो जाए, तो क्या आप निराश होने के बजाय तुरंत अगले लक्ष्य में जुट जाते हैं?',
    kn: 'ನೀವು ವಾರಗಟ್ಟಲೆ ಕಷ್ಟಪಟ್ಟು ರೂಪಿಸಿದ ಯೋಜನೆ ರದ್ದಾದರೂ ಅಥವಾ ವಿಫಲವಾದರೂ, ನೀವು ಕುಗ್ಗದೆ ತಕ್ಷಣವೇ ಮುಂದಿನ ಗುರಿಯತ್ತ ಮುನ್ನಡೆಯುತ್ತೀರಾ?',
  },
  ocean_n5: {
    en: 'When rumors of management changes or company reorganizations spread, do you stay grounded on your work instead of getting anxious?',
    hi: 'कंपनी में बड़े बदलावों या पुनर्गठन की चर्चा के दौरान, क्या आप चिंतित होने के बजाय अपने दैनिक काम पर ध्यान केंद्रित रखते हैं?',
    kn: 'ಸಂಸ್ಥೆಯಲ್ಲಿ ಆಡಳಿತ ಬದಲಾವಣೆ ಅಥವಾ ಮರುರಚನೆಯ ವದಂತಿಗಳು ಹರಡಿದಾಗ, ನೀವು ಆತಂಕಕ್ಕೆ ಒಳಗಾಗದೆ ನಿಮ್ಮ ಕೆಲಸದ ಮೇಲೆ ಗಮನವಿಡುತ್ತೀರಾ?',
  },
  ocean_n6: {
    en: 'Do you keep your patience and cool when dealing with sluggish tools, slow approval queues, or annoying bureaucratic delays?',
    hi: 'धीमे टूल्स, कागजी औपचारिकताओं या अप्रत्याशित देरी का सामना करते समय भी क्या आप अपना धैर्य और संतुलन बनाए रखते हैं?',
    kn: 'ನಿಧಾನಗತಿಯ ತಂತ್ರಜ್ಞಾನಗಳು ಅಥವಾ ಸುದೀರ್ಘ ಅನುಮತಿ ಪ್ರಕ್ರಿಯೆಗಳ ವಿಳಂಬವನ್ನು ಎದುರಿಸುವಾಗ ನೀವು ಸಂಯಮ ಮತ್ತು ತಾಳ್ಮೆಯಿಂದ ವರ್ತಿಸುತ್ತೀರಾ?',
  },

  // --------------------------------------------------------------------------
  // STUDENT MBTI (mbti_ei_1 to mbti_jp_3)
  // --------------------------------------------------------------------------
  mbti_ei_1: {
    en: 'When kicking off a new project, what gets your best ideas flowing: bouncing spontaneous thoughts with a group, or thinking deeply on your own first?',
    hi: 'नया प्रोजेक्ट शुरू करते समय आपके बेहतरीन विचार कैसे आते हैं: समूह में तुरंत बातचीत करने से, या पहले अकेले शांत बैठकर सोचने से?',
    kn: 'ಹೊಸ ಪ್ರಾಜೆಕ್ಟ್ ಆರಂಭಿಸುವಾಗ ನಿಮ್ಮ ಉತ್ತಮ ಆಲೋಚನೆಗಳು ಹೇಗೆ ಹೊರಹೊಮ್ಮುತ್ತವೆ: ಗುಂಪಿನಲ್ಲಿ ಮುಕ್ತವಾಗಿ ಚರ್ಚಿಸುವುದರಿಂದಲೋ ಅಥವಾ ಮೊದಲು ಒಂಟಿಯಾಗಿ ಆಳವಾಗಿ ಯೋಚಿಸುವುದರಿಂದಲೋ?',
  },
  mbti_ei_2: {
    en: 'After an exhausting week of stressful exams, how do you recharge: going out to socialize with friends, or enjoying quiet solitude at home?',
    hi: 'कठिन परीक्षाओं के थकाऊ सप्ताह के बाद आप कैसे तरोताजा होते हैं: दोस्तों के साथ बाहर जाकर, या घर पर शांति से अकेले समय बिताकर?',
    kn: 'ಪರೀಕ್ಷೆಗಳ ಒತ್ತಡದ ವಾರದ ನಂತರ ನೀವು ಹೇಗೆ ವಿಶ್ರಾಂತಿ ಪಡೆಯುತ್ತೀರಿ: ಸ್ನೇಹಿತರೊಂದಿಗೆ ಹೊರಗೆ ಬೆರೆಯುವುದರಿಂದಲೋ ಅಥವಾ ಮನೆಯಲ್ಲಿ ಏಕಾಂತದಲ್ಲಿ ಶಾಂತವಾಗಿ ಸಮಯ ಕಳೆಯುವುದರಿಂದಲೋ?',
  },
  mbti_ei_3: {
    en: 'In seminars and discussions, do you shape your thoughts out loud as you speak, or do you prefer forming clear points in your head first?',
    hi: 'चर्चा के दौरान क्या आप बोलते-बोलते अपने विचार विकसित करते हैं, या पहले मन में पूरी बात सोचकर फिर बोलना पसंद करते हैं?',
    kn: 'ಸಭೆ-ಚರ್ಚೆಗಳಲ್ಲಿ ನೀವು ಮಾತನಾಡುತ್ತಲೇ ಆಲೋಚನೆಗಳನ್ನು ರೂಪಿಸಿಕೊಳ್ಳುತ್ತೀರಾ ಅಥವಾ ಮೊದಲು ಮನಸ್ಸಿನಲ್ಲೇ ಸ್ಪಷ್ಟಪಡಿಸಿಕೊಂಡು ನಂತರ ಮಾತನಾಡುತ್ತೀರಾ?',
  },
  mbti_sn_1: {
    en: 'When learning a complex subject, what gives you the most confidence: concrete facts and real-world examples, or big-picture concepts and theories?',
    hi: 'जटिल विषय सीखते समय आपको किससे अधिक स्पष्टता मिलती है: वास्तविक तथ्यों और उदाहरणों से, या व्यापक सिद्धांतों और भविष्य की संभावनाओं से?',
    kn: 'ಕಠಿಣ ವಿಷಯವನ್ನು ಕಲಿಯುವಾಗ ನಿಮಗೆ ಯಾವುದು ಹೆಚ್ಚು ಸ್ಪಷ್ಟತೆ ನೀಡುತ್ತದೆ: ವಾಸ್ತವಿಕ ವಿವರಗಳು ಮತ್ತು ನೈಜ ಉದಾಹರಣೆಗಳೋ ಅಥವಾ ವಿಶಾಲ ಸಿದ್ಧಾಂತಗಳು ಮತ್ತು ಪರಿಕಲ್ಪನೆಗಳೋ?',
  },
  mbti_sn_2: {
    en: 'When building an experimental prototype, do you prefer using reliable, proven tools or exploring uncharted, cutting-edge technologies?',
    hi: 'प्रोटोटाइप बनाते समय आप किसे चुनेंगे: विश्वसनीय और परखे हुए टूल्स को, या एकदम नई और आधुनिक तकनीकों को?',
    kn: 'ಹೊಸ ಮಾದರಿಯನ್ನು ನಿರ್ಮಿಸುವಾಗ ನೀವು ಯಾವುದನ್ನು ಆರಿಸಿಕೊಳ್ಳುತ್ತೀರಿ: ಈಗಾಗಲೇ ಸಾಬೀತಾದ ನಂಬಿಕಸ್ಥ ಸಾಧನಗಳನ್ನೋ ಅಥವಾ ಅತ್ಯಾಧುನಿಕ ನೂತನ ತಂತ್ರಜ್ಞಾನಗಳನ್ನೋ?',
  },
  mbti_sn_3: {
    en: 'When given a project brief, do you prefer following step-by-step instructions carefully, or discovering your own creative path to the goal?',
    hi: 'प्रोजेक्ट का विवरण मिलने पर आप क्या पसंद करते हैं: दिए गए निर्देशों का कड़ाई से पालन करना, या अपने तरीके से नया रास्ता तलाशना?',
    kn: 'ಪ್ರಾಜೆಕ್ಟ್‌ನ ಸೂಚನೆಗಳನ್ನು ಸ್ವೀಕರಿಸಿದಾಗ ನೀವು ಯಾವುದನ್ನು ಬಯಸುತ್ತೀರಿ: ನಿಯಮಗಳನ್ನು ನಿಖರವಾಗಿ ಪಾಲಿಸುವುದನ್ನೋ ಅಥವಾ ನಿಮ್ಮದೇ ಆದ ಸ್ವತಂತ್ರ ಹಾದಿಯನ್ನು ಅನ್ವೇಷಿಸುವುದನ್ನೋ?',
  },
  mbti_tf_1: {
    en: 'When a team disagrees on what to do, what matters most to you: choosing the most logical and effective option, or protecting team harmony and consensus?',
    hi: 'जब टीम में मतभेद हो, तो आपके लिए अधिक महत्वपूर्ण क्या है: सबसे तार्किक और प्रभावी विकल्प चुनना, या टीम का तालमेल और खुशी बनाए रखना?',
    kn: 'ತಂಡದಲ್ಲಿ ಭಿನ್ನಾಭಿಪ್ರಾಯ ಮೂಡಿದಾಗ ನಿಮಗೆ ಯಾವುದು ಹೆಚ್ಚು ಮುಖ್ಯ: ತಾರ್ಕಿಕವಾಗಿ ಶ್ರೇಷ್ಠವಾದ ನಿರ್ಧಾರ ಕೈಗೊಳ್ಳುವುದೋ ಅಥವಾ ಎಲ್ಲರ ಒಗ್ಗಟ್ಟು ಮತ್ತು ಸೌಹಾರ್ದತೆ ಕಾಪಾಡುವುದೋ?',
  },
  mbti_tf_2: {
    en: 'When reviewing a classmate’s mistakes, do you give direct, honest feedback on the facts, or soften it with gentle encouragement to protect their feelings?',
    hi: 'सहपाठी की गलतियों पर प्रतिक्रिया देते समय क्या आप सीधे और स्पष्ट तथ्य बताते हैं, या उनकी भावनाओं का ध्यान रखकर नरमी से समझाते हैं?',
    kn: 'ಸಹಪಾಠಿಯ ತಪ್ಪುಗಳನ್ನು ಸರಿಪಡಿಸುವಾಗ ನೀವು ನೇರವಾಗಿ ನ್ಯೂನತೆಗಳನ್ನು ತಿಳಿಸುತ್ತೀರಾ ಅಥವಾ ಅವರ ಮನಸ್ಸಿಗೆ ನೋವಾಗದಂತೆ ಪ್ರೋತ್ಸಾಹದಾಯಕವಾಗಿ ಸಲಹೆ ನೀಡುತ್ತೀರಾ?',
  },
  mbti_tf_3: {
    en: 'If a peer faces personal hardships near a deadline, do you evaluate them strictly by grading rules, or show compassion and help absorb their workload?',
    hi: 'यदि किसी साथी को व्यक्तिगत संकट हो, तो क्या आप नियमों के अनुसार निष्पक्ष मूल्यांकन करते हैं, या सहानुभूति दिखाकर उनका काम खुद संभालते हैं?',
    kn: 'ಗಡುವಿನ ಸಮಯದಲ್ಲಿ ಸಹಪಾಠಿಗೆ ಕಷ್ಟ ಬಂದಾಗ, ನೀವು ಕಟ್ಟುನಿಟ್ಟಾದ ನಿಯಮಗಳಂತೆ ನಿರ್ಣಯಿಸುತ್ತೀರಾ ಅಥವಾ ಮಾನವೀಯತೆಯಿಂದ ಅವರ ಕೆಲಸದಲ್ಲಿ ಸಹಾಯ ಮಾಡುತ್ತೀರಾ?',
  },
  mbti_jp_1: {
    en: 'When preparing for deadlines, do you prefer a structured schedule with clear milestones, or staying flexible and adapting close to the finish line?',
    hi: 'समय-सीमा की तैयारी के लिए आप क्या पसंद करते हैं: पहले से तय समय-सारणी, या अंतिम समय तक लचीला रहकर काम करना?',
    kn: 'ಅಂತಿಮ ಗಡುವಿನೊಳಗೆ ಕೆಲಸ ಮುಗಿಸಲು ನೀವು ಯಾವುದನ್ನು ಇಷ್ಟಪಡುತ್ತೀರಿ: ಮುಂಚಿತವಾಗಿ ರೂಪಿಸಿದ ವೇಳಾಪಟ್ಟಿಯನ್ನೋ ಅಥವಾ ಕೊನೆಯವರೆಗೂ ನಮ್ಯತೆಯಿಂದ ಹೊಂದಿಕೊಳ್ಳುವುದನ್ನೋ?',
  },
  mbti_jp_2: {
    en: 'When choosing a specialization or elective, do you like making a firm decision early for peace of mind, or keeping your options open to explore?',
    hi: 'करियर या विषय का चुनाव करते समय: क्या आप जल्दी पक्का फैसला लेना पसंद करते हैं, या सभी विकल्पों को खुला रखना चाहते हैं?',
    kn: 'ವಿಷಯ ಅಥವಾ ವೃತ್ತಿಯನ್ನು ಆಯ್ಕೆ ಮಾಡುವಾಗ: ಆರಂಭದಲ್ಲೇ ಖಚಿತ ನಿರ್ಧಾರ ಕೈಗೊಳ್ಳಲು ಇಷ್ಟಪಡುತ್ತೀರಾ ಅಥವಾ ಎಲ್ಲಾ ಅವಕಾಶಗಳನ್ನು ಮುಕ್ತವಾಗಿಟ್ಟುಕೊಳ್ಳಲು ಬಯಸುತ್ತೀರಾ?',
  },
  mbti_jp_3: {
    en: 'If project requirements change abruptly two days before submission, do you feel uneasy and rewrite a structured plan, or enjoy adapting on the fly?',
    hi: 'अंतिम दो दिन पहले नियम बदलने पर: क्या आप परेशान होकर तुरंत नया प्लान बनाते हैं, या बिना घबराए तुरंत नए तरीके से ढल जाते हैं?',
    kn: 'ಗಡುವಿಗೆ ಎರಡು ದಿನಗಳ ಮೊದಲು ನಿಯಮಗಳು ಬದಲಾದಾಗ: ನೀವು ಅಸಮಾಧಾನಗೊಂಡು ಹೊಸ ವೇಳಾಪಟ್ಟಿ ರಚಿಸುತ್ತೀರಾ ಅಥವಾ ಬದಲಾವಣೆಗೆ ತಕ್ಷಣ ಹೊಂದಿಕೊಳ್ಳುತ್ತೀರಾ?',
  },

  // --------------------------------------------------------------------------
  // STUDENT HOLLAND RIASEC (holland_1 to holland_4)
  // --------------------------------------------------------------------------
  holland_1: {
    en: 'Which kind of internship sounds more exciting to you: hands-on assembling of physical equipment, or analytical data analysis and research?',
    hi: 'इंटर्नशिप में आपको क्या अधिक आकर्षित करता है: हार्डवेयर और उपकरणों पर सीधे हाथ से काम करना, या डेटा और जटिल समस्याओं का विश्लेषण करना?',
    kn: 'ಇಂಟರ್ನ್‌ಶಿಪ್‌ನಲ್ಲಿ ನಿಮಗೆ ಹೆಚ್ಚು ಆಸಕ್ತಿ ನೀಡುವ ಕೆಲಸ ಯಾವುದು: ಯಂತ್ರೋಪಕರಣಗಳನ್ನು ಪ್ರಾಯೋಗಿಕವಾಗಿ ನಿರ್ವಹಿಸುವುದೋ ಅಥವಾ ಮಾಹಿತಿ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಸಂಶೋಧನೆಯೋ?',
  },
  holland_2: {
    en: 'In a student club or venture, what role gives you deeper satisfaction: designing creative visuals and media, or mentoring people and organizing community events?',
    hi: 'कॉलेज क्लब में आपको किस काम में अधिक संतोष मिलेगा: रचनात्मक डिज़ाइन और मल्टीमीडिया बनाना, या सहपाठियों का मार्गदर्शन और सामाजिक आयोजन करना?',
    kn: 'ಕಾಲೇಜು ಕ್ಲಬ್‌ನಲ್ಲಿ ನಿಮಗೆ ಯಾವ ಪಾತ್ರ ಹೆಚ್ಚು ತೃಪ್ತಿ ನೀಡುತ್ತದೆ: ಸೃಜನಾತ್ಮಕ ವಿನ್ಯಾಸ ಮತ್ತು ಕಲೆ ರೂಪಿಸುವುದೋ ಅಥವಾ ಜನರಿಗೆ ಮಾರ್ಗದರ್ಶನ ನೀಡಿ ಸಮುದಾಯ ಸೇವೆ ಮಾಡುವುದೋ?',
  },
  holland_3: {
    en: 'In a college business fest, would you rather pitch to investors and lead promotions, or manage budgets, accounts, and logistical coordination?',
    hi: 'कॉलेज के बिजनेस फेस्ट में आप क्या चुनेंगे: निवेशकों को आकर्षित करना और प्रचार का नेतृत्व करना, या बजट, खातों और व्यवस्था का प्रबंधन करना?',
    kn: 'ವ್ಯಾಪಾರ ಮೇಳದಲ್ಲಿ ನೀವು ಯಾವ ಜವಾಬ್ದಾರಿ ವಹಿಸಲು ಬಯಸುತ್ತೀರಿ: ಹೂಡಿಕೆದಾರರನ್ನು ಸೆಳೆಯುವುದು ಮತ್ತು ಪ್ರಚಾರ ಮುನ್ನಡೆಸುವುದೋ ಅಥವಾ ಆಯವ್ಯಯ ಮತ್ತು ವ್ಯವಸ್ಥಿತ ನಿರ್ವಹಣೆಯೋ?',
  },
  holland_4: {
    en: 'Looking 5 years into the future, which achievement brings you deeper pride: building an innovative product or startup, or becoming a trusted mentor known for quality and ethics?',
    hi: 'भविष्य में 5 साल बाद, कौन सी उपलब्धि आपको अधिक गर्व देगी: एक नया उत्पाद या स्टार्टअप बनाना, या एक प्रतिष्ठित विशेषज्ञ व मार्गदर्शक बनना?',
    kn: 'ಮುಂದಿನ 5 ವರ್ಷಗಳಲ್ಲಿ ಯಾವ ಸಾಧನೆ ನಿಮಗೆ ಹೆಮ್ಮೆ ತರುತ್ತದೆ: ಹೊಸ ತಂತ್ರಜ್ಞಾನ ಉತ್ಪನ್ನ ಅಥವಾ ಸ್ಟಾರ್ಟಪ್ ಕಟ್ಟುವುದು ಅಥವಾ ನೈತಿಕ ಮಾರ್ಗದರ್ಶಕ ಪರಿಣಿತರಾಗುವುದು?',
  },

  // --------------------------------------------------------------------------
  // CLASSICAL DILEMMA TRACK (q1 to q5)
  // --------------------------------------------------------------------------
  q1: {
    en: 'A big executive demo starts in 30 minutes, but the dashboard is running very slowly. You can restart the cache to temporarily hide the problem (with risk of bad data later), or redirect queries to a backup server and inform the demo lead about a slight delay. What would you do?',
    hi: '30 मिनट में एक महत्वपूर्ण डेमो शुरू होना है, लेकिन सिस्टम बहुत धीमा हो गया है। आप कैश रीस्टार्ट करके समस्या को कुछ देर छिपा सकते हैं (जिससे बाद में डेटा गलत हो सकता है), या बैकअप सर्वर पर ट्रैफिक भेजकर डेमो लीडर को संभावित देरी की जानकारी दे सकते हैं। आप क्या करेंगे?',
    kn: 'ಪ್ರಮುಖ ಡೆಮೊ ಪ್ರಾರಂಭವಾಗಲು 30 ನಿಮಿಷಗಳಿವೆ, ಆದರೆ ಸಿಸ್ಟಮ್ ತುಂಬಾ ನಿಧಾನವಾಗಿದೆ. ತಾತ್ಕಾಲಿಕ ಮರುಪ್ರಾರಂಭದ ಮೂಲಕ ಸಮಸ್ಯೆಯನ್ನು ಮರೆಮಾಡಬಹುದು (ನಂತರ ಡೇಟಾ ದೋಷದ ಅಪಾಯವಿದೆ), ಅಥವಾ ಬ್ಯಾಕಪ್ ಸರ್ವರ್‌ಗೆ ವರ್ಗಾಯಿಸಿ ಡೆಮೊ ತಂಡಕ್ಕೆ ಮುಂಚಿತವಾಗಿ ತಿಳಿಸಬಹುದು. ನೀವು ಏನು ಮಾಡುತ್ತೀರಿ?',
  },
  q2: {
    en: 'Just 4 days before a scheduled release, the Product Manager asks to add a new checkout feature. Your analysis shows an 80% risk that mobile payments will break. How do you handle this request?',
    hi: 'रिलीज से सिर्फ 4 दिन पहले, प्रोडक्ट मैनेजर एक नया पेमेंट फीचर जोड़ने का अनुरोध करते हैं। आपके विश्लेषण के अनुसार इससे मोबाइल पेमेंट फेल होने का 80% जोखिम है। आप इस स्थिति से कैसे निपटेंगे?',
    kn: 'ಬಿಡುಗಡೆಗೆ ಕೇವಲ 4 ದಿನಗಳ ಮೊದಲು ಹೊಸ ವೈಶಿಷ್ಟ್ಯ ಸೇರಿಸಲು ಬೇಡಿಕೆ ಬರುತ್ತದೆ. ಆದರೆ ಇದರಿಂದ ಮೊಬೈಲ್ ಪಾವತಿಯಲ್ಲಿ 80% ದೋಷ ಉಂಟಾಗುವ ಅಪಾಯವಿದೆ. ನೀವು ಈ ವಿನಂತಿಯನ್ನು ಹೇಗೆ ನಿಭಾಯಿಸುತ್ತೀರಿ?',
  },
  q3: {
    en: 'A subtle race condition bug that you approved during code review slipped into production and affected 120 users. How do you respond and take accountability?',
    hi: 'कोड समीक्षा के दौरान आपसे छूटा हुआ एक बग लाइव सिस्टम में चला गया और 120 उपयोगकर्ताओं को प्रभावित किया। आप इसकी जिम्मेदारी कैसे लेंगे और क्या कदम उठाएंगे?',
    kn: 'ಕೋಡ್ ಪರಿಶೀಲನೆಯಲ್ಲಿ ನಿಮ್ಮ ಗಮನಕ್ಕೆ ಬಾರದ ಒಂದು ದೋಷವು ಲೈವ್ ಸಿಸ್ಟಮ್‌ನಲ್ಲಿ ಕಾಣಿಸಿಕೊಂಡು 120 ಬಳಕೆದಾರರ ಮೇಲೆ ಪರಿಣಾಮ ಬೀರಿದೆ. ನೀವು ಇದಕ್ಕೆ ಹೇಗೆ ಜವಾಬ್ದಾರಿ ತೆಗೆದುಕೊಳ್ಳುತ್ತೀರಿ?',
  },
  q4: {
    en: 'Midway through an urgent quarterly sprint, a surprise data regulation rule forces your team to redesign the auth system. How do you adjust priorities and help the team adapt?',
    hi: 'अति-महत्वपूर्ण तिमाही काम के बीच में, एक नए सरकारी डेटा नियम के कारण आपकी टीम को ऑथेंटिकेशन सिस्टम फिर से डिजाइन करना पड़ रहा है। आप प्राथमिकताओं को कैसे संतुलित करेंगे?',
    kn: 'ತುರ್ತು ಕಾರ್ಯದ ನಡುವೆ, ಹೊಸ ಡೇಟಾ ನಿಯಮದ ಕಾರಣದಿಂದ ಲಾಗಿನ್ ಸಿಸ್ಟಮ್ ಅನ್ನು ಮರುವಿನ್ಯಾಸಗೊಳಿಸಬೇಕಾಗಿದೆ. ನೀವು ಆದ್ಯತೆಗಳನ್ನು ಹೇಗೆ ಹೊಂದಿಸುತ್ತೀರಿ?',
  },
  q5: {
    en: 'You have a high-priority deadline to fix an enterprise security issue affecting 500,000 users, but your team has also received 4 urgent customer escalation tickets today. How do you decide what to do first?',
    hi: '500,000 उपयोगकर्ताओं की सुरक्षा के लिए एक महत्वपूर्ण समय-सीमा है, लेकिन आज 4 जरूरी ग्राहक शिकायतें भी आई हैं। आप पहले क्या करेंगे और कैसे फैसला लेंगे?',
    kn: '500,000 ಬಳಕೆದಾರರ ಸುರಕ್ಷತೆಗೆ ಪ್ರಮುಖ ಗಡುವು ಇದೆ, ಆದರೆ ಇಂದು 4 ತುರ್ತು ಗ್ರಾಹಕ ಟಿಕೆಟ್‌ಗಳು ಕೂಡ ಬಂದಿವೆ. ನೀವು ಮೊದಲು ಯಾವುದನ್ನು ಆರಿಸುತ್ತೀರಿ?',
  },
};

export function getSimplifiedQuestionInfo(
  q: IDualPaneQuestion,
  lang: 'en' | 'hi' | 'kn' = 'en'
): SimplifiedQuestionInfo {
  const content = q[lang] || q.en;

  // 1. If question explicitly has inline simplifiedScenario and simplifiedPrompt
  if (content.simplifiedScenario || content.simplifiedPrompt) {
    const optionMap: Record<string, string> = {};
    if (content.mcqOptions && content.mcqOptions.length > 0) {
      content.mcqOptions.forEach((opt) => {
        if (opt.simplifiedText) {
          optionMap[opt.id] = opt.simplifiedText;
        }
      });
    }

    return {
      scenarioTitle:
        lang === 'kn'
          ? '💡 ಸರಳ ವಿವರಣೆ (ಸರಳ ಭಾಷೆಯಲ್ಲಿ)'
          : lang === 'hi'
          ? '💡 सरल भाषा में समझें'
          : '💡 In Plain & Simple Words',
      scenarioSummary: content.simplifiedScenario || content.scenario,
      subjectivePromptTitle:
        lang === 'kn'
          ? '✍️ ಇಲ್ಲಿ ಏನು ಬರೆಯಬೇಕು?'
          : lang === 'hi'
          ? '✍️ यहाँ क्या लिखना है?'
          : '✍️ What to write in this section:',
      subjectivePromptGuide: content.simplifiedPrompt || content.writtenPrompt,
      simplifiedOptions: Object.keys(optionMap).length > 0 ? optionMap : undefined,
    };
  }

  // Common Likert Options in plain everyday language
  const likertMapEn: Record<string, string> = {
    '1': '1 • Definitely NOT like me (Strongly Disagree)',
    '2': '2 • Rarely like me (Disagree)',
    '3': '3 • Sometimes / Situational (Neutral)',
    '4': '4 • Mostly like me (Agree)',
    '5': '5 • Definitely ME (Strongly Agree)',
  };
  const likertMapHi: Record<string, string> = {
    '1': '1 • मेरे जैसा बिल्कुल नहीं (दृढ़ता से असहमत)',
    '2': '2 • कभी-कभार मेरे जैसा (असहमत)',
    '3': '3 • कभी-कभी / परिस्थिति पर निर्भर (तटस्थ)',
    '4': '4 • आमतौर पर मेरे जैसा (सहमत)',
    '5': '5 • पूरी तरह मेरे जैसा (दृढ़ता से सहमत)',
  };
  const likertMapKn: Record<string, string> = {
    '1': '1 • ಖಂಡಿತ ನನ್ನದಲ್ಲ (ಸಂಪೂರ್ಣ ಅಸಮ್ಮತಿ)',
    '2': '2 • ಅಪರೂಪಕ್ಕೆ ಮಾತ್ರ (ಅಸಮ್ಮತಿ)',
    '3': '3 • ಕೆಲವೊಮ್ಮೆ / ಸಂದರ್ಭಕ್ಕೆ ತಕ್ಕಂತೆ (ತಟಸ್ಥ)',
    '4': '4 • ಸಾಮಾನ್ಯವಾಗಿ ನನ್ನದೇ ಸ್ವಭಾವ (ಸಮ್ಮತಿ)',
    '5': '5 • ಖಂಡಿತ ಪೂರ್ಣವಾಗಿ ನನ್ನದೇ ಸ್ವಭಾವ (ಸಂಪೂರ್ಣ ಸಮ್ಮತಿ)',
  };

  // Check if we have a tailored entry for this question ID in our dictionary
  const specificEntry = SIMPLIFIED_QUESTION_MAP[q.questionId];
  const specificText = specificEntry ? specificEntry[lang] || specificEntry.en : undefined;

  // 2. OCEAN (Big Five) Likert Scale Questions
  if (q.category === 'ocean' || q.questionType === 'likert') {
    const sub = (q.subCategory || '').toLowerCase();
    const comp = (q.competencyKey || '').toLowerCase();

    let enSimple = 'How accurately does this statement describe your natural behavior at work? Tap 1 if it is completely opposite to you, or 5 if it describes you perfectly.';
    let hiSimple = 'यह वाक्य काम के दौरान आपके स्वाभाविक व्यवहार को कितना दर्शाता है? 1 चुनें यदि यह आपके विपरीत है, या 5 चुनें यदि यह पूरी तरह आपका स्वभाव है।';
    let knSimple = 'ಈ ವಾಕ್ಯವು ಕೆಲಸದ ಸ್ಥಳದಲ್ಲಿ ನಿಮ್ಮ ಸ್ವಭಾವವನ್ನು ಎಷ್ಟು ನಿಖರವಾಗಿ ವಿವರಿಸುತ್ತದೆ? ಇದು ನಿಮ್ಮದಲ್ಲ ಎಂದಾದರೆ 1 ಆಯ್ಕೆಮಾಡಿ, ಸಂಪೂರ್ಣ ನಿಮ್ಮದೇ ಸ್ವಭಾವ ಎಂದಾದರೆ 5 ಆಯ್ಕೆಮಾಡಿ.';

    if (comp.includes('openness') || sub.includes('openness')) {
      enSimple = 'Do you naturally like trying out brand new tools, experimenting with creative ideas, and exploring unfamiliar topics?';
      hiSimple = 'क्या आपको नए टूल्स आजमाना, नए विचारों पर प्रयोग करना और नई चीजें सीखना स्वाभाविक रूप से पसंद है?';
      knSimple = 'ಹೊಸ ತಂತ್ರಜ್ಞಾನಗಳು ಮತ್ತು ಹೊಸ ಆಲೋಚನೆಗಳನ್ನು ಪ್ರಯೋಗಿಸಲು ನೀವು ಇಷ್ಟಪಡುತ್ತೀರಾ?';
    } else if (comp.includes('conscientiousness') || sub.includes('conscientiousness')) {
      enSimple = 'How disciplined and organized are you when creating plans, paying attention to small details, and finishing tasks before deadlines?';
      hiSimple = 'क्या आप योजनाओं को व्यवस्थित रखने, बारीकियों पर ध्यान देने और समय सीमा से पहले काम पूरा करने में अनुशासित हैं?';
      knSimple = 'ಯೋಜನೆಗಳನ್ನು ವ್ಯವಸ್ಥಿತವಾಗಿ ರೂಪಿಸುವಲ್ಲಿ ಮತ್ತು ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ಕೆಲಸ ಪೂರ್ಣಗೊಳಿಸುವಲ್ಲಿ ನೀವು ಎಷ್ಟು ಶಿಸ್ತುಬದ್ಧರಾಗಿದ್ದೀರಿ?';
    } else if (comp.includes('extraversion') || sub.includes('extraversion')) {
      enSimple = 'Do you feel energized speaking up in meetings, presenting ideas to crowds, and working closely with large groups of people?';
      hiSimple = 'क्या आपको बैठकों में खुलकर अपनी बात रखने, लोगों के सामने बोलने और टीम के साथ मिलकर काम करने में ऊर्जा मिलती है?';
      knSimple = 'ಗುಂಪಿನಲ್ಲಿ ಚರ್ಚಿಸಲು, ಸಭೆಗಳಲ್ಲಿ ಮುಕ್ತವಾಗಿ ಮಾತನಾಡಲು ಮತ್ತು ಇತರರೊಂದಿಗೆ ಸಂವಹನ ನಡೆಸಲು ನೀವು ಇಷ್ಟಪಡುತ್ತೀರಾ?';
    } else if (comp.includes('agreeableness') || sub.includes('agreeableness')) {
      enSimple = 'How easily do you listen with empathy, forgive honest mistakes, help teammates without being asked, and resolve disagreements peacefully?';
      hiSimple = 'क्या आप दूसरों की बातों को ध्यान से सुनते हैं, गलतियों को माफ करते हैं और टीम के सदस्यों की बिना कहे मदद करते हैं?';
      knSimple = 'ಸಹೋದ್ಯೋಗಿಗಳ ಮಾತನ್ನು ಸಮಾಧಾನದಿಂದ ಆಲಿಸಲು ಮತ್ತು ಸಂಘರ್ಷವಿಲ್ಲದೆ ಶಾಂತವಾಗಿ ಕೆಲಸ ಮಾಡಲು ನೀವು ಆದ್ಯತೆ ನೀಡುತ್ತೀರಾ?';
    } else if (comp.includes('neuroticism') || comp.includes('emotional') || sub.includes('emotional')) {
      enSimple = 'When unexpected emergencies erupt and work pressure is high, do you stay calm and composed without getting overwhelmed?';
      hiSimple = 'जब काम का भारी दबाव हो या अचानक कोई संकट आ जाए, तो क्या आप शांत और स्थिर रहकर निर्णय ले पाते हैं?';
      knSimple = 'ಕಠಿಣ ಒತ್ತಡದ ಸಂದರ್ಭದಲ್ಲಿ ಅಥವಾ ಆಕಸ್ಮಿಕ ಸಮಸ್ಯೆಗಳು ಎದುರಾದಾಗ ನೀವು ಶಾಂತವಾಗಿ ನಿಯಂತ್ರಣ ಕಾಯ್ದುಕೊಳ್ಳುತ್ತೀರಾ?';
    }

    const finalScenarioSummary = specificText || (lang === 'kn' ? knSimple : lang === 'hi' ? hiSimple : enSimple);
    const isMandatory = q.isRationaleRequired || q.questionId.endsWith('6');

    return {
      scenarioTitle:
        lang === 'kn' ? '💡 ಸರಳ ವಿವರಣೆ' : lang === 'hi' ? '💡 सरल भाषा में समझें' : '💡 In Simple Terms',
      scenarioSummary: finalScenarioSummary,
      simplifiedOptions: lang === 'kn' ? likertMapKn : lang === 'hi' ? likertMapHi : likertMapEn,
      subjectivePromptTitle: isMandatory
        ? (lang === 'kn' ? '✍️ ನೈಜ ಅನುಭವದ ಉದಾಹರಣೆ (ಕಡ್ಡಾಯ)' : lang === 'hi' ? '✍️ वास्तविक अनुभव का उदाहरण (अनिवार्य)' : '✍️ Real-World Experience (Mandatory)')
        : (lang === 'kn' ? '✍️ ನಿಮ್ಮ ಕಾರಣ (ಐಚ್ಛಿಕ)' : lang === 'hi' ? '✍️ आपकी वजह (वैकल्पिक)' : '✍️ Your Reasoning (Optional)'),
      subjectivePromptGuide: isMandatory
        ? (lang === 'kn'
            ? 'ಸರಳವಾಗಿ ಬರೆಯಿರಿ: ಈ ಪರಿಸ್ಥಿತಿ ಯಾವಾಗ ಸಂಭವಿಸಿತು, ಸವಾಲು ಏನಾಗಿತ್ತು, ನೀವು ಏನು ಮಾಡಿದಿರಿ ಮತ್ತು ಅಂತಿಮ ಫಲಿತಾಂಶವೇನಾಯಿತು?'
            : lang === 'hi'
            ? 'सरल भाषा में लिखें: यह परिस्थिति कब आई थी, क्या चुनौती थी, आपने क्या किया और उसका क्या परिणाम निकला?'
            : 'Share in simple words: What was the real situation, what challenge did you face, what action did you take, and what was the outcome?')
        : (lang === 'kn'
            ? 'ಐಚ್ಛಿಕ: ನೀವು ಬಯಸಿದರೆ ನಿಮ್ಮ ರೇಟಿಂಗ್‌ಗೆ ಕಾರಣವನ್ನು ಸಂಕ್ಷಿಪ್ತವಾಗಿ 1-2 ವಾಕ್ಯಗಳಲ್ಲಿ ಬರೆಯಬಹುದು.'
            : lang === 'hi'
            ? 'वैकल्पिक: यदि आप चाहें तो 1-2 वाक्यों में लिख सकते हैं कि आपने यह रेटिंग क्यों चुनी।'
            : 'Optional: If you wish, briefly write in 1–2 sentences why you chose this rating.'),
    };
  }

  // 3. STAR Subjective Questions (Situation, Task, Action, Result)
  if (q.category === 'star' || q.questionType === 'subjective_star') {
    const qId = q.questionId.toLowerCase();

    if (qId.includes('_s') || q.competencyKey.includes('situation')) {
      return {
        scenarioTitle:
          lang === 'kn'
            ? '💡 ಸನ್ನಿವೇಶದ ಸಾರಾಂಶ (Crisis Dilemma)'
            : lang === 'hi'
            ? '💡 संकट का सरल सार (Crisis Scenario)'
            : '💡 Incident Context (What is happening)',
        scenarioSummary:
          lang === 'kn'
            ? 'ಸಂಸ್ಥೆಯ ಮುಖ್ಯ ಸಾಫ್ಟ್‌ವೇರ್ ವ್ಯವಸ್ಥೆಯಲ್ಲಿ ದೊಡ್ಡ ಆಕಸ್ಮಿಕ ವೈಫಲ್ಯ ಸಂಭವಿಸಿದೆ. ಕ್ಲೈಂಟ್ ಒತ್ತಡ ಮತ್ತು ಡೇಟಾ ಸುರಕ್ಷತೆಯ ನಡುವೆ ಕಠಿಣ ಸವಾಲು ಎದುರಾಗಿದೆ.'
            : lang === 'hi'
            ? 'कंपनी के मुख्य सिस्टम में भारी तकनीकी समस्या आ गई है। क्लाइंट के दबाव और डेटा सुरक्षा के बीच एक गंभीर निर्णय लेना है।'
            : 'A critical system breakdown has hit the platform right before peak business hours. You face a high-stakes trade-off between rushing a quick fix versus protecting data security.',
        subjectivePromptTitle:
          lang === 'kn'
            ? '✍️ ಹಂತ 1: ಸನ್ನಿವೇಶವನ್ನು ವಿವರಿಸಿ (Situation)'
            : lang === 'hi'
            ? '✍️ चरण 1: परिस्थिति का विवरण (Situation)'
            : '✍️ Step 1: Explain the Situation in Simple Words',
        subjectivePromptGuide:
          lang === 'kn'
            ? 'ಇಲ್ಲಿ ಏನು ಬರೆಯಬೇಕು: 2-3 ಸಾಲುಗಳಲ್ಲಿ ಮುಖ್ಯ ಸಮಸ್ಯೆ ಏನು? ಏನು ಹಾಳಾಯಿತು ಮತ್ತು ಇದರಿಂದ ಸಂಸ್ಥೆಗೆ ಉಂಟಾಗಬಹುದಾದ ದೊಡ್ಡ ಅಪಾಯವೇನು ಎಂಬುದನ್ನು ವಿವರಿಸಿ.'
            : lang === 'hi'
            ? 'यहाँ क्या लिखना है: 2-3 सरल वाक्यों में बताएं कि मुख्य समस्या क्या थी, क्या खराब हुआ और इसका कंपनी पर क्या बुरा असर हो सकता था।'
            : 'In 2–3 clear sentences, explain what broke, who was impacted, and why this was a major emergency for the company.',
        helpfulQuestions:
          lang === 'kn'
            ? ['ಮುಖ್ಯ ಸಮಸ್ಯೆ ಅಥವಾ ವೈಫಲ್ಯ ಏನು?', 'ಯಾವ ಸಂಸ್ಥೆಯ ಅಪಾಯ ಎದುರಾಗಿತ್ತು?', 'ತಕ್ಷಣದ ತುರ್ತು ಸವಾಲು ಯಾವುದು?']
            : lang === 'hi'
            ? ['मुख्य समस्या या रुकावट क्या थी?', 'कंपनी या ग्राहकों के लिए क्या बड़ा खतरा था?', 'इसको तुरंत सुलझाना क्यों जरूरी था?']
            : ['What was the root breakdown or conflict?', 'What severe risk did the company face?', 'Why was immediate action required?'],
      };
    }

    if (qId.includes('_t') || q.competencyKey.includes('task')) {
      return {
        scenarioTitle:
          lang === 'kn' ? '💡 ಸನ್ನಿವೇಶ' : lang === 'hi' ? '💡 संदर्भ' : '💡 Context Refresher',
        scenarioSummary:
          lang === 'kn'
            ? 'ಅದೇ ಸನ್ನಿವೇಶ: ವೈಫಲ್ಯದ ನಡುವೆ ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಹೊಣೆಗಾರಿಕೆ.'
            : lang === 'hi'
            ? 'वही परिस्थिति: संकट के बीच आपकी व्यक्तिगत जिम्मेदारी।'
            : 'Continuing the same incident: Focus on your personal mission and non-negotiable boundaries.',
        subjectivePromptTitle:
          lang === 'kn'
            ? '✍️ ಹಂತ 2: ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಜವಾಬ್ದಾರಿ (Task)'
            : lang === 'hi'
            ? '✍️ चरण 2: आपकी व्यक्तिगत जिम्मेदारी (Task)'
            : '✍️ Step 2: Define your Task in Simple Words',
        subjectivePromptGuide:
          lang === 'kn'
            ? 'ಇಲ್ಲಿ ಏನು ಬರೆಯಬೇಕು: ಈ ಪರಿಸ್ಥಿತಿಯಲ್ಲಿ ನಿಮ್ಮ ನೇರ ಜವಾಬ್ದಾರಿ ಏನು? ನೀವು ರಕ್ಷಿಸಲು ನಿರ್ಧರಿಸಿದ ಪ್ರಮುಖ ಗಡಿ (ಉದಾ: ಡೇಟಾ ಸುರಕ್ಷತೆ) ಯಾವುದು?'
            : lang === 'hi'
            ? 'यहाँ क्या लिखना है: इस समस्या में आपकी अपनी भूमिका क्या थी? आप किस मुख्य मानक (जैसे डेटा अखंडता) से बिल्कुल समझौता नहीं करने वाले थे?'
            : 'What was YOUR specific mission to solve? What core priority (e.g. data safety vs short-term uptime) did you personally take ownership of upholding?',
        helpfulQuestions:
          lang === 'kn'
            ? ['ನಿಮ್ಮ ನಿರ್ದಿಷ್ಟ ಪಾತ್ರವೇನು?', 'ಯಾವ ಮುಖ್ಯ ಗುರಿಯನ್ನು ನೀವು ಹೊಣೆಗಾರರಾಗಿ ತೆಗೆದುಕೊಂಡಿರಿ?', 'ಯಾವುದರೊಂದಿಗೆ ನೀವು ರಾಜಿ ಮಾಡಿಕೊಳ್ಳಲಿಲ್ಲ?']
            : lang === 'hi'
            ? ['आपकी व्यक्तिगत जिम्मेदारी क्या थी?', 'आपका मुख्य लक्ष्य क्या था?', 'किस मानक पर आप अडिग रहे?']
            : ['What was your exact job in this crisis?', 'What clear objective did you own?', 'What rule or standard would you never compromise on?'],
      };
    }

    if (qId.includes('_a') || q.competencyKey.includes('action')) {
      return {
        scenarioTitle:
          lang === 'kn' ? '💡 ಸನ್ನಿವೇಶ' : lang === 'hi' ? '💡 संदर्भ' : '💡 Context Refresher',
        scenarioSummary:
          lang === 'kn'
            ? 'ಅದೇ ಸನ್ನಿವೇಶ: ನೀವು ಕೈಗೊಂಡ ನಿರ್ದಿಷ್ಟ ಕ್ರಮಗಳು ಮತ್ತು ನಿರ್ಧಾರಗಳು.'
            : lang === 'hi'
            ? 'वही परिस्थिति: आपके द्वारा उठाए गए ठोस कदम।'
            : 'Continuing the same incident: Focus on your actual actions and leadership under pressure.',
        subjectivePromptTitle:
          lang === 'kn'
            ? '✍️ ಹಂತ 3: ನೀವು ಕೈಗೊಂಡ ಕ್ರಮಗಳು (Action)'
            : lang === 'hi'
            ? '✍️ चरण 3: आपके द्वारा उठाए गए कदम (Action)'
            : '✍️ Step 3: Explain your Action in Simple Words',
        subjectivePromptGuide:
          lang === 'kn'
            ? 'ಇಲ್ಲಿ ಏನು ಬರೆಯಬೇಕು: ಹಂತ-ಹಂತವಾಗಿ ನೀವು ಏನು ಮಾಡಿದಿರಿ? ತಂಡವನ್ನು ಹೇಗೆ ಮುನ್ನಡೆಸಿದಿರಿ ಮತ್ತು ಭಿನ್ನಾಭಿಪ್ರಾಯಗಳನ್ನು ಹೇಗೆ ಪರಿಹರಿಸಿದಿರಿ?'
            : lang === 'hi'
            ? 'यहाँ क्या लिखना है: आपने चरण-दर-चरण क्या कदम उठाए? टीम और अधिकारियों से कैसे बात की और मतभेदों को कैसे सुलझाया?'
            : 'Explain step-by-step what concrete actions YOU took. How did you coordinate the team, prioritize tasks, and manage stakeholders who were pushing for conflicting outcomes?',
        helpfulQuestions:
          lang === 'kn'
            ? ['ಮೊದಲು, ನಂತರ ನೀವು ಕೈಗೊಂಡ ಕ್ರಮಗಳೇನು?', 'ಸಹೋದ್ಯೋಗಿಗಳನ್ನು ಹೇಗೆ ನಿರ್ವಹಿಸಿದಿರಿ?', 'ಒತ್ತಡದ ಸಮಯದಲ್ಲಿ ಹೇಗೆ ನಿರ್ಧಾರ ಮಾಡಿದಿರಿ?']
            : lang === 'hi'
            ? ['आपने पहले और बाद में क्या ठोस कदम उठाए?', 'सरोकारों और मतभेदों को कैसे संभाला?', 'दबाव में सही निर्णय कैसे लिया?']
            : ['What specific steps did you execute first and next?', 'How did you communicate with anxious stakeholders?', 'How did you resolve trade-offs?'],
      };
    }

    if (qId.includes('_r') || q.competencyKey.includes('result')) {
      return {
        scenarioTitle:
          lang === 'kn' ? '💡 ಸನ್ನಿವೇಶ' : lang === 'hi' ? '💡 संदर्भ' : '💡 Context Refresher',
        scenarioSummary:
          lang === 'kn'
            ? 'ಅದೇ ಸನ್ನಿವೇಶ: ಅಂತಿಮ ಫಲಿತಾಂಶ ಮತ್ತು ಕಲಿಕೆ.'
            : lang === 'hi'
            ? 'वही परिस्थिति: अंतिम परिणाम और सीख।'
            : 'Continuing the same incident: Focus on final outcomes and lasting prevention.',
        subjectivePromptTitle:
          lang === 'kn'
            ? '✍️ ಹಂತ 4: ಅಂತಿಮ ಫಲಿತಾಂಶ ಮತ್ತು ಕಲಿಕೆ (Result)'
            : lang === 'hi'
            ? '✍️ चरण 4: अंतिम परिणाम और सीख (Result)'
            : '✍️ Step 4: Share the Result in Simple Words',
        subjectivePromptGuide:
          lang === 'kn'
            ? 'ಇಲ್ಲಿ ಏನು ಬರೆಯಬೇಕು: ಕೊನೆಗೆ ಏನಾಯಿತು? ಸಂಸ್ಥೆಗೆ ದೊರೆತ ಸ್ಪಷ್ಟ ಪ್ರಯೋಜನವೇನು ಮತ್ತು ಭವಿಷ್ಯದಲ್ಲಿ ಇದು ಮರುಕಳಿಸದಂತೆ ಯಾವ ಶಾಶ್ವತ ಪರಿಹಾರವನ್ನು ಜಾರಿಗೆ ತಂದಿರಿ?'
            : lang === 'hi'
            ? 'यहाँ क्या लिखना है: अंत में क्या हुआ? कंपनी को क्या स्पष्ट फायदा हुआ और भविष्य में ऐसा संकट दोबारा न आए इसके लिए आपने क्या स्थायी सुधार किए?'
            : 'What was the final tangible outcome? Did the system recover cleanly? And what permanent safeguard (e.g. automated tests, alert system, process update) did you build to prevent this forever?',
        helpfulQuestions:
          lang === 'kn'
            ? ['ಅಂತಿಮ ಫಲಿತಾಂಶವೇನು?', 'ಯಾವ ಶಾಶ್ವತ ಸುಧಾರಣೆಯನ್ನು ಜಾರಿಗೆ ತಂದಿರಿ?', 'ಇದರಿಂದ ಕಲಿತ ಮುಖ್ಯ ಪಾಠವೇನು?']
            : lang === 'hi'
            ? ['अंतिम परिणाम क्या रहा?', 'भविष्य के लिए क्या स्थायी व्यवस्था बनाई?', 'इससे क्या मुख्य सीख मिली?']
            : ['What was the measurable final outcome?', 'What permanent preventative mechanism did you put in place?', 'What key lessons were learned?'],
      };
    }
  }

  // 4. Student MBTI Questions
  if (q.category === 'mbti') {
    const sub = (q.subCategory || '').toLowerCase();
    const comp = (q.competencyKey || '').toLowerCase();

    let enSimple = 'Choose the option that feels most natural and comfortable to you. The explanation box on the right is optional.';
    let hiSimple = 'वह विकल्प चुनें जो आपके लिए सबसे स्वाभाविक और सहज हो। दाईं ओर व्याख्या लिखना वैकल्पिक है।';
    let knSimple = 'ನಿಮಗೆ ಹೆಚ್ಚು ಸಹಜವೆನಿಸುವ ಆಯ್ಕೆಯನ್ನು ಆರಿಸಿ. ಬಲಭಾಗದಲ್ಲಿ ವಿವರಣೆ ನೀಡುವುದು ಕಡ್ಡಾಯವಲ್ಲ.';

    if (comp.includes('energy') || sub.includes('extraversion')) {
      enSimple = 'When you need to brainstorm or solve a challenge, what recharges you more: bouncing spontaneous ideas in a lively group, or thinking quietly alone first?';
      hiSimple = 'जब आपको नए विचारों पर काम करना हो, तो आपको किससे अधिक ऊर्जा मिलती है: समूह में तुरंत चर्चा करने से, या पहले अकेले शांत बैठकर सोचने से?';
      knSimple = 'ಹೊಸ ಆಲೋಚನೆಗಳನ್ನು ಕಂಡುಕೊಳ್ಳುವಾಗ ನಿಮಗೆ ಯಾವುದು ಸುಲಭ: ಗುಂಪಿನಲ್ಲಿ ಮುಕ್ತವಾಗಿ ಚರ್ಚಿಸುವುದೇ ಅಥವಾ ಮೊದಲು ಒಂಟಿಯಾಗಿ ಶಾಂತವಾಗಿ ಯೋಚಿಸುವುದೇ?';
    } else if (comp.includes('information') || sub.includes('sensing')) {
      enSimple = 'When learning or building something new, do you prefer concrete practical facts right in front of you, or big-picture ideas and future possibilities?';
      hiSimple = 'नया काम करते समय आप किस पर अधिक भरोसा करते हैं: ठोस तथ्यों और वर्तमान वास्तविकता पर, या भविष्य की संभावनाओं और नए विचारों पर?';
      knSimple = 'ನೀವು ಹೊಸ ಕೆಲಸ ಮಾಡುವಾಗ ವಾಸ್ತವಿಕ ಸಂಗತಿಗಳಿಗೆ ಆದ್ಯತೆ ನೀಡುತ್ತೀರಾ ಅಥವಾ ಭವಿಷ್ಯದ ಹೊಸ ಸಾಧ್ಯತೆಗಳು ಮತ್ತು ಕಲ್ಪನೆಗಳಿಗೆ ಆದ್ಯತೆ ನೀಡುತ್ತೀರಾ?';
    } else if (comp.includes('decision') || sub.includes('thinking')) {
      enSimple = 'When making a tough decision, do you prioritize objective logic and consistency, or how the decision will impact people and relationships?';
      hiSimple = 'कठिन निर्णय लेते समय आप किसे प्राथमिकता देते हैं: निष्पक्ष तर्क और नियमों को, या लोगों की भावनाओं और रिश्तों को?';
      knSimple = 'ಕಠಿಣ ನಿರ್ಧಾರ ತೆಗೆದುಕೊಳ್ಳುವಾಗ ತಾರ್ಕಿಕ ಸತ್ಯಗಳಿಗೆ ಆದ್ಯತೆ ನೀಡುತ್ತೀರಾ ಅಥವಾ ಜನರ ಭಾವನೆಗಳು ಮತ್ತು ಸಂಬಂಧಗಳಿಗೆ ಆದ್ಯತೆ ನೀಡುತ್ತೀರಾ?';
    } else if (comp.includes('structure') || sub.includes('judging')) {
      enSimple = 'Do you prefer having a clear schedule with tasks planned in advance, or staying flexible and adapting spontaneously as things happen?';
      hiSimple = 'क्या आप पहले से तय योजना और दिनचर्या पसंद करते हैं, या परिस्थितियों के अनुसार लचीला रहकर काम करना पसंद करते हैं?';
      knSimple = 'ಮುಂಚಿತವಾಗಿ ಯೋಜಿಸಿದ ಸ್ಪಷ್ಟ ವೇಳಾಪಟ್ಟಿಯನ್ನು ಇಷ್ಟಪಡುತ್ತೀರಾ ಅಥವಾ ಸಂದರ್ಭಕ್ಕೆ ತಕ್ಕಂತೆ ಬದಲಾಗುವ ನಮ್ಯತೆಯನ್ನು ಇಷ್ಟಪಡುತ್ತೀರಾ?';
    }

    const finalSummary = specificText || (lang === 'kn' ? knSimple : lang === 'hi' ? hiSimple : enSimple);

    return {
      scenarioTitle:
        lang === 'kn' ? '💡 ಸರಳ ವಿವರಣೆ' : lang === 'hi' ? '💡 सरल भाषा में समझें' : '💡 In Simple Terms',
      scenarioSummary: finalSummary,
      subjectivePromptTitle:
        lang === 'kn' ? '✍️ ವಿವರಣೆ (ಐಚ್ಛಿಕ)' : lang === 'hi' ? '✍️ आपकी वजह (वैकल्पिक)' : '✍️ Why this choice fits you (Optional)',
      subjectivePromptGuide:
        lang === 'kn'
          ? 'ಇದು ಕಡ್ಡಾಯವಲ್ಲ. ನೀವು ಬಯಸಿದರೆ ಈ ಆಯ್ಕೆ ನಿಮ್ಮ ಸ್ವಭಾವಕ್ಕೆ ಹೇಗೆ ಹೊಂದಿಕೆಯಾಗುತ್ತದೆ ಎಂದು 1-2 ವಾಕ್ಯಗಳಲ್ಲಿ ಬರೆಯಬಹುದು.'
          : lang === 'hi'
          ? 'यह लिखना अनिवार्य नहीं है। यदि आप चाहें तो 1-2 वाक्यों में लिख सकते हैं कि यह विकल्प आपको क्यों सही लगा।'
          : 'This is not mandatory. If you wish, briefly write in 1–2 lines why this style feels more natural to you.',
    };
  }

  // 5. Student Holland (RIASEC) Questions
  if (q.category === 'holland') {
    const finalSummary =
      specificText ||
      (lang === 'kn'
        ? 'ದೀರ್ಘಾವಧಿಯಲ್ಲಿ ನಿಮಗೆ ಯಾವ ರೀತಿಯ ಚಟುವಟಿಕೆಗಳು ಹೆಚ್ಚು ಸಂತೋಷ ಮತ್ತು ಆಸಕ್ತಿಯನ್ನು ನೀಡುತ್ತವೆ ಎಂಬುದನ್ನು ಆರಿಸಿ.'
        : lang === 'hi'
        ? 'लंबे समय में आपको किस प्रकार के काम करने में सबसे अधिक आनंद और संतुष्टि मिलती है, उसे चुनें।'
        : 'Choose the career activities that genuinely spark your natural curiosity and passion. There are no right or wrong answers.');

    return {
      scenarioTitle:
        lang === 'kn' ? '💡 ವೃತ್ತಿ ಆಸಕ್ತಿಯ ವಿವರಣೆ' : lang === 'hi' ? '💡 करियर रुचि का सरल सार' : '💡 Career Interest Focus',
      scenarioSummary: finalSummary,
      subjectivePromptTitle:
        lang === 'kn' ? '✍️ ವಿವರಣೆ (ಐಚ್ಛಿಕ)' : lang === 'hi' ? '✍️ आपकी वजह (वैकब्लपक)' : '✍️ Optional Explanation',
      subjectivePromptGuide:
        lang === 'kn'
          ? 'ನಿಮಗೆ ಆಸಕ್ತಿ ಇದ್ದರೆ ಮಾತ್ರ 1 ಸಾಲಿನಲ್ಲಿ ನಿಮ್ಮ ಅಭಿಪ್ರಾಯವನ್ನು ಬರೆಯಿರಿ. ಇದು ಕಡ್ಡಾಯವಲ್ಲ.'
          : lang === 'hi'
          ? 'केवल अपनी इच्छा होने पर 1 वाक्य में लिखें। यह अनिवार्य नहीं है।'
          : 'Write a brief note if you want to elaborate on why this work style excites you. Completely optional.',
    };
  }

  // 6. Classical Case Studies & Default Fallback
  const finalSummary =
    specificText ||
    (lang === 'kn'
      ? 'ಈ ಸನ್ನಿವೇಶದಲ್ಲಿ ನಿಮ್ಮ ಮುಖ್ಯ ನಿರ್ಧಾರ ಮತ್ತು ಅದಕ್ಕೆ ತಕ್ಕ ಕಾರಣವನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ನೀಡಿ.'
      : lang === 'hi'
      ? 'इस परिस्थिति में आपका मुख्य निर्णय क्या होगा और उसका कारण क्या है, उसे स्पष्ट करें।'
      : 'Read the dilemma, pick the decision path you believe is most effective, and explain your reasoning simply on the right.');

  return {
    scenarioTitle:
      lang === 'kn' ? '💡 ಸನ್ನಿವೇಶದ ಸಾರಾಂಶ' : lang === 'hi' ? '💡 परिस्थिति का सरल सार' : '💡 Plain Summary',
    scenarioSummary: finalSummary,
    subjectivePromptTitle:
      lang === 'kn' ? '✍️ ನಿಮ್ಮ ಕಾರಣವನ್ನು ವಿವರಿಸಿ' : lang === 'hi' ? '✍️ अपना तर्क स्पष्ट करें' : '✍️ Explain your reasoning',
    subjectivePromptGuide:
      lang === 'kn'
        ? 'ನೀವು ಈ ಆಯ್ಕೆಯನ್ನು ಏಕೆ ಆರಿಸಿದಿರಿ ಮತ್ತು ಈ ನಿರ್ಧಾರದಿಂದ ಸಂಸ್ಥೆಗೆ ಹೇಗೆ ಪ್ರಯೋಜನವಾಗುತ್ತದೆ ಎಂದು ವಿವರಿಸಿ.'
        : lang === 'hi'
        ? 'आपने यह विकल्प क्यों चुना और इससे समस्या का समाधान कैसे होगा, इसे 2-3 वाक्यों में लिखें।'
        : 'In 2–3 sentences, explain why you picked this option and how it balances immediate urgency with long-term results.',
  };
}
