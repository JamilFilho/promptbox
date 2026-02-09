'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  Menu, X, Check, ArrowRight, ArrowUpRight, 
  Terminal, Zap, Layers, MessageSquare, 
  Copy, Shield, Sparkles, Code, 
  ChevronRight, ExternalLink, Mail, Twitter, Linkedin
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

// Navigation Component
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md border-b border-neutral-200' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5" strokeWidth={1.5} />
            <span className="font-semibold text-lg tracking-tight">PromptBox</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="mono-tech hover:text-black transition-colors">Recursos</a>
            <a href="#how-it-works" className="mono-tech hover:text-black transition-colors">Como funciona</a>
            <a href="#pricing" className="mono-tech hover:text-black transition-colors">Preço</a>
            <a href="#faq" className="mono-tech hover:text-black transition-colors">FAQ</a>
          </div>

          <div className="hidden md:block">
            <a href="/box" className="btn-primary-tech text-sm">
              Comprar agora <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
          
          <button 
            className="md:hidden p-2 border border-neutral-300 rounded-lg hover:border-black transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" strokeWidth={1.5} /> : <Menu className="w-5 h-5" strokeWidth={1.5} />}
          </button>
        </div>
      </nav>
      
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-white flex flex-col items-center justify-center gap-8 md:hidden">
          <button 
            className="absolute top-4 right-6 p-2 border border-neutral-300 rounded-lg"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
          <a href="#features" onClick={() => setIsOpen(false)} className="heading-tech-md">Recursos</a>
          <a href="#how-it-works" onClick={() => setIsOpen(false)} className="heading-tech-md">Como funciona</a>
          <a href="#pricing" onClick={() => setIsOpen(false)} className="heading-tech-md">Preço</a>
          <a href="#faq" onClick={() => setIsOpen(false)} className="heading-tech-md">FAQ</a>
          <a href="/box" className="btn-primary-tech mt-4">
            Comprar agora <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      )}
    </>
  )
}

// Hero Section
const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const content = contentRef.current
    if (!section || !content) return

    const ctx = gsap.context(() => {
      gsap.fromTo(content.children, 
        { y: 40, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          stagger: 0.1,
          duration: 0.8,
          ease: 'power3.out',
          delay: 0.2
        }
      )
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="section-tech py-20 bg-white grid-pattern">
      <div ref={contentRef} className="max-w-4xl mx-auto text-center pt-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-full mb-8">
          <Sparkles className="w-4 h-4" strokeWidth={1.5} />
          <span className="mono-tech">500+ prompts prontos</span>
        </div>
        
        <h1 className="heading-tech-xl mb-6">
          Pare de gastar<br />
          <span className="text-neutral-400">tempo escrevendo</span>
        </h1>
        
        <p className="body-tech max-w-2xl mx-auto mb-10">
          Uma biblioteca de prompts testados e aprovados para ChatGPT, Claude, Gemini e outras IAs.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="/box" className="btn-primary-tech w-full sm:w-auto">
            Comprar agora <ArrowRight className="w-4 h-4" />
          </a>
          <a href="#prompt-example" className="btn-outline-tech w-full sm:w-auto">
            Ver demonstração <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="mt-16 pt-8 border-t border-neutral-200">
          <p className="mono-tech mb-6">Compatível com</p>
          <div className="flex items-center justify-center gap-8 text-neutral-400">
            <span className="font-mono text-sm">ChatGPT</span>
            <span className="font-mono text-sm">Claude</span>
            <span className="font-mono text-sm">Gemini</span>
            <span className="font-mono text-sm">Copilot</span>
          </div>
        </div>
      </div>
    </section>
  )
}

// Features Section
const FeaturesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const cards = cardsRef.current
    if (!section || !cards) return

    const ctx = gsap.context(() => {
      gsap.fromTo(cards.children, 
        { y: 60, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          stagger: 0.1,
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            end: 'top 30%',
            scrub: 0.5,
          }
        }
      )
    }, section)

    return () => ctx.revert()
  }, [])

  const features = [
    {
      icon: <Copy className="w-5 h-5" strokeWidth={1.5} />,
      title: 'Copy que converte',
      description: 'Landing pages, emails e anúncios otimizados para resultados.'
    },
    {
      icon: <Layers className="w-5 h-5" strokeWidth={1.5} />,
      title: 'Sistemas de conteúdo',
      description: 'Conteúdo semanal, roteiros e legendas sem burnout.'
    },
    {
      icon: <MessageSquare className="w-5 h-5" strokeWidth={1.5} />,
      title: 'Voz da marca',
      description: 'Mantenha consistência de tom em todas as saídas.'
    },
    {
      icon: <Zap className="w-5 h-5" strokeWidth={1.5} />,
      title: 'Pronto para usar',
      description: 'Cole e execute. Sem configuração complicada.'
    },
    {
      icon: <Code className="w-5 h-5" strokeWidth={1.5} />,
      title: 'Variáveis inteligentes',
      description: 'Preencha os campos e personalize em segundos.'
    },
    {
      icon: <Shield className="w-5 h-5" strokeWidth={1.5} />,
      title: 'Uso comercial',
      description: 'Use em projetos pessoais e comerciais sem limites.'
    }
  ]

  return (
    <section id="features" ref={sectionRef} className="section-tech py-12 bg-neutral-50">
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <span className="mono-tech block mb-4">Deixe a complicação com a gente</span>
          <h2 className="heading-tech-lg">Tudo que você precisa</h2>
        </div>
        
        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div key={i} className="tech-card p-6">
              <div className="icon-container mb-4">
                {feature.icon}
              </div>
              <h3 className="heading-tech-md mb-2">{feature.title}</h3>
              <p className="body-tech text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// How It Works Section
const HowItWorksSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<HTMLDivElement>(null)
  const [formValues, setFormValues] = useState({
    produto: '',
    beneficio: '',
    tom: '',
    publico: '',
    objetivo: '',
    dor: '',
    link: '',
    foco: ''
  })
  const [copied, setCopied] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCopyPrompt = () => {
    const promptText = `Atue como um copywriter especialista em email marketing com foco em alta taxa de abertura e clique (CTR). Crie um email de topo de funil com as seguintes características:\n\nObjetivo: ${formValues.objetivo || 'Gerar curiosidade, conexão emocional e levar o leitor a clicar no link para consumir um conteúdo gratuito.'}\nProduto: ${formValues.produto || '[produto]'}\nBenefício: ${formValues.beneficio || '[benefício principal]'}\nDor principal: ${formValues.dor || '[dor ou frustração do público]'}\nTom: ${formValues.tom || '[profissional/amigável/urgente]'}\nPúblico-alvo: ${formValues.publico || '[descrição do público-alvo]'}\nFoco psicológico: ${formValues.foco || 'curiosidade + identificação + benefício implícito'}\nLink para CTA: ${formValues.link || '[inserir link]'}\n\nDiretrizes: 1. Assunto com até 45 caracteres, altamente curioso e específico. 2. Primeira linha precisa gerar identificação imediata. 3. Linguagem simples, direta e conversacional. 4. Parágrafos curtos (1-3 linhas). 5. Usar perguntas estratégicas para aumentar envolvimento. 6. Não vender diretamente — apenas despertar interesse. 7. Inserir 1 único CTA claro e objetivo. 8. Finalizar com uma frase curta e impactante. 9. Evitar clichês e promessas exageradas. 10. Incluir variação A/B de assunto ao final.\n\nEstrutura recomendada: Assunto / Pré-header / Corpo / CTA / Assinatura.`

    navigator.clipboard.writeText(promptText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  useEffect(() => {
    const section = sectionRef.current
    const steps = stepsRef.current
    if (!section || !steps) return

    const ctx = gsap.context(() => {
      gsap.fromTo(steps.children, 
        { x: -40, opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          stagger: 0.15,
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            end: 'top 30%',
            scrub: 0.5,
          }
        }
      )
    }, section)

    return () => ctx.revert()
  }, [])

  const steps = [
    {
      number: '01',
      title: 'Escolha um objetivo',
      description: 'Navegue pela biblioteca e encontre o prompt perfeito para sua necessidade.'
    },
    {
      number: '02',
      title: 'Personalize o prompt',
      description: 'Adicione informações específicas sobre seu produto ou serviço.'
    },
    {
      number: '03',
      title: 'Copie o prompt',
      description: 'Copie e cole no ChatGPT, Claude, Gemini ou qualquer IA de sua preferência.'
    },
  ]

  return (
    <section id="how-it-works" ref={sectionRef} className="section-tech py-12 bg-white">
      <div className="max-w-5xl mx-auto w-full">
        <div className="text-center mb-16">
          <span className="mono-tech block mb-4">Como funciona</span>
          <h2 className="heading-tech-lg">Três passos simples</h2>
        </div>
        
        <div ref={stepsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="feature-item last:col-span-full">
              <span className="font-mono text-2xl text-neutral-300 font-light">{step.number}</span>
              <div className="pr-2">
                <h3 className="heading-tech-md mb-1">{step.title}</h3>
                <p className="body-tech">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div id="prompt-example" className="scroll-mt-32 mt-12 p-6 border border-neutral-200 rounded-lg bg-neutral-50">
          <div className="flex items-center gap-2 mb-4">
            <Terminal className="w-4 h-4 text-neutral-500" strokeWidth={1.5} />
            <span className="mono-tech">Exemplo de prompt</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="h-fit flex flex-row flex-wrap gap-4 p-2">
              <input 
                placeholder="Descreva seu produto" 
                className="w-full p-2 border border-neutral-300 rounded-md" 
                value={formValues.produto}
                onChange={(e) => handleInputChange('produto', e.target.value)}
              />
              <input 
                placeholder="Qual o principal benefício?" 
                className="w-full p-2 border border-neutral-300 rounded-md"
                value={formValues.beneficio}
                onChange={(e) => handleInputChange('beneficio', e.target.value)}
              />
              <input 
                placeholder="Qual o tom?" 
                className="w-full p-2 border border-neutral-300 rounded-md"
                value={formValues.tom}
                onChange={(e) => handleInputChange('tom', e.target.value)}
              />
              <input 
                placeholder="Qual o seu público-alvo?" 
                className="w-full p-2 border border-neutral-300 rounded-md"
                value={formValues.publico}
                onChange={(e) => handleInputChange('publico', e.target.value)}
              />
              <input
                placeholder="Objetivo do email (ex: gerar curiosidade)"
                className="w-full p-2 border border-neutral-300 rounded-md"
                value={formValues.objetivo}
                onChange={(e) => handleInputChange('objetivo', e.target.value)}
              />
              <input
                placeholder="Qual a principal dor do público?"
                className="w-full p-2 border border-neutral-300 rounded-md"
                value={formValues.dor}
                onChange={(e) => handleInputChange('dor', e.target.value)}
              />
              <input
                placeholder="Link para CTA (opcional)"
                className="w-full p-2 border border-neutral-300 rounded-md"
                value={formValues.link}
                onChange={(e) => handleInputChange('link', e.target.value)}
              />
              <input
                placeholder="Foco psicológico (ex: curiosidade + identificação)"
                className="w-full p-2 border border-neutral-300 rounded-md"
                value={formValues.foco}
                onChange={(e) => handleInputChange('foco', e.target.value)}
              />
            </div>
            <div>
              <div className="code-block md:max-h-[400px] overflow-y-auto">
                <span className="text-neutral text-xs py-1 px-2 border rounded-full">Email Marketing</span>
                <p className="text-neutral-600">
                  Atue como um copywriter especialista em email marketing com foco em alta taxa de abertura e clique (CTR). Crie um email de topo de funil com as seguintes características:
                  <br/><br/>
                  <b>Objetivo:</b> {formValues.objetivo || '[Gerar curiosidade, conexão emocional e levar o leitor a clicar no link para consumir um conteúdo gratuito (artigo, vídeo, checklist ou diagnóstico).]'}
                  <br/>
                  <b>Público-alvo:</b> {formValues.publico || '[descrição do público-alvo]'}
                  <br/>
                  <b>Dor principal:</b> {formValues.dor || '[Descreva a principal dor ou frustração do público]'}
                  <br/>
                  <b>Promessa implícita:</b> {formValues.beneficio || '[Qual transformação ou insight será apresentado no conteúdo]'}
                  <br/>
                  <b>Link para CTA:</b> {formValues.link || '[Inserir link ou placeholder]'}
                  <br/><br/>
                  Diretrizes obrigatórias:
                  <br/><br/>
                  1. Assunto com até 45 caracteres, altamente curioso e específico.
                  <br/>
                  2. Primeira linha precisa gerar identificação imediata.
                  <br/>
                  3. Linguagem simples, direta e conversacional.
                  <br/>
                  4. Parágrafos curtos (1-3 linhas).
                  <br/>
                  5. Usar perguntas estratégicas para aumentar envolvimento.
                  <br/>
                  6. Não vender diretamente — apenas despertar interesse.
                  <br/>
                  7. Inserir 1 único CTA claro e objetivo.
                  <br/>
                  8. Finalizar com uma frase curta e impactante.
                  <br/>
                  9. Evitar clichês e promessas exageradas.
                  <br/>
                  10. Incluir variação A/B de assunto ao final.
                  <br/><br/>
                  Estrutura recomendada:
                  <br/><br/>
                  - Assunto
                  <br/>
                  - Pré-header (linha complementar ao assunto)
                  <br/>
                  - Corpo do email
                  <br/>
                  - CTA
                  <br/>
                  - Assinatura simples
                  <br/><br/>
                  <b>Tom:</b> {formValues.tom || '[profissional/amigável/urgente]'}.
                  <br/>
                  <b>Foco psicológico:</b> {formValues.foco || '[curiosidade + identificação + benefício implícito]'}.
                </p>
              </div>
              <button
                onClick={handleCopyPrompt}
                className="mt-4 flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-md hover:border-black hover:bg-neutral-50 transition-colors text-sm font-medium"
              >
                <Copy className="w-4 h-4" strokeWidth={1.5} />
                {copied ? 'Copiado!' : 'Copiar prompt'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Categories Section
const CategoriesSection = () => {
  const categories = [
    { name: 'Marketing', count: '120+' },
    { name: 'Copywriting', count: '95+' },
    { name: 'Conteúdo', count: '85+' },
    { name: 'Vendas', count: '70+' },
    { name: 'Social Media', count: '65+' },
    { name: 'Email', count: '55+' },
    { name: 'SEO', count: '45+' },
    { name: 'Branding', count: '40+' },
  ]

  return (
    <section className="section-tech bg-neutral-50">
      <div className="max-w-5xl mx-auto w-full">
        <div className="text-center mb-16">
          <span className="mono-tech block mb-4">Categorias</span>
          <h2 className="heading-tech-lg">Prompts organizados</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <div key={i} className="tech-card p-4 text-center hover:border-black cursor-pointer transition-all">
              <span className="font-mono text-xs text-neutral-400 block mb-1">{cat.count}</span>
              <span className="font-medium text-black">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Pricing Section
const PricingSection = () => {
  const features = [
    '500+ prompts',
    'Atualizações vitalícias',
    'Uso comercial',
    'Acesso imediato',
    'Suporte por email'
  ]

  return (
    <section id="pricing" className="section-tech bg-neutral-50">
      <div className="w-full grid grid-cols-2">
        <div className="text-center flex items-center justify-center flex-col gap-4">
          <span className="mono-tech block mb-4">Preço</span>
          <h2 className="heading-tech-lg">Pague uma vez, use para sempre</h2>
        </div>
        
        <div className="pricing-card-featured bg-white w-3/4 mx-auto">
          <div className="text-center mb-8">
            <span className="mono-tech block mb-4">PromptBox Completo</span>
            <div className="flex items-baseline justify-center gap-3">
              <span className="text-2xl text-neutral-400 line-through">R$99</span>
              <span className="heading-tech-xl">R$17,99</span>
            </div>
            <span className="mono-tech block mt-2">Pagamento único</span>
          </div>
          
          <div className="space-y-3 mb-8">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <Check className="w-4 h-4 text-black" strokeWidth={1.5} />
                <span className="body-tech">{f}</span>
              </div>
            ))}
          </div>
          
          <a href="/box" className="btn-primary-tech w-full">
            Comprar agora <ArrowRight className="w-4 h-4" />
          </a>
          
          <p className="text-center mt-4 text-sm text-neutral-500">
            Garantia de 7 dias. Sem perguntas.
          </p>
        </div>
      </div>
    </section>
  )
}

// FAQ Section
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      q: 'Como recebo os prompts após a compra?',
      a: 'Você recebe acesso imediato a uma área de membros protegida onde pode navegar, buscar e copiar todos os prompts.'
    },
    {
      q: 'Posso usar os prompts para projetos comerciais?',
      a: 'Sim! Todos os prompts incluem licença de uso comercial. Use em projetos pessoais ou para clientes sem limitações.'
    },
    {
      q: 'Funciona com qual IA?',
      a: 'Os prompts são compatíveis com ChatGPT, Claude, Gemini, Copilot e outras IAs de linguagem grandes.'
    },
    {
      q: 'Vocês adicionam novos prompts?',
      a: 'Sim, nossas atualizações são quinzenais! Todos os compradores recebem atualizações vitalícias sempre que adicionamos novos prompts à biblioteca.'
    },
    {
      q: 'Tem garantia?',
      a: 'Oferecemos garantia de 7 dias. Se não estiver satisfeito, devolvemos 100% do seu dinheiro.'
    }
  ]

  return (
    <section id="faq" className="section-tech bg-white">
      <div className="max-w-3xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="heading-tech-lg">Perguntas frequentes</h2>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-neutral-200 rounded-lg overflow-hidden bg-white">
              <button 
                className="w-full flex items-center justify-between p-5 text-left hover:bg-neutral-50 transition-colors"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="font-medium text-black pr-4">{faq.q}</span>
                {openIndex === i ? (
                  <X className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                ) : (
                  <ChevronRight className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                )}
              </button>
              {openIndex === i && (
                <div className="px-5 py-5">
                  <p className="body-tech">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// CTA Section
const CTASection = () => {
  return (
    <section className="section-tech bg-black text-white">
      <div className="max-w-3xl mx-auto text-center">
        <Terminal className="w-10 h-10 mx-auto mb-6 opacity-50" strokeWidth={1.5} />
        <h2 className="heading-tech-lg text-white mb-6">
          Pronto para transformar<br />seu workflow?
        </h2>
        <p className="text-neutral-400 mb-10 max-w-xl mx-auto">
          Junte-se a milhares de criadores e profissionais de marketing que já economizam horas todos os dias.
        </p>
        <a href="/box" className="bg-white text-black px-8 py-4 font-medium hover:bg-neutral-200 transition-colors flex items-center gap-2 mx-auto">
          Comprar agora <ArrowRight className="w-4 h-4" />
        </a>
        <p className="mono-tech mt-6">R$17,99 · Pagamento único</p>
      </div>
    </section>
  )
}

// Footer
const Footer = () => {
  return (
    <footer className="bg-white border-t border-neutral-200 py-12 grid-pattern">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="w-5 h-5" strokeWidth={1.5} />
              <span className="font-semibold">PromptBox</span>
            </div>
            <p className="body-tech text-sm max-w-xs">
              Biblioteca de prompts para criadores e profissionais de marketing.
            </p>
            <p className="mt-4 body-tech text-sm max-w-xs">
              Um produto <a href="https://holylab.com.br" target="_blank" className="underline hover:text-black transition-colors">holyLAB</a>.
            </p>
          </div>
          
          {/* <div className="flex gap-12">
            <div>
              <span className="mono-tech block mb-4">Links</span>
              <div className="space-y-2">
                <a href="#features" className="block body-tech text-sm hover:text-black transition-colors">Recursos</a>
                <a href="#how-it-works" className="block body-tech text-sm hover:text-black transition-colors">Como funciona</a>
                <a href="#pricing" className="block body-tech text-sm hover:text-black transition-colors">Preço</a>
                <a href="#faq" className="block body-tech text-sm hover:text-black transition-colors">FAQ</a>
              </div>
            </div>
          </div> */}
        </div>
        
        <div className="pt-8 border-t border-neutral-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="mono-tech text-xs opacity-50">
            © 2026 PromptBox. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

// Main Page
export default function Home() {
  useEffect(() => {
    ScrollTrigger.refresh()
    
    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [])

  return (
    <div className="relative">
      <Navigation />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CategoriesSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
        <Footer />
      </main>
    </div>
  )
}
