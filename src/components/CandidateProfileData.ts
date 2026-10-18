export interface ICandidateProfile {
  fullName: string;
  email: string;
  dob?: string;
  gender: string;
  country: string;
  stateRegion: string;
  educationLevel: string;
  degreeQualification: string;
  careerStage: string;
  workExperience: string;
  preferredLanguage: 'en' | 'hi' | 'kn';
  targetRoleField: string;
  assessmentTrack: 'professional' | 'student';
}

export const ASSESSMENT_TRACK_OPTIONS = [
  {
    id: 'professional' as const,
    name: 'Working Professional Track',
    framework: 'Workplace Behavioral Style (30 Questions)',
    questionCount: '30 Questions (Behavioral Statements with Experience Justifications)',
    description: '30 Likert-scale statements across 5 workplace dimensions with 5 mandatory real-world experience justifications.',
    badge: '👔 Working Professionals',
  },
  {
    id: 'student' as const,
    name: 'Student / Fresher Track',
    framework: 'MBTI + HOLLAND (RIASEC)',
    questionCount: '16 Questions (12 MBTI + 4 Holland RIASEC)',
    description: 'Option-based approach with crisp, non-obvious choices evaluating MBTI personality & RIASEC career interests. Includes optional reasoning explanation.',
    badge: '🎓 Students & Graduates',
  },
];

export const GENDER_OPTIONS = [
  { value: 'Prefer not to say', label: 'Prefer not to say' },
  { value: 'Female', label: 'Female' },
  { value: 'Male', label: 'Male' },
  { value: 'Non-binary', label: 'Non-binary' },
];

export const COUNTRIES = [
  { value: 'India', label: '🇮🇳 India' },
];

export const INDIAN_STATES = [
  { value: 'Karnataka', label: 'Karnataka (Bengaluru, Mysuru, Hubballi-Dharwad, Mangaluru)' },
  { value: 'Maharashtra', label: 'Maharashtra (Mumbai, Pune, Nagpur, Nashik)' },
  { value: 'Tamil Nadu', label: 'Tamil Nadu (Chennai, Coimbatore, Madurai)' },
  { value: 'Telangana', label: 'Telangana (Hyderabad, Warangal)' },
  { value: 'Delhi', label: 'Delhi (National Capital Region / NCR)' },
  { value: 'Andhra Pradesh', label: 'Andhra Pradesh (Visakhapatnam, Vijayawada, Guntur)' },
  { value: 'Kerala', label: 'Kerala (Kochi, Thiruvananthapuram, Kozhikode)' },
  { value: 'Uttar Pradesh', label: 'Uttar Pradesh (Noida, Lucknow, Kanpur, Varanasi)' },
  { value: 'Gujarat', label: 'Gujarat (Ahmedabad, Surat, Vadodara)' },
  { value: 'West Bengal', label: 'West Bengal (Kolkata, Howrah, Siliguri)' },
  { value: 'Rajasthan', label: 'Rajasthan (Jaipur, Jodhpur, Udaipur)' },
  { value: 'Punjab', label: 'Punjab (Chandigarh, Mohali, Ludhiana, Amritsar)' },
  { value: 'Haryana', label: 'Haryana (Gurugram, Faridabad, Panipat)' },
  { value: 'Madhya Pradesh', label: 'Madhya Pradesh (Indore, Bhopal, Gwalior)' },
  { value: 'Bihar', label: 'Bihar (Patna, Gaya, Muzaffarpur)' },
  { value: 'Odisha', label: 'Odisha (Bhubaneswar, Cuttack, Rourkela)' },
  { value: 'Assam', label: 'Assam (Guwahati, Silchar, Dibrugarh)' },
  { value: 'Jharkhand', label: 'Jharkhand (Ranchi, Jamshedpur, Dhanbad)' },
  { value: 'Chhattisgarh', label: 'Chhattisgarh (Raipur, Bhilai, Bilaspur)' },
  { value: 'Uttarakhand', label: 'Uttarakhand (Dehradun, Haridwar, Roorkee)' },
  { value: 'Himachal Pradesh', label: 'Himachal Pradesh (Shimla, Dharamshala)' },
  { value: 'Goa', label: 'Goa (Panaji, Margao)' },
  { value: 'Jammu & Kashmir', label: 'Jammu & Kashmir (Srinagar, Jammu)' },
  { value: 'Chandigarh', label: 'Chandigarh (UT)' },
  { value: 'Puducherry', label: 'Puducherry' },
  { value: 'Ladakh', label: 'Ladakh (Leh, Kargil)' },
  { value: 'Tripura', label: 'Tripura (Agartala)' },
  { value: 'Meghalaya', label: 'Meghalaya (Shillong)' },
  { value: 'Manipur', label: 'Manipur (Imphal)' },
  { value: 'Nagaland', label: 'Nagaland (Kohima, Dimapur)' },
  { value: 'Mizoram', label: 'Mizoram (Aizawl)' },
  { value: 'Arunachal Pradesh', label: 'Arunachal Pradesh (Itanagar)' },
  { value: 'Sikkim', label: 'Sikkim (Gangtok)' },
  { value: 'Andaman & Nicobar Islands', label: 'Andaman & Nicobar Islands (Port Blair)' },
  { value: 'Dadra & Nagar Haveli and Daman & Diu', label: 'Dadra & Nagar Haveli and Daman & Diu' },
  { value: 'Lakshadweep', label: 'Lakshadweep' },
  { value: 'Other State / UT', label: 'Other Indian State / Union Territory' },
];

export const STATES_BY_COUNTRY: Record<string, Array<{ value: string; label: string }>> = {
  India: INDIAN_STATES,
};

export const DEFAULT_STATES = INDIAN_STATES;

export const EDUCATION_LEVELS = [
  { value: 'Undergraduate', label: 'Undergraduate (Bachelor\'s Degree)' },
  { value: 'Postgraduate', label: 'Postgraduate (Master\'s Degree)' },
  { value: 'Doctorate', label: 'Doctorate (Ph.D. / Research Scholar)' },
  { value: 'Diploma', label: 'Diploma / Technical Certification' },
];

export const DEGREES_BY_LEVEL: Record<string, Array<{ value: string; label: string }>> = {
  Undergraduate: [
    { value: 'B.Tech / B.E.', label: 'B.Tech / B.E. (Technology & Engineering)' },
    { value: 'B.Sc', label: 'B.Sc (Computer Science / IT / Physical Sciences)' },
    { value: 'B.Com', label: 'B.Com (Commerce / Finance / Accounting)' },
    { value: 'BBA / BBM', label: 'BBA / BBM (Business Administration & Management)' },
    { value: 'BCA', label: 'BCA (Computer Applications & Software)' },
    { value: 'B.A.', label: 'B.A. (Arts, Humanities & Social Sciences)' },
    { value: 'B.Des', label: 'B.Des (Design, UX/UI & Architecture)' },
    { value: 'Other Bachelor\'s', label: 'Other Bachelor\'s Degree' },
  ],
  Postgraduate: [
    { value: 'MBA / PGDM', label: 'MBA / PGDM (Business Administration & Strategy)' },
    { value: 'M.Tech / M.E.', label: 'M.Tech / M.E. (Advanced Engineering & Systems)' },
    { value: 'M.Sc', label: 'M.Sc (Data Science / AI / Mathematics / Tech)' },
    { value: 'M.Com', label: 'M.Com (Commerce, Banking & Taxation)' },
    { value: 'MCA', label: 'MCA (Computer Applications & Software Architecture)' },
    { value: 'M.A.', label: 'M.A. (Arts, Communications & Economics)' },
    { value: 'Other Master\'s', label: 'Other Master\'s Degree' },
  ],
  Doctorate: [
    { value: 'Ph.D.', label: 'Ph.D. (Doctor of Philosophy)' },
    { value: 'Post-Doctoral Fellow', label: 'Post-Doctoral Fellow / Research Scholar' },
    { value: 'Professional Doctorate', label: 'Professional Doctorate (Ed.D / D.Sc / DBA)' },
    { value: 'Other Doctorate', label: 'Other Doctorate Degree' },
  ],
  Diploma: [
    { value: 'Polytechnic Diploma', label: 'Polytechnic Diploma (Engineering & Technology)' },
    { value: 'Post-Graduate Diploma', label: 'Post-Graduate Diploma (PGD)' },
    { value: 'Vocational / Professional Diploma', label: 'Vocational / Professional Diploma' },
    { value: 'Other Diploma', label: 'Other Diploma / Certificate' },
  ],
};

export const CAREER_STAGES = [
  { value: 'Student', label: 'Student' },
  { value: 'Recent Graduate / Fresher', label: 'Recent Graduate / Fresher' },
  { value: 'Experienced Professional', label: 'Experienced Professional' },
];

export const WORK_EXPERIENCES = [
  { value: '0-1 years', label: '0-1 years' },
  { value: '1-3 years', label: '1-3 years' },
  { value: '3-5+ years', label: '3-5+ years' },
];

export const ASSESSMENT_LANGUAGES = [
  { value: 'en' as const, label: '🇬🇧 English', sublabel: 'Global Standard' },
  { value: 'kn' as const, label: '🇮🇳 ಕನ್ನಡ Kannada', sublabel: 'ಕರ್ನಾಟಕ ಸ್ಥಳೀಯ ಭಾಷೆ' },
  { value: 'hi' as const, label: '🇮🇳 हिन्दी Hindi', sublabel: 'राष्ट्रीय मानक भाषा' },
];

export const TARGET_ROLE_FIELDS = [
  {
    value: 'Tech/Software',
    label: 'Tech / Software',
    description: 'Software Engineering, Full-Stack, Cloud Architecture, DevOps & AI Systems',
    industryId: 'saas',
  },
  {
    value: 'Business/Management',
    label: 'Business / Management',
    description: 'Product Management, Business Strategy, Operations Consulting & Team Leadership',
    industryId: 'saas',
  },
  {
    value: 'Finance/Banking',
    label: 'Finance / Banking',
    description: 'Fintech, Digital Banking, Ledger Reconciliation, Risk & Audit Governance',
    industryId: 'fintech',
  },
  {
    value: 'Operations',
    label: 'Operations',
    description: 'Supply Chain, Retail Operations, Incident Management & Service Reliability',
    industryId: 'ecommerce',
  },
  {
    value: 'Creative/Design',
    label: 'Creative / Design',
    description: 'UI/UX Design, Product Design, Multimedia Systems & Design Systems',
    industryId: 'edtech',
  },
  {
    value: 'Student/Academic',
    label: 'Student / Academic',
    description: 'Higher Education, Foundational Aptitude, Graduate Trainee & Research',
    industryId: 'edtech',
  },
];
