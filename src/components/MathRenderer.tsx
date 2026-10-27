'use client';

import { useState, type ReactNode } from 'react';
import katex from 'katex';

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  async function copy() {
    try { await navigator.clipboard.writeText(code); setCopied(true); setFailed(false); }
    catch { setFailed(true); }
  }
  return <div className="code-block"><div className="code-header"><span>{language.toUpperCase() || 'CODE'}</span>
    <button type="button" className="copy-btn" onClick={() => { void copy(); }}>{failed ? 'Select to copy' : copied ? 'Copied' : 'Copy'}</button></div><pre><code>{code}</code></pre></div>;
}

function inlineText(text: string): ReactNode {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, index) => part.startsWith('**') && part.endsWith('**')
    ? <strong key={index}>{part.slice(2, -2)}</strong>
    : part.startsWith('`') && part.endsWith('`') ? <code key={index} className="inline-code">{part.slice(1, -1)}</code> : part);
}

function TextSegment({ text }: { text: string }) {
  const tokens = text.split(/(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\$[\s\S]*?\$|\\\([\s\S]*?\\\)|\n)/g);
  return <div className="text-segment">{tokens.map((token, index) => {
    if (token === '\n') return <br key={index} />;
    const display = token.startsWith('$$') || token.startsWith('\\[');
    const math = display || token.startsWith('$') && token.endsWith('$') || token.startsWith('\\(') && token.endsWith('\\)');
    if (math) {
      const trim = token.startsWith('$') && !display ? 1 : 2;
      return <span key={index} dangerouslySetInnerHTML={{ __html: katex.renderToString(token.slice(trim, -trim), { displayMode: display, throwOnError: false, trust: false }) }} />;
    }
    if (/^\s*[-*]\s/.test(token)) return <span key={index} className="text-bullet">• {inlineText(token.replace(/^\s*[-*]\s/, ''))}</span>;
    return <span key={index}>{inlineText(token)}</span>;
  })}</div>;
}

export function MathRenderer({ text }: { text: string }) {
  if (!text) return null;
  const blocks: ReactNode[] = [];
  const regex = /```(\w*)[ \t]*\r?\n([\s\S]*?)\r?\n[ \t]*```/g;
  let last = 0;
  for (const match of text.matchAll(regex)) {
    if (match.index > last) blocks.push(<TextSegment key={`text-${last}`} text={text.slice(last, match.index)} />);
    blocks.push(<CodeBlock key={`code-${match.index}-${match[2]}`} language={match[1]} code={match[2]} />);
    last = match.index + match[0].length;
  }
  if (last < text.length) blocks.push(<TextSegment key={`text-${last}`} text={text.slice(last)} />);
  return <div className="markdown-container">{blocks}</div>;
}
