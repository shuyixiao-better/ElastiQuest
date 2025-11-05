'use client';

import React from 'react';
import { HighlightSegment } from '@/lib/api/ragChat';

interface HighlightedTextProps {
  segments: HighlightSegment[];
  className?: string;
}

/**
 * 高亮文本组件
 * 显示带有高亮标记的文本
 */
export default function HighlightedText({ segments, className = '' }: HighlightedTextProps) {
  if (!segments || segments.length === 0) {
    return null;
  }

  return (
    <div className={`whitespace-pre-wrap ${className}`}>
      {segments.map((segment, index) => (
        segment.highlighted ? (
          <mark
            key={index}
            style={{
              backgroundColor: '#fff3cd',
              color: '#856404',
              padding: '2px 4px',
              borderRadius: '3px',
              fontWeight: 500,
            }}
          >
            {segment.text}
          </mark>
        ) : (
          <span key={index}>{segment.text}</span>
        )
      ))}
    </div>
  );
}

