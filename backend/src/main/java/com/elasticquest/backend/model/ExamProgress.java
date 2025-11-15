package com.elasticquest.backend.model;

import java.util.List;
import java.util.Map;

/**
 * 用户考试学习进度
 */
public class ExamProgress {
    private String userId;
    private List<String> completedTopics;
    private Map<String, ChallengeResult> completedChallenges;
    private List<String> completedLevels;
    private List<String> achievements;
    private int level;
    private int totalExperience;
    private String currentTitle;
    private ExamStats stats;

    public static class ChallengeResult {
        private int score;
        private int timeSpent;
        private int attempts;
        private String lastAttempt;
        private int bestScore;

        // Getters and Setters
        public int getScore() {
            return score;
        }

        public void setScore(int score) {
            this.score = score;
        }

        public int getTimeSpent() {
            return timeSpent;
        }

        public void setTimeSpent(int timeSpent) {
            this.timeSpent = timeSpent;
        }

        public int getAttempts() {
            return attempts;
        }

        public void setAttempts(int attempts) {
            this.attempts = attempts;
        }

        public String getLastAttempt() {
            return lastAttempt;
        }

        public void setLastAttempt(String lastAttempt) {
            this.lastAttempt = lastAttempt;
        }

        public int getBestScore() {
            return bestScore;
        }

        public void setBestScore(int bestScore) {
            this.bestScore = bestScore;
        }
    }

    public static class ExamStats {
        private int totalStudyTime;
        private int totalChallenges;
        private int successRate;
        private List<String> strongCategories;
        private List<String> weakCategories;

        // Getters and Setters
        public int getTotalStudyTime() {
            return totalStudyTime;
        }

        public void setTotalStudyTime(int totalStudyTime) {
            this.totalStudyTime = totalStudyTime;
        }

        public int getTotalChallenges() {
            return totalChallenges;
        }

        public void setTotalChallenges(int totalChallenges) {
            this.totalChallenges = totalChallenges;
        }

        public int getSuccessRate() {
            return successRate;
        }

        public void setSuccessRate(int successRate) {
            this.successRate = successRate;
        }

        public List<String> getStrongCategories() {
            return strongCategories;
        }

        public void setStrongCategories(List<String> strongCategories) {
            this.strongCategories = strongCategories;
        }

        public List<String> getWeakCategories() {
            return weakCategories;
        }

        public void setWeakCategories(List<String> weakCategories) {
            this.weakCategories = weakCategories;
        }
    }

    // Getters and Setters
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public List<String> getCompletedTopics() {
        return completedTopics;
    }

    public void setCompletedTopics(List<String> completedTopics) {
        this.completedTopics = completedTopics;
    }

    public Map<String, ChallengeResult> getCompletedChallenges() {
        return completedChallenges;
    }

    public void setCompletedChallenges(Map<String, ChallengeResult> completedChallenges) {
        this.completedChallenges = completedChallenges;
    }

    public List<String> getCompletedLevels() {
        return completedLevels;
    }

    public void setCompletedLevels(List<String> completedLevels) {
        this.completedLevels = completedLevels;
    }

    public List<String> getAchievements() {
        return achievements;
    }

    public void setAchievements(List<String> achievements) {
        this.achievements = achievements;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public int getTotalExperience() {
        return totalExperience;
    }

    public void setTotalExperience(int totalExperience) {
        this.totalExperience = totalExperience;
    }

    public String getCurrentTitle() {
        return currentTitle;
    }

    public void setCurrentTitle(String currentTitle) {
        this.currentTitle = currentTitle;
    }

    public ExamStats getStats() {
        return stats;
    }

    public void setStats(ExamStats stats) {
        this.stats = stats;
    }
}
