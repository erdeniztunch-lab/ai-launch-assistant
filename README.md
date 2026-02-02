# LaunchFast AI - Prompt Engineering Prototype

> AI launch motor for startups following Y Combinator's "Launch ASAP" philosophy

## 🎯 What This Is

This is the **prompt engineering foundation** for LaunchFast AI - a GTM launch engine that helps founders ship their first action in 3 minutes.

**Not included yet:** Full app UI, database, authentication  
**Included now:** Core AI logic that makes the product work

**Repository status:** All source UI strings were translated to English in the repository. Files updated: `src/components/ContextForm.js`, `src/app/api/generate-hypothesis/route.js`, `tests/test-prompts.js`. Note: some build artifacts or dev logs under `.next` may still contain the original Turkish text until you remove `.next` and restart the dev server (see Quick Start).

## 🧠 Philosophy

Based on YC's Launch ASAP principles:
- Launch is NOT an event, it's a continuous learning loop
- One hypothesis → one task → real human contact → learn → repeat
- Speed over perfection

## 🚀 Quick Start

### 1. Get Free Gemini API Key

```bash
# Visit: https://aistudio.google.com/app/apikey
# Create free API key (no credit card needed)
```

### 2. Install & Test

```bash
# Install dependencies
npm install

# Set your API key (macOS / Linux)
export GEMINI_API_KEY='your-key-here'

# Set your API key (PowerShell - temporary for this session)
$Env:GEMINI_API_KEY = 'your-key-here'

# Set your API key (PowerShell - persistent)
setx GEMINI_API_KEY 'your-key-here'

# Run full test flow
npm test
```

### 3. Run Dev Server (Windows / macOS / Linux)

If you see untranslated text coming from previous builds (e.g., in `.next`), delete the `.next` folder and restart the dev server to regenerate assets in English:

```powershell
# Remove previous build artifacts (PowerShell)
Remove-Item -Recurse -Force .next

# Start dev server
npm run dev
```

## 📁 File Structure

```
.
├── prompts.js          # 4 core prompts for launch flow
├── gemini-api.js       # Gemini integration + rate limiting
├── test-prompts.js     # Test script that simulates user flow
├── package.json        # Dependencies
└── README.md           # This file
```

## 🧪 Core Prompts

### 1. **Hypothesis Generation**
Input: Product description, target audience, current artifact, learning goal  
Output: Single testable hypothesis + success criteria

### 2. **Launch Type Selection**
Input: Hypothesis, available artifact  
Output: Best launch type (silent, community, strangers, etc.) + reasoning

### 3. **Task Generation**
Input: Hypothesis, launch type  
Output: One 30-minute executable task with instructions

### 4. **Learn & Iterate**
Input: Previous hypothesis, task, user feedback  
Output: Learning analysis + next hypothesis + next action

## 📊 Example Flow

```
User: "I have an AI launch tool idea, no landing page yet"
↓
AI: Hypothesis - "Solo founders understand 'launch paralysis' in 10 seconds"
↓
AI: Launch Type - STRANGER_LAUNCH (Twitter/LinkedIn outreach)
↓
AI: Task - "DM 5 solo founders with 'do you struggle with launching?' and listen"
↓
User: "3 said yes immediately, 2 asked what I'm building"
↓
AI: Learning - "Problem validated. Next: Show solution (landing page)"
```

## 🎓 Testing Individual Prompts

```bash
# Test only hypothesis generation
node test-prompts.js

# Or manually test in code:
import { testHypothesisGeneration } from './test-prompts.js';
import { initGemini } from './gemini-api.js';

const model = initGemini(process.env.GEMINI_API_KEY);
const result = await testHypothesisGeneration(model);
console.log(result);
```

## 🔧 Customizing Prompts

Edit `prompts.js` to:
- Add new launch types
- Adjust task complexity
- Change hypothesis format
- Fine-tune reasoning style

Each prompt includes:
- System context (YC philosophy)
- Input variables
- Output JSON schema
- Example outputs

## 🌐 Free Tier Limits

**gemini-2.0-flash-exp:**
- 15 requests/minute
- 1 million tokens/minute
- 1500 requests/day

**For MVP:** More than enough. Each user flow = ~4-5 API calls.

## 📈 Next Steps

After validating prompts:

1. **Backend API** (Next.js API routes or Bun)
   - `/api/generate-hypothesis`
   - `/api/select-launch-type`
   - `/api/generate-task`
   - `/api/learn-iterate`

2. **Database** (Supabase)
   ```sql
   launches (id, user_id, hypothesis, launch_type, status)
   tasks (id, launch_id, description, completed_at)
   learnings (id, launch_id, feedback, next_hypothesis)
   ```

3. **Frontend** (Next.js + Tailwind)
   - Linear-style single-task view
   - Context capture form
   - Learning feedback form

## 🎨 UI Mockup Preview

```
┌─────────────────────────────────────────┐
│  LaunchFast AI                          │
│  ─────────────────────────────          │
│                                         │
│  Your Current Launch                    │
│                                         │
│  Hypothesis:                            │
│  "Solo founders understand launch       │
│   paralysis in 10 seconds"              │
│                                         │
│  Today's Task:                          │
│  ☐ DM 5 solo founders on Twitter and    │
│     ask: "Do you struggle with          │
│     launching?" Listen to responses.    │
│                                         │
│  ⏱️ 30 min timebox                       │
│                                         │
│  [Mark Complete]  [Need Help]           │
│                                         │
└─────────────────────────────────────────┘
```

## 💡 Why This Approach?

1. **Validate AI quality first** - Before building UI, ensure Gemini gives good outputs
2. **Iterate fast** - Easier to tweak prompts than rebuild UI
3. **GitHub-ready** - Clean, documented code for portfolio
4. **GTM Engineer role** - Shows understanding of launch strategy + AI engineering

## 🤝 Contributing

This is a prototype. Future improvements:
- [ ] Add memory/context between launches
- [ ] Multi-language support (TR/EN)
- [ ] Team collaboration mode
- [ ] Revenue-first launch templates
- [ ] Channel-specific playbooks

---

**Built with:** Gemini 2.0 Flash (free tier) + Claude Sonnet 4.5 + YC Launch ASAP philosophy
