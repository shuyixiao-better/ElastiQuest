package com.elasticquest.backend.service;

import com.elasticquest.backend.model.HighlightSegment;
import com.hankcs.hanlp.HanLP;
import com.hankcs.hanlp.seg.common.Term;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 文本高亮服务
 * 使用 HanLP 进行中文分词，识别回答中引用的参考材料
 */
@Service
public class TextHighlightService {
    
    private static final Logger logger = LoggerFactory.getLogger(TextHighlightService.class);
    
    // 最小匹配长度（字符数）
    private static final int MIN_MATCH_LENGTH = 4;
    
    /**
     * 对回答文本进行高亮处理
     * @param answer 大模型的回答
     * @param contextMaterial 参考材料
     * @return 高亮片段列表
     */
    public List<HighlightSegment> highlightAnswer(String answer, String contextMaterial) {
        if (answer == null || answer.isEmpty()) {
            return Collections.emptyList();
        }
        
        if (contextMaterial == null || contextMaterial.isEmpty()) {
            // 没有参考材料，返回整个答案作为非高亮文本
            return Collections.singletonList(new HighlightSegment(answer, false));
        }
        
        try {
            // 提取参考材料中的关键短语
            Set<String> keyPhrases = extractKeyPhrases(contextMaterial);
            
            // 在回答中查找匹配的短语
            List<HighlightSegment> segments = new ArrayList<>();
            int lastIndex = 0;
            
            // 使用滑动窗口查找匹配
            for (int i = 0; i < answer.length(); i++) {
                String matchedPhrase = findLongestMatch(answer, i, keyPhrases);
                
                if (matchedPhrase != null && matchedPhrase.length() >= MIN_MATCH_LENGTH) {
                    // 添加非高亮部分
                    if (i > lastIndex) {
                        String normalText = answer.substring(lastIndex, i);
                        if (!normalText.isEmpty()) {
                            segments.add(new HighlightSegment(normalText, false));
                        }
                    }
                    
                    // 添加高亮部分
                    segments.add(new HighlightSegment(matchedPhrase, true));
                    
                    lastIndex = i + matchedPhrase.length();
                    i = lastIndex - 1; // 跳过已匹配的部分
                }
            }
            
            // 添加剩余的非高亮部分
            if (lastIndex < answer.length()) {
                segments.add(new HighlightSegment(answer.substring(lastIndex), false));
            }
            
            // 如果没有找到任何匹配，返回整个答案作为非高亮文本
            if (segments.isEmpty()) {
                segments.add(new HighlightSegment(answer, false));
            }
            
            return segments;
            
        } catch (Exception e) {
            logger.error("高亮处理失败", e);
            // 出错时返回整个答案作为非高亮文本
            return Collections.singletonList(new HighlightSegment(answer, false));
        }
    }
    
    /**
     * 提取参考材料中的关键短语
     */
    private Set<String> extractKeyPhrases(String text) {
        Set<String> phrases = new HashSet<>();
        
        try {
            // 使用 HanLP 进行分词
            List<Term> terms = HanLP.segment(text);
            
            // 提取名词短语和较长的词组
            for (int i = 0; i < terms.size(); i++) {
                Term term = terms.get(i);
                String word = term.word;
                
                // 添加单个词（长度>=2）
                if (word.length() >= 2) {
                    phrases.add(word);
                }
                
                // 添加2-gram
                if (i < terms.size() - 1) {
                    String bigram = word + terms.get(i + 1).word;
                    if (bigram.length() >= MIN_MATCH_LENGTH) {
                        phrases.add(bigram);
                    }
                }
                
                // 添加3-gram
                if (i < terms.size() - 2) {
                    String trigram = word + terms.get(i + 1).word + terms.get(i + 2).word;
                    if (trigram.length() >= MIN_MATCH_LENGTH) {
                        phrases.add(trigram);
                    }
                }
            }
            
            // 同时添加原文中的连续子串（用于匹配完整句子）
            addSubstrings(text, phrases);
            
        } catch (Exception e) {
            logger.warn("分词失败，使用简单子串提取", e);
            addSubstrings(text, phrases);
        }
        
        return phrases;
    }
    
    /**
     * 添加文本的连续子串
     */
    private void addSubstrings(String text, Set<String> phrases) {
        // 提取长度在 MIN_MATCH_LENGTH 到 50 之间的子串
        for (int len = MIN_MATCH_LENGTH; len <= Math.min(50, text.length()); len++) {
            for (int i = 0; i <= text.length() - len; i++) {
                String substring = text.substring(i, i + len);
                phrases.add(substring);
            }
        }
    }
    
    /**
     * 从指定位置开始查找最长匹配
     */
    private String findLongestMatch(String text, int startIndex, Set<String> keyPhrases) {
        String longestMatch = null;
        int maxLength = 0;
        
        // 尝试不同长度的子串
        for (int len = MIN_MATCH_LENGTH; len <= Math.min(50, text.length() - startIndex); len++) {
            String substring = text.substring(startIndex, startIndex + len);
            if (keyPhrases.contains(substring) && len > maxLength) {
                longestMatch = substring;
                maxLength = len;
            }
        }
        
        return longestMatch;
    }
}

