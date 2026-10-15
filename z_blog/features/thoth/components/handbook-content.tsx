"use client";

import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useHandbookLanguage } from './handbook-shell';

export function HandbookContent({english,chinese}:{english:string;chinese?:string}) {
  const {zh} = useHandbookLanguage();
  const prose = 'prose prose-sm max-w-none text-[var(--text-soft)] prose-headings:text-[var(--text)] prose-strong:text-[var(--text)] prose-a:text-[var(--primary)] prose-code:text-[var(--text)] prose-blockquote:text-[var(--text-soft)]';
  return <>
    <div className={prose}><Markdown remarkPlugins={[remarkGfm]}>{zh && chinese ? chinese : english}</Markdown></div>
    {zh && chinese && <details className="mt-5 border-t border-[var(--border)] pt-4"><summary className="cursor-pointer text-sm text-[var(--primary)]">英文原文 · English source</summary><div className={`${prose} mt-4`}><Markdown remarkPlugins={[remarkGfm]}>{english}</Markdown></div></details>}
  </>;
}
