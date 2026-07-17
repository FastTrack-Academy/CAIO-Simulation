'use client';

import React from 'react';
import katex from 'katex';

interface MathRendererProps {
  text: string;
}

export function MathRenderer({ text }: MathRendererProps) {
  if (!text) return null;

  // Render inline and display math and code blocks
  // First, parse out code blocks: ```[lang]\n[code]\n```
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)\n```/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  let blockId = 0;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    const textBefore = text.substring(lastIndex, match.index);
    if (textBefore) {
      parts.push(<TextWithMath key={`text-${blockId}`} text={textBefore} />);
      blockId++;
    }

    const language = match[1] || 'code';
    const code = match[2];
    parts.push(
      <pre key={`code-${blockId}`} className="code-block">
        <div className="code-header">
          <span>{language.toUpperCase()}</span>
          <button 
            className="copy-btn" 
            onClick={() => navigator.clipboard.writeText(code)}
          >
            Copy
          </button>
        </div>
        <code>{code}</code>
        <style jsx>{`
          .code-block {
            background-color: #0f1322;
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            margin: 1rem 0;
            overflow: hidden;
            font-family: var(--font-mono);
            font-size: 0.875rem;
          }
          .code-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #171c30;
            padding: 0.5rem 1rem;
            font-size: 0.75rem;
            color: var(--text-muted);
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          }
          .copy-btn {
            background: none;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            font-weight: 500;
          }
          .copy-btn:hover {
            color: var(--text-primary);
          }
          code {
            display: block;
            padding: 1rem;
            overflow-x: auto;
            color: #e2e8f0;
            line-height: 1.5;
            white-space: pre;
          }
        `}</style>
      </pre>
    );
    blockId++;
    lastIndex = codeBlockRegex.lastIndex;
  }

  const remainingText = text.substring(lastIndex);
  if (remainingText) {
    parts.push(<TextWithMath key={`text-${blockId}`} text={remainingText} />);
  }

  return <div className="markdown-container">{parts}</div>;
}

function TextWithMath({ text }: { text: string }) {
  // Regex to split block math ($$...$$ and \[...\]), inline math ($...$ and \(...\)), and linebreaks
  // Block math: \$\$(.*?)\$\$ or \\\[(.*?)\\\]
  // Inline math: \$(.*?)\$ or \\\((.*?)\\\)
  const regex = /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\$[\s\S]*?\$|\\\([\s\S]*?\\\)|\n)/g;
  const tokens = text.split(regex);

  return (
    <p style={{ margin: '0.5rem 0', lineHeight: '1.6', wordBreak: 'break-word' }}>
      {tokens.map((token, i) => {
        if (token.startsWith('$$') && token.endsWith('$$')) {
          const formula = token.substring(2, token.length - 2);
          try {
            const html = katex.renderToString(formula, { displayMode: true, throwOnError: false });
            return <span key={i} dangerouslySetInnerHTML={{ __html: html }} />;
          } catch (e) {
            return <code key={i}>{token}</code>;
          }
        } else if (token.startsWith('\\[') && token.endsWith('\\]')) {
          const formula = token.substring(2, token.length - 2);
          try {
            const html = katex.renderToString(formula, { displayMode: true, throwOnError: false });
            return <span key={i} dangerouslySetInnerHTML={{ __html: html }} />;
          } catch (e) {
            return <code key={i}>{token}</code>;
          }
        } else if (token.startsWith('$') && token.endsWith('$')) {
          const formula = token.substring(1, token.length - 1);
          try {
            const html = katex.renderToString(formula, { displayMode: false, throwOnError: false });
            return <span key={i} dangerouslySetInnerHTML={{ __html: html }} />;
          } catch (e) {
            return <code key={i}>{token}</code>;
          }
        } else if (token.startsWith('\\(') && token.endsWith('\\)')) {
          const formula = token.substring(2, token.length - 2);
          try {
            const html = katex.renderToString(formula, { displayMode: false, throwOnError: false });
            return <span key={i} dangerouslySetInnerHTML={{ __html: html }} />;
          } catch (e) {
            return <code key={i}>{token}</code>;
          }
        } else if (token === '\n') {
          return <br key={i} />;
        } else {
          // Render bold and list items simply
          return <span key={i}>{renderTextFormatting(token)}</span>;
        }
      })}
    </p>
  );
}

function renderTextFormatting(text: string): React.ReactNode {
  // Handle basic markdown inline formatting like bold (**text**)
  // and bullet points (e.g., "* ", "- ")
  if (!text) return '';

  const boldRegex = /\*\*([\s\S]*?)\*\*/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  let boldId = 0;

  while ((match = boldRegex.exec(text)) !== null) {
    const textBefore = text.substring(lastIndex, match.index);
    if (textBefore) {
      parts.push(textBefore);
    }
    parts.push(<strong key={boldId} style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{match[1]}</strong>);
    boldId++;
    lastIndex = boldRegex.lastIndex;
  }

  const remaining = text.substring(lastIndex);
  if (remaining) {
    parts.push(remaining);
  }

  // Check if this chunk is a list item or has bullet points
  const listMatch = text.match(/^(\s*[-*]\s+)(.*)/);
  if (listMatch) {
    return (
      <span style={{ display: 'inline-flex', paddingLeft: '1rem', margin: '0.2rem 0' }}>
        <span style={{ marginRight: '0.5rem', color: 'var(--color-primary)' }}>•</span>
        <span>{parts}</span>
      </span>
    );
  }

  return parts;
}
