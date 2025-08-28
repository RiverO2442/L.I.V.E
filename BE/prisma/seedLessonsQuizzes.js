import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const modules = {
  // ================= HEALTHY EATING =================
  "healthy-eating": {
    lessons: [
      {
        title: "Understanding Food & Carbs",
        quizzes: [
          {
            q: "Which carbohydrates are generally better?",
            options: ["Simple carbs", "Complex carbs", "No carbs"],
            correctIndex: 1,
            f: "Complex carbs release energy slowly, keeping blood sugar stable.",
          },
          {
            q: "What does GI stand for?",
            options: ["Glucose Indicator", "Glycemic Index", "General Intake"],
            correctIndex: 1,
            f: "The Glycemic Index measures how fast foods raise blood sugar.",
          },
          {
            q: "Which food is high GI?",
            options: ["White bread", "Oats", "Lentils"],
            correctIndex: 0,
            f: "White bread spikes blood sugar quickly.",
          },
          {
            q: "Which food contains healthy fats?",
            options: ["Avocado", "Candy", "Soda"],
            correctIndex: 0,
            f: "Avocados provide unsaturated fats beneficial for health.",
          },
          {
            q: "Which is a source of protein?",
            options: ["Chicken", "Rice", "Apple"],
            correctIndex: 0,
            f: "Protein is found in meat, fish, beans, and dairy.",
          },
          {
            q: "What is fiber good for?",
            options: ["Digestion & stable glucose", "Hair growth", "Vision"],
            correctIndex: 0,
            f: "Fiber slows glucose absorption and aids digestion.",
          },
          {
            q: "Which drink is best for hydration?",
            options: ["Sugary soda", "Water", "Energy drink"],
            correctIndex: 1,
            f: "Water is calorie-free and keeps you hydrated.",
          },
        ],
      },
      {
        title: "Meal Planning",
        quizzes: [
          {
            q: "What is the plate method?",
            options: [
              "Half veggies, quarter protein, quarter grains",
              "All carbs",
              "Half sweets, half fats",
            ],
            correctIndex: 0,
            f: "The plate method balances portions with vegetables, protein, and grains.",
          },
          {
            q: "Why is portion control important?",
            options: [
              "To reduce food cost",
              "To manage glucose and weight",
              "To eat faster",
            ],
            correctIndex: 1,
            f: "Portion control prevents spikes in blood sugar.",
          },
          {
            q: "What should half your plate contain?",
            options: ["Vegetables", "Bread", "Meat"],
            correctIndex: 0,
            f: "Half the plate should be non-starchy vegetables.",
          },
          {
            q: "Which is healthier snack?",
            options: ["Nuts", "Cake", "Candy"],
            correctIndex: 0,
            f: "Nuts are high in protein and healthy fats.",
          },
          {
            q: "Why spread meals across the day?",
            options: [
              "To increase hunger",
              "To maintain stable glucose",
              "To save time",
            ],
            correctIndex: 1,
            f: "Frequent smaller meals help avoid large glucose spikes.",
          },
          {
            q: "Which food is good before exercise?",
            options: ["Banana", "Fried food", "Ice cream"],
            correctIndex: 0,
            f: "Bananas provide quick and steady energy.",
          },
          {
            q: "Why reduce sugary drinks?",
            options: [
              "They dehydrate you",
              "They spike blood sugar",
              "They are tasteless",
            ],
            correctIndex: 1,
            f: "Sugary drinks cause rapid blood glucose increases.",
          },
        ],
      },
      {
        title: "Practical Skills",
        quizzes: [
          {
            q: "Which cooking method is healthiest?",
            options: ["Frying", "Grilling/Steaming", "Deep-frying"],
            correctIndex: 1,
            f: "Grilling or steaming avoids excess oils and keeps meals healthier.",
          },
          {
            q: "Why read nutrition labels?",
            options: [
              "To find hidden sugars",
              "To choose brands",
              "To read faster",
            ],
            correctIndex: 0,
            f: "Labels show sugar, carb, and fat content.",
          },
          {
            q: "Best strategy when eating out?",
            options: [
              "Choose balanced meals & smaller portions",
              "Eat everything offered",
              "Skip vegetables",
            ],
            correctIndex: 0,
            f: "Balanced meals at restaurants keep glucose stable.",
          },
          {
            q: "Which oil is healthier?",
            options: ["Olive oil", "Palm oil", "Butter"],
            correctIndex: 0,
            f: "Olive oil is unsaturated and heart-healthy.",
          },
          {
            q: "How to avoid overeating?",
            options: ["Eat slowly & mindfully", "Eat standing", "Skip meals"],
            correctIndex: 0,
            f: "Eating mindfully prevents overeating.",
          },
          {
            q: "Which dessert is better option?",
            options: ["Fruit salad", "Chocolate cake", "Ice cream"],
            correctIndex: 0,
            f: "Fruits satisfy sweet cravings without spiking glucose as much.",
          },
          {
            q: "What is a smart grocery tip?",
            options: ["Shop with a list", "Buy when hungry", "Skip veggies"],
            correctIndex: 0,
            f: "Planning groceries helps choose healthy foods.",
          },
        ],
      },
    ],
  },

  "physical-activity": {
    lessons: [
      {
        title: "Exercise Basics",
        quizzes: [
          {
            q: "Why is exercise important for diabetes management?",
            options: [
              "It reduces stress only",
              "It helps control blood sugar",
              "It replaces medication",
            ],
            correctIndex: 1,
            f: "Exercise improves insulin sensitivity and helps regulate glucose.",
          },
          {
            q: "How often should adults aim to exercise per week?",
            options: [
              "Once a week",
              "150 minutes spread across the week",
              "Daily for 2 hours",
            ],
            correctIndex: 1,
            f: "Guidelines recommend at least 150 minutes of moderate activity weekly.",
          },
          {
            q: "Which activity is aerobic?",
            options: ["Push-ups", "Walking briskly", "Stretching"],
            correctIndex: 1,
            f: "Walking briskly is aerobic and boosts cardiovascular health.",
          },
          {
            q: "What should you check before exercising?",
            options: ["Shoes", "Blood glucose level", "Weather"],
            correctIndex: 1,
            f: "Checking glucose ensures safe exercise planning.",
          },
          {
            q: "Best time to exercise?",
            options: [
              "Directly after meals",
              "Whenever safe & convenient",
              "Before sleeping",
            ],
            correctIndex: 1,
            f: "Exercise timing depends on glucose levels and daily routine.",
          },
          {
            q: "Which is a warning sign to stop exercising?",
            options: [
              "Feeling thirsty",
              "Chest pain or dizziness",
              "Sweating lightly",
            ],
            correctIndex: 1,
            f: "Stop if chest pain or dizziness occurs—these are danger signs.",
          },
          {
            q: "Which shoes are best for exercise?",
            options: ["Sandals", "Supportive sneakers", "Barefoot"],
            correctIndex: 1,
            f: "Proper footwear prevents injuries and foot problems.",
          },
        ],
      },
      {
        title: "Cardio Workouts",
        quizzes: [
          {
            q: "What does cardio exercise improve?",
            options: ["Lung and heart health", "Hair growth", "Bone size"],
            correctIndex: 0,
            f: "Cardio strengthens the heart and lungs while aiding glucose use.",
          },
          {
            q: "Which is a cardio workout?",
            options: ["Cycling", "Bicep curls", "Sit-ups"],
            correctIndex: 0,
            f: "Cycling is a great cardiovascular activity.",
          },
          {
            q: "How long should cardio sessions last ideally?",
            options: ["5 minutes", "20–30 minutes", "2 hours"],
            correctIndex: 1,
            f: "20–30 minutes of cardio supports glucose control.",
          },
          {
            q: "Which cardio is lowest impact?",
            options: ["Swimming", "Running", "Jumping jacks"],
            correctIndex: 0,
            f: "Swimming is gentle on joints yet effective.",
          },
          {
            q: "Why warm up before cardio?",
            options: [
              "To burn calories faster",
              "To reduce injury risk",
              "To lose fat",
            ],
            correctIndex: 1,
            f: "Warm-ups prepare muscles and reduce injury.",
          },
          {
            q: "Best way to track intensity?",
            options: ["Count steps", "Heart rate monitoring", "Guessing"],
            correctIndex: 1,
            f: "Monitoring heart rate helps keep safe intensity levels.",
          },
          {
            q: "Which is a good way to make cardio fun?",
            options: ["Group classes", "Dance workouts", "Sports"],
            correctIndex: 2,
            f: "Sports and group activities make cardio enjoyable.",
          },
        ],
      },
      {
        title: "Strength & Flexibility",
        quizzes: [
          {
            q: "Why include strength training?",
            options: [
              "It increases glucose uptake",
              "It reduces flexibility",
              "It causes stress",
            ],
            correctIndex: 0,
            f: "Strength training builds muscle that improves glucose use.",
          },
          {
            q: "Which is a strength activity?",
            options: ["Push-ups", "Jogging", "Yoga"],
            correctIndex: 0,
            f: "Push-ups build muscle strength.",
          },
          {
            q: "Which helps with flexibility?",
            options: ["Yoga", "Weight lifting", "Boxing"],
            correctIndex: 0,
            f: "Yoga promotes balance and flexibility.",
          },
          {
            q: "How often should strength training be done?",
            options: ["Once a month", "2–3 times per week", "Daily"],
            correctIndex: 1,
            f: "Strength training 2–3 times weekly is effective.",
          },
          {
            q: "Which body part benefits most from stretching?",
            options: ["Muscles & joints", "Hair", "Teeth"],
            correctIndex: 0,
            f: "Stretching keeps muscles and joints healthy.",
          },
          {
            q: "What’s a safe way to progress strength training?",
            options: [
              "Gradually increase weights",
              "Lift maximum weight immediately",
              "Skip rest",
            ],
            correctIndex: 0,
            f: "Increase weights slowly to avoid injury.",
          },
          {
            q: "Why include balance exercises?",
            options: ["Prevent falls", "Improve eyesight", "Gain weight"],
            correctIndex: 0,
            f: "Balance training prevents falls, especially in older adults.",
          },
        ],
      },
    ],
  },

  // ================= BLOOD GLUCOSE MONITORING =================
  "blood-glucose": {
    lessons: [
      {
        title: "Basics of Glucose Monitoring",
        quizzes: [
          {
            q: "What does blood glucose monitoring show?",
            options: [
              "Blood oxygen",
              "Glucose level in blood",
              "Blood pressure",
            ],
            correctIndex: 1,
            f: "Monitoring shows your glucose levels at different times.",
          },
          {
            q: "Why is monitoring important?",
            options: [
              "It entertains you",
              "It guides daily decisions",
              "It replaces exercise",
            ],
            correctIndex: 1,
            f: "Monitoring helps make informed food and medicine choices.",
          },
          {
            q: "Which tool measures blood sugar?",
            options: ["Thermometer", "Glucometer", "Stethoscope"],
            correctIndex: 1,
            f: "A glucometer is used to measure blood sugar.",
          },
          {
            q: "What is normal fasting glucose range?",
            options: ["80–130 mg/dL", "200–250 mg/dL", "40–60 mg/dL"],
            correctIndex: 0,
            f: "Normal fasting glucose is typically 80–130 mg/dL.",
          },
          {
            q: "What can affect readings?",
            options: ["Food intake", "Stress", "Exercise"],
            correctIndex: 0,
            f: "Meals and lifestyle strongly affect glucose readings.",
          },
          {
            q: "When should you test most often?",
            options: ["During sleep", "Before and after meals", "Once a year"],
            correctIndex: 1,
            f: "Testing around meals helps understand glucose impact.",
          },
          {
            q: "What is HbA1c?",
            options: [
              "Average 3-month glucose",
              "Daily sugar intake",
              "Insulin level",
            ],
            correctIndex: 0,
            f: "HbA1c reflects average blood sugar over 2–3 months.",
          },
        ],
      },
      {
        title: "Testing Methods",
        quizzes: [
          {
            q: "Which is a common testing site?",
            options: ["Fingertip", "Ear", "Toe"],
            correctIndex: 0,
            f: "Fingertips are commonly used for blood glucose checks.",
          },
          {
            q: "What does CGM stand for?",
            options: [
              "Continuous Glucose Monitoring",
              "Calorie Guide Monitor",
              "Cardio Glycemic Measure",
            ],
            correctIndex: 0,
            f: "CGM stands for Continuous Glucose Monitoring.",
          },
          {
            q: "Why rotate test sites?",
            options: ["Prevent soreness", "Get faster results", "Save strips"],
            correctIndex: 0,
            f: "Rotating sites avoids skin irritation and calluses.",
          },
          {
            q: "What is needed for glucometer testing?",
            options: ["Test strips", "Battery", "Blood drop"],
            correctIndex: 2,
            f: "A test strip and a drop of blood are needed.",
          },
          {
            q: "Which is less invasive?",
            options: ["CGM sensor", "Finger prick", "IV test"],
            correctIndex: 0,
            f: "CGM uses a sensor and avoids repeated pricks.",
          },
          {
            q: "How often do CGM sensors usually change?",
            options: ["Every 10–14 days", "Once a year", "Daily"],
            correctIndex: 0,
            f: "Most CGM sensors are replaced every 10–14 days.",
          },
          {
            q: "Why calibrate some glucose meters?",
            options: [
              "To keep accurate results",
              "To save power",
              "To connect online",
            ],
            correctIndex: 0,
            f: "Calibration ensures reliable results.",
          },
        ],
      },
      {
        title: "Interpreting Results",
        quizzes: [
          {
            q: "What’s a sign of hypoglycemia?",
            options: ["Shaking & sweating", "Feeling full", "Calm mood"],
            correctIndex: 0,
            f: "Low sugar often causes shaking, sweating, and dizziness.",
          },
          {
            q: "What’s a sign of hyperglycemia?",
            options: ["Excessive thirst", "Feeling cold", "Normal energy"],
            correctIndex: 0,
            f: "High sugar may cause thirst, urination, and fatigue.",
          },
          {
            q: "What’s the target 2-hour post-meal glucose?",
            options: ["<180 mg/dL", "<250 mg/dL", "<90 mg/dL"],
            correctIndex: 0,
            f: "Less than 180 mg/dL is a typical target.",
          },
          {
            q: "Why log glucose readings?",
            options: [
              "To share with healthcare team",
              "To compete with friends",
              "For fun",
            ],
            correctIndex: 0,
            f: "Logs help doctors adjust treatments.",
          },
          {
            q: "What affects morning readings?",
            options: ["Dawn phenomenon", "Sleep only", "Music"],
            correctIndex: 0,
            f: "Hormonal changes in morning can raise glucose.",
          },
          {
            q: "What to do if glucose is consistently high?",
            options: [
              "Ignore it",
              "Adjust lifestyle/consult doctor",
              "Eat more sugar",
            ],
            correctIndex: 1,
            f: "Work with a doctor to adjust food, meds, or exercise.",
          },
          {
            q: "What’s a risk of uncontrolled glucose?",
            options: [
              "Complications like heart disease",
              "Better fitness",
              "Thicker hair",
            ],
            correctIndex: 0,
            f: "Long-term high glucose damages organs.",
          },
        ],
      },
    ],
  },

  // ================= RECOGNISING SYMPTOMS =================
  "recognising-symptoms": {
    lessons: [
      {
        title: "Symptoms of High Blood Sugar",
        quizzes: [
          {
            q: "Which is a common symptom of hyperglycemia?",
            options: ["Thirst & frequent urination", "Hair loss", "Sneezing"],
            correctIndex: 0,
            f: "Excess glucose pulls water, causing thirst and urination.",
          },
          {
            q: "What happens to energy with high blood sugar?",
            options: ["More energy", "Fatigue", "Hyperactivity"],
            correctIndex: 1,
            f: "Cells can’t use glucose well, leading to fatigue.",
          },
          {
            q: "Which vision symptom may appear?",
            options: ["Blurred vision", "Better vision", "Double eyelashes"],
            correctIndex: 0,
            f: "High glucose draws fluid into eyes, causing blurriness.",
          },
          {
            q: "Which can high sugar cause?",
            options: [
              "Slow wound healing",
              "Fast muscle growth",
              "Better focus",
            ],
            correctIndex: 0,
            f: "High sugar slows the healing of cuts and infections.",
          },
          {
            q: "What’s a severe high glucose complication?",
            options: ["Ketoacidosis", "Allergies", "Arthritis"],
            correctIndex: 0,
            f: "Ketoacidosis is a dangerous emergency from very high sugar.",
          },
          {
            q: "Which organ is stressed by high sugar?",
            options: ["Kidneys", "Hair", "Lungs"],
            correctIndex: 0,
            f: "High sugar strains the kidneys and can cause damage.",
          },
          {
            q: "What’s a sign you should see a doctor?",
            options: [
              "Persistent high readings",
              "Normal readings",
              "No symptoms",
            ],
            correctIndex: 0,
            f: "Consistent highs should be reviewed by a healthcare provider.",
          },
        ],
      },
      {
        title: "Symptoms of Low Blood Sugar",
        quizzes: [
          {
            q: "What’s a common early sign of hypoglycemia?",
            options: ["Sweating & shaking", "Calm focus", "Better sleep"],
            correctIndex: 0,
            f: "Sweating and tremors signal low glucose.",
          },
          {
            q: "Which emotion is common with lows?",
            options: ["Irritability", "Joy", "Calmness"],
            correctIndex: 0,
            f: "Irritability is a common symptom.",
          },
          {
            q: "What happens to thinking ability?",
            options: ["Improves", "Becomes difficult", "Unchanged"],
            correctIndex: 1,
            f: "Low glucose makes concentration hard.",
          },
          {
            q: "Which is severe hypoglycemia?",
            options: ["Loss of consciousness", "Mild hunger", "Sweating"],
            correctIndex: 0,
            f: "Severe lows can cause fainting and require help.",
          },
          {
            q: "Best immediate treatment?",
            options: ["15g fast-acting carbs", "Exercise", "Ignore it"],
            correctIndex: 0,
            f: "Quick carbs like juice raise glucose fast.",
          },
          {
            q: "Why recheck after treatment?",
            options: ["To confirm glucose rose", "For fun", "To waste strips"],
            correctIndex: 0,
            f: "Always confirm glucose has returned to safe range.",
          },
          {
            q: "What’s an emergency step if unconscious?",
            options: ["Give glucagon injection", "Give water", "Wait it out"],
            correctIndex: 0,
            f: "Glucagon or emergency care is needed if unconscious.",
          },
        ],
      },
      {
        title: "Responding to Symptoms",
        quizzes: [
          {
            q: "What’s the first step in treating low sugar?",
            options: ["Take insulin", "Eat fast carbs", "Go running"],
            correctIndex: 1,
            f: "Fast-acting carbs like glucose tablets are first line.",
          },
          {
            q: "What should you do if sugar is very high?",
            options: [
              "Take prescribed insulin & hydrate",
              "Ignore it",
              "Exercise hard immediately",
            ],
            correctIndex: 0,
            f: "High sugar needs hydration and medical adjustment.",
          },
          {
            q: "What should you avoid with hypoglycemia?",
            options: ["Driving until recovered", "Resting", "Eating"],
            correctIndex: 0,
            f: "Never drive if blood sugar is low.",
          },
          {
            q: "Which professional should you consult for repeated issues?",
            options: ["Doctor or diabetes educator", "Chef", "Dentist"],
            correctIndex: 0,
            f: "Your healthcare provider helps manage repeated issues.",
          },
          {
            q: "What’s a good habit to prevent severe lows?",
            options: ["Carry glucose tablets", "Skip meals", "Exercise harder"],
            correctIndex: 0,
            f: "Always carry glucose sources when diabetic.",
          },
          {
            q: "Why track symptoms?",
            options: [
              "To help adjust treatment",
              "For fun",
              "To impress friends",
            ],
            correctIndex: 0,
            f: "Symptom logs guide better care plans.",
          },
          {
            q: "What’s a household precaution?",
            options: [
              "Tell family how to respond",
              "Hide condition",
              "Ignore symptoms",
            ],
            correctIndex: 0,
            f: "Educating family ensures quick help if needed.",
          },
        ],
      },
    ],
  },
};

export default modules;

async function main() {
  console.log("🌱 Seeding lessons & quizzes...");

  for (const [slug, data] of Object.entries(modules)) {
    const mod = await prisma.module.findUnique({ where: { slug } });
    if (!mod) {
      console.warn(`⚠️ Module ${slug} not found`);
      continue;
    }

    for (let i = 0; i < data.lessons.length; i++) {
      const lesson = data.lessons[i];

      // Upsert lesson
      const dbLesson = await prisma.lesson.upsert({
        where: {
          moduleId_title: { moduleId: mod.id, title: lesson.title },
        },
        update: { order: i },
        create: { moduleId: mod.id, title: lesson.title, order: i },
      });

      for (const quiz of lesson.quizzes) {
        await prisma.quizQuestion.upsert({
          where: {
            moduleId_question: { moduleId: mod.id, question: quiz.q },
          },
          update: {
            options: quiz.options,
            correctIndex: quiz.correctIndex,
            feedback: quiz.f,
            lessonId: dbLesson.id,
          },
          create: {
            moduleId: mod.id,
            lessonId: dbLesson.id,
            question: quiz.q,
            options: quiz.options,
            correctIndex: quiz.correctIndex,
            feedback: quiz.f,
          },
        });
      }
    }
  }

  console.log("✅ Done seeding lessons + quizzes.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
