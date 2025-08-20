// In-memory store for demo. Swap for DB later.
export const progressStore = {
  // Example shape:
  // "demoUser": {
  //   "healthy-eating": { progress: 85, quizAccuracy: 90, timeSpentMin: 22, lastAccessed: '2025-08-11T12:00:00.000Z' }
  // }
};

export function getUserProgress(userId) {
  return progressStore[userId] || {};
}

export function setUserProgress(userId, moduleId, payload) {
  progressStore[userId] = progressStore[userId] || {};
  progressStore[userId][moduleId] = {
    progress: 0,
    quizAccuracy: 0,
    timeSpentMin: 0,
    lastAccessed: new Date().toISOString(),
    ...progressStore[userId][moduleId],
    ...payload,
  };
  return progressStore[userId][moduleId];
}
