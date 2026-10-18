import { IDualPaneQuestion } from '@/models/Assessment';

export interface SimplifiedQuestionInfo {
  scenarioTitle: string;
  scenarioSummary: string;
  subjectivePromptTitle?: string;
  subjectivePromptGuide?: string;
  helpfulQuestions?: string[];
  simplifiedOptions?: Record<string, string>;
}

export function getSimplifiedQuestionInfo(
  q: IDualPaneQuestion,
  lang: 'en' | 'hi' | 'kn' = 'en'
): SimplifiedQuestionInfo {
  const content = q[lang] || q.en;

  // 1. If question explicitly has simplifiedScenario and simplifiedPrompt
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

    return {
      scenarioTitle:
        lang === 'kn' ? '💡 ಸರಳ ವಿವರಣೆ' : lang === 'hi' ? '💡 सरल भाषा में समझें' : '💡 In Simple Terms',
      scenarioSummary: lang === 'kn' ? knSimple : lang === 'hi' ? hiSimple : enSimple,
      simplifiedOptions: lang === 'kn' ? likertMapKn : lang === 'hi' ? likertMapHi : likertMapEn,
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

    return {
      scenarioTitle:
        lang === 'kn' ? '💡 ಸರಳ ವಿವರಣೆ' : lang === 'hi' ? '💡 सरल भाषा में समझें' : '💡 In Simple Terms',
      scenarioSummary: lang === 'kn' ? knSimple : lang === 'hi' ? hiSimple : enSimple,
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
    return {
      scenarioTitle:
        lang === 'kn' ? '💡 ವೃತ್ತಿ ಆಸಕ್ತಿಯ ವಿವರಣೆ' : lang === 'hi' ? '💡 करियर रुचि का सरल सार' : '💡 Career Interest Focus',
      scenarioSummary:
        lang === 'kn'
          ? 'ದೀರ್ಘಾವಧಿಯಲ್ಲಿ ನಿಮಗೆ ಯಾವ ರೀತಿಯ ಚಟುವಟಿಕೆಗಳು ಹೆಚ್ಚು ಸಂತೋಷ ಮತ್ತು ಆಸಕ್ತಿಯನ್ನು ನೀಡುತ್ತವೆ ಎಂಬುದನ್ನು ಆರಿಸಿ.'
          : lang === 'hi'
          ? 'लंबे समय में आपको किस प्रकार के काम करने में सबसे अधिक आनंद और संतुष्टि मिलती है, उसे चुनें।'
          : 'Choose the career activities that genuinely spark your natural curiosity and passion. There are no right or wrong answers.',
      subjectivePromptTitle:
        lang === 'kn' ? '✍️ ವಿವರಣೆ (ಐಚ್ಛಿಕ)' : lang === 'hi' ? '✍️ आपकी वजह (वैकल्पिक)' : '✍️ Optional Explanation',
      subjectivePromptGuide:
        lang === 'kn'
          ? 'ನಿಮಗೆ ಆಸಕ್ತಿ ಇದ್ದರೆ ಮಾತ್ರ 1 ಸಾಲಿನಲ್ಲಿ ನಿಮ್ಮ ಅಭಿಪ್ರಾಯವನ್ನು ಬರೆಯಿರಿ. ಇದು ಕಡ್ಡಾಯವಲ್ಲ.'
          : lang === 'hi'
          ? 'केवल अपनी इच्छा होने पर 1 वाक्य में लिखें। यह अनिवार्य नहीं है।'
          : 'Write a brief note if you want to elaborate on why this work style excites you. Completely optional.',
    };
  }

  // 6. Default Fallback for classical dual-pane questions
  return {
    scenarioTitle:
      lang === 'kn' ? '💡 ಸನ್ನಿವೇಶದ ಸಾರಾಂಶ' : lang === 'hi' ? '💡 परिस्थिति का सरल सार' : '💡 Plain Summary',
    scenarioSummary:
      lang === 'kn'
        ? 'ಈ ಸನ್ನಿವೇಶದಲ್ಲಿ ನಿಮ್ಮ ಮುಖ್ಯ ನಿರ್ಧಾರ ಮತ್ತು ಅದಕ್ಕೆ ತಕ್ಕ ಕಾರಣವನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ನೀಡಿ.'
        : lang === 'hi'
        ? 'इस परिस्थिति में आपका मुख्य निर्णय क्या होगा और उसका कारण क्या है, उसे स्पष्ट करें।'
        : 'Read the dilemma, pick the decision path you believe is most effective, and explain your reasoning simply on the right.',
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
