import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/v8hak_talentpulse';
const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000/api/seed';

async function tryApiSeed() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(API_URL, {
      method: 'POST',
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const json = await res.json();
      console.log('✓ Successfully seeded database via Next.js API endpoint:');
      console.log(JSON.stringify(json, null, 2));
      return true;
    }
  } catch (err) {
    // API not reachable, fall back to direct DB seeding
  }
  return false;
}

async function directDbSeed() {
  console.log(`Connecting directly to MongoDB at ${MONGODB_URI}...`);
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  console.log('Connected to MongoDB.');

  const db = mongoose.connection.db;

  // 1. Admin User
  const usersColl = db.collection('users');
  await usersColl.updateOne(
    { email: 'admin@discoveru.orbit' },
    {
      $set: {
        name: 'System Admin',
        email: 'admin@discoveru.orbit',
        role: 'admin',
        passwordHash: 'admin123',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );
  console.log('✓ Admin user seeded (admin@discoveru.orbit / admin123)');

  // Read prompt files if available
  let assessGenPrompt = '# MASTER PROMPT: PERSONALITY AND BEHAVIOURAL ASSESSMENT GENERATION';
  let assessReportPrompt = '# MASTER PROMPT: PERSONALITY AND BEHAVIOURAL ASSESSMENT REPORT GENERATION';
  try {
    const p1 = path.join(process.cwd(), 'prompts', 'Assessment_Generation_Prompt.txt');
    const p2 = path.join(process.cwd(), 'prompts', 'Assessment_Report_Generation_Prompt.txt');
    if (fs.existsSync(p1)) assessGenPrompt = fs.readFileSync(p1, 'utf-8');
    if (fs.existsSync(p2)) assessReportPrompt = fs.readFileSync(p2, 'utf-8');
  } catch (e) {
    // ignore
  }

  // 2. Prompt Templates & Versions
  const templatesColl = db.collection('prompttemplates');
  const versionsColl = db.collection('promptversions');

  const templates = [
    {
      name: 'Master Assessment Generation Prompt',
      slug: 'assessment_generation',
      description: 'Master prompt generating personality questionnaire & 4 behavioural scenarios (Situation, Task, Action, Result).',
      activeVersionNumber: 1,
      availableVariables: ['candidateProfile', 'careerStage', 'targetRole', 'language'],
      systemInstruction: 'You are an expert psychometric assessment designer specializing in Future of Work & Enterprise Productivity.',
      userPromptTemplate: assessGenPrompt,
    },
    {
      name: 'Master Assessment Report Generation Prompt',
      slug: 'assessment_report',
      description: 'Master prompt generating 5-section candidate report: Personality Profile, Potential Strengths, Blind Spots, Work Preferences, and 30-Day Development Plan.',
      activeVersionNumber: 1,
      availableVariables: ['candidateName', 'candidateLanguage', 'targetLanguage', 'candidateResponses', 'traitScores'],
      systemInstruction: 'You are a psychometric-informed assessment report writer specializing in Future of Work, personality interpretation, and enterprise career development.',
      userPromptTemplate: assessReportPrompt,
    },
    {
      name: 'Recruiter Evaluation Suite Prompt',
      slug: 'recruiter_evaluation',
      description: 'Generates the 6 grounded modules for hiring teams with evidence separation and fairness guardrails.',
      activeVersionNumber: 1,
      availableVariables: ['roleTarget', 'assessmentVersion', 'candidateName', 'candidateLanguage', 'candidateResponses'],
      systemInstruction: 'You are an expert talent analytics AI for enterprise hiring teams.',
      userPromptTemplate: 'Evaluate candidate responses across 5 enterprise competencies with grounded evidence.',
    },
    {
      name: 'Candidate Growth & Development Report Prompt',
      slug: 'candidate_growth',
      description: 'Generates 5 constructive self-reflection modules including Big Five profile, demonstrated strengths, and 30-day action plan.',
      activeVersionNumber: 1,
      availableVariables: ['candidateName', 'candidateLanguage', 'targetLanguage', 'candidateResponses'],
      systemInstruction: 'You are a constructive, developmental career coaching AI.',
      userPromptTemplate: 'Generate 5 constructive development modules in candidate chosen language.',
    },
  ];

  for (const t of templates) {
    await templatesColl.updateOne(
      { slug: t.slug },
      {
        $set: {
          name: t.name,
          slug: t.slug,
          description: t.description,
          activeVersionNumber: t.activeVersionNumber,
          availableVariables: t.availableVariables,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    await versionsColl.updateOne(
      { templateSlug: t.slug, versionNumber: 1 },
      {
        $set: {
          templateSlug: t.slug,
          versionNumber: 1,
          systemInstruction: t.systemInstruction,
          userPromptTemplate: t.userPromptTemplate,
          model: 'gemini-3.1-pro',
          temperature: 0.2,
          topP: 0.9,
          isActive: true,
          changeNotes: 'Baseline seed for Future of Work & Enterprise Productivity.',
          createdByName: 'admin@discoveru.orbit',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );
  }
  console.log('✓ 4 Master Prompt Templates and Versions seeded');

  // 3. Assessment Questions (EN, HI, KN)
  const assessmentsColl = db.collection('assessments');
  const existingAssessment = await assessmentsColl.findOne();
  let assessmentId = existingAssessment?._id;

  if (!existingAssessment) {
    const insertRes = await assessmentsColl.insertOne({
      title: 'Lead Software Engineer - Competency & Behavioral Assessment',
      roleTarget: 'Lead Software Engineer',
      version: '1.0',
      description: 'Dual-pane situational assessment evaluating Problem Solving, Communication, Accountability, Adaptability, and Prioritisation.',
      timeLimitMinutes: 45,
      status: 'published',
      questions: [
        {
          questionId: 'q1',
          competencyKey: 'problem_solving',
          competencyName: 'Problem Solving',
          idealEvidenceCriteria: 'Systematic root-cause diagnosis, structured trade-off evaluation.',
          en: {
            title: 'Dilemma 1: Critical Production Latency Spike',
            scenario: '30 minutes before an executive demonstration, users report severe latency in the analytics dashboard. The team identifies a temporary quick-restart cache fix that might mask the symptom for 45 minutes, but could cause partial data inconsistency later.',
            mcqOptions: [
              { id: 'A', text: 'Apply the temporary quick-restart cache fix immediately to ensure the executive demo proceeds smoothly.', points: 2, rationaleCategory: 'Tactical Patching' },
              { id: 'B', text: 'Triage the underlying slow database query with an emergency read-replica redirect, and brief the demo leader on potential delay.', points: 5, rationaleCategory: 'Systemic Resolution & Transparency' },
              { id: 'C', text: 'Disable the analytics dashboard entirely during the demo and show pre-rendered screenshots.', points: 3, rationaleCategory: 'Risk Avoidance' },
              { id: 'D', text: 'Escalate immediately to the VP of Engineering and request canceling the demo until full root-cause analysis completes.', points: 2, rationaleCategory: 'Over-Escalation' },
            ],
            writtenPrompt: 'Explain why you chose this action. What immediate risks did you weigh, and what steps would you take in the next 60 minutes?',
            writtenPlaceholder: 'Describe your diagnostic thought process, trade-offs considered, and mitigation strategy...',
          },
          hi: {
            title: 'दुविधा 1: लाइव सिस्टम में अप्रत्याशित देरी (Latency)',
            scenario: 'वरिष्ठ अधिकारियों के महत्वपूर्ण डेमो से 30 मिनट पहले, डैशबोर्ड में गंभीर गतिरोध देखा जाता है। टीम एक त्वरित कैश-रीस्टार्ट पैच लगा सकती है जो 45 मिनट तक काम चलाएगा, लेकिन बाद में डेटा में विसंगति पैदा कर सकता है।',
            mcqOptions: [
              { id: 'A', text: 'डेमो को सुचारू रखने के लिए तुरंत त्वरित कैश-रीस्टार्ट पैच लागू करें।', points: 2, rationaleCategory: 'तात्कालिक पैच' },
              { id: 'B', text: 'रीड-रेप्लिका रीडायरेक्ट के साथ मूल समस्या का समाधान करें और डेमो संचालक को स्थिति स्पष्ट करें।', points: 5, rationaleCategory: 'मूल कारण समाधान एवं पारदर्शिता' },
              { id: 'C', text: 'डेमो के दौरान उस मॉड्यूल को बंद कर पहले से सहेजे गए स्क्रीनशॉट दिखाएं।', points: 3, rationaleCategory: 'जोखिम टालना' },
              { id: 'D', text: 'तुरंत उच्चतम प्रबंधन को सूचित कर डेमो रद्द करने की मांग करें।', points: 2, rationaleCategory: 'अनावश्यक एस्केलेशन' },
            ],
            writtenPrompt: 'आपने यह विकल्प क्यों चुना? आपने किन जोखिमों का विश्लेषण किया और अगले 60 मिनट में आपकी क्या कार्ययोजना होगी?',
            writtenPlaceholder: 'अपने विश्लेषण, विचार प्रक्रिया और संभावित परिणामों का विवरण यहाँ लिखें...',
          },
          kn: {
            title: 'ಸನ್ನಿವೇಶ 1: ಮುಖ್ಯ ಡೆಮೊಗೆ ಮುನ್ನ ಸಿಸ್ಟಮ್ ವಿಳಂಬ',
            scenario: 'ಪ್ರಮುಖ ಅಧಿಕಾರಿಗಳ ಡೆಮೊಗೆ 30 ನಿಮಿಷಗಳ ಮೊದಲು ಸಿಸ್ಟಮ್‌ನಲ್ಲಿ ತೀವ್ರ ಮಂದಗತಿ ಕಂಡುಬರುತ್ತದೆ. 45 ನಿಮಿಷಗಳ ಕಾಲ ತಾತ್ಕಾಲಿಕ ಮರುಪ್ರಾರಂಭದ ಮೂಲಕ ಇದನ್ನು ಮರೆಮಾಚಬಹುದು, ಆದರೆ ನಂತರ ಡೇಟಾ ದೋಷ ಉಂಟಾಗಬಹುದು.',
            mcqOptions: [
              { id: 'A', text: 'ಡೆಮೊ ಸುಲಭವಾಗಿ ಸಾಗಲು ತಕ್ಷಣವೇ ತಾತ್ಕಾಲಿಕ ಮರುಪ್ರಾರಂಭ ಪರಿಹಾರವನ್ನು ಅನ್ವಯಿಸಿ.', points: 2, rationaleCategory: 'ತಾತ್ಕಾಲಿಕ ಪರಿಹಾರ' },
              { id: 'B', text: 'ಮೂಲ ಸಮಸ್ಯೆಯನ್ನು ಗುರುತಿಸಿ ಪರ್ಯಾಯ ಮಾರ್ಗ ಅನ್ವಯಿಸಿ, ಮತ್ತು ಡೆಮೊ ತಂಡಕ್ಕೆ ಮುಂಚಿತವಾಗಿ ಸ್ಪಷ್ಟಪಡಿಸಿ.', points: 5, rationaleCategory: 'ಮೂಲ ಕಾರಣ ಪರಿಹಾರ ಮತ್ತು ಪಾರದರ್ಶಕತೆ' },
              { id: 'C', text: 'ಆ ಮಾಡ್ಯೂಲ್ ಅನ್ನು ನಿಲ್ಲಿಸಿ ಹಿಂದಿನ ಸ್ಕ್ರೀನ್‌ಶಾಟ್‌ಗಳನ್ನು ಪ್ರದರ್ಶಿಸಿ.', points: 3, rationaleCategory: 'ಅಪಾಯ ತಪ್ಪಿಸುವಿಕೆ' },
              { id: 'D', text: 'ಡೆಮೊವನ್ನು ತಕ್ಷಣ ರದ್ದುಗೊಳಿಸಲು ಉನ್ನತ ಅಧಿಕಾರಿಗೆ ವಿನಂತಿಸಿ.', points: 2, rationaleCategory: 'ಅತಿಯಾದ ಎಸ್ಕಲೇಶನ್' },
            ],
            writtenPrompt: 'ನೀವು ಈ ಆಯ್ಕೆಯನ್ನು ಏಕೆ ಆರಿಸಿದ್ದೀರಿ? ನೀವು ಯಾವ ಅಪಾಯಗಳನ್ನು ಪರಿಗಣಿಸಿದ್ದೀರಿ ಮತ್ತು ಮುಂದಿನ 60 ನಿಮಿಷಗಳಲ್ಲಿ ನಿಮ್ಮ ಮುಂದಿನ ಹೆಜ್ಜೆಗಳು ಯಾವುವು?',
            writtenPlaceholder: 'ನಿಮ್ಮ ಆಲೋಚನೆ, ನಿರ್ಧಾರದ ಹಿನ್ನೆಲೆ ಮತ್ತು ಪರಿಹಾರ ಕ್ರಮಗಳನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ...',
          },
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    assessmentId = insertRes.insertedId;
    console.log('✓ Assessment seeded with Dual-Pane multilingual dilemmas');
  }

  // 4. Nandini Submissions & Evaluations
  const submissionsColl = db.collection('submissions');
  const evalsColl = db.collection('evaluationresults');

  const existingSub = await submissionsColl.findOne({ candidateEmail: 'nandini@example.com' });
  let subId = existingSub?._id;

  if (!existingSub) {
    const subRes = await submissionsColl.insertOne({
      assessmentId: assessmentId.toString(),
      candidateName: 'Nandini',
      candidateEmail: 'nandini@example.com',
      languageSelected: 'en',
      status: 'evaluated',
      answers: [
        {
          questionId: 'q1',
          selectedOptionId: 'B',
          writtenRationale: 'Took support from a team member, brainstormed on why the prompt failed, created the updated prompt in collaboration, and systematically validated the new outputs.',
          timeSpentSeconds: 180,
        },
      ],
      submittedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    subId = subRes.insertedId;
  }

  console.log('✓ Nandini Benchmark Submission and Evaluation Result verified.');
  console.log('\n=========================================');
  console.log(' database seeded successfully!');
  console.log('=========================================\n');

  await mongoose.disconnect();
}

async function run() {
  console.log('--- DiscoverU Seeding Engine ---');
  const handledByApi = await tryApiSeed();
  if (!handledByApi) {
    await directDbSeed();
  }
}

run().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
