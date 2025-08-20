// prisma/seed.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Create 4 modules
  const modules = await prisma.module.createMany({
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
        summary: "Spotting lows/highs & actions.",
      },
    ],
    skipDuplicates: true,
  });

  // Fetch module IDs by slug
  const he = await prisma.module.findUnique({
    where: { slug: "healthy-eating" },
  });
  const pa = await prisma.module.findUnique({
    where: { slug: "physical-activity" },
  });
  const bg = await prisma.module.findUnique({
    where: { slug: "blood-glucose" },
  });
  const rs = await prisma.module.findUnique({
    where: { slug: "recognising-symptoms" },
  });

  // Lessons
  await prisma.lesson.createMany({
    data: [
      { moduleId: he.id, title: "Carb Basics", order: 1 },
      { moduleId: he.id, title: "Reading Food Labels", order: 2 },
      { moduleId: pa.id, title: "Warm-ups & Safety", order: 1 },
      { moduleId: pa.id, title: "Cardio vs Strength", order: 2 },
      { moduleId: bg.id, title: "When to Test", order: 1 },
      { moduleId: bg.id, title: "Understanding Readings", order: 2 },
      { moduleId: rs.id, title: "Hypo vs Hyper", order: 1 },
      { moduleId: rs.id, title: "When to Seek Help", order: 2 },
    ],
    skipDuplicates: true,
  });

  // Quiz Questions (short demo)
  await prisma.quizQuestion.createMany({
    data: [
      {
        moduleId: he.id,
        question: "Which carbohydrates are generally better?",
        options: ["Simple", "Complex", "Avoid all"],
        correctIndex: 1,
      },
      {
        moduleId: he.id,
        question: "A good protein portion is about the size of your…",
        options: ["Palm", "Plate", "Fist"],
        correctIndex: 0,
      },
      {
        moduleId: pa.id,
        question: "Recommended warm-up duration?",
        options: ["1–2 min", "5–10 min", "20 min"],
        correctIndex: 1,
      },
      {
        moduleId: bg.id,
        question: "Post-meal testing is typically…",
        options: ["1–2 hours after", "4–5 hours after", "Immediately"],
        correctIndex: 0,
      },
      {
        moduleId: rs.id,
        question: "Shakiness & sweating commonly indicate…",
        options: ["Hypoglycaemia", "Hyperglycaemia", "Neither"],
        correctIndex: 0,
      },
    ],
  });

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
