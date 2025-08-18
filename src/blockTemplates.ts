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
          { type: "strength", exercises: ["Bench Press", "Squat"], sets: "5x8", intensity: 60 },
          { type: "liss", activity: "Walk", duration: 60 },
          { type: "strength", exercises: ["Bench Press", "Squat"], sets: "5x8", intensity: 60 },
          { type: "liss", activity: "LISS run", duration: 20 },
          { type: "strength", exercises: ["Deadlift"], sets: "5x8", intensity: 60 },
          { type: "liss", activity: "Ruck", duration: 60 },
          { type: "rest" }
        ]
      },
      {
        days: [
          { type: "strength", exercises: ["Bench Press", "Squat"], sets: "5x6", intensity: 70 },
          { type: "liss", activity: "Walk", duration: 60 },
          { type: "strength", exercises: ["Bench Press", "Squat"], sets: "5x6", intensity: 70 },
          { type: "liss", activity: "LISS run", duration: 20 },
          { type: "strength", exercises: ["Deadlift"], sets: "5x5", intensity: 70 },
          { type: "liss", activity: "Ruck", duration: 60 },
          { type: "rest" }
        ]
      },
      {
        days: [
          { type: "strength", exercises: ["Bench Press", "Squat"], sets: "5x3", intensity: 80 },
          { type: "liss", activity: "Walk", duration: 60 },
          { type: "strength", exercises: ["Bench Press", "Squat"], sets: "5x3", intensity: 80 },
          { type: "liss", activity: "LISS run", duration: 20 },
          { type: "strength", exercises: ["Deadlift"], sets: "10x3", intensity: 80 },
          { type: "liss", activity: "Ruck", duration: 60 },
          { type: "rest" }
        ]
      }
    ]
  },
  powerbuilding2: {
    weeks: [
      {
        days: [
          { type: "strength", exercises: ["Bench Press", "Squat", "Calf Raises", "Adduction Machine", "Abduction Machine"], sets: "4x8,4x8,4x12,4x12,4x12", intensity: "70,70,55,55,55" },
          { type: "liss", activity: "Walk", duration: 60 },
          { type: "strength", exercises: ["Overhead Press", "Deadlift", "KB Halos", "KB Rotational Swings", "KB Side Bends"], sets: "4x8,4x8,4x12,4x12,4x12", intensity: "70,70,55,55,55" },
          { type: "liss", activity: "LISS run", duration: 30 },
          { type: "strength", exercises: ["Bench Press", "Squat", "Calf Raises", "Adduction Machine", "Abduction Machine"], sets: "4x8,4x8,4x12,4x12,4x12", intensity: "70,70,55,55,55" },
          { type: "rest" },
          { type: "rest" }
        ]
      },
      {
        days: [
          { type: "strength", exercises: ["Overhead Press", "Deadlift", "KB Halos", "KB Rotational Swings", "KB Side Bends"], sets: "4x6,4x6,4x10,4x10,4x10", intensity: "75,75,60,60,60" },
          { type: "liss", activity: "Walk", duration: 60 },
          { type: "strength", exercises: ["Bench Press", "Squat", "Calf Raises", "Adduction Machine", "Abduction Machine"], sets: "4x6,4x6,4x10,4x10,4x10", intensity: "75,75,60,60,60" },
          { type: "liss", activity: "LISS run", duration: 30 },
          { type: "strength", exercises: ["Overhead Press", "Deadlift", "KB Halos", "KB Rotational Swings", "KB Side Bends"], sets: "4x6,4x6,4x10,4x10,4x10", intensity: "75,75,60,60,60" },
          { type: "rest" },
          { type: "rest" }
        ]
      },
      {
        days: [
          { type: "strength", exercises: ["Bench Press", "Squat", "Calf Raises", "Adduction Machine", "Abduction Machine"], sets: "4x3,4x3,4x8,4x8,4x8", intensity: "80,80,65,65,65" },
          { type: "liss", activity: "Walk", duration: 60 },
          { type: "strength", exercises: ["Overhead Press", "Deadlift", "KB Halos", "KB Rotational Swings", "KB Side Bends"], sets: "4x3,4x3,4x8,4x8,4x8", intensity: "80,80,65,65,65" },
          { type: "liss", activity: "LISS run", duration: 30 },
          { type: "strength", exercises: ["Bench Press", "Squat", "Calf Raises", "Adduction Machine", "Abduction Machine"], sets: "4x3,4x3,4x8,4x8,4x8", intensity: "80,80,65,65,65" },
          { type: "rest" },
          { type: "rest" }
        ]
      }
    ]
  },
  powerbuilding3: {
    weeks: [
      {
        days: [
          { type: "strength", exercises: ["Bench Press", "Squat", "Power Clean"], sets: "3x6", intensity: 75 },
          { type: "hypertrophy", exercises: ["DB Chest Flys", "DB Reverse Flys", "DB Lateral Raises", "DB Pullovers", "DB Bicep Curls", "DB Skull Crushers"], sets: "4x12", intensity: 65 },
          { type: "hiit", activity: "Reset-20", duration: 20 },
          { type: "strength", exercises: ["Bench Press", "Squat", "Power Clean"], sets: "3x6", intensity: 75 },
          { type: "hypertrophy", exercises: ["KB Bulgarian Split Squat", "KB Cossack Squat", "KB Hack Squat", "Calf Raise", "Adduction Machine", "Abduction Machine"], sets: "4x12", intensity: 65 },
          { type: "rest" },
          { type: "rest" }
        ]
      },
      {
        days: [
          { type: "strength", exercises: ["Bench Press", "Squat", "Power Clean"], sets: "3x5", intensity: 80 },
          { type: "hypertrophy", exercises: ["DB Chest Flys", "DB Reverse Flys", "DB Lateral Raises", "DB Pullovers", "DB Bicep Curls", "DB Skull Crushers"], sets: "4x10", intensity: 70 },
          { type: "hiit", activity: "Reset-20", duration: 15 },
          { type: "strength", exercises: ["Bench Press", "Squat", "Power Clean"], sets: "3x5", intensity: 80 },
          { type: "hypertrophy", exercises: ["KB Bulgarian Split Squat", "KB Cossack Squat", "KB Hack Squat", "Calf Raise", "Adduction Machine", "Abduction Machine"], sets: "4x10", intensity: 70 },
          { type: "rest" },
          { type: "rest" }
        ]
      },
      {
        days: [
          { type: "strength", exercises: ["Bench Press", "Squat", "Power Clean"], sets: "3x3", intensity: 85 },
          { type: "hypertrophy", exercises: ["DB Chest Flys", "DB Reverse Flys", "DB Lateral Raises", "DB Pullovers", "DB Bicep Curls", "DB Skull Crushers"], sets: "4x8", intensity: 75 },
          { type: "hiit", activity: "Reset-20", duration: 15 },
          { type: "strength", exercises: ["Bench Press", "Squat", "Power Clean"], sets: "3x3", intensity: 85 },
          { type: "hypertrophy", exercises: ["KB Bulgarian Split Squat", "KB Cossack Squat", "KB Hack Squat", "Calf Raise", "Adduction Machine", "Abduction Machine"], sets: "4x8", intensity: 75 },
          { type: "rest" },
          { type: "rest" }
        ]
      }
    ]
  },
  powerbuilding3bulgarian: {
    weeks: [
      {
        days: [
          { type: "strength", exercises: ["Bench Press", "Squat", "Deadlift"], sets: "3x6,3x6,1x6", intensity: 75 },
          { type: "hypertrophy", exercises: ["Bench Press", "Squat", "Romanian Deadlift"], sets: "4x12,4x12,4x12", intensity: 65 },
          { type: "hiit", activity: "Reset-20", duration: 20 },
          { type: "strength", exercises: ["Bench Press", "Squat", "Deadlift"], sets: "3x6,3x6,1x6", intensity: 75 },
          { type: "hypertrophy", exercises: ["Bench Press", "Squat", "Romanian Deadlift"], sets: "4x12,4x12,4x12", intensity: 65 },
          { type: "rest" },
          { type: "rest" }
        ]
      },
      {
        days: [
          { type: "strength", exercises: ["Bench Press", "Squat", "Deadlift"], sets: "3x5,3x5,1x5", intensity: 80 },
          { type: "hypertrophy", exercises: ["Bench Press", "Squat", "Romanian Deadlift"], sets: "4x10,4x10,4x10", intensity: 70 },
          { type: "hiit", activity: "Reset-20", duration: 15 },
          { type: "strength", exercises: ["Bench Press", "Squat", "Deadlift"], sets: "3x5,3x5,1x5", intensity: 80 },
          { type: "hypertrophy", exercises: ["Bench Press", "Squat", "Romanian Deadlift"], sets: "4x10,4x10,4x10", intensity: 70 },
          { type: "rest" },
          { type: "rest" }
        ]
      },
      {
        days: [
          { type: "strength", exercises: ["Bench Press", "Squat", "Deadlift"], sets: "3x3,3x3,1x3", intensity: 85 },
          { type: "hypertrophy", exercises: ["Bench Press", "Squat", "Romanian Deadlift"], sets: "4x8,4x8,4x8", intensity: 75 },
          { type: "hiit", activity: "Reset-20", duration: 15 },
          { type: "strength", exercises: ["Bench Press", "Squat", "Deadlift"], sets: "3x3,3x3,1x3", intensity: 85 },
          { type: "hypertrophy", exercises: ["Bench Press", "Squat", "Romanian Deadlift"], sets: "4x8,4x8,4x8", intensity: 75 },
          { type: "rest" },
          { type: "rest" }
        ]
      }
    ]
  },
  bodybuilding: {
    weeks: [
      {
        days: [
          { type: "hypertrophy", exercises: ["DB Shoulder Press", "1-Arm DB Bench Press", "Weighted Dips", "Weighted Pull-Ups", "1-Arm DB Rows", "DB Upright Rows", "DB Bicep Curls", "DB Skull Crushers"], sets: "4x12", intensity: 50 },
          { type: "hypertrophy", exercises: ["Leg Extensions", "Lying Leg Curls", "Leg Press", "Calf Raises", "Back Extensions", "Hanging Leg Raises", "Adduction Machine", "Abduction Machine"], sets: "4x12", intensity: 50 },
          { type: "hiit", activity: "Hill Sprints", duration: "3 sprints" },
          { type: "hypertrophy", exercises: ["DB Shoulder Press", "1-Arm DB Bench Press", "Weighted Dips", "Weighted Pull-Ups", "1-Arm DB Rows", "DB Upright Rows", "DB Bicep Curls", "DB Skull Crushers"], sets: "4x12", intensity: 55 },
          { type: "hypertrophy", exercises: ["Leg Extensions", "Lying Leg Curls", "Leg Press", "Calf Raises", "Back Extensions", "Hanging Leg Raises", "Adduction Machine", "Abduction Machine"], sets: "4x12", intensity: 55 },
          { type: "rest" },
          { type: "rest" }
        ]
      },
      {
        days: [
          { type: "hypertrophy", exercises: ["DB Shoulder Press", "1-Arm DB Bench Press", "Weighted Dips", "Weighted Pull-Ups", "1-Arm DB Rows", "DB Upright Rows", "DB Bicep Curls", "DB Skull Crushers"], sets: "4x10", intensity: 60 },
          { type: "hypertrophy", exercises: ["Leg Extensions", "Lying Leg Curls", "Leg Press", "Calf Raises", "Back Extensions", "Hanging Leg Raises", "Adduction Machine", "Abduction Machine"], sets: "4x10", intensity: 60 },
          { type: "hiit", activity: "Hill Sprints", duration: "5 sprints" },
          { type: "hypertrophy", exercises: ["DB Shoulder Press", "1-Arm DB Bench Press", "Weighted Dips", "Weighted Pull-Ups", "1-Arm DB Rows", "DB Upright Rows", "DB Bicep Curls", "DB Skull Crushers"], sets: "4x10", intensity: 65 },
          { type: "hypertrophy", exercises: ["Leg Extensions", "Lying Leg Curls", "Leg Press", "Calf Raises", "Back Extensions", "Hanging Leg Raises", "Adduction Machine", "Abduction Machine"], sets: "4x10", intensity: 65 },
          { type: "rest" },
          { type: "rest" }
        ]
      },
      {
        days: [
          { type: "hypertrophy", exercises: ["DB Shoulder Press", "1-Arm DB Bench Press", "Weighted Dips", "Weighted Pull-Ups", "1-Arm DB Rows", "DB Upright Rows", "DB Bicep Curls", "DB Skull Crushers"], sets: "4x8", intensity: 70 },
          { type: "hypertrophy", exercises: ["Leg Extensions", "Lying Leg Curls", "Leg Press", "Calf Raises", "Back Extensions", "Hanging Leg Raises", "Adduction Machine", "Abduction Machine"], sets: "4x8", intensity: 70 },
          { type: "hiit", activity: "Hill Sprints", duration: "7 sprints" },
          { type: "hypertrophy", exercises: ["DB Shoulder Press", "1-Arm DB Bench Press", "Weighted Dips", "Weighted Pull-Ups", "1-Arm DB Rows", "DB Upright Rows", "DB Bicep Curls", "DB Skull Crushers"], sets: "4x8", intensity: 75 },
          { type: "hypertrophy", exercises: ["Leg Extensions", "Lying Leg Curls", "Leg Press", "Calf Raises", "Back Extensions", "Hanging Leg Raises", "Adduction Machine", "Abduction Machine"], sets: "4x8", intensity: 75 },
          { type: "rest" },
          { type: "rest" }
        ]
      }
    ]
  },
  strength: {
    weeks: [
      {
        days: [
          { type: "strength", exercises: ["Bench Press", "Squat"], sets: "5x5", intensity: 70 },
          { type: "strength", exercises: ["Weighted Pull-up", "Overhead Press"], sets: "5x5", intensity: 70 },
          { type: "hiit", activity: "Tempo Run", duration: "5 km" },
          { type: "strength", exercises: ["Bench Press", "Squat"], sets: "5x5", intensity: 70 },
          { type: "strength", exercises: ["Deadlift", "Overhead Press"], sets: "3x5,5x5", intensity: 70 },
          { type: "hiit", activity: "GC 9", duration: "" },
          { type: "rest" }
        ]
      },
      {
        days: [
          { type: "strength", exercises: ["Bench Press", "Squat"], sets: "5x5", intensity: 80 },
          { type: "strength", exercises: ["Weighted Pull-up", "Overhead Press"], sets: "5x5", intensity: 80 },
          { type: "hiit", activity: "600m Resets", duration: "" },
          { type: "strength", exercises: ["Bench Press", "Squat"], sets: "5x5", intensity: 80 },
          { type: "strength", exercises: ["Deadlift", "Overhead Press"], sets: "3x5,5x5", intensity: 80 },
          { type: "hiit", activity: "GC 9", duration: "" },
          { type: "rest" }
        ]
      },
      {
        days: [
          { type: "strength", exercises: ["Bench Press", "Squat"], sets: "5x3", intensity: 90 },
          { type: "strength", exercises: ["Weighted Pull-up", "Overhead Press"], sets: "5x3", intensity: 90 },
          { type: "hiit", activity: "Tempo Run", duration: "5 km" },
          { type: "strength", exercises: ["Bench Press", "Squat"], sets: "5x3", intensity: 90 },
          { type: "strength", exercises: ["Deadlift", "Overhead Press"], sets: "3x3,5x3", intensity: 90 },
          { type: "rest" },
          { type: "rest" }
        ]
      },
      {
        days: [
          { type: "strength", exercises: ["Bench Press", "Squat"], sets: "5x5", intensity: 75 },
          { type: "strength", exercises: ["Weighted Pull-up", "Overhead Press"], sets: "5x5", intensity: 75 },
          { type: "hiit", activity: "600m Resets", duration: "" },
          { type: "strength", exercises: ["Bench Press", "Squat"], sets: "5x5", intensity: 75 },
          { type: "strength", exercises: ["Deadlift", "Overhead Press"], sets: "3x5,5x5", intensity: 75 },
          { type: "hiit", activity: "GC 9", duration: "" },
          { type: "rest" }
        ]
      },
      {
        days: [
          { type: "strength", exercises: ["Bench Press", "Squat"], sets: "5x3", intensity: 85 },
          { type: "strength", exercises: ["Weighted Pull-up", "Overhead Press"], sets: "5x3", intensity: 85 },
          { type: "hiit", activity: "Tempo Run", duration: "5 km" },
          { type: "strength", exercises: ["Bench Press", "Squat"], sets: "5x3", intensity: 85 },
          { type: "strength", exercises: ["Deadlift", "Overhead Press"], sets: "3x3,5x3", intensity: 85 },
          { type: "hiit", activity: "GC 9", duration: "" },
          { type: "rest" }
        ]
      },
      {
        days: [
          { type: "strength", exercises: ["Bench Press", "Squat"], sets: "5x2", intensity: 95 },
          { type: "strength", exercises: ["Weighted Pull-up", "Overhead Press"], sets: "5x2", intensity: 95 },
          { type: "hiit", activity: "600m Resets", duration: "" },
          { type: "strength", exercises: ["Bench Press", "Squat"], sets: "5x2", intensity: 95 },
          { type: "strength", exercises: ["Deadlift", "Overhead Press"], sets: "3x2,5x2", intensity: 95 },
          { type: "rest" },
          { type: "rest" }
        ]
      }
    ]
  }
};
