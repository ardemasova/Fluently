import type { Scenario, ScenarioId } from "@/types";

/**
 * Scenario library. Scripts are hand-written so the demo is deterministic.
 * A real implementation would replace the scripted turns with an LLM call
 * (see lib/mock-conversation.ts) but keep this metadata.
 */
export const SCENARIOS: Scenario[] = [
  {
    id: "coffee-shop",
    title: "Coffee shop conversation",
    description: "Order a drink, ask about the menu and handle a small mix-up politely.",
    icon: "coffee",
    durationMin: 5,
    recommendedLevel: "A2",
    category: "Everyday",
    role: "Barista at a busy café",
    skills: ["Polite requests", "Asking follow-up questions", "Handling a small problem"],
    vocabulary: [
      {
        word: "to go",
        definition: "Packed so you can take it away rather than drink it in the café.",
        example: "Could I get a flat white to go, please?",
      },
      {
        word: "oat milk",
        definition: "A plant-based milk alternative made from oats.",
        example: "Do you have oat milk instead of regular milk?",
      },
      {
        word: "I think there's been a mix-up",
        definition: "A polite way to say an order or situation is wrong.",
        example: "Sorry, I think there's been a mix-up — I ordered a decaf.",
      },
    ],
    nextScenarioId: "small-talk",
    opening: {
      text: "Hi there, welcome in! What can I get started for you today?",
      hint: "Could I get a…, please?",
      stretch: "Feel free to ask what I'd recommend — I love talking about our beans.",
    },
    turns: [
      {
        text: "Great choice. Would you like that for here or to go? And what size — small, medium or large?",
        hint: "For here, please. A medium…",
        stretch: "If you're in a hurry, tell me — I can prioritise your order.",
      },
      {
        text: "Perfect. We also have fresh banana bread today. Can I tempt you with anything to eat?",
        hint: "No thanks, I'm fine. / Yes, I'd love…",
      },
      {
        text: "Here you go! Oh — hang on, I think I made this with regular milk. Is that OK, or shall I remake it?",
        hint: "Actually, could you…?",
        stretch: "Try handling this politely but clearly — what would you say?",
      },
      {
        text: "No problem at all, sorry about that! That comes to €4.20. Are you paying by card or cash?",
        hint: "By card, please.",
      },
      {
        text: "All done. Have a lovely day — and enjoy your drink!",
        hint: "Thanks, you too!",
      },
    ],
    reactions: [
      { keywords: ["latte", "cappuccino", "flat white", "americano", "espresso", "coffee"], reply: "Lovely, one of our most popular drinks." },
      { keywords: ["tea", "chai", "matcha"], reply: "Nice — we brew our tea fresh." },
      { keywords: ["recommend", "suggest", "best"], reply: "Honestly, our house flat white is the one people come back for." },
      { keywords: ["sorry", "mistake", "mix-up", "remake", "wrong"], reply: "Thanks for being so kind about it." },
      { keywords: ["card", "cash", "pay"], reply: "Perfect, the machine is ready for you." },
    ],
    sampleCorrection: {
      original: "I want a coffee with milk.",
      suggestion: "Could I get a coffee with milk, please?",
      explanation: "\"Could I get…\" sounds friendlier and more natural than \"I want…\" when ordering.",
    },
  },
  {
    id: "job-interview",
    title: "Job interview",
    description: "Introduce yourself, talk about your experience and answer common interview questions.",
    icon: "briefcase",
    durationMin: 12,
    recommendedLevel: "B2",
    category: "Career",
    role: "Hiring manager at a product company",
    skills: ["Talking about experience", "Structuring answers (STAR)", "Describing strengths with examples"],
    vocabulary: [
      {
        word: "to take ownership of",
        definition: "To accept responsibility for something and make sure it gets done.",
        example: "I took ownership of the onboarding redesign from research to launch.",
      },
      {
        word: "cross-functional",
        definition: "Involving people from different teams or departments.",
        example: "I worked in a cross-functional team with engineers and marketers.",
      },
      {
        word: "to streamline",
        definition: "To make a process simpler and more efficient.",
        example: "We streamlined the approval process and saved two days per release.",
      },
    ],
    nextScenarioId: "business-meeting",
    opening: {
      text: "Thanks for coming in today. To start, could you tell me a little about yourself and your current role?",
      hint: "Sure. I'm currently working as… and I'm responsible for…",
      stretch: "Try to finish with why this role is a logical next step for you.",
    },
    turns: [
      {
        text: "That's interesting. Can you tell me about a project you're particularly proud of? What was your role in it?",
        hint: "One project I'm proud of is… My role was to…",
        stretch: "Use the STAR structure: situation, task, action, result.",
      },
      {
        text: "Nice. Tell me about a time something didn't go to plan at work. How did you handle it?",
        hint: "Once, we had a problem with… I decided to…",
        stretch: "Mention what you would do differently next time.",
      },
      {
        text: "How would your colleagues describe you, in three words?",
        hint: "I think they would say I'm…, … and …",
      },
      {
        text: "Why are you interested in joining our team specifically?",
        hint: "I'm interested because…",
        stretch: "Connect one of your skills to something specific about the company.",
      },
      {
        text: "Great, that's all from me. Do you have any questions for us?",
        hint: "Yes — could you tell me more about…?",
      },
    ],
    reactions: [
      { keywords: ["design", "designer", "ux", "ui"], reply: "Design is a big part of how we work here, so that's relevant." },
      { keywords: ["develop", "engineer", "code", "software", "programm"], reply: "Engineering experience will definitely be useful in this role." },
      { keywords: ["team", "colleague", "together", "collaborat"], reply: "It's good to hear how you work with others." },
      { keywords: ["deadline", "problem", "mistake", "late", "fail"], reply: "Thanks for being open about that — it's a realistic example." },
      { keywords: ["learn", "grow", "improve"], reply: "I like that you focus on learning." },
      { keywords: ["salary", "remote", "hybrid", "team size", "culture"], reply: "Good question — we'd cover that in detail in the next round." },
    ],
    sampleCorrection: {
      original: "I am working there since three years.",
      suggestion: "I've been working there for three years.",
      explanation: "Use the present perfect continuous with \"for\" + a period of time for something that started in the past and continues now.",
    },
  },
  {
    id: "airport",
    title: "Airport and travel",
    description: "Check in for a flight, ask about luggage and deal with a last-minute gate change.",
    icon: "plane",
    durationMin: 8,
    recommendedLevel: "B1",
    category: "Travel",
    role: "Check-in agent at an international airport",
    skills: ["Asking for information", "Understanding announcements", "Solving travel problems"],
    vocabulary: [
      {
        word: "carry-on",
        definition: "A small bag you are allowed to take onto the plane with you.",
        example: "Is this backpack OK as a carry-on?",
      },
      {
        word: "layover",
        definition: "A short stop between two flights on the same journey.",
        example: "I have a two-hour layover in Frankfurt.",
      },
      {
        word: "boarding pass",
        definition: "The document that lets you get on the plane.",
        example: "Could you print my boarding pass, please?",
      },
    ],
    nextScenarioId: "small-talk",
    opening: {
      text: "Good morning! Where are you flying to today? Could I see your passport, please?",
      hint: "Good morning. I'm flying to… Here's my passport.",
    },
    turns: [
      {
        text: "Thank you. Are you checking in any bags today, or just travelling with hand luggage?",
        hint: "I'd like to check in one bag, please.",
      },
      {
        text: "Could you place your suitcase on the scale? Hmm, it's 24 kilos — the limit is 23. Would you like to move something into your carry-on?",
        hint: "Sure, I can take out…",
        stretch: "Negotiate a little: ask if there's any flexibility.",
      },
      {
        text: "Perfect, that works. Would you prefer a window or an aisle seat?",
        hint: "I'd prefer a window seat, please.",
      },
      {
        text: "Here's your boarding pass. Just so you know, your gate has changed to B14 and boarding starts at 10:40. Any questions?",
        hint: "Where is gate B14? / How long does it take to get there?",
        stretch: "Check you understood by repeating the key details back.",
      },
      {
        text: "It's about ten minutes on foot, past security on the left. Have a great flight!",
        hint: "Thank you so much!",
      },
    ],
    reactions: [
      { keywords: ["london", "paris", "new york", "berlin", "madrid", "rome", "tokyo", "dublin"], reply: "Lovely destination." },
      { keywords: ["window"], reply: "Great — you'll get a nice view on take-off." },
      { keywords: ["aisle"], reply: "Good choice for stretching your legs." },
      { keywords: ["heavy", "shoes", "jacket", "book", "take out", "move"], reply: "That should do it." },
      { keywords: ["gate", "where", "how long"], reply: "Good question." },
    ],
    sampleCorrection: {
      original: "Where is the gate B14?",
      suggestion: "Where's gate B14?",
      explanation: "We don't usually use \"the\" before a gate or platform number.",
    },
  },
  {
    id: "small-talk",
    title: "Everyday small talk",
    description: "Chat with a new neighbour about your week, your plans and things you enjoy.",
    icon: "chat",
    durationMin: 6,
    recommendedLevel: "B1",
    category: "Everyday",
    role: "Friendly new neighbour",
    skills: ["Keeping a conversation going", "Talking about routines and plans", "Showing interest"],
    vocabulary: [
      {
        word: "to settle in",
        definition: "To become comfortable in a new home, job or place.",
        example: "We're still settling in, but we love the neighbourhood.",
      },
      {
        word: "hectic",
        definition: "Very busy, with lots of things happening.",
        example: "It's been a hectic week at work.",
      },
      {
        word: "to catch up",
        definition: "To talk to someone and hear their news after some time.",
        example: "Let's grab a coffee and catch up soon.",
      },
    ],
    nextScenarioId: "coffee-shop",
    opening: {
      text: "Oh, hi! I think we're neighbours — I just moved in next door. How long have you lived here?",
      hint: "Hi! Nice to meet you. I've lived here for…",
    },
    turns: [
      {
        text: "That's nice. How's your week been so far?",
        hint: "It's been… because…",
        stretch: "Add a small detail or story to make it more interesting.",
      },
      {
        text: "I'm still learning the area. Is there anywhere nearby you'd recommend — a café, a park, anything?",
        hint: "You should try… It's great for…",
      },
      {
        text: "Thanks, I'll check it out! Have you got any plans for the weekend?",
        hint: "I'm going to… / I'm not sure yet, maybe…",
      },
      {
        text: "Sounds fun. What do you usually do to relax after work?",
        hint: "I usually… / I really enjoy…",
        stretch: "Ask me a question back to keep the conversation going.",
      },
      {
        text: "It was really nice to meet you. Let's catch up properly soon!",
        hint: "Definitely! See you around.",
      },
    ],
    reactions: [
      { keywords: ["busy", "hectic", "tired", "work"], reply: "Oh, I know that feeling." },
      { keywords: ["good", "great", "nice", "relax", "fine"], reply: "Glad to hear it!" },
      { keywords: ["park", "café", "cafe", "restaurant", "bakery", "gym"], reply: "Oh, I'll definitely try that." },
      { keywords: ["family", "friends", "beach", "hike", "cinema", "movie"], reply: "That sounds lovely." },
      { keywords: ["you?", "and you", "what about you"], reply: "Thanks for asking! I've mostly been unpacking boxes." },
    ],
    sampleCorrection: {
      original: "In the weekend I go to make a picnic.",
      suggestion: "At the weekend, I'm going to have a picnic.",
      explanation: "Use \"at/on the weekend\", \"going to\" for plans, and \"have a picnic\" rather than \"make\".",
    },
  },
  {
    id: "business-meeting",
    title: "Business meeting",
    description: "Share an update, give your opinion diplomatically and agree on next steps.",
    icon: "presentation",
    durationMin: 10,
    recommendedLevel: "B2",
    category: "Professional",
    role: "Project lead running a weekly sync",
    skills: ["Giving updates", "Disagreeing politely", "Summarising action points"],
    vocabulary: [
      {
        word: "on track",
        definition: "Progressing as planned, likely to finish on time.",
        example: "The migration is on track for the end of the month.",
      },
      {
        word: "I see your point, but…",
        definition: "A diplomatic way to disagree after acknowledging someone's view.",
        example: "I see your point, but I'm worried about the timeline.",
      },
      {
        word: "action item",
        definition: "A specific task someone agrees to do after a meeting.",
        example: "My action item is to share the revised budget by Friday.",
      },
    ],
    nextScenarioId: "job-interview",
    opening: {
      text: "Morning, everyone. Let's start with a quick update — how's your part of the project going?",
      hint: "So far, we've… The next step is…",
      stretch: "Mention one risk and how you plan to manage it.",
    },
    turns: [
      {
        text: "Thanks. The client wants to bring the launch forward by two weeks. What do you think — is that realistic?",
        hint: "I think it might be difficult because…",
        stretch: "Disagree diplomatically and offer an alternative.",
      },
      {
        text: "That's a fair concern. What would you need from the rest of the team to make it work?",
        hint: "It would help if we could…",
      },
      {
        text: "OK. Could you summarise the main risks so I can share them with the client?",
        hint: "The main risks are… and…",
        stretch: "Order them from most to least important.",
      },
      {
        text: "Very clear, thank you. Before we wrap up, what's your action item for this week?",
        hint: "My action item is to… by…",
      },
      {
        text: "Great. I'll send round the notes this afternoon. Thanks, everyone!",
        hint: "Thanks — speak soon.",
      },
    ],
    reactions: [
      { keywords: ["delay", "late", "behind", "risk", "problem"], reply: "Good that you flagged that early." },
      { keywords: ["on track", "finished", "done", "completed", "progress"], reply: "Great progress." },
      { keywords: ["agree", "realistic", "possible"], reply: "OK, noted." },
      { keywords: ["but", "however", "concern", "worried"], reply: "I appreciate the honesty." },
      { keywords: ["friday", "monday", "tomorrow", "next week", "end of"], reply: "Perfect, that timing works." },
    ],
    sampleCorrection: {
      original: "I am agree with the plan but it depends of the budget.",
      suggestion: "I agree with the plan, but it depends on the budget.",
      explanation: "\"Agree\" is a verb, so we don't add \"am\". And we say \"depend on\", not \"depend of\".",
    },
  },
  {
    id: "ielts",
    title: "IELTS speaking practice",
    description: "Answer Part 1 and Part 2 style questions with clear structure and range.",
    icon: "graduation",
    durationMin: 14,
    recommendedLevel: "C1",
    category: "Exams",
    role: "Speaking examiner (practice format)",
    skills: ["Extending answers", "Using a range of vocabulary", "Speaking fluently on a topic"],
    vocabulary: [
      {
        word: "to a certain extent",
        definition: "Partly, but not completely.",
        example: "To a certain extent, technology has made us less patient.",
      },
      {
        word: "first-hand",
        definition: "Experienced directly by yourself, not heard from others.",
        example: "I've seen first-hand how tourism changes a small town.",
      },
      {
        word: "it goes without saying",
        definition: "Used to say something is so obvious it hardly needs to be said.",
        example: "It goes without saying that practice makes a huge difference.",
      },
    ],
    nextScenarioId: "business-meeting",
    opening: {
      text: "Good afternoon. Let's begin with some questions about you. Do you work or are you a student?",
      hint: "I'm currently… and I…",
      stretch: "Extend your answer with a reason and an example.",
    },
    turns: [
      {
        text: "Let's talk about your hometown. What do you like most about the place where you grew up?",
        hint: "What I like most is… because…",
        stretch: "Contrast it with something you would change.",
      },
      {
        text: "How do people in your country usually spend their free time?",
        hint: "Generally speaking, people tend to…",
      },
      {
        text: "Now, Part 2. Describe a skill you learned that took a long time to master. Say what it was, how you learned it, and how you feel about it now.",
        hint: "I'd like to talk about… It took me… because…",
        stretch: "Aim to speak for about two minutes — use linking phrases to move between points.",
      },
      {
        text: "Thank you. Do you think people today are less patient when learning new skills? Why?",
        hint: "To a certain extent, yes, because…",
        stretch: "Consider both sides before giving your opinion.",
      },
      {
        text: "Thank you, that's the end of the practice test.",
        hint: "Thank you.",
      },
    ],
    reactions: [
      { keywords: ["student", "university", "study"], reply: "Thank you." },
      { keywords: ["work", "job", "company"], reply: "Thank you." },
      { keywords: ["because", "for example", "for instance"], reply: "Good — you supported your answer." },
      { keywords: ["however", "on the other hand", "although", "whereas"], reply: "Nice use of contrast." },
    ],
    sampleCorrection: {
      original: "I learned it very much time ago.",
      suggestion: "I learned it a long time ago.",
      explanation: "With time, use \"a long time\" — \"much time\" is used mainly in questions and negatives.",
    },
  },
];

export const SCENARIO_MAP = Object.fromEntries(SCENARIOS.map((s) => [s.id, s])) as Record<ScenarioId, Scenario>;

export function getScenario(id: ScenarioId): Scenario {
  return SCENARIO_MAP[id];
}
