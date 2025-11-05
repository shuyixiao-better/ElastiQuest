import { Metadata } from 'next';
import RAGChatPanel from '@/components/RAG/RAGChatPanel';

export const metadata: Metadata = {
  title: 'RAG 智能问答 - ElastiQuest',
  description: '使用 RAG 技术结合参考资料与大模型知识进行智能问答',
};

export default function RAGPage() {
  return <RAGChatPanel />;
}

