// BE/data/progress.js
const progress = {};

function updateProgress(moduleId, value) {
  if (!progress[moduleId]) {
    progress[moduleId] = 0;
  }
  progress[moduleId] = Math.min(100, progress[moduleId] + value);
}

function getProgress(moduleId) {
  return progress[moduleId] || 0;
}

module.exports = { updateProgress, getProgress };
