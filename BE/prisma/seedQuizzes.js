// prisma/seedQuizzes.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const quizzes = {
  "healthy-eating": [
    {
      q: "Which carbohydrates are best for stable blood sugar?",
      f: "Complex carbs like whole grains and legumes release energy slowly.",
      options: [
        "Sugary drinks",
        "White bread",
        "Whole grains & legumes",
        "Candy",
      ],
      correctIndex: 2,
    },
    {
      q: "Why should diabetics limit sugary drinks?",
      f: "They cause rapid spikes in blood sugar with little nutrition.",
      options: [
        "They hydrate best",
        "They are high in sugar",
        "They are rich in protein",
        "They are low in carbs",
      ],
      correctIndex: 1,
    },
    {
      q: "What is the plate method?",
      f: "Half veggies, quarter protein, quarter whole grains.",
      options: [
        "Half protein, half carbs",
        "Half veggies, quarter protein, quarter whole grains",
        "All fruits",
        "Mostly dairy",
      ],
      correctIndex: 1,
    },
    {
      q: "How does portion control help?",
      f: "Smaller portions prevent spikes and weight gain.",
      options: [
        "It increases hunger",
        "It prevents sugar spikes",
        "It reduces vitamins",
        "It causes cravings",
      ],
      correctIndex: 1,
    },
    {
      q: "What foods are best for fiber?",
      f: "Vegetables, beans, oats, and whole grains.",
      options: [
        "Fried foods",
        "Processed snacks",
        "Vegetables and oats",
        "Candy",
      ],
      correctIndex: 2,
    },
    {
      q: "How often should meals be eaten?",
      f: "Every 4–5 hours to keep blood sugar steady.",
      options: [
        "Once per day",
        "Every hour",
        "Every 4–5 hours",
        "Every 10 hours",
      ],
      correctIndex: 2,
    },
    {
      q: "Are artificial sweeteners safe?",
      f: "Most don’t raise blood sugar and are safe in moderation.",
      options: [
        "Always harmful",
        "Safe in moderation",
        "Raise blood sugar",
        "Cause weight gain",
      ],
      correctIndex: 1,
    },
    {
      q: "Why avoid refined carbs?",
      f: "They break down quickly and raise blood sugar fast.",
      options: [
        "They are high in vitamins",
        "They lower sugar",
        "They raise blood sugar fast",
        "They prevent spikes",
      ],
      correctIndex: 2,
    },
    {
      q: "What fats are healthiest?",
      f: "Unsaturated fats like olive oil, nuts, and fish.",
      options: [
        "Saturated fats",
        "Trans fats",
        "Unsaturated fats",
        "Fried oils",
      ],
      correctIndex: 2,
    },
    {
      q: "Why is protein important?",
      f: "It slows digestion and helps stabilize blood sugar.",
      options: [
        "Raises sugar",
        "Slows digestion",
        "Reduces fiber",
        "Increases cravings",
      ],
      correctIndex: 1,
    },
  ],
  "physical-activity": [
    {
      q: "Why is exercise important?",
      f: "It improves insulin sensitivity and lowers blood sugar.",
      options: [
        "Raises sugar",
        "Improves insulin sensitivity",
        "Causes illness",
        "Prevents sleep",
      ],
      correctIndex: 1,
    },
    {
      q: "How much exercise weekly?",
      f: "At least 150 minutes of moderate activity.",
      options: ["50 minutes", "100 minutes", "150 minutes", "300 minutes"],
      correctIndex: 2,
    },
    {
      q: "Best time to exercise?",
      f: "1–3 hours after meals when sugar is higher.",
      options: ["Before bed", "After meals", "On empty stomach", "At midnight"],
      correctIndex: 1,
    },
    {
      q: "Why warm up first?",
      f: "Prepares muscles and prevents injury.",
      options: [
        "To get tired",
        "To prevent injury",
        "To raise sugar",
        "To shorten workout",
      ],
      correctIndex: 1,
    },
    {
      q: "How does strength training help?",
      f: "Muscle uses glucose more efficiently.",
      options: [
        "Increases fat",
        "Weakens bones",
        "Uses glucose efficiently",
        "Raises cholesterol",
      ],
      correctIndex: 2,
    },
  ],
  "blood-glucose": [
    {
      q: "What is normal fasting blood sugar?",
      f: "70–100 mg/dL.",
      options: ["40–60", "70–100", "120–150", "200+"],
      correctIndex: 1,
    },
    {
      q: "When test sugar?",
      f: "Before meals, at bedtime, and with symptoms.",
      options: [
        "Only once a week",
        "Before meals & bedtime",
        "Never",
        "Only in morning",
      ],
      correctIndex: 1,
    },
    {
      q: "What is HbA1c?",
      f: "It measures 2–3 months average blood sugar.",
      options: [
        "Daily sugar",
        "2–3 month average",
        "Cholesterol",
        "Blood pressure",
      ],
      correctIndex: 1,
    },
    {
      q: "What causes spikes?",
      f: "Large meals, stress, illness, lack of activity.",
      options: ["Exercise", "Fiber", "Stress & big meals", "Protein intake"],
      correctIndex: 2,
    },
    {
      q: "How to treat low sugar?",
      f: "Take 15g of carbs, recheck after 15 min.",
      options: [
        "Skip food",
        "Drink water",
        "15g carbs then recheck",
        "Sleep it off",
      ],
      correctIndex: 2,
    },
  ],
  "recognising-symptoms": [
    {
      q: "Early signs of high sugar?",
      f: "Thirst, frequent urination, blurred vision.",
      options: ["Thirst & urination", "Low energy only", "Cough", "Headache"],
      correctIndex: 0,
    },
    {
      q: "Signs of low sugar?",
      f: "Shakiness, sweating, confusion.",
      options: ["Shakiness & sweating", "Thirst", "Calmness", "None"],
      correctIndex: 0,
    },
    {
      q: "When call doctor?",
      f: "Sugar >400 mg/dL or difficulty breathing.",
      options: [
        "Always",
        "Never",
        "Only if >400 or trouble breathing",
        "At 100 mg/dL",
      ],
      correctIndex: 2,
    },
    {
      q: "What is neuropathy?",
      f: "Nerve damage causing numbness or tingling.",
      options: [
        "Eye disease",
        "Nerve damage",
        "Kidney issue",
        "Lung infection",
      ],
      correctIndex: 1,
    },
    {
      q: "Why infections common?",
      f: "High sugar weakens immunity.",
      options: [
        "Sugar strengthens immunity",
        "High sugar weakens immunity",
        "Low sugar helps bacteria",
        "None",
      ],
      correctIndex: 1,
    },
  ],
};

async function main() {
  for (const [slug, qs] of Object.entries(quizzes)) {
    // 1. Find module by slug
    const mod = await prisma.module.findUnique({ where: { slug } });
    if (!mod) {
      console.warn(`⚠️ Module ${slug} not found, skipping...`);
      continue;
    }

    // 2. Insert or update quizzes for this module
    for (const q of qs) {
      await prisma.quizQuestion.upsert({
        where: {
          moduleId_question: {
            // requires @@unique([moduleId, question]) in schema
            moduleId: mod.id,
            question: q.q,
          },
        },
        update: {
          feedback: q.f,
          options: q.options,
          correctIndex: q.correctIndex,
        },
        create: {
          moduleId: mod.id,
          question: q.q,
          feedback: q.f,
          options: q.options,
          correctIndex: q.correctIndex,
        },
      });
    }

    console.log(`✅ Synced ${qs.length} quizzes for ${slug}`);
  }
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
