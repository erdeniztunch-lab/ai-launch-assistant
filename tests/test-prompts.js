/**
 * LaunchFast AI - Prompt Testing Script
 * Run this to validate Gemini responses before building UI
 */
console.log("🚀 Test starting...");


import {
  PROMPT_GENERATE_HYPOTHESIS,
  PROMPT_SELECT_LAUNCH_TYPE,
  PROMPT_GENERATE_TASK,
  PROMPT_LEARN_AND_ITERATE,
  fillPrompt
} from '../src/lib/prompts.js';  // ✅ CORRECT

import {
  initGemini,
  safeCallGemini,
  createStructuredPrompt
} from '../src/lib/gemini-api.js';  // ✅ CORRECT
// ============================================
// Test Data (Example Startup)
// ============================================

const TEST_CONTEXT = {
  PRODUCT_DESCRIPTION: "LaunchFast AI - AI launch motor for startups to ship their first GTM action in 3 minutes",
  TARGET_AUDIENCE: "Solo founders with MVP ready but stuck in launch paralysis",
  CURRENT_ARTIFACT: "Product vision document, no landing page yet",
  LEARNING_GOAL: "Do founders understand 'launch paralysis' as a real problem?"
};

// ============================================
// Test Functions
// ============================================

async function testHypothesisGeneration(model) {
  console.log("\n🧪 TEST 1: Hypothesis Generation");
  console.log("─".repeat(50));

  const prompt = fillPrompt(PROMPT_GENERATE_HYPOTHESIS, TEST_CONTEXT);
  const result = await safeCallGemini(model, prompt, true);

  console.log("✅ Hypothesis:", result.hypothesis);
  console.log("📝 Reasoning:", result.reasoning);
  console.log("🎯 Success Signal:", result.success_signal);

  return result;
}

async function testLaunchTypeSelection(model, hypothesis) {
  console.log("\n🧪 TEST 2: Launch Type Selection");
  console.log("─".repeat(50));

  const prompt = fillPrompt(PROMPT_SELECT_LAUNCH_TYPE, {
    HYPOTHESIS: hypothesis.hypothesis,
    ARTIFACT_TYPE: TEST_CONTEXT.CURRENT_ARTIFACT
  });

  const result = await safeCallGemini(model, prompt, true);

  console.log("✅ Launch Type:", result.launch_type);
  console.log("📝 Reason:", result.reason);
  console.log("🛠️  Preparation:", result.preparation_needed);

  return result;
}

async function testTaskGeneration(model, hypothesis, launchType) {
  console.log("\n🧪 TEST 3: Task Generation");
  console.log("─".repeat(50));

  const prompt = fillPrompt(PROMPT_GENERATE_TASK, {
    HYPOTHESIS: hypothesis.hypothesis,
    LAUNCH_TYPE: launchType.launch_type,
    ARTIFACT_TYPE: TEST_CONTEXT.CURRENT_ARTIFACT
  });

  const result = await safeCallGemini(model, prompt, true);

  console.log("✅ Task:", result.task);
  console.log("📋 Instructions:");
  result.instructions.forEach((step, i) => console.log(`   ${i + 1}. ${step}`));
  console.log("⏱️  Timebox:", result.timebox);
  console.log("🎯 Success Criteria:", result.success_criteria);
  console.log("💡 Why This Matters:", result.why_this_matters);

  return result;
}

async function testLearnLoop(model, hypothesis, task) {
  console.log("\n🧪 TEST 4: Learn Loop (Hypothesis Update)");
  console.log("─".repeat(50));

  // Simulated user feedback
  const userFeedback = `I posted on r/SaaS. Got 8 comments:
- 3 people said "I need this right now"
- 2 people asked "how is this different from Notion templates?"
- 1 person said "seems useful but I'd need to see it in action"
- 2 people just upvoted, no comment

Overall: People understand the problem but want to see proof it works.`;

  const prompt = fillPrompt(PROMPT_LEARN_AND_ITERATE, {
    HYPOTHESIS: hypothesis.hypothesis,
    TASK_DESCRIPTION: task.task,
    USER_FEEDBACK: userFeedback
  });

  const result = await safeCallGemini(model, prompt, true);

  console.log("✅ Hypothesis Status:", result.hypothesis_status);
  console.log("📊 Key Learning:", result.key_learning);
  console.log("🔍 Evidence:", result.evidence);
  console.log("🔄 Next Hypothesis:", result.next_hypothesis);
  console.log("🚀 Next Launch:", result.suggested_next_launch);
  console.log("💪 Momentum Note:", result.momentum_note);

  return result;
}

// ============================================
// Main Test Runner
// ============================================

async function runAllTests() {
  console.log("\n🚀 LaunchFast AI - Prompt Testing");
  console.log("═".repeat(50));

  // Check for API key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ Error: GEMINI_API_KEY not found in environment variables");
    console.log("\nTo fix:");
    console.log("1. Get free API key: https://aistudio.google.com/app/apikey");
    console.log("2. Run: export GEMINI_API_KEY='your-key-here'");
    process.exit(1);
  }

  try {
    const model = initGemini(apiKey);

    // Run tests in sequence (simulating real user flow)
    const hypothesis = await testHypothesisGeneration(model);
    const launchType = await testLaunchTypeSelection(model, hypothesis);
    const task = await testTaskGeneration(model, hypothesis, launchType);
    const learning = await testLearnLoop(model, hypothesis, task);

    console.log("\n✅ All tests completed successfully!");
    console.log("\n📊 Full Flow Summary:");
    console.log("─".repeat(50));
    console.log("1. Hypothesis:", hypothesis.hypothesis);
    console.log("2. Launch Type:", launchType.launch_type);
    console.log("3. Task:", task.task);
    console.log("4. Learning:", learning.key_learning);
    console.log("5. Next Step:", learning.suggested_next_launch);

  } catch (error) {
    console.error("\n❌ Test failed:", error.message);
    if (error.message.includes("API key")) {
      console.log("\nAPI Key issue. Get yours at: https://aistudio.google.com/app/apikey");
    }
  }
}

// ============================================
// Run if executed directly
// ============================================

// Run tests immediately
runAllTests().catch(console.error);

export { runAllTests, testHypothesisGeneration, testLaunchTypeSelection, testTaskGeneration, testLearnLoop };