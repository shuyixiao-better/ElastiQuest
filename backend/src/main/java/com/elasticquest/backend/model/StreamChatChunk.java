package com.elasticquest.backend.model;

import java.util.List;

/**
 * 流式聊天响应块
 */
public class StreamChatChunk {
    
    private String content; // 增量内容
    private boolean done; // 是否完成
    private List<HighlightSegment> highlights; // 高亮片段（仅在done=true时返回）
    private String error; // 错误信息
    
    public StreamChatChunk() {
    }
    
    public StreamChatChunk(String content, boolean done) {
        this.content = content;
        this.done = done;
    }
    
    public static StreamChatChunk content(String content) {
        return new StreamChatChunk(content, false);
    }
    
    public static StreamChatChunk done(List<HighlightSegment> highlights) {
        StreamChatChunk chunk = new StreamChatChunk("", true);
        chunk.setHighlights(highlights);
        return chunk;
    }
    
    public static StreamChatChunk error(String error) {
        StreamChatChunk chunk = new StreamChatChunk("", true);
        chunk.setError(error);
        return chunk;
    }
    
    // Getters and Setters
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public boolean isDone() {
        return done;
    }
    
    public void setDone(boolean done) {
        this.done = done;
    }
    
    public List<HighlightSegment> getHighlights() {
        return highlights;
    }
    
    public void setHighlights(List<HighlightSegment> highlights) {
        this.highlights = highlights;
    }
    
    public String getError() {
        return error;
    }
    
    public void setError(String error) {
        this.error = error;
    }
}

