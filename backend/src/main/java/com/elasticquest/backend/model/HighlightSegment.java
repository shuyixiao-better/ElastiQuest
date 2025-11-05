package com.elasticquest.backend.model;

/**
 * 高亮文本片段
 */
public class HighlightSegment {
    
    private String text; // 文本内容
    private boolean highlighted; // 是否高亮
    
    public HighlightSegment() {
    }
    
    public HighlightSegment(String text, boolean highlighted) {
        this.text = text;
        this.highlighted = highlighted;
    }
    
    // Getters and Setters
    public String getText() {
        return text;
    }
    
    public void setText(String text) {
        this.text = text;
    }
    
    public boolean isHighlighted() {
        return highlighted;
    }
    
    public void setHighlighted(boolean highlighted) {
        this.highlighted = highlighted;
    }
}

