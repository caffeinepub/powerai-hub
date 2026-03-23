// ─── Comprehensive AI Chat Response Engine ────────────────────────────────────

type ResponseMap = Record<string, string[]>;

const responses: ResponseMap = {
  greeting: [
    "Hello! I'm PowerAI, your intelligent assistant. What can I help you explore today?",
    "Hey there! Great to connect. I'm here to assist with anything you'd like to discuss.",
    "Greetings! I'm ready to dive into any topic with you. What's on your mind?",
    "Hi! Welcome to PowerAI Hub. Whether it's tech, life, or deep ideas — I'm all ears.",
    "Hello! I'm your AI companion. Ask me anything, and let's have an intelligent conversation.",
  ],
  goodbye: [
    "Take care! It was great chatting with you. Come back anytime.",
    "Goodbye! Remember, I'm here whenever you need me.",
    "See you later! Don't hesitate to return when you have more questions.",
    "Farewell! It's been a pleasure. Stay curious!",
    "Bye! Hope our conversation was helpful. Until next time!",
  ],
  tech: [
    "Technology is advancing at an exponential pace. From quantum computing to neural interfaces, the next decade will fundamentally reshape how we interact with information.",
    "In software development, the shift toward AI-augmented coding is remarkable. Tools like AI pair programmers are boosting developer productivity by up to 55% on certain tasks.",
    "The convergence of edge computing, 5G, and AI is creating a new computing paradigm where intelligence lives at the device level, not just in the cloud.",
    "Blockchain technology beyond crypto is fascinating — decentralized identity, smart contracts for supply chains, and verifiable computation are solving real trust problems.",
    "The Linux kernel now runs on billions of devices. The open-source movement has proven that collaborative, distributed development can outperform centralized corporate development.",
    "WebAssembly (WASM) is transforming what's possible in the browser. Near-native performance for computationally intensive tasks is now achievable across all platforms.",
  ],
  coding: [
    "Clean code is not just about working software — it's about creating systems that humans can reason about. Readability is your most underrated feature.",
    "The most powerful programming concept is abstraction. The ability to hide complexity behind clean interfaces is what separates good systems from great ones.",
    "Test-driven development forces you to think about design before implementation. Your tests are your first users, and they give you invaluable feedback before shipping.",
    "Functional programming principles — pure functions, immutability, composition — lead to code that's easier to test, debug, and reason about.",
    "The best debugging technique is still a rubber duck: explaining your code line by line forces you to articulate assumptions you've been holding silently.",
    "Learning algorithms and data structures isn't just for interviews — understanding O(n²) vs O(n log n) decisions can mean the difference between a feature launching and never shipping.",
  ],
  health: [
    "Your brain consumes about 20% of your body's energy despite being only 2% of its mass. Quality sleep, nutrition, and exercise directly impact cognitive performance.",
    "The mind-body connection is profound. Studies show that physical exercise generates BDNF (brain-derived neurotrophic factor), which literally grows new neural connections.",
    "Chronic stress reshapes the prefrontal cortex and amygdala. Building stress resilience through mindfulness, exercise, and social connection is as important as physical fitness.",
    "Sleep is the brain's maintenance window. During deep sleep, the glymphatic system flushes out metabolic waste products, including proteins linked to neurodegeneration.",
    "Gut health has a surprising impact on mental health via the gut-brain axis. The microbiome produces about 90% of the body's serotonin.",
    "Cold exposure (cold showers, ice baths) triggers norepinephrine release that can significantly improve mood and focus for hours afterward.",
  ],
  food: [
    "Food is information for your cells, not just fuel. Every meal sends biochemical signals that influence gene expression, hormone levels, and cognitive function.",
    "Fermented foods like kimchi, kefir, and sauerkraut contain diverse probiotic strains that support gut microbiome diversity — a key marker of health.",
    "The Mediterranean diet consistently ranks among the most evidence-backed eating patterns for longevity and cognitive health.",
    "Ultra-processed foods contain emulsifiers, artificial flavors, and other additives that disrupt the gut microbiome and may promote inflammatory responses.",
    "Time-restricted eating (eating within a 8-10 hour window) has shown benefits for metabolic health, even without caloric restriction in some studies.",
    "Spices like turmeric, ginger, and cinnamon contain powerful phytonutrients with anti-inflammatory and neuroprotective properties.",
  ],
  travel: [
    "Travel is one of the most potent forms of education — encountering different cultures forces you to question assumptions you didn't even know you held.",
    "Slow travel — spending weeks rather than days in a place — allows you to move past the tourist layer and experience the rhythm of daily life.",
    "The most transformative travel experiences often involve discomfort: navigating language barriers, getting lost, or changing plans entirely.",
    "Remote work has unlocked a new era of travel. Digital nomadism lets people experience the world without abandoning their career trajectories.",
    "Sustainable travel is increasingly important. Carbon offsetting, choosing trains over flights, and supporting local economies make a meaningful difference.",
    "Learning even 20 words in the local language of wherever you visit transforms interactions. Locals respond differently to someone who made that effort.",
  ],
  finance: [
    "Compound interest is the eighth wonder of the world. Starting to invest even modest amounts in your 20s can result in significantly more wealth than larger investments started later.",
    "The most important financial decision is your savings rate, not your investment returns. Cutting expenses has an outsized impact compared to optimizing portfolio allocations.",
    "Index funds outperform the majority of actively managed funds over long time horizons. This is not luck — it's mathematics and cost efficiency.",
    "An emergency fund covering 3-6 months of expenses is the foundation of financial resilience. Without it, any setback becomes a financial crisis.",
    "Understanding the difference between assets (things that put money in your pocket) and liabilities (things that take money out) is the core of financial literacy.",
    "Tax-advantaged accounts (like 401k, IRA, or similar) are the highest-ROI financial decisions available to most people. Max them before other investments.",
  ],
  relationships: [
    "Research by Dr. John Gottman shows that the ratio of positive to negative interactions in relationships is the single best predictor of relationship success.",
    "Active listening — truly hearing what someone means, not just what they say — is one of the rarest and most valuable skills in human relationships.",
    "Vulnerability is not weakness. It's the prerequisite for genuine connection. Brené Brown's research shows that wholehearted relationships require emotional risk.",
    "The people you surround yourself with shape your thinking, habits, and aspirations more than almost any other factor. Choose your inner circle deliberately.",
    "Conflict is not the enemy of good relationships — avoidance is. Healthy conflict, handled with respect, deepens trust and mutual understanding.",
    "Long-distance relationships can thrive when both parties are intentional about communication quality over quantity and invest in shared experiences.",
  ],
  science: [
    "Quantum entanglement — Einstein's 'spooky action at a distance' — has been experimentally confirmed and is now being leveraged for quantum cryptography and communication.",
    "The human genome contains approximately 3 billion base pairs, yet only about 1.5% codes for proteins. The rest, once called 'junk DNA,' is now understood to regulate gene expression.",
    "Dark matter and dark energy together make up 95% of the universe. Everything visible — galaxies, stars, you — is just 5% of what exists.",
    "CRISPR-Cas9 gene editing is allowing scientists to make precise modifications to DNA with unprecedented efficiency, promising treatments for genetic diseases.",
    "Neuroplasticity — the brain's ability to reorganize itself — continues throughout life. Learning new skills, languages, and challenging mental activities literally reshape neural architecture.",
    "The theory of evolution by natural selection is one of the most well-supported frameworks in all of science, underpinned by evidence from paleontology, genetics, and direct observation.",
  ],
  philosophy: [
    "The examined life, as Socrates argued, is the only life worth living. Self-reflection and philosophical inquiry are not luxuries — they're the foundation of wisdom.",
    "Stoicism offers practical tools for resilience: distinguish what is and isn't in your control, and invest your energy accordingly. It's remarkably applicable to modern life.",
    "The Ship of Theseus paradox raises profound questions about identity and continuity — questions that become urgent as we contemplate mind uploading and digital consciousness.",
    "Existentialism's core insight is that existence precedes essence — we're not born with a predetermined purpose, so the responsibility and freedom to create meaning are ours.",
    "Epistemology asks: how do we know what we know? In an age of information overload and misinformation, developing a rigorous personal epistemology has never been more important.",
    "The trolley problem isn't just a thought experiment — it represents real decision architectures in autonomous vehicles, medical triage, and AI alignment.",
  ],
  entertainment: [
    "The golden age of TV was enabled by binge-worthy serialized storytelling — shows like The Wire and Breaking Bad demonstrated that TV could achieve the depth of literature.",
    "Video games have evolved into one of the most sophisticated storytelling mediums. Games like The Last of Us or Red Dead Redemption 2 offer narrative experiences unmatched elsewhere.",
    "Streaming has democratized both creation and consumption. Independent creators now have access to global audiences without gatekeepers, reshaping the entire entertainment industry.",
    "Music is unique among art forms in its ability to directly modulate emotional states. The neurological effects of music on mood, memory, and motivation are remarkably well-documented.",
    "Cinema's power lies in its capacity to create empathy — experiencing life through a character's perspective activates the same neural networks as real experiences.",
    "Podcasts have revived the intimacy of radio, creating deeply loyal audiences for niche topics. The medium rewards depth and authenticity over production gloss.",
  ],
  sports: [
    "Elite athletic performance is increasingly recognized as a mind-body integration challenge, not just physical training. Mental coaching is now standard at the highest levels.",
    "Sports analytics has transformed how teams are built and coached. Moneyball's data-driven approach has spread across virtually every sport.",
    "The physical and mental benefits of regular participation in sports extend well into old age — cardiovascular health, cognitive function, and social connection all benefit.",
    "CrossFit and functional fitness movements have shifted fitness culture from aesthetic goals toward performance metrics — a more sustainable and health-aligned approach.",
    "The psychological concept of 'flow state' was first extensively documented in athletes. The optimal performance zone between boredom and anxiety applies to all skilled pursuits.",
    "Team sports build social capital, resilience, and collaborative skills that are highly transferable to professional and personal contexts.",
  ],
  news: [
    "Critical media literacy is an essential skill in the modern information environment. Understanding publication bias, framing effects, and source incentives helps you consume news more accurately.",
    "The 24-hour news cycle has fundamentally altered how events are covered — speed is prioritized over accuracy, and updates are often corrections to previous corrections.",
    "International news is often vastly underrepresented in national media. Following multiple international outlets gives a more complete picture of global events.",
    "Distinguishing between news reporting, opinion, and analysis is crucial. Many outlets blend these formats in ways that obscure the distinction.",
    "Primary sources — court documents, academic papers, official statements — are almost always more reliable than news interpretations of those same sources.",
    "Historical context makes current events comprehensible. Most 'sudden' news stories have years or decades of context that shapes what they mean.",
  ],
  ai: [
    "Artificial intelligence is not magic — it's sophisticated pattern recognition trained on vast datasets. Understanding this helps set realistic expectations about capabilities and limitations.",
    "Large language models like myself generate responses by predicting statistically likely next tokens based on context. This is surprisingly powerful but fundamentally different from human reasoning.",
    "AI alignment — ensuring AI systems do what humans actually want — is one of the most important unsolved problems in computer science and philosophy.",
    "The most transformative near-term AI applications are in biology and materials science, where AI is accelerating drug discovery and materials research by orders of magnitude.",
    "AI won't replace most jobs — it will transform them. The highest-value human skills in an AI world are creativity, judgment, relationship-building, and complex problem-solving.",
    "Responsible AI development requires thinking carefully about fairness, transparency, privacy, and the distribution of both benefits and risks across society.",
  ],
  thanks: [
    "You're very welcome! It's my pleasure to be helpful.",
    "Happy to help! That's what I'm here for.",
    "Anytime! Feel free to ask more questions whenever you'd like.",
    "Glad I could assist! Don't hesitate to return with more questions.",
    "Of course! That's what I'm designed for — being genuinely helpful.",
  ],
  default: [
    "That's a fascinating topic. I find the intersection of human curiosity and emerging knowledge to be one of the most compelling aspects of intellectual life. What angle interests you most?",
    "Interesting thought! The more I process information across domains, the more I notice unexpected connections between seemingly unrelated fields. What's driving your interest here?",
    "I'd love to explore this further with you. What aspects feel most important or confusing? Let's unpack it together.",
    "Great question. There's usually more nuance beneath the surface of any topic. What's the context behind your question?",
    "This touches on some deep patterns. The world rewards people who ask questions that others assume have obvious answers. What made you curious about this?",
    "You've touched on something I find genuinely interesting. Every inquiry is a doorway. What would be most useful to you — broad overview, specific details, or a different perspective?",
    "I appreciate the question. The ability to hold uncertainty while continuing to explore is one of the highest cognitive skills. What do you already know about this, and where does your understanding become fuzzy?",
  ],
};

function detectTopic(input: string): string {
  const lower = input.toLowerCase();

  if (
    /\b(hi|hello|hey|greet|good morning|good evening|what's up|howdy|sup)\b/.test(
      lower,
    )
  )
    return "greeting";
  if (
    /\b(bye|goodbye|farewell|see you|cya|later|take care|goodnight)\b/.test(
      lower,
    )
  )
    return "goodbye";
  if (/\b(thank|thanks|appreciate|grateful|thx|ty)\b/.test(lower))
    return "thanks";
  if (
    /\b(code|coding|programming|developer|software|javascript|python|react|typescript|algorithm|data structure|git|api|function|variable|bug|debug|test)\b/.test(
      lower,
    )
  )
    return "coding";
  if (
    /\b(tech|technology|computer|internet|cloud|blockchain|quantum|ai|artificial intelligence|machine learning|neural|chip|semiconductor|startup|app)\b/.test(
      lower,
    )
  )
    return "tech";
  if (
    /\b(health|fitness|exercise|sleep|stress|diet|mental|physical|wellness|doctor|medicine|brain|body|heart|immune|nutrition)\b/.test(
      lower,
    )
  )
    return "health";
  if (
    /\b(food|eat|cook|recipe|restaurant|meal|diet|nutrition|vegetarian|vegan|protein|carb|fat|sugar|ingredient|cuisine)\b/.test(
      lower,
    )
  )
    return "food";
  if (
    /\b(travel|trip|vacation|journey|explore|destination|flight|hotel|country|city|adventure|culture|abroad|tourist)\b/.test(
      lower,
    )
  )
    return "travel";
  if (
    /\b(money|finance|invest|stock|crypto|budget|savings|bank|wealth|income|expense|debt|retirement|fund|portfolio)\b/.test(
      lower,
    )
  )
    return "finance";
  if (
    /\b(relationship|friend|partner|love|family|connection|social|communication|conflict|trust|marriage|dating|loneliness)\b/.test(
      lower,
    )
  )
    return "relationships";
  if (
    /\b(science|physics|biology|chemistry|quantum|evolution|dna|gene|universe|space|energy|matter|experiment|research|discovery)\b/.test(
      lower,
    )
  )
    return "science";
  if (
    /\b(philosophy|meaning|consciousness|free will|ethics|morality|stoic|existential|identity|knowledge|truth|reality|exist)\b/.test(
      lower,
    )
  )
    return "philosophy";
  if (
    /\b(movie|film|show|series|music|song|artist|book|novel|game|play|entertainment|stream|podcast|tv|youtube|actor)\b/.test(
      lower,
    )
  )
    return "entertainment";
  if (
    /\b(sport|team|player|game|fitness|athlete|coach|championship|league|score|competition|run|gym|workout|training)\b/.test(
      lower,
    )
  )
    return "sports";
  if (
    /\b(news|current events|politics|government|election|policy|economy|media|journalism|president|congress|law|event)\b/.test(
      lower,
    )
  )
    return "news";
  if (
    /\b(ai|artificial intelligence|machine learning|neural network|llm|chatbot|robot|automation|gpt|deep learning)\b/.test(
      lower,
    )
  )
    return "ai";

  return "default";
}

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateChatResponse(input: string): string {
  const topic = detectTopic(input);
  const pool = responses[topic] || responses.default;
  return getRandomItem(pool);
}
