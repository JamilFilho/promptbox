import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'PromptBox - Prompts que realmente funcionam',
  description: 'Biblioteca curada de 500+ prompts para marketing, copywriting e conteúdo. Copie, cole e comece a criar em segundos.',
  keywords: 'prompts, chatgpt, marketing, copywriting, conteúdo, ia, claude, gemini, inteligência artificial, chatgpt prompts, melhores prompts, biblioteca de prompts, prompts para marketing, prompts para copywriting, prompts para conteúdo, prompts em português, social media, blogger, criadores de conteúdo, profissionais de marketing, redatores, escritores, dicas de prompts, guia de prompts',
  openGraph: {
    title: 'PromptBox - Prompts que realmente funcionam',
    description: 'Biblioteca curada de 500+ prompts para marketing, copywriting e conteúdo.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className="antialiased">{children}</body>
    </html>
  )
}
