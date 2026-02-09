"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type User = {
  id: string;
  nome: string;
  email: string;
  paid: boolean;
};

type PromptItem = {
  id: string;
  title: string;
  category: string;
  prompt: string;
};

const prompts: PromptItem[] = [
  {
    id: "1",
    title: "Email de boas-vindas com CTA",
    category: "Email",
    prompt:
      "Atue como copywriter e escreva um email de boas-vindas para novos leads, com tom amigável e CTA para baixar um material gratuito.",
  },
  {
    id: "2",
    title: "Sequência de 5 posts para Instagram",
    category: "Social Media",
    prompt:
      "Crie uma sequência de 5 posts para Instagram com storytelling, dor, prova, solução e CTA para direct.",
  },
  {
    id: "3",
    title: "Estrutura de landing page de conversão",
    category: "Copywriting",
    prompt:
      "Monte a estrutura completa de uma landing page de alta conversão para [produto], incluindo headline, benefícios, prova social e CTA.",
  },
  {
    id: "4",
    title: "Plano de conteúdo semanal",
    category: "Conteúdo",
    prompt:
      "Crie um plano de conteúdo semanal com 7 ideias de posts para [nicho], com objetivo de gerar engajamento e leads.",
  },
  {
    id: "5",
    title: "Script de anúncio de vídeo curto",
    category: "Anúncios",
    prompt:
      "Escreva um script de anúncio de 30 segundos com gancho forte nos 3 primeiros segundos e CTA no final.",
  },
  {
    id: "6",
    title: "Roteiro de descoberta para vendas",
    category: "Vendas",
    prompt:
      "Crie um roteiro de perguntas para call de descoberta de vendas consultivas, com foco em dor, urgência e decisão.",
  },
];

export default function BoxPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [form, setForm] = useState({ nome: "", email: "", password: "" });

  useEffect(() => {
    async function bootstrap() {
      try {
        const res = await fetch("/api/users/session", { method: "GET" });
        if (!res.ok) return;

        const data = await res.json();
        if (data?.authenticated && data.user) {
          setUser(data.user);
        }
      } catch {
        // noop
      } finally {
        setBooting(false);
      }
    }

    bootstrap();
  }, []);

  const categories = useMemo(
    () => ["Todos", ...new Set(prompts.map((item) => item.category))],
    []
  );

  const filteredPrompts = useMemo(() => {
    return prompts.filter((item) => {
      const matchesCategory = category === "Todos" || item.category === category;
      const normalized = `${item.title} ${item.prompt}`.toLowerCase();
      const matchesQuery = normalized.includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  async function handleAuthSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint = mode === "login" ? "/api/users/login" : "/api/users/register";
      const payload =
        mode === "login"
          ? { email: form.email, password: form.password }
          : { nome: form.nome, email: form.email, password: form.password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Não foi possível autenticar.");
        return;
      }

      setUser(data.user);
      setForm({ nome: "", email: "", password: "" });
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckout() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/box/proxy", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Falha ao iniciar pagamento.");
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Erro ao conectar com o checkout.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/users/logout", { method: "POST" });
    setUser(null);
  }

  async function handleCopy(prompt: PromptItem) {
    await navigator.clipboard.writeText(prompt.prompt);
    setCopiedId(prompt.id);
    setTimeout(() => setCopiedId(null), 1800);
  }

  if (booting) {
    return <div className="p-10 text-center">Carregando área de membros...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white border border-neutral-200 rounded-xl p-6">
          <h1 className="text-2xl font-semibold mb-2">Área de membros PromptBox</h1>
          <p className="text-sm text-neutral-600 mb-6">Entre para acessar seus prompts.</p>

          <div className="flex mb-6 border rounded-md overflow-hidden">
            <button
              className={`w-1/2 p-2 text-sm ${mode === "login" ? "bg-black text-white" : "bg-white"}`}
              onClick={() => setMode("login")}
              type="button"
            >
              Login
            </button>
            <button
              className={`w-1/2 p-2 text-sm ${mode === "register" ? "bg-black text-white" : "bg-white"}`}
              onClick={() => setMode("register")}
              type="button"
            >
              Criar conta
            </button>
          </div>

          <form className="space-y-3" onSubmit={handleAuthSubmit}>
            {mode === "register" && (
              <input
                className="w-full border border-neutral-300 rounded-md p-2"
                placeholder="Seu nome"
                value={form.nome}
                onChange={(e) => setForm((prev) => ({ ...prev, nome: e.target.value }))}
                required
              />
            )}
            <input
              className="w-full border border-neutral-300 rounded-md p-2"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
            <input
              className="w-full border border-neutral-300 rounded-md p-2"
              placeholder="Senha"
              type="password"
              minLength={6}
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              required
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              className="w-full bg-black text-white p-2 rounded-md disabled:opacity-50"
              disabled={loading}
              type="submit"
            >
              {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta e entrar"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!user.paid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-neutral-50">
        <div className="w-full max-w-xl bg-white border border-neutral-200 rounded-xl p-8">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <h1 className="text-2xl font-semibold">Olá, {user.nome}</h1>
              <p className="text-neutral-600">Sua conta está ativa. Falta liberar o acesso premium.</p>
            </div>
            <button className="text-sm underline" onClick={handleLogout}>
              Sair
            </button>
          </div>

          <div className="border border-neutral-200 rounded-lg p-5 mb-5">
            <p className="text-sm text-neutral-600">Plano PromptBox Completo</p>
            <p className="text-3xl font-semibold mt-1">R$17,99</p>
            <p className="text-sm text-neutral-500">Pagamento único</p>
          </div>

          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

          <button
            className="w-full bg-black text-white rounded-md p-3 disabled:opacity-50"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? "Redirecionando..." : "Desbloquear área de membros"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="bg-white border border-neutral-200 rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-wider text-neutral-500">Área de membros</p>
              <h1 className="text-2xl font-semibold">Bem-vindo, {user.nome}</h1>
              <p className="text-neutral-600">Explore, filtre e copie prompts prontos para usar.</p>
            </div>
            <button className="text-sm underline self-start md:self-auto" onClick={handleLogout}>
              Sair
            </button>
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              className="border border-neutral-300 rounded-md p-2"
              placeholder="Buscar prompt"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select
              className="border border-neutral-300 rounded-md p-2"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className="border border-neutral-200 rounded-md p-2 text-sm text-neutral-600 flex items-center">
              {filteredPrompts.length} prompt(s) encontrado(s)
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPrompts.map((item) => (
            <article key={item.id} className="bg-white border border-neutral-200 rounded-xl p-5">
              <p className="text-xs uppercase tracking-wider text-neutral-500 mb-2">{item.category}</p>
              <h2 className="font-semibold text-lg mb-2">{item.title}</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">{item.prompt}</p>
              <button
                className="mt-4 bg-black text-white rounded-md px-4 py-2 text-sm"
                onClick={() => handleCopy(item)}
              >
                {copiedId === item.id ? "Copiado!" : "Copiar prompt"}
              </button>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
