import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard, Newspaper, Video, MessageSquare, Users, Zap,
  Plus, Pencil, Trash2, Eye, EyeOff, LogOut, ArrowLeft, Check, X, Shield, RefreshCw
} from "lucide-react";
import { toast } from "sonner";

type Tab = "dashboard" | "articles" | "videos" | "opinions" | "breaking" | "users";

interface Article {
  id: string;
  title: string;
  category: string;
  published: boolean | null;
  author: string | null;
  views: number | null;
  created_at: string;
}

interface VideoItem {
  id: string;
  title: string;
  category: string | null;
  published: boolean | null;
  views: number | null;
  duration: string | null;
  created_at: string;
}

interface BreakingItem {
  id: string;
  text: string;
  active: boolean | null;
  created_at: string;
}

interface Opinion {
  id: string;
  title: string;
  author: string;
  published: boolean | null;
  created_at: string;
}

interface UserRole {
  id: string;
  user_id: string;
  role: string;
}

const AdminPage = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();

  // Capture global errors and show as toasts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const originalOnError = window.onerror;
      window.onerror = (message) => {
        console.error("Global error caught:", message);
        toast.error("Erro detectado: " + message);
        if (originalOnError) return originalOnError(message);
        return false;
      };
      return () => { window.onerror = originalOnError; };
    }
  }, []);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [articles, setArticles] = useState<Article[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [opinions, setOpinions] = useState<Opinion[]>([]);
  const [breakingNews, setBreakingNews] = useState<BreakingItem[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [stats, setStats] = useState({ articles: 0, videos: 0, opinions: 0, breaking: 0 });
  const [dataLoading, setDataLoading] = useState(false);

  // Article form
  const [articleForm, setArticleForm] = useState({ title: "", summary: "", category: "Política", author: "Redação", image_url: "", is_hero: false, is_breaking: false });
  const [editingArticle, setEditingArticle] = useState<string | null>(null);
  const [showArticleForm, setShowArticleForm] = useState(false);

  // Video form
  const [videoForm, setVideoForm] = useState({ title: "", description: "", video_url: "", thumbnail_url: "", duration: "", category: "Vídeo" });
  const [showVideoForm, setShowVideoForm] = useState(false);

  // Opinion form
  const [opinionForm, setOpinionForm] = useState({ title: "", author: "", content: "", excerpt: "", avatar_url: "" });
  const [editingOpinion, setEditingOpinion] = useState<string | null>(null);
  const [showOpinionForm, setShowOpinionForm] = useState(false);

  // Breaking form
  const [breakingForm, setBreakingForm] = useState("");
  const [showBreakingForm, setShowBreakingForm] = useState(false);

  // User role form
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<"admin" | "editor">("editor");

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
    if (!loading && user && !isAdmin) navigate("/");
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) loadData(activeTab);
  }, [activeTab, isAdmin]);

  const loadData = async (tab: Tab) => {
    console.log("Loading data for tab:", tab);
    setDataLoading(true);
    try {
      if (tab === "dashboard" || tab === "articles") {
        const { data, error } = await supabase.from("news_articles").select("id,title,category,published,author,views,created_at").order("created_at", { ascending: false });
        if (error) console.error("Error loading articles:", error);
        if (data) {
          setArticles(data);
          if (tab === "dashboard") setStats(s => ({ ...s, articles: data.length }));
        }
      }
      if (tab === "dashboard" || tab === "videos") {
        const { data, error } = await supabase.from("video_news").select("id,title,category,published,views,duration,created_at").order("created_at", { ascending: false });
        if (error) console.error("Error loading videos:", error);
        if (data) {
          setVideos(data);
          if (tab === "dashboard") setStats(s => ({ ...s, videos: data.length }));
        }
      }
      if (tab === "dashboard" || tab === "opinions") {
        const { data, error } = await supabase.from("opinion_articles").select("id,title,author,published,created_at").order("created_at", { ascending: false });
        if (error) console.error("Error loading opinions:", error);
        if (data) {
          setOpinions(data);
          if (tab === "dashboard") setStats(s => ({ ...s, opinions: data.length }));
        }
      }
      if (tab === "breaking") {
        const { data, error } = await supabase.from("breaking_news").select("*").order("created_at", { ascending: false });
        if (error) {
          console.error("Error loading breaking news:", error);
          toast.error("Erro ao carregar notícias: " + error.message);
        }
        if (data) {
          console.log("Breaking news loaded:", data);
          setBreakingNews(data);
        }
      }
      if (tab === "users") {
        const { data } = await supabase.from("user_roles").select("*");
        if (data) setUserRoles(data);
      }
    } catch (err) {
      console.error("Unexpected error in loadData:", err);
    } finally {
      setDataLoading(false);
    }
  };

  const togglePublished = async (table: string, id: string, current: boolean | null) => {
    const { error } = await supabase.from(table as any).update({ published: !current }).eq("id", id);
    if (error) {
      toast.error("Erro ao alterar estado: " + error.message);
    } else {
      toast.success("Estado alterado com sucesso");
      loadData(activeTab);
    }
  };

  const deleteRecord = async (table: string, id: string) => {
    if (!confirm("Tem a certeza que quer eliminar este registo?")) return;
    const { error } = await supabase.from(table as any).delete().eq("id", id);
    if (error) {
      toast.error("Erro ao eliminar: " + error.message);
    } else {
      toast.success("Eliminado com sucesso");
      loadData(activeTab);
    }
  };

  const saveArticle = async () => {
    if (!articleForm.title) {
      toast.error("O título é obrigatório");
      return;
    }
    const { error } = editingArticle
      ? await supabase.from("news_articles").update(articleForm).eq("id", editingArticle)
      : await supabase.from("news_articles").insert({ ...articleForm, published: true });

    if (error) {
      toast.error("Erro ao guardar artigo: " + error.message);
    } else {
      toast.success("Artigo guardado com sucesso");
      setShowArticleForm(false);
      setEditingArticle(null);
      setArticleForm({ title: "", summary: "", category: "Política", author: "Redação", image_url: "", is_hero: false, is_breaking: false });
      loadData("articles");
    }
  };

  const saveVideo = async () => {
    console.log("Saving video triggered. Form data:", videoForm);
    if (!videoForm.title || !videoForm.video_url) {
      toast.error("Título e URL do vídeo são obrigatórios");
      return;
    }

    setDataLoading(true);
    try {
      console.log("Attempting Supabase insert into video_news...");
      const { data, error } = await supabase.from("video_news").insert({ ...videoForm, published: true }).select();

      if (error) {
        console.error("Supabase insert error details:", error);
        toast.error("Erro ao guardar vídeo: " + error.message);
      } else {
        console.log("Video saved successfully. Data returned:", data);
        toast.success("Vídeo guardado com sucesso");
        setShowVideoForm(false);
        setVideoForm({ title: "", description: "", video_url: "", thumbnail_url: "", duration: "", category: "Vídeo" });
        loadData("videos");
      }
    } catch (err) {
      console.error("Unexpected error during saveVideo:", err);
      toast.error("Erro inesperado ao guardar o vídeo. Verifique a consola.");
    } finally {
      setDataLoading(false);
    }
  };

  const saveOpinion = async () => {
    if (!opinionForm.title || !opinionForm.author) {
      toast.error("Título e autor são obrigatórios");
      return;
    }
    const { error } = editingOpinion
      ? await supabase.from("opinion_articles").update(opinionForm).eq("id", editingOpinion)
      : await supabase.from("opinion_articles").insert({ ...opinionForm, published: true });

    if (error) {
      toast.error("Erro ao guardar opinião: " + error.message);
    } else {
      toast.success("Artigo de opinião guardado com sucesso");
      setShowOpinionForm(false);
      setEditingOpinion(null);
      setOpinionForm({ title: "", author: "", content: "", excerpt: "", avatar_url: "" });
      loadData("opinions");
    }
  };

  const saveBreaking = async () => {
    console.log("Saving breaking news:", breakingForm);
    if (!breakingForm) {
      toast.error("O texto é obrigatório");
      return;
    }

    setDataLoading(true);
    try {
      const { data, error } = await supabase.from("breaking_news").insert({ text: breakingForm, active: true }).select();
      if (error) {
        console.error("Breaking news insert error:", error);
        toast.error("Erro ao adicionar notícia: " + error.message);
      } else {
        console.log("Breaking news added successfully:", data);
        toast.success("Notícia de última hora adicionada");
        setShowBreakingForm(false);
        setBreakingForm("");
        loadData("breaking");
      }
    } catch (err) {
      console.error("Unexpected error in saveBreaking:", err);
      toast.error("Erro inesperado. Verifique a consola.");
    } finally {
      setDataLoading(false);
    }
  };

  const toggleBreaking = async (id: string, current: boolean | null) => {
    const { error } = await supabase.from("breaking_news").update({ active: !current }).eq("id", id);
    if (error) {
      toast.error("Erro ao alterar estado: " + error.message);
    } else {
      toast.success("Estado alterado");
      loadData("breaking");
    }
  };

  const categories = ["Política", "Economia", "Mundo", "Desporto", "Cultura", "Tecnologia", "Saúde", "Opinião"];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="text-muted-foreground text-sm mb-4 animate-pulse">A verificar permissões...</div>
        <button
          onClick={() => { localStorage.clear(); window.location.reload(); }}
          className="text-xs text-primary underline hoverline"
        >
          Demora muito? Clique aqui para reiniciar sessão
        </button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
        <Shield className="w-12 h-12 text-destructive mb-4" />
        <h1 className="text-xl font-bold text-foreground mb-2">Acesso Negado</h1>
        <p className="text-muted-foreground text-sm mb-6 max-w-xs">
          Não tem permissões de administrador. Se acabou de as receber, experimente reiniciar a sessão.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/")}
            className="bg-primary text-primary-foreground px-6 py-2 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Voltar ao Início
          </button>
          <button
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            className="text-xs text-muted-foreground underline"
          >
            Limpar cache e reiniciar
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "dashboard" as Tab, label: "Dashboard", icon: LayoutDashboard },
    { id: "articles" as Tab, label: "Artigos", icon: Newspaper },
    { id: "videos" as Tab, label: "Vídeos", icon: Video },
    { id: "opinions" as Tab, label: "Opinião", icon: MessageSquare },
    { id: "breaking" as Tab, label: "Última Hora", icon: Zap },
    { id: "users" as Tab, label: "Utilizadores", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Admin</span>
          </div>
          <h1 className="font-heading text-xl font-black tracking-tight text-foreground uppercase">OBSERVADOR</h1>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{user?.email}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <button
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${activeTab === id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom actions */}
        <div className="mt-6 pt-6 border-t border-border space-y-2">
          <button
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors uppercase tracking-wider font-semibold"
          >
            <RefreshCw className="w-4 h-4" />
            Reiniciar Sessão
          </button>
          <button
            onClick={() => { signOut(); navigate("/"); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider font-semibold"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-card border-b border-border px-8 py-4 sticky top-0 z-10">
          <h2 className="font-heading text-lg font-bold text-foreground capitalize">
            {tabs.find(t => t.id === activeTab)?.label}
          </h2>
        </div>

        <div className="p-8">
          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Artigos", value: articles.length, icon: Newspaper, color: "text-blue-400" },
                  { label: "Vídeos", value: videos.length, icon: Video, color: "text-purple-400" },
                  { label: "Última Hora", value: breakingNews.length, icon: Zap, color: "text-primary" },
                  { label: "Utilizadores", value: userRoles.length, icon: Users, color: "text-green-400" },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="bg-card border border-border p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <div className="text-3xl font-heading font-bold text-foreground">{value}</div>
                  </div>
                ))}
              </div>

              <div className="bg-card border border-border p-5">
                <h3 className="font-heading font-semibold text-foreground mb-4">Últimos artigos</h3>
                <div className="space-y-2">
                  {articles.slice(0, 5).map(a => (
                    <div key={a.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <p className="text-sm text-foreground line-clamp-1">{a.title}</p>
                        <p className="text-xs text-muted-foreground">{a.category} · {a.author}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 ${a.published ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"}`}>
                        {a.published ? "Publicado" : "Rascunho"}
                      </span>
                    </div>
                  ))}
                  {articles.length === 0 && <p className="text-sm text-muted-foreground">Sem artigos ainda.</p>}
                </div>
              </div>
            </div>
          )}

          {/* Articles */}
          {activeTab === "articles" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">{articles.length} artigos no total</p>
                <button
                  onClick={() => { setShowArticleForm(true); setEditingArticle(null); }}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" />
                  Novo artigo
                </button>
              </div>

              {/* Article form */}
              {showArticleForm && (
                <div className="bg-card border border-border p-6 mb-6">
                  <h3 className="font-heading font-semibold text-foreground mb-4">
                    {editingArticle ? "Editar artigo" : "Novo artigo"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Título *</label>
                      <input
                        value={articleForm.title}
                        onChange={e => setArticleForm(f => ({ ...f, title: e.target.value }))}
                        className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                        placeholder="Título do artigo"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Resumo</label>
                      <textarea
                        value={articleForm.summary}
                        onChange={e => setArticleForm(f => ({ ...f, summary: e.target.value }))}
                        className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                        rows={3}
                        placeholder="Resumo do artigo"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Categoria</label>
                      <select
                        value={articleForm.category}
                        onChange={e => setArticleForm(f => ({ ...f, category: e.target.value }))}
                        className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                      >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Autor</label>
                      <input
                        value={articleForm.author}
                        onChange={e => setArticleForm(f => ({ ...f, author: e.target.value }))}
                        className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">URL da imagem</label>
                      <input
                        value={articleForm.image_url}
                        onChange={e => setArticleForm(f => ({ ...f, image_url: e.target.value }))}
                        className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                        placeholder="https://..."
                      />
                    </div>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                        <input type="checkbox" checked={articleForm.is_hero} onChange={e => setArticleForm(f => ({ ...f, is_hero: e.target.checked }))} className="accent-primary" />
                        Destaque principal
                      </label>
                      <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                        <input type="checkbox" checked={articleForm.is_breaking} onChange={e => setArticleForm(f => ({ ...f, is_breaking: e.target.checked }))} className="accent-primary" />
                        Última hora
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <button onClick={saveArticle} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity">
                      <Check className="w-4 h-4" />
                      Guardar
                    </button>
                    <button onClick={() => setShowArticleForm(false)} className="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 text-sm hover:bg-muted transition-colors">
                      <X className="w-4 h-4" />
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {/* Articles table */}
              <div className="bg-card border border-border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Título</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Categoria</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Autor</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map(article => (
                      <tr key={article.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                        <td className="px-4 py-3 text-sm text-foreground max-w-xs">
                          <span className="line-clamp-1">{article.title}</span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="text-xs bg-secondary text-muted-foreground px-2 py-0.5">{article.category}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell">{article.author}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 ${article.published ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"}`}>
                            {article.published ? "Publicado" : "Rascunho"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => togglePublished("news_articles", article.id, article.published)}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                              title={article.published ? "Despublicar" : "Publicar"}
                            >
                              {article.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => {
                                setEditingArticle(article.id);
                                setArticleForm({ title: article.title, summary: "", category: article.category, author: article.author || "Redação", image_url: "", is_hero: false, is_breaking: false });
                                setShowArticleForm(true);
                              }}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteRecord("news_articles", article.id)}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {articles.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                          Sem artigos. Crie o primeiro artigo.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Videos */}
          {activeTab === "videos" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">{videos.length} vídeos no total</p>
                <button
                  onClick={() => setShowVideoForm(true)}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" />
                  Novo vídeo
                </button>
              </div>

              {showVideoForm && (
                <div className="bg-card border border-border p-6 mb-6">
                  <h3 className="font-heading font-semibold text-foreground mb-4">Novo vídeo</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Título *</label>
                      <input value={videoForm.title} onChange={e => setVideoForm(f => ({ ...f, title: e.target.value }))} className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">URL do vídeo (YouTube/Vimeo) *</label>
                      <input value={videoForm.video_url} onChange={e => setVideoForm(f => ({ ...f, video_url: e.target.value }))} className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary" placeholder="https://youtube.com/watch?v=..." />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Thumbnail URL</label>
                      <input value={videoForm.thumbnail_url} onChange={e => setVideoForm(f => ({ ...f, thumbnail_url: e.target.value }))} className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Duração (ex: 12:34)</label>
                      <input value={videoForm.duration} onChange={e => setVideoForm(f => ({ ...f, duration: e.target.value }))} className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Descrição</label>
                      <textarea value={videoForm.description} onChange={e => setVideoForm(f => ({ ...f, description: e.target.value }))} className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none" rows={2} />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <button onClick={saveVideo} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90">
                      <Check className="w-4 h-4" /> Guardar
                    </button>
                    <button onClick={() => setShowVideoForm(false)} className="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 text-sm hover:bg-muted">
                      <X className="w-4 h-4" /> Cancelar
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-card border border-border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Título</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Duração</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {videos.map(v => (
                      <tr key={v.id} className="border-b border-border hover:bg-secondary/50">
                        <td className="px-4 py-3 text-sm text-foreground"><span className="line-clamp-1">{v.title}</span></td>
                        <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">{v.duration || "—"}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 ${v.published ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"}`}>
                            {v.published ? "Publicado" : "Rascunho"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => togglePublished("video_news", v.id, v.published)} className="text-muted-foreground hover:text-foreground transition-colors">
                              {v.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button onClick={() => deleteRecord("video_news", v.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {videos.length === 0 && (
                      <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">Sem vídeos ainda.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Breaking news */}
          {activeTab === "breaking" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">Notícias de última hora ativas no ticker</p>
                <button onClick={() => setShowBreakingForm(true)} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90">
                  <Plus className="w-4 h-4" /> Nova notícia
                </button>
              </div>

              {showBreakingForm && (
                <div className="bg-card border border-border p-6 mb-6">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Texto da notícia *</label>
                  <input value={breakingForm} onChange={e => setBreakingForm(e.target.value)} className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary mb-3" placeholder="Texto que aparece no ticker..." />
                  <div className="flex gap-3">
                    <button onClick={saveBreaking} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90">
                      <Check className="w-4 h-4" /> Adicionar
                    </button>
                    <button onClick={() => setShowBreakingForm(false)} className="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 text-sm hover:bg-muted">
                      <X className="w-4 h-4" /> Cancelar
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {breakingNews.map(item => (
                  <div key={item.id} className="flex items-center justify-between bg-card border border-border px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.active ? "bg-primary animate-pulse" : "bg-muted-foreground"}`} />
                      <span className="text-sm text-foreground line-clamp-1">{item.text}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                      <button onClick={() => toggleBreaking(item.id, item.active)} className={`text-xs px-2 py-1 transition-colors ${item.active ? "bg-green-500/20 text-green-400 hover:bg-red-500/20 hover:text-red-400" : "bg-muted text-muted-foreground hover:bg-green-500/20 hover:text-green-400"}`}>
                        {item.active ? "Ativo" : "Inativo"}
                      </button>
                      <button onClick={() => deleteRecord("breaking_news", item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {breakingNews.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Sem notícias de última hora.</p>}
              </div>
            </div>
          )}

          {/* Users */}
          {activeTab === "users" && (
            <div>
              <div className="bg-card border border-border p-6 mb-6">
                <h3 className="font-heading font-semibold text-foreground mb-1">Atribuir função a utilizador</h3>
                <p className="text-xs text-muted-foreground mb-4">Introduza o UUID do utilizador (visível no Cloud → Utilizadores)</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <input
                      value={newUserEmail}
                      onChange={e => setNewUserEmail(e.target.value)}
                      className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                      placeholder="UUID do utilizador"
                    />
                  </div>
                  <select
                    value={newUserRole}
                    onChange={e => setNewUserRole(e.target.value as "admin" | "editor")}
                    className="bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button
                  onClick={async () => {
                    if (!newUserEmail) return;
                    const { error } = await supabase.from("user_roles").insert({ user_id: newUserEmail, role: newUserRole });
                    if (error) toast.error("Erro: " + error.message);
                    else { toast.success("Função atribuída com sucesso"); setNewUserEmail(""); loadData("users"); }
                  }}
                  className="mt-3 flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90"
                >
                  <Plus className="w-4 h-4" />
                  Atribuir função
                </button>
              </div>

              <div className="bg-card border border-border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">User ID</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Função</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userRoles.map(ur => (
                      <tr key={ur.id} className="border-b border-border hover:bg-secondary/50">
                        <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{ur.user_id}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 uppercase font-semibold tracking-wider ${ur.role === "admin" ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>
                            {ur.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button onClick={() => deleteRecord("user_roles", ur.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {userRoles.length === 0 && <tr><td colSpan={3} className="px-4 py-8 text-center text-sm text-muted-foreground">Sem utilizadores com funções atribuídas.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Opinions */}
          {activeTab === "opinions" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">{opinions.length} artigos de opinião no total</p>
                <button
                  onClick={() => { setShowOpinionForm(true); setEditingOpinion(null); }}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" />
                  Novo artigo de opinião
                </button>
              </div>

              {/* Opinion form */}
              {showOpinionForm && (
                <div className="bg-card border border-border p-6 mb-6">
                  <h3 className="font-heading font-semibold text-foreground mb-4">
                    {editingOpinion ? "Editar opinião" : "Novo artigo de opinião"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Título *</label>
                      <input
                        value={opinionForm.title}
                        onChange={e => setOpinionForm(f => ({ ...f, title: e.target.value }))}
                        className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                        placeholder="Título da opinião"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Autor *</label>
                      <input
                        value={opinionForm.author}
                        onChange={e => setOpinionForm(f => ({ ...f, author: e.target.value }))}
                        className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Avatar URL</label>
                      <input
                        value={opinionForm.avatar_url}
                        onChange={e => setOpinionForm(f => ({ ...f, avatar_url: e.target.value }))}
                        className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                        placeholder="https://..."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Excerto (Opcional)</label>
                      <textarea
                        value={opinionForm.excerpt}
                        onChange={e => setOpinionForm(f => ({ ...f, excerpt: e.target.value }))}
                        className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                        rows={2}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Conteúdo</label>
                      <textarea
                        value={opinionForm.content}
                        onChange={e => setOpinionForm(f => ({ ...f, content: e.target.value }))}
                        className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                        rows={10}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <button onClick={saveOpinion} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity">
                      <Check className="w-4 h-4" />
                      Guardar
                    </button>
                    <button onClick={() => setShowOpinionForm(false)} className="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 text-sm hover:bg-muted transition-colors">
                      <X className="w-4 h-4" />
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {/* Opinions table */}
              <div className="bg-card border border-border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Título</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Autor</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {opinions.map(op => (
                      <tr key={op.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                        <td className="px-4 py-3 text-sm text-foreground max-w-xs">
                          <span className="line-clamp-1">{op.title}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{op.author}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 ${op.published ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"}`}>
                            {op.published ? "Publicado" : "Rascunho"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => togglePublished("opinion_articles", op.id, op.published)}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                              title={op.published ? "Despublicar" : "Publicar"}
                            >
                              {op.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={async () => {
                                const { data } = await supabase.from("opinion_articles").select("*").eq("id", op.id).single();
                                if (data) {
                                  setEditingOpinion(op.id);
                                  setOpinionForm({
                                    title: data.title,
                                    author: data.author,
                                    content: data.content || "",
                                    excerpt: data.excerpt || "",
                                    avatar_url: data.avatar_url || ""
                                  });
                                  setShowOpinionForm(true);
                                }
                              }}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteRecord("opinion_articles", op.id)}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {opinions.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">
                          Sem artigos de opinião.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
