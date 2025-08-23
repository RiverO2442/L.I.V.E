// prisma/seed.ts or seed.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create modules
  await prisma.module.createMany({
    data: [
      {
        slug: "healthy-eating",
        title: "Healthy Eating",
        summary: "Balanced nutrition, carbs, portion control.",
      },
      {
        slug: "physical-activity",
        title: "Physical Activity",
        summary: "Safe exercise routines & planning.",
      },
      {
        slug: "blood-glucose",
        title: "Blood Glucose Monitoring",
        summary: "Testing, interpreting, patterns.",
      },
      {
        slug: "recognising-symptoms",
        title: "Recognising Symptoms",
        summary: "Spotting lows/highs & what to do.",
      },
    ],
    skipDuplicates: true,
  });

  // Healthy Eating questions
  const healthy = await prisma.module.findUnique({
    where: { slug: "healthy-eating" },
  });
  if (healthy) {
    await prisma.quizQuestion.createMany({
      data: [
        {
          moduleId: healthy.id,
          question: "Which carbohydrates are generally better?",
          options: ["Simple", "Complex", "Avoid all"],
          correctIndex: 1,
          feedback:
            "Complex carbs release energy slowly, helping maintain stable blood sugar.",
        },
        {
          moduleId: healthy.id,
          question: "A good protein portion is about the size of your…",
          options: ["Palm", "Plate", "Fist"],
          correctIndex: 0,
          feedback:
            "Using your palm helps estimate a balanced protein serving size.",
        },
      ],
      skipDuplicates: true,
    });
  }

  // Physical Activity questions
  const activity = await prisma.module.findUnique({
    where: { slug: "physical-activity" },
  });
  if (activity) {
    await prisma.quizQuestion.createMany({
      data: [
        {
          moduleId: activity.id,
          question: "How much exercise is generally recommended per week?",
          options: ["60 minutes", "150 minutes", "300 minutes"],
          correctIndex: 1,
          feedback:
            "Health guidelines recommend about 150 minutes of moderate activity weekly.",
        },
        {
          moduleId: activity.id,
          question: "Why is warming up important before exercise?",
          options: [
            "It prevents boredom",
            "It reduces risk of injury",
            "It burns more calories",
          ],
          correctIndex: 1,
          feedback:
            "Warming up prepares muscles and reduces the risk of injury during activity.",
        },
      ],
      skipDuplicates: true,
    });
  }

  // Blood Glucose Monitoring questions
  const glucose = await prisma.module.findUnique({
    where: { slug: "blood-glucose" },
  });
  if (glucose) {
    await prisma.quizQuestion.createMany({
      data: [
        {
          moduleId: glucose.id,
          question: "When is the best time to test blood glucose?",
          options: [
            "Before meals and 2 hours after",
            "Only once a week",
            "After exercise only",
          ],
          correctIndex: 0,
          feedback:
            "Testing before meals and 2 hours after helps track blood sugar trends effectively.",
        },
        {
          moduleId: glucose.id,
          question: "Why track blood glucose readings?",
          options: [
            "To compare with friends",
            "To adjust diet and treatment",
            "Just for curiosity",
          ],
          correctIndex: 1,
          feedback:
            "Tracking readings helps adjust diet and treatment for better diabetes management.",
        },
      ],
      skipDuplicates: true,
    });
  }

  // Recognising Symptoms questions
  const symptoms = await prisma.module.findUnique({
    where: { slug: "recognising-symptoms" },
  });
  if (symptoms) {
    await prisma.quizQuestion.createMany({
      data: [
        {
          moduleId: symptoms.id,
          question: "What is a common sign of hypoglycemia?",
          options: ["Thirst", "Shaking/sweating", "Blurred vision"],
          correctIndex: 1,
          feedback:
            "Shaking, sweating, and dizziness are classic signs of low blood sugar (hypoglycemia).",
        },
        {
          moduleId: symptoms.id,
          question: "When should you seek medical help?",
          options: [
            "If symptoms are severe or persistent",
            "Only if you miss a meal",
            "Whenever you feel tired",
          ],
          correctIndex: 0,
          feedback:
            "Seek medical help if symptoms are severe or don’t improve with treatment.",
        },
      ],
      skipDuplicates: true,
    });
  }

  console.log("✅ Database has been seeded successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
