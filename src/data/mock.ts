export const elder = {
  nameBn: 'রহিমা খাতুন',
  nameEn: 'Rahima Khatun',
  shortEn: 'Ma',
  age: 72,
  placeEn: 'Mymensingh',
  phone: '+880 17** ***-412',
  phoneType: 'Button phone + smartwatch',
}

export const caregivers = [
  { id: 'c1', nameEn: 'Tanvir Ahmed', nameBn: 'তানভীর', relation: 'Son', place: 'Dhaka' },
  { id: 'c2', nameEn: 'Nabila Ahmed', nameBn: 'নাবিলা', relation: 'Granddaughter', place: 'Dhaka' },
]

export type Medicine = {
  id: string
  bn: string
  en: string
  purposeBn: string
  purposeEn: string
  timeBn: string
  time: string
}

export const medicines: Medicine[] = [
  { id: 'm1', bn: 'অ্যামলোডিপিন ৫ মি.গ্রা.', en: 'Amlodipine 5 mg', purposeBn: 'প্রেসারের ওষুধ', purposeEn: 'Blood pressure', timeBn: 'সকাল ৮টা', time: '08:00' },
  { id: 'm2', bn: 'মেটফরমিন ৫০০ মি.গ্রা.', en: 'Metformin 500 mg', purposeBn: 'ডায়াবেটিসের ওষুধ', purposeEn: 'Diabetes', timeBn: 'দুপুর ২টা', time: '14:00' },
  { id: 'm3', bn: 'ক্যালসিয়াম + ভিটামিন ডি', en: 'Calcium + Vitamin D', purposeBn: 'হাড়ের জন্য', purposeEn: 'Bone health', timeBn: 'রাত ৯টা', time: '21:00' },
]

export const vitals = {
  heartRate: 78,
  restingHr: 72,
  spo2: 96,
  sleepHours: 4.8,
  steps: 1850,
  stepsGoal: 3000,
  syncedEn: 'Synced 6 min ago',
  weekLabels: ['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'],
  sleepWeek: [6.9, 6.4, 6.1, 5.2, 4.6, 4.9, 4.8],
  stepsWeek: [3100, 2900, 3400, 2200, 1600, 2100, 1850],
  hrWeek: [70, 71, 70, 73, 74, 72, 72],
  spo2Week: [97, 97, 96, 96, 95, 96, 96],
}

export const wellbeing = {
  score: 64,
  labelEn: 'Needs a check-in',
  trendEn: 'Down 9 points from last week',
  moodWeek: [4, 4, 3, 3, 2, 3, 3],
}

export type Insight = {
  id: string
  tone: 'alert' | 'watch' | 'good'
  titleEn: string
  bodyEn: string
  evidence: string[]
  quoteBn?: string
  whenEn: string
  actionEn?: string
}

export const insights: Insight[] = [
  {
    id: 'i1',
    tone: 'alert',
    titleEn: 'Poor sleep, 3 times this week',
    bodyEn: 'Your mother mentioned difficulty sleeping in three calls. Her watch agrees: under 5 hours on 3 of the last 4 nights.',
    evidence: ['Call, Mon 9:04 AM', 'Call, Tue 9:02 AM', 'Call, Wed 9:05 AM', 'Watch sleep avg 4.8 h'],
    quoteBn: 'কয়েকদিন ধরে রাতে ঘুম হচ্ছে না।',
    whenEn: 'Today',
    actionEn: 'Consider checking in tonight',
  },
  {
    id: 'i2',
    tone: 'watch',
    titleEn: 'Knee pain mentioned twice',
    bodyEn: 'She said her knee hurts when she climbs stairs. Steps are down 40% from last week, which may be related.',
    evidence: ['Call, Sun 9:10 AM', 'Call, Tue 9:02 AM', 'Steps 1,850 vs 3,100 avg'],
    quoteBn: 'সিঁড়ি দিয়ে উঠতে গেলে হাঁটুতে ব্যথা করে।',
    whenEn: 'Yesterday',
    actionEn: 'A doctor visit may help. Not a diagnosis.',
  },
  {
    id: 'i3',
    tone: 'watch',
    titleEn: 'Missed the evening medicine once',
    bodyEn: 'Calcium + Vitamin D was not taken on Monday night. She took it every other day this week.',
    evidence: ['Evening follow-up, Mon', '6 of 7 doses confirmed'],
    whenEn: '2 days ago',
  },
  {
    id: 'i4',
    tone: 'good',
    titleEn: 'She enjoyed talking about Nabila',
    bodyEn: 'Her mood lifted when she talked about her granddaughter\'s exam results. A short call from Nabila could brighten her week.',
    evidence: ['Call, Sat 9:08 AM'],
    quoteBn: 'নাবিলা পরীক্ষায় খুব ভালো করেছে, শুনে মনটা ভরে গেল।',
    whenEn: 'Saturday',
  },
]

export type Turn = { who: 'ai' | 'elder'; bn: string; en: string }

export const callScript: Turn[] = [
  { who: 'ai', bn: 'আসসালামু আলাইকুম মা, আমি আলাপন। আজ কেমন আছেন?', en: 'Assalamu alaikum Ma, this is Aalapon. How are you today?' },
  { who: 'elder', bn: 'ভালোই আছি। তবে কয়েকদিন ধরে রাতে ঘুম হচ্ছে না।', en: 'I am fine. But I have not been sleeping well for a few days.' },
  { who: 'ai', bn: 'শুনে খারাপ লাগলো মা। ঘড়িতেও দেখছি কাল রাতে পাঁচ ঘণ্টার কম ঘুম হয়েছে। সকালের প্রেসারের ওষুধটা খেয়েছেন?', en: 'Sorry to hear that. Your watch also shows under 5 hours of sleep last night. Did you take your morning blood pressure medicine?' },
  { who: 'elder', bn: 'হ্যাঁ, খেয়েছি। কিন্তু ওষুধ প্রায় শেষ হয়ে এসেছে।', en: 'Yes, I took it. But the medicine is almost finished.' },
  { who: 'ai', bn: 'ঠিক আছে, আমি ওষুধ আনানোর ব্যবস্থা করছি আর তানভীরকে জানিয়ে দিচ্ছি। আর কিছু লাগবে?', en: 'Alright, I will arrange a refill and let Tanvir know. Do you need anything else?' },
  { who: 'elder', bn: 'চাল আর ডিম লাগবে।', en: 'I need rice and eggs.' },
  { who: 'ai', bn: 'অর্ডার দিয়ে দিলাম, বিকেলের মধ্যে পৌঁছে যাবে। রাতে ঘুমানোর আগে একটু গরম দুধ খাবেন। কাল সকালে আবার কথা হবে।', en: 'Order placed, it will arrive by afternoon. Try some warm milk before bed. We will talk again tomorrow morning.' },
]

export type CallLog = {
  id: string
  dayEn: string
  timeEn: string
  duration: string
  moodEn: string
  mood: 1 | 2 | 3 | 4 | 5
  summaryEn: string
  tags: string[]
  channelEn: string
}

export const calls: CallLog[] = [
  { id: 'k1', dayEn: 'Today', timeEn: '9:05 AM', duration: '4:12', moodEn: 'Tired', mood: 3, summaryEn: 'Poor sleep again. Morning medicine taken, refill needed. Asked for rice and eggs.', tags: ['Sleep', 'Medicine refill', 'Groceries'], channelEn: 'Phone call' },
  { id: 'k2', dayEn: 'Tuesday', timeEn: '9:02 AM', duration: '3:40', moodEn: 'Low', mood: 2, summaryEn: 'Knee pain on stairs, did not go for her evening walk. Slept badly.', tags: ['Pain', 'Sleep'], channelEn: 'Phone call' },
  { id: 'k3', dayEn: 'Monday', timeEn: '9:04 AM', duration: '5:02', moodEn: 'Okay', mood: 3, summaryEn: 'Talked about the neighbour\'s wedding. Mentioned she woke up at 3 AM.', tags: ['Sleep', 'Social'], channelEn: 'Phone call' },
  { id: 'k4', dayEn: 'Sunday', timeEn: '9:10 AM', duration: '4:25', moodEn: 'Okay', mood: 3, summaryEn: 'Knee pain first mentioned. All medicines taken.', tags: ['Pain'], channelEn: 'Phone call' },
  { id: 'k5', dayEn: 'Saturday', timeEn: '9:08 AM', duration: '6:31', moodEn: 'Happy', mood: 5, summaryEn: 'Very cheerful. Proud of Nabila\'s exam results. Asked to see her soon.', tags: ['Family', 'Mood up'], channelEn: 'Video call' },
]

export type AgentDef = {
  id: string
  nameEn: string
  descEn: string
  autonomy: 'auto' | 'approve'
  runsEn: string
  icon: 'phone' | 'basket' | 'pill' | 'doctor' | 'bell' | 'alert'
}

export const agents: AgentDef[] = [
  { id: 'a1', nameEn: 'Family contact', descEn: 'Calls or texts a family member when she asks, or when something needs attention.', autonomy: 'auto', runsEn: '12 runs this month', icon: 'phone' },
  { id: 'a2', nameEn: 'Grocery order', descEn: 'Orders from her usual list through a partner grocer. Up to BDT 1,500 without approval.', autonomy: 'auto', runsEn: '4 runs this month', icon: 'basket' },
  { id: 'a3', nameEn: 'Medicine refill', descEn: 'Reorders prescribed medicines from a partner pharmacy.', autonomy: 'approve', runsEn: '2 runs this month', icon: 'pill' },
  { id: 'a4', nameEn: 'Doctor appointment', descEn: 'Finds and books a slot with her doctor.', autonomy: 'approve', runsEn: '1 run this month', icon: 'doctor' },
  { id: 'a5', nameEn: 'Reminders', descEn: 'Adds follow-up questions to the next call, like medicine or water.', autonomy: 'auto', runsEn: '30 runs this month', icon: 'bell' },
  { id: 'a6', nameEn: 'Urgent help', descEn: 'If she says she feels very unwell, calls every caregiver at once.', autonomy: 'auto', runsEn: 'Never triggered', icon: 'alert' },
]

export type NewAgentRequest = { id: string; titleEn: string; fromBn: string; statusEn: string }

export const newAgentRequests: NewAgentRequest[] = [
  { id: 'n1', titleEn: 'Pay the electricity bill', fromBn: 'বিদ্যুৎ বিলটা দিয়ে দিতে পারবে?', statusEn: 'Waiting for admin review' },
]
