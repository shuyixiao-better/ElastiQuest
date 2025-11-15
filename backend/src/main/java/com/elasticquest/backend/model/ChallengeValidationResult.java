package com.elasticquest.backend.model;

/**
 * 挑战验证结果
 */
public class ChallengeValidationResult {
    private boolean correct;
    private int score;
    private String feedback;
    private Object executionResult;
    private String explanation;

    public ChallengeValidationResult() {
    }

    public ChallengeValidationResult(boolean correct, int score, String feedback) {
        this.correct = correct;
        this.score = score;
        this.feedback = feedback;
    }

    // Getters and Setters
    public boolean isCorrect() {
        return correct;
    }

    public void setCorrect(boolean correct) {
        this.correct = correct;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public Object getExecutionResult() {
        return executionResult;
    }

    public void setExecutionResult(Object executionResult) {
        this.executionResult = executionResult;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
}
