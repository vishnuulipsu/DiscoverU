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
}

export const GENDER_OPTIONS = [
  { value: 'Prefer not to say', label: 'Prefer not to say' },
  { value: 'Female', label: 'Female' },
  { value: 'Male', label: 'Male' },
  { value: 'Non-binary', label: 'Non-binary' },
];

export const COUNTRIES = [
  { value: 'India', label: '🇮🇳 India' },
  { value: 'United States', label: '🇺🇸 United States' },
  { value: 'United Kingdom', label: '🇬🇧 United Kingdom' },
  { value: 'Canada', label: '🇨🇦 Canada' },
  { value: 'Australia', label: '🇦🇺 Australia' },
  { value: 'Germany', label: '🇩🇪 Germany' },
  { value: 'Singapore', label: '🇸🇬 Singapore' },
  { value: 'United Arab Emirates', label: '🇦🇪 United Arab Emirates' },
  { value: 'France', label: '🇫🇷 France' },
  { value: 'Netherlands', label: '🇳🇱 Netherlands' },
  { value: 'Japan', label: '🇯🇵 Japan' },
  { value: 'Ireland', label: '🇮🇪 Ireland' },
  { value: 'Switzerland', label: '🇨🇭 Switzerland' },
  { value: 'Saudi Arabia', label: '🇸🇦 Saudi Arabia' },
  { value: 'Other / International', label: '🌐 Other Country / International' },
];

export const STATES_BY_COUNTRY: Record<string, Array<{ value: string; label: string }>> = {
  India: [
    { value: 'Karnataka', label: 'Karnataka (Bangalore, Mysuru, Hubli)' },
    { value: 'Maharashtra', label: 'Maharashtra (Mumbai, Pune)' },
    { value: 'Tamil Nadu', label: 'Tamil Nadu (Chennai, Coimbatore)' },
    { value: 'Telangana', label: 'Telangana (Hyderabad)' },
    { value: 'Delhi', label: 'Delhi (National Capital Region)' },
    { value: 'Andhra Pradesh', label: 'Andhra Pradesh (Visakhapatnam, Vijayawada)' },
    { value: 'Kerala', label: 'Kerala (Kochi, Thiruvananthapuram)' },
    { value: 'Uttar Pradesh', label: 'Uttar Pradesh (Noida, Lucknow)' },
    { value: 'Gujarat', label: 'Gujarat (Ahmedabad, Surat)' },
    { value: 'West Bengal', label: 'West Bengal (Kolkata)' },
    { value: 'Rajasthan', label: 'Rajasthan (Jaipur)' },
    { value: 'Punjab', label: 'Punjab (Chandigarh, Mohali)' },
    { value: 'Haryana', label: 'Haryana (Gurugram, Faridabad)' },
    { value: 'Madhya Pradesh', label: 'Madhya Pradesh (Indore, Bhopal)' },
    { value: 'Bihar', label: 'Bihar (Patna)' },
    { value: 'Odisha', label: 'Odisha (Bhubaneswar)' },
    { value: 'Assam', label: 'Assam (Guwahati)' },
    { value: 'Goa', label: 'Goa' },
    { value: 'Jharkhand', label: 'Jharkhand (Ranchi)' },
    { value: 'Chhattisgarh', label: 'Chhattisgarh (Raipur)' },
    { value: 'Uttarakhand', label: 'Uttarakhand (Dehradun)' },
    { value: 'Himachal Pradesh', label: 'Himachal Pradesh (Shimla)' },
    { value: 'Jammu & Kashmir', label: 'Jammu & Kashmir' },
    { value: 'Other State / UT', label: 'Other Indian State / Union Territory' },
  ],
  'United States': [
    { value: 'California', label: 'California (CA)' },
    { value: 'New York', label: 'New York (NY)' },
    { value: 'Texas', label: 'Texas (TX)' },
    { value: 'Washington', label: 'Washington (WA)' },
    { value: 'Illinois', label: 'Illinois (IL)' },
    { value: 'Massachusetts', label: 'Massachusetts (MA)' },
    { value: 'Florida', label: 'Florida (FL)' },
    { value: 'Other US State', label: 'Other US State' },
  ],
  'United Kingdom': [
    { value: 'Greater London', label: 'Greater London' },
    { value: 'England', label: 'England' },
    { value: 'Scotland', label: 'Scotland' },
    { value: 'Wales', label: 'Wales' },
    { value: 'Northern Ireland', label: 'Northern Ireland' },
  ],
  Canada: [
    { value: 'Ontario', label: 'Ontario (Toronto, Ottawa)' },
    { value: 'British Columbia', label: 'British Columbia (Vancouver)' },
    { value: 'Quebec', label: 'Quebec (Montreal)' },
    { value: 'Alberta', label: 'Alberta (Calgary)' },
    { value: 'Other Province', label: 'Other Canadian Province' },
  ],
  Australia: [
    { value: 'New South Wales', label: 'New South Wales (Sydney)' },
    { value: 'Victoria', label: 'Victoria (Melbourne)' },
    { value: 'Queensland', label: 'Queensland (Brisbane)' },
    { value: 'Western Australia', label: 'Western Australia (Perth)' },
    { value: 'Other State', label: 'Other Australian State' },
  ],
};

export const DEFAULT_STATES = [
  { value: 'Central / Capital Region', label: 'Central / Capital Region' },
  { value: 'Northern Region', label: 'Northern Region' },
  { value: 'Southern Region', label: 'Southern Region' },
  { value: 'Eastern Region', label: 'Eastern Region' },
  { value: 'Western Region', label: 'Western Region' },
  { value: 'Other Region', label: 'Other Region' },
];

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
