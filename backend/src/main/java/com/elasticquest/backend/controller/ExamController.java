package com.elasticquest.backend.controller;

import com.elasticquest.backend.model.ChallengeSubmission;
import com.elasticquest.backend.model.ChallengeValidationResult;
import com.elasticquest.backend.model.ExamProgress;
import com.elasticquest.backend.service.ExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * ES认证考试学习API
 */
@RestController
@RequestMapping("/api/exam")
@CrossOrigin(origins = "*")
public class ExamController {

    @Autowired
    private ExamService examService;

    /**
     * 获取用户学习进度
     */
    @GetMapping("/progress/{userId}")
    public ResponseEntity<ExamProgress> getProgress(@PathVariable String userId) {
        ExamProgress progress = examService.getUserProgress(userId);
        return ResponseEntity.ok(progress);
    }

    /**
     * 提交挑战答案并验证
     */
    @PostMapping("/challenge/submit")
    public ResponseEntity<ChallengeValidationResult> submitChallenge(
            @RequestBody ChallengeSubmission submission,
            @RequestHeader(value = "X-User-Id", defaultValue = "default") String userId
    ) {
        ChallengeValidationResult result = examService.validateChallenge(submission, userId);
        return ResponseEntity.ok(result);
    }

    /**
     * 完成知识点
     */
    @PostMapping("/topic/{topicId}/complete")
    public ResponseEntity<ExamProgress> completeTopic(
            @PathVariable String topicId,
            @RequestHeader(value = "X-User-Id", defaultValue = "default") String userId
    ) {
        ExamProgress progress = examService.completeTopic(userId, topicId);
        return ResponseEntity.ok(progress);
    }

    /**
     * 完成关卡
     */
    @PostMapping("/level/{levelId}/complete")
    public ResponseEntity<ExamProgress> completeLevel(
            @PathVariable String levelId,
            @RequestHeader(value = "X-User-Id", defaultValue = "default") String userId
    ) {
        ExamProgress progress = examService.completeLevel(userId, levelId);
        return ResponseEntity.ok(progress);
    }

    /**
     * 重置进度（用于测试）
     */
    @PostMapping("/progress/reset")
    public ResponseEntity<String> resetProgress(
            @RequestHeader(value = "X-User-Id", defaultValue = "default") String userId
    ) {
        examService.resetProgress(userId);
        return ResponseEntity.ok("Progress reset successfully");
    }

    /**
     * 获取学习统计
     */
    @GetMapping("/stats/{userId}")
    public ResponseEntity<ExamProgress.ExamStats> getStats(@PathVariable String userId) {
        ExamProgress.ExamStats stats = examService.getStats(userId);
        return ResponseEntity.ok(stats);
    }
}
