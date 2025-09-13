// Block Templates for Tactical Barbell Workout System
// Contains workout configuration templates for different training blocks

export const blockTemplates = {
  endurance1: {
    weeks: [
      {
        days: [
          { type: "strength", exercises: ["Overhead Press", "Front Squat", "Weighted Pull-up"], sets: "3x5", intensity: 70 },
          { type: "liss", activity: "LISS run", duration: 60 },
          { type: "strength", exercises: ["Overhead Press", "Front Squat", "Trap Bar Deadlift"], sets: "3x5", intensity: 70 },
          { type: "liss", activity: "LISS run", duration: 30 },
          { type: "strength", exercises: ["Overhead Press", "Front Squat", "Weighted Pull-up"], sets: "3x5", intensity: 70 },
          { type: "liss", activity: "LISS run", duration: 90 },
          { type: "rest" }
        ]
      },
      {
        days: [
          { type: "strength", exercises: ["Overhead Press", "Front Squat", "Weighted Pull-up"], sets: "3x5", intensity: 80 },
          { type: "liss", activity: "LISS run", duration: 60 },
          { type: "strength", exercises: ["Overhead Press", "Front Squat", "Trap Bar Deadlift"], sets: "3x5", intensity: 80 },
          { type: "liss", activity: "LISS run", duration: 30 },
          { type: "strength", exercises: ["Overhead Press", "Front Squat", "Weighted Pull-up"], sets: "3x5", intensity: 80 },
          { type: "liss", activity: "LISS run", duration: 90 },
          { type: "rest" }
        ]
      },
      {
        days: [
          { type: "strength", exercises: ["Overhead Press", "Front Squat", "Weighted Pull-up"], sets: "3x3", intensity: 90 },
          { type: "liss", activity: "LISS run", duration: 60 },
          { type: "strength", exercises: ["Overhead Press", "Front Squat", "Trap Bar Deadlift"], sets: "3x3", intensity: 90 },
          { type: "liss", activity: "LISS run", duration: 30 },
          { type: "strength", exercises: ["Overhead Press", "Front Squat", "Weighted Pull-up"], sets: "3x3", intensity: 90 },
          { type: "liss", activity: "LISS run", duration: 90 },
          { type: "rest" }
        ]
      },
      {
        days: [
          { type: "deload" },
          { type: "liss", activity: "LISS run", duration: 30 },
          { type: "deload" },
          { type: "liss", activity: "LISS run", duration: 30 },
          { type: "deload" },
          { type: "liss", activity: "LISS run", duration: 30 },
          { type: "rest" }
        ]
      },
      {
        days: [
          { type: "strength", exercises: ["Overhead Press", "Front Squat", "Weighted Pull-up"], sets: "3x5", intensity: 75 },
          { type: "liss", activity: "LISS run", duration: 90 },
          { type: "strength", exercises: ["Overhead Press", "Front Squat", "Trap Bar Deadlift"], sets: "3x5", intensity: 75 },
          { type: "liss", activity: "LISS run", duration: 60 },
          { type: "strength", exercises: ["Overhead Press", "Front Squat", "Weighted Pull-up"], sets: "3x5", intensity: 75 },
          { type: "liss", activity: "LISS run", duration: 120 },
          { type: "rest" }
        ]
      },
      {
        days: [
          { type: "strength", exercises: ["Overhead Press", "Front Squat", "Weighted Pull-up"], sets: "3x3", intensity: 85 },
          { type: "liss", activity: "LISS run", duration: 90 },
          { type: "strength", exercises: ["Overhead Press", "Front Squat", "Trap Bar Deadlift"], sets: "3x3", intensity: 85 },
          { type: "liss", activity: "LISS run", duration: 60 },
          { type: "strength", exercises: ["Overhead Press", "Front Squat", "Weighted Pull-up"], sets: "3x3", intensity: 85 },
          { type: "liss", activity: "LISS run", duration: 120 },
          { type: "rest" }
        ]
      },
      {
        days: [
          { type: "strength", exercises: ["Overhead Press", "Front Squat", "Weighted Pull-up"], sets: "4x2", intensity: 95 },
          { type: "liss", activity: "LISS run", duration: 90 },
          { type: "strength", exercises: ["Overhead Press", "Front Squat", "Trap Bar Deadlift"], sets: "4x2", intensity: 95 },
          { type: "liss", activity: "LISS run", duration: 60 },
          { type: "strength", exercises: ["Overhead Press", "Front Squat", "Weighted Pull-up"], sets: "4x2", intensity: 95 },
          { type: "liss", activity: "LISS run", duration: 120 },
          { type: "rest" }
        ]
      },
      {
        days: [
          { type: "deload" },
          { type: "liss", activity: "LISS run", duration: 30 },
          { type: "deload" },
          { type: "liss", activity: "LISS run", duration: 30 },
          { type: "deload" },
          { type: "liss", activity: "LISS run", duration: 30 },
          { type: "rest" }
        ]
      }
    ]
  },
  powerbuilding1: {
    weeks: [
      {
        days: [
          { type: "strength", exercises: ["Overhead Press", "Front Squat", "Weighted Pull-up"], sets: "3x5", intensity: 75 },
          { type: "hypertrophy", exercises: ["Close Grip Bench Press", "Barbell Row", "Overhead Press"], sets: "3x8-12" },
          { type: "strength", exercises: ["Overhead Press", "Front Squat", "Trap Bar Deadlift"], sets: "3x5", intensity: 75 },
          { type: "hypertrophy", exercises: ["Incline Dumbbell Press", "Romanian Deadlift", "Weighted Dips"], sets: "3x8-12" },
          { type: "strength", exercises: ["Overhead Press", "Front Squat", "Weighted Pull-up"], sets: "3x5", intensity: 75 },
          { type: "hypertrophy", exercises: ["Dumbbell Shoulder Press", "Bulgarian Split Squat", "Face Pulls"], sets: "3x8-12" },
          { type: "rest" }
        ]
      },
      {
        days: [
          { type: "strength", exercises: ["Overhead Press", "Front Squat", "Weighted Pull-up"], sets: "3x3", intensity: 85 },
          { type: "hypertrophy", exercises: ["Close Grip Bench Press", "Barbell Row", "Overhead Press"], sets: "3x8-12" },
          { type: "strength", exercises: ["Overhead Press", "Front Squat", "Trap Bar Deadlift"], sets: "3x3", intensity: 85 },
          { type: "hypertrophy", exercises: ["Incline Dumbbell Press", "Romanian Deadlift", "Weighted Dips"], sets: "3x8-12" },
          { type: "strength", exercises: ["Overhead Press", "Front Squat", "Weighted Pull-up"], sets: "3x3", intensity: 85 },
          { type: "hypertrophy", exercises: ["Dumbbell Shoulder Press", "Bulgarian Split Squat", "Face Pulls"], sets: "3x8-12" },
          { type: "rest" }
        ]
      },
      {
        days: [
          { type: "strength", exercises: ["Overhead Press", "Front Squat", "Weighted Pull-up"], sets: "5x1", intensity: 95 },
          { type: "hypertrophy", exercises: ["Close Grip Bench Press", "Barbell Row", "Overhead Press"], sets: "3x8-12" },
          { type: "strength", exercises: ["Overhead Press", "Front Squat", "Trap Bar Deadlift"], sets: "5x1", intensity: 95 },
          { type: "hypertrophy", exercises: ["Incline Dumbbell Press", "Romanian Deadlift", "Weighted Dips"], sets: "3x8-12" },
          { type: "strength", exercises: ["Overhead Press", "Front Squat", "Weighted Pull-up"], sets: "5x1", intensity: 95 },
          { type: "hypertrophy", exercises: ["Dumbbell Shoulder Press", "Bulgarian Split Squat", "Face Pulls"], sets: "3x8-12" },
          { type: "rest" }
        ]
      }
    ]
  },
  powerbuilding2: {
    weeks: [
      {
        days: [
          { type: "strength", exercises: ["Bench Press", "Squat", "Weighted Pull-up"], sets: "3x5", intensity: 75 },
          { type: "hypertrophy", exercises: ["Incline Dumbbell Press", "Romanian Deadlift", "Barbell Row"], sets: "3x8-12" },
          { type: "strength", exercises: ["Overhead Press", "Deadlift", "Weighted Dips"], sets: "3x5", intensity: 75 },
          { type: "hypertrophy", exercises: ["Dumbbell Shoulder Press", "Bulgarian Split Squat", "Lat Pulldown"], sets: "3x8-12" },
          { type: "strength", exercises: ["Bench Press", "Front Squat", "Barbell Row"], sets: "3x5", intensity: 75 },
          { type: "hypertrophy", exercises: ["Close Grip Bench Press", "Walking Lunges", "Face Pulls"], sets: "3x8-12" },
          { type: "rest" }
        ]
      },
      {
        days: [
          { type: "strength", exercises: ["Bench Press", "Squat", "Weighted Pull-up"], sets: "3x3", intensity: 85 },
          { type: "hypertrophy", exercises: ["Incline Dumbbell Press", "Romanian Deadlift", "Barbell Row"], sets: "3x8-12" },
          { type: "strength", exercises: ["Overhead Press", "Deadlift", "Weighted Dips"], sets: "3x3", intensity: 85 },
          { type: "hypertrophy", exercises: ["Dumbbell Shoulder Press", "Bulgarian Split Squat", "Lat Pulldown"], sets: "3x8-12" },
          { type: "strength", exercises: ["Bench Press", "Front Squat", "Barbell Row"], sets: "3x3", intensity: 85 },
          { type: "hypertrophy", exercises: ["Close Grip Bench Press", "Walking Lunges", "Face Pulls"], sets: "3x8-12" },
          { type: "rest" }
        ]
      },
      {
        days: [
          { type: "strength", exercises: ["Bench Press", "Squat", "Weighted Pull-up"], sets: "5x1", intensity: 95 },
          { type: "hypertrophy", exercises: ["Incline Dumbbell Press", "Romanian Deadlift", "Barbell Row"], sets: "3x8-12" },
          { type: "strength", exercises: ["Overhead Press", "Deadlift", "Weighted Dips"], sets: "5x1", intensity: 95 },
          { type: "hypertrophy", exercises: ["Dumbbell Shoulder Press", "Bulgarian Split Squat", "Lat Pulldown"], sets: "3x8-12" },
          { type: "strength", exercises: ["Bench Press", "Front Squat", "Barbell Row"], sets: "5x1", intensity: 95 },
          { type: "hypertrophy", exercises: ["Close Grip Bench Press", "Walking Lunges", "Face Pulls"], sets: "3x8-12" },
          { type: "rest" }
        ]
      }
    ]
  },
  powerbuilding3: {
    weeks: [
      {
        days: [
          { type: "strength", exercises: ["Bench Press", "Squat", "Weighted Pull-up"], sets: "5x3", intensity: 80 },
          { type: "hypertrophy", exercises: ["Incline Dumbbell Press", "Romanian Deadlift", "Barbell Row"], sets: "4x8-12" },
          { type: "strength", exercises: ["Overhead Press", "Deadlift", "Weighted Dips"], sets: "5x3", intensity: 80 },
          { type: "hypertrophy", exercises: ["Dumbbell Shoulder Press", "Bulgarian Split Squat", "Lat Pulldown"], sets: "4x8-12" },
          { type: "strength", exercises: ["Bench Press", "Front Squat", "Barbell Row"], sets: "5x3", intensity: 80 },
          { type: "hypertrophy", exercises: ["Close Grip Bench Press", "Walking Lunges", "Face Pulls"], sets: "4x8-12" },
          { type: "rest" }
        ]
      },
      {
        days: [
          { type: "strength", exercises: ["Bench Press", "Squat", "Weighted Pull-up"], sets: "5x2", intensity: 87.5 },
          { type: "hypertrophy", exercises: ["Incline Dumbbell Press", "Romanian Deadlift", "Barbell Row"], sets: "4x8-12" },
          { type: "strength", exercises: ["Overhead Press", "Deadlift", "Weighted Dips"], sets: "5x2", intensity: 87.5 },
          { type: "hypertrophy", exercises: ["Dumbbell Shoulder Press", "Bulgarian Split Squat", "Lat Pulldown"], sets: "4x8-12" },
          { type: "strength", exercises: ["Bench Press", "Front Squat", "Barbell Row"], sets: "5x2", intensity: 87.5 },
          { type: "hypertrophy", exercises: ["Close Grip Bench Press", "Walking Lunges", "Face Pulls"], sets: "4x8-12" },
          { type: "rest" }
        ]
      },
      {
        days: [
          { type: "strength", exercises: ["Bench Press", "Squat", "Weighted Pull-up"], sets: "6x1", intensity: 95 },
          { type: "hypertrophy", exercises: ["Incline Dumbbell Press", "Romanian Deadlift", "Barbell Row"], sets: "4x8-12" },
          { type: "strength", exercises: ["Overhead Press", "Deadlift", "Weighted Dips"], sets: "6x1", intensity: 95 },
          { type: "hypertrophy", exercises: ["Dumbbell Shoulder Press", "Bulgarian Split Squat", "Lat Pulldown"], sets: "4x8-12" },
          { type: "strength", exercises: ["Bench Press", "Front Squat", "Barbell Row"], sets: "6x1", intensity: 95 },
          { type: "hypertrophy", exercises: ["Close Grip Bench Press", "Walking Lunges", "Face Pulls"], sets: "4x8-12" },
          { type: "rest" }
        ]
      }
    ]
  },
  powerbuilding3bulgarian: {
    weeks: [
      {
        days: [
          { type: "strength", exercises: ["Squat", "Bench Press", "Weighted Pull-up"], sets: "Work up to daily max then 85% 3x3", intensity: 100 },
          { type: "hypertrophy", exercises: ["Incline Dumbbell Press", "Romanian Deadlift", "Barbell Row"], sets: "3x8-12" },
          { type: "strength", exercises: ["Squat", "Overhead Press", "Weighted Dips"], sets: "Work up to daily max then 85% 3x3", intensity: 100 },
          { type: "hypertrophy", exercises: ["Dumbbell Shoulder Press", "Bulgarian Split Squat", "Lat Pulldown"], sets: "3x8-12" },
          { type: "strength", exercises: ["Squat", "Bench Press", "Barbell Row"], sets: "Work up to daily max then 85% 3x3", intensity: 100 },
          { type: "hypertrophy", exercises: ["Close Grip Bench Press", "Walking Lunges", "Face Pulls"], sets: "3x8-12" },
          { type: "rest" }
        ]
      },
      {
        days: [
          { type: "strength", exercises: ["Squat", "Bench Press", "Weighted Pull-up"], sets: "Work up to daily max then 90% 2x2", intensity: 100 },
          { type: "hypertrophy", exercises: ["Incline Dumbbell Press", "Romanian Deadlift", "Barbell Row"], sets: "3x8-12" },
          { type: "strength", exercises: ["Squat", "Overhead Press", "Weighted Dips"], sets: "Work up to daily max then 90% 2x2", intensity: 100 },
          { type: "hypertrophy", exercises: ["Dumbbell Shoulder Press", "Bulgarian Split Squat", "Lat Pulldown"], sets: "3x8-12" },
          { type: "strength", exercises: ["Squat", "Bench Press", "Barbell Row"], sets: "Work up to daily max then 90% 2x2", intensity: 100 },
          { type: "hypertrophy", exercises: ["Close Grip Bench Press", "Walking Lunges", "Face Pulls"], sets: "3x8-12" },
          { type: "rest" }
        ]
      },
      {
        days: [
          { type: "strength", exercises: ["Squat", "Bench Press", "Weighted Pull-up"], sets: "Work up to daily max then 95% 1x1", intensity: 100 },
          { type: "hypertrophy", exercises: ["Incline Dumbbell Press", "Romanian Deadlift", "Barbell Row"], sets: "3x8-12" },
          { type: "strength", exercises: ["Squat", "Overhead Press", "Weighted Dips"], sets: "Work up to daily max then 95% 1x1", intensity: 100 },
          { type: "hypertrophy", exercises: ["Dumbbell Shoulder Press", "Bulgarian Split Squat", "Lat Pulldown"], sets: "3x8-12" },
          { type: "strength", exercises: ["Squat", "Bench Press", "Barbell Row"], sets: "Work up to daily max then 95% 1x1", intensity: 100 },
          { type: "hypertrophy", exercises: ["Close Grip Bench Press", "Walking Lunges", "Face Pulls"], sets: "3x8-12" },
          { type: "rest" }
        ]
      }
    ]
  },
  bodybuilding: {
    weeks: [
      {
        days: [
          { type: "hypertrophy", exercises: ["Bench Press", "Incline Dumbbell Press", "Weighted Dips", "Close Grip Bench Press", "Tricep Dips"], sets: "4x8-12" },
          { type: "hypertrophy", exercises: ["Squat", "Romanian Deadlift", "Bulgarian Split Squat", "Walking Lunges", "Calf Raises"], sets: "4x8-12" },
          { type: "hypertrophy", exercises: ["Weighted Pull-up", "Barbell Row", "Lat Pulldown", "Face Pulls", "Barbell Curl"], sets: "4x8-12" },
          { type: "hypertrophy", exercises: ["Overhead Press", "Dumbbell Shoulder Press", "Lateral Raises", "Rear Delt Flies", "Shrugs"], sets: "4x8-12" },
          { type: "hypertrophy", exercises: ["Deadlift", "Good Mornings", "Glute Ham Raises", "Back Extensions", "Plank"], sets: "4x8-12" },
          { type: "hypertrophy", exercises: ["Full Body Circuit", "Farmer's Walk", "Battle Ropes", "Burpees", "Mountain Climbers"], sets: "3x8-12" },
          { type: "rest" }
        ]
      },
      {
        days: [
          { type: "hypertrophy", exercises: ["Incline Barbell Press", "Dumbbell Flyes", "Cable Crossovers", "Diamond Push-ups", "Overhead Tricep Extension"], sets: "4x8-12" },
          { type: "hypertrophy", exercises: ["Front Squat", "Goblet Squat", "Step-ups", "Leg Curls", "Calf Raises"], sets: "4x8-12" },
          { type: "hypertrophy", exercises: ["T-Bar Row", "Cable Row", "Reverse Flyes", "Hammer Curls", "Cable Curls"], sets: "4x8-12" },
          { type: "hypertrophy", exercises: ["Arnold Press", "Front Raises", "Cable Lateral Raises", "Upright Rows", "Face Pulls"], sets: "4x8-12" },
          { type: "hypertrophy", exercises: ["Sumo Deadlift", "Hip Thrusts", "Single Leg RDL", "Reverse Hypers", "Side Plank"], sets: "4x8-12" },
          { type: "hypertrophy", exercises: ["HIIT Circuit", "Jump Squats", "Push-up to T", "High Knees", "Plank Jacks"], sets: "3x30s" },
          { type: "rest" }
        ]
      },
      {
        days: [
          { type: "hypertrophy", exercises: ["Dumbbell Press", "Cable Flyes", "Dips", "Skull Crushers", "Cable Tricep Pushdowns"], sets: "4x8-12" },
          { type: "hypertrophy", exercises: ["Hack Squat", "Leg Press", "Leg Extensions", "Leg Curls", "Standing Calf Raises"], sets: "4x8-12" },
          { type: "hypertrophy", exercises: ["Wide Grip Pull-ups", "Bent Over Row", "Cable Rows", "Preacher Curls", "Cable Hammer Curls"], sets: "4x8-12" },
          { type: "hypertrophy", exercises: ["Seated Dumbbell Press", "Cable Lateral Raises", "Bent Over Lateral Raises", "Cable Shrugs", "Barbell Shrugs"], sets: "4x8-12" },
          { type: "hypertrophy", exercises: ["Trap Bar Deadlift", "Stiff Leg Deadlift", "Cable Pull Throughs", "Good Mornings", "Russian Twists"], sets: "4x8-12" },
          { type: "hypertrophy", exercises: ["Metabolic Circuit", "Kettlebell Swings", "Box Jumps", "Rowing Machine", "Bike Sprints"], sets: "3x45s" },
          { type: "rest" }
        ]
      }
    ]
  },
  strength: {
    weeks: [
      {
        days: [
          { type: "strength", exercises: ["Squat", "Bench Press", "Barbell Row"], sets: "3x5", intensity: 65 },
          { type: "strength", exercises: ["Overhead Press", "Deadlift", "Weighted Chin-up"], sets: "3x5", intensity: 65 },
          { type: "strength", exercises: ["Squat", "Bench Press", "Barbell Row"], sets: "3x5", intensity: 65 },
          { type: "strength", exercises: ["Overhead Press", "Deadlift", "Weighted Chin-up"], sets: "3x5", intensity: 65 },
          { type: "strength", exercises: ["Squat", "Bench Press", "Barbell Row"], sets: "3x5", intensity: 65 },
          { type: "rest" },
          { type: "rest" }
        ]
      },
      {
        days: [
          { type: "strength", exercises: ["Squat", "Bench Press", "Barbell Row"], sets: "3x5", intensity: 70 },
          { type: "strength", exercises: ["Overhead Press", "Deadlift", "Weighted Chin-up"], sets: "3x5", intensity: 70 },
          { type: "strength", exercises: ["Squat", "Bench Press", "Barbell Row"], sets: "3x5", intensity: 70 },
          { type: "strength", exercises: ["Overhead Press", "Deadlift", "Weighted Chin-up"], sets: "3x5", intensity: 70 },
          { type: "strength", exercises: ["Squat", "Bench Press", "Barbell Row"], sets: "3x5", intensity: 70 },
          { type: "rest" },
          { type: "rest" }
        ]
      },
      {
        days: [
          { type: "strength", exercises: ["Squat", "Bench Press", "Barbell Row"], sets: "3x5", intensity: 75 },
          { type: "strength", exercises: ["Overhead Press", "Deadlift", "Weighted Chin-up"], sets: "3x5", intensity: 75 },
          { type: "strength", exercises: ["Squat", "Bench Press", "Barbell Row"], sets: "3x5", intensity: 75 },
          { type: "strength", exercises: ["Overhead Press", "Deadlift", "Weighted Chin-up"], sets: "3x5", intensity: 75 },
          { type: "strength", exercises: ["Squat", "Bench Press", "Barbell Row"], sets: "3x5", intensity: 75 },
          { type: "rest" },
          { type: "rest" }
        ]
      },
      {
        days: [
          { type: "deload" },
          { type: "deload" },
          { type: "deload" },
          { type: "deload" },
          { type: "deload" },
          { type: "rest" },
          { type: "rest" }
        ]
      },
      {
        days: [
          { type: "strength", exercises: ["Squat", "Bench Press", "Barbell Row"], sets: "3x3", intensity: 80 },
          { type: "strength", exercises: ["Overhead Press", "Deadlift", "Weighted Chin-up"], sets: "3x3", intensity: 80 },
          { type: "strength", exercises: ["Squat", "Bench Press", "Barbell Row"], sets: "3x3", intensity: 80 },
          { type: "strength", exercises: ["Overhead Press", "Deadlift", "Weighted Chin-up"], sets: "3x3", intensity: 80 },
          { type: "strength", exercises: ["Squat", "Bench Press", "Barbell Row"], sets: "3x3", intensity: 80 },
          { type: "rest" },
          { type: "rest" }
        ]
      },
      {
        days: [
          { type: "strength", exercises: ["Squat", "Bench Press", "Barbell Row"], sets: "3x3", intensity: 85 },
          { type: "strength", exercises: ["Overhead Press", "Deadlift", "Weighted Chin-up"], sets: "3x3", intensity: 85 },
          { type: "strength", exercises: ["Squat", "Bench Press", "Barbell Row"], sets: "3x3", intensity: 85 },
          { type: "strength", exercises: ["Overhead Press", "Deadlift", "Weighted Chin-up"], sets: "3x3", intensity: 85 },
          { type: "strength", exercises: ["Squat", "Bench Press", "Barbell Row"], sets: "3x3", intensity: 85 },
          { type: "rest" },
          { type: "rest" }
        ]
      },
      {
        days: [
          { type: "strength", exercises: ["Squat", "Bench Press", "Barbell Row"], sets: "3x3", intensity: 90 },
          { type: "strength", exercises: ["Overhead Press", "Deadlift", "Weighted Chin-up"], sets: "3x3", intensity: 90 },
          { type: "strength", exercises: ["Squat", "Bench Press", "Barbell Row"], sets: "3x3", intensity: 90 },
          { type: "strength", exercises: ["Overhead Press", "Deadlift", "Weighted Chin-up"], sets: "3x3", intensity: 90 },
          { type: "strength", exercises: ["Squat", "Bench Press", "Barbell Row"], sets: "3x3", intensity: 90 },
          { type: "rest" },
          { type: "rest" }
        ]
      },
      {
        days: [
          { type: "deload" },
          { type: "deload" },
          { type: "deload" },
          { type: "deload" },
          { type: "deload" },
          { type: "rest" },
          { type: "rest" }
        ]
      },
      {
        days: [
          { type: "strength", exercises: ["Squat"], sets: "1x1", intensity: 100 },
          { type: "strength", exercises: ["Bench Press"], sets: "1x1", intensity: 100 },
          { type: "strength", exercises: ["Deadlift"], sets: "1x1", intensity: 100 },
          { type: "rest" },
          { type: "rest" },
          { type: "rest" },
          { type: "rest" }
        ]
      }
    ]
  }
};