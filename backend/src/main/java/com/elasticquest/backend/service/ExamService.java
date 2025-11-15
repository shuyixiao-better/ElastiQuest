package com.elasticquest.backend.service;

import com.elasticquest.backend.model.ChallengeSubmission;
import com.elasticquest.backend.model.ChallengeValidationResult;
import com.elasticquest.backend.model.ExamProgress;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * ES认证考试学习服务
 */
@Service
public class ExamService {

    // 简单的内存存储，实际应该使用数据库
    private final Map<String, ExamProgress> userProgressMap = new ConcurrentHashMap<>();

    /**
     * 获取用户进度
     */
    public ExamProgress getUserProgress(String userId) {
        return userProgressMap.computeIfAbsent(userId, k -> createInitialProgress(userId));
    }

    /**
     * 创建初始进度
     */
    private ExamProgress createInitialProgress(String userId) {
        ExamProgress progress = new ExamProgress();
        progress.setUserId(userId);
        progress.setCompletedTopics(new ArrayList<>());
        progress.setCompletedChallenges(new HashMap<>());
        progress.setCompletedLevels(new ArrayList<>());
        progress.setAchievements(new ArrayList<>());
        progress.setLevel(1);
        progress.setTotalExperience(0);
        
        ExamProgress.ExamStats stats = new ExamProgress.ExamStats();
        stats.setTotalStudyTime(0);
        stats.setTotalChallenges(0);
        stats.setSuccessRate(0);
        stats.setStrongCategories(new ArrayList<>());
        stats.setWeakCategories(new ArrayList<>());
        progress.setStats(stats);
        
        return progress;
    }

    /**
     * 验证挑战答案
     */
    public ChallengeValidationResult validateChallenge(ChallengeSubmission submission, String userId) {
        ExamProgress progress = getUserProgress(userId);
        
        // 这里简化处理，实际应该根据挑战类型进行不同的验证
        // 对于实践题，需要实际执行ES查询
        boolean correct = validateAnswer(submission);
        int score = correct ? 100 : 50; // 简化评分
        
        // 更新进度
        ExamProgress.ChallengeResult result = new ExamProgress.ChallengeResult();
        result.setScore(score);
        result.setTimeSpent(submission.getTimeSpent());
        result.setLastAttempt(LocalDateTime.now().toString());
        
        ExamProgress.ChallengeResult existing = progress.getCompletedChallenges()
                .get(submission.getChallengeId());
        if (existing != null) {
            result.setAttempts(existing.getAttempts() + 1);
            result.setBestScore(Math.max(existing.getBestScore(), score));
        } else {
            result.setAttempts(1);
            result.setBestScore(score);
        }
        
        progress.getCompletedChallenges().put(submission.getChallengeId(), result);
        
        // 更新统计
        updateStats(progress);
        
        ChallengeValidationResult validationResult = new ChallengeValidationResult();
        validationResult.setCorrect(correct);
        validationResult.setScore(score);
        validationResult.setFeedback(correct ? "回答正确！" : "回答错误，请再试一次");
        
        return validationResult;
    }

    /**
     * 验证答案（简化版）
     */
    private boolean validateAnswer(ChallengeSubmission submission) {
        // 实际应该根据挑战类型和正确答案进行验证
        // 这里简化为随机结果
        if (submission.getCode() != null && !submission.getCode().trim().isEmpty()) {
            return submission.getCode().length() > 50;
        }
        return submission.getAnswer() != null && !submission.getAnswer().isEmpty();
    }

    /**
     * 完成知识点
     */
    public ExamProgress completeTopic(String userId, String topicId) {
        ExamProgress progress = getUserProgress(userId);
        if (!progress.getCompletedTopics().contains(topicId)) {
            progress.getCompletedTopics().add(topicId);
            // 奖励经验值
            progress.setTotalExperience(progress.getTotalExperience() + 50);
            updateLevel(progress);
        }
        return progress;
    }

    /**
     * 完成关卡
     */
    public ExamProgress completeLevel(String userId, String levelId) {
        ExamProgress progress = getUserProgress(userId);
        if (!progress.getCompletedLevels().contains(levelId)) {
            progress.getCompletedLevels().add(levelId);
            
            // 根据关卡奖励经验值和成就
            int experienceReward = getLevelExperienceReward(levelId);
            progress.setTotalExperience(progress.getTotalExperience() + experienceReward);
            
            String badge = getLevelBadge(levelId);
            if (badge != null && !progress.getAchievements().contains(badge)) {
                progress.getAchievements().add(badge);
            }
            
            String title = getLevelTitle(levelId);
            if (title != null) {
                progress.setCurrentTitle(title);
            }
            
            updateLevel(progress);
        }
        return progress;
    }

    /**
     * 更新等级
     */
    private void updateLevel(ExamProgress progress) {
        int newLevel = progress.getTotalExperience() / 1000 + 1;
        progress.setLevel(newLevel);
    }

    /**
     * 更新统计信息
     */
    private void updateStats(ExamProgress progress) {
        ExamProgress.ExamStats stats = progress.getStats();
        
        int totalChallenges = progress.getCompletedChallenges().size();
        stats.setTotalChallenges(totalChallenges);
        
        if (totalChallenges > 0) {
            long successfulChallenges = progress.getCompletedChallenges().values().stream()
                    .filter(r -> r.getBestScore() >= 60)
                    .count();
            int successRate = (int) ((successfulChallenges * 100) / totalChallenges);
            stats.setSuccessRate(successRate);
        }
        
        int totalTime = progress.getCompletedChallenges().values().stream()
                .mapToInt(ExamProgress.ChallengeResult::getTimeSpent)
                .sum();
        stats.setTotalStudyTime(totalTime / 60); // 转换为分钟
    }

    /**
     * 获取统计信息
     */
    public ExamProgress.ExamStats getStats(String userId) {
        ExamProgress progress = getUserProgress(userId);
        return progress.getStats();
    }

    /**
     * 重置进度
     */
    public void resetProgress(String userId) {
        userProgressMap.remove(userId);
    }

    /**
     * 获取关卡经验奖励
     */
    private int getLevelExperienceReward(String levelId) {
        return switch (levelId) {
            case "level-1" -> 500;
            case "level-2" -> 1000;
            case "level-3" -> 2000;
            case "level-4" -> 5000;
            default -> 100;
        };
    }

    /**
     * 获取关卡徽章
     */
    private String getLevelBadge(String levelId) {
        return switch (levelId) {
            case "level-1" -> "🎓 ES学徒";
            case "level-2" -> "🔍 查询大师";
            case "level-3" -> "🏆 ES架构师";
            case "level-4" -> "👑 认证工程师";
            default -> null;
        };
    }

    /**
     * 获取关卡称号
     */
    private String getLevelTitle(String levelId) {
        return switch (levelId) {
            case "level-1" -> "ES学徒";
            case "level-2" -> "查询大师";
            case "level-3" -> "ES架构师";
            case "level-4" -> "Elasticsearch认证工程师";
            default -> null;
        };
    }
}
