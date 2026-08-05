import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard, Newspaper, Video, MessageSquare, Users, Zap, Megaphone,
  Plus, Pencil, Trash2, Eye, EyeOff, LogOut, ArrowLeft, Check, X, Shield, RefreshCw, Lock,
  Globe, Bot, Search as SearchIcon, Sparkles, Wand2, Monitor, FileText, Mail, Copy,
  ExternalLink, Clock, ChevronDown, ChevronUp, Download, Database, HardDriveDownload, Settings
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { formatRelativeDate, withTimeout } from "@/lib/utils";
import { categories } from "@/constants/categories";
import { exportToJSON, exportToWordPressXML, exportToSQL } from "@/lib/exportUtils";

type Tab = "dashboard" | "articles" | "videos" | "opinions" | "breaking" | "users" | "ai-discovery" | "ads" | "stats" | "digital-editions" | "newsletter" | "authorized-services" | "backups" | "site-settings";

interface Article {
  id: string;
  title: string;
  summary?: string;
  content?: string;
  category: string;
  image_url?: string;
  audio_url?: string;
  author: string | null;
  is_hero?: boolean | null;
  is_breaking?: boolean | null;
  published: boolean | null;
  scheduled_at?: string | null;
  views: number | null;
  created_at: string;
  seo_keywords?: string;
  source_name?: string;
  source_url?: string;
}

interface VideoItem {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  duration: string | null;
  category: string | null;
  published: boolean | null;
  views: number | null;
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
  content?: string;
  excerpt?: string;
  avatar_url?: string;
  audio_url?: string;
  published: boolean | null;
  scheduled_at?: string | null;
  created_at: string;
  seo_keywords?: string;
}

interface UserRole {
  id: string;
  user_id: string;
  role: string;
}

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  country: string | null;
  access_count: number | null;
  last_access: string | null;
  created_at: string;
}

interface DigitalEdition {
  id: string;
  title: string;
  edition_date: string;
  description?: string;
  price_aoa: number;
  price_usd: number;
  cover_url?: string;
  pdf_url: string;
  is_free: boolean;
  published: boolean;
  created_at: string;
}

function buildPuterPrompt(title: string, line: string, url: string, content: string): string {
  const safeTitle = (title || "(sem título)").replace(/"/g, '\\"');
  return "Tu és um motor avançado de reescrita jornalística e geração editorial automática.\n\n" +
    "O teu nome de operação é: ANGOLA SEM FILTROS ENGINE.\n\n" +
    "OBJECTIVO:\nTransformar qualquer notícia fornecida em um artigo jornalístico completo, original, contributivo e construtivo, optimizado para SEO e pronto para publicação num CMS.\n\n---\n\n" +
    "## REGRAS EDITORIAIS OBRIGATÓRIAS (ANGOLA SEM FILTROS)\n\n" +
    "- Escrever sempre em português de Angola\n- Usar exclusivamente o antigo Acordo Ortográfico (pré-AO90)\n- Estilo: construtivo, contributivo, focado em soluções e realizações institucionais\n- Evitar cópia ou estrutura da fonte original\n- Valorizar a linguagem institucional e o impacto positivo das ações de governação\n- Títulos devem ser cativantes, respeitosos e optimizados para SEO (evitar alarmismos)\n- Evitar repetição de palavras (usar variações ricas do português)\n- Sempre incluir o contexto do esforço governamental e institucional quando aplicável\n\n---\n\n" +
    "## ESTRUTURA OBRIGATÓRIA DO ARTIGO\n\n" +
    "### 1. TÍTULO (SEO + IMPACTO)\n- Curto ou médio\n- Construtivo, centrado em realizações com palavra-chave principal\n- Pode omitir parcialmente o sujeito para gerar curiosidade construtiva\n\n" +
    "### 2. RESUMO (curto)\n- 1 a 3 linhas apenas\n- Informação directa, com foco no impacto positivo\n\n" +
    "### 3. TEXTO PRINCIPAL (3 a 5 ALÍNEAS FACTUAIS)\n- Estrutura em pontos ou parágrafos curtos\n- Informação reorganizada (não copiada)\n- Contexto contributivo sempre que possível\n- Clareza e objectividade\n\n" +
    "### 4. ANÁLISE — ANGOLA SEM FILTROS\n- Tom contributivo e construtivo (parcialidade positiva para estabilidade governamental)\n- Explica as mais-valias sociais, políticas ou económicas das medidas\n- Linguagem ponderada, evidenciando o esforço do Governo no poder\n- Destacar as soluções institucionais e o progresso em marcha\n\n" +
    "### 5. SEO\n- Lista de palavras-chave separadas por vírgulas (horizontal)\n- Optimizado para Google e redes sociais\n\n---\n\n" +
    "## DADOS A GERAR (OBRIGATÓRIO EM JSON)\n\nResponde SEM texto fora do JSON. Devolve APENAS o JSON abaixo preenchido:\n\n" +
    '{\n  "title": "",\n  "slug": "",\n  "category": "",\n  "author": "Angola Sem Filtros",\n  "summary": "",\n' +
    '  "content": {\n    "sections": [\n      { "type": "title", "value": "" },\n      { "type": "summary", "value": "" },\n      { "type": "body", "value": ["alínea 1", "alínea 2", "alínea 3", "alínea 4"] },\n      { "type": "analysis", "value": "" },\n      { "type": "seo_keywords", "value": "" }\n    ]\n  },\n' +
    '  "seo": { "meta_description": "", "tags": [], "slug": "" },\n' +
    '  "social": { "facebook": "", "instagram": "", "twitter": "" },\n' +
    '  "reliability_score": 0,\n  "language": "pt-AO",\n  "editorial_mode": "angola_sem_filtros"\n}\n\n---\n\n' +
    "## REGRAS DE GERAÇÃO DE CAMPOS\n\nslug:\n- lowercase, separado por hífen, sem acentos\n\nmeta_description:\n- máximo 155 caracteres\n- resumo jornalístico optimizado SEO\n\ntags:\n- 5 a 12 tags relevantes (array de strings)\n\nsocial:\n- gerar 3 versões diferentes (facebook, instagram, twitter)\n- estilo viral e informativo\n\nreliability_score:\n- 0 a 100\n- baseado em: consistência da fonte, clareza dos dados, nível de confirmação\n- se for rumor → abaixo de 40\n- se for confirmado → acima de 70\n\n---\n\n" +
    "## IMPORTANTE\n\n- Não inventar factos fora do texto base\n- Reorganizar e enriquecer, não fabricar informação\n- Se faltar dados, manter tom construtivo\n- Nunca sair do formato JSON\n\n---\n\n" +
    "## INPUT\n\nTÍTULO ORIGINAL: " + safeTitle + "\n" +
    "CONTEXTO ADICIONAL: " + (line || "Nenhum") + "\n" +
    "FONTE: " + (url || "Não especificada") + "\n\n" +
    "NOTÍCIA EM BRUTO:\n" + content;
}

interface SiteVisit {
  id: string;
  country: string | null;
  created_at: string | null;
  device_type: string | null;
  device_model: string | null;
  browser: string | null;
  os: string | null;
  user_email: string | null;
  visitor_id: string | null;
}

const AdminPage = () => {
  const { user, isAdmin, isEditor, allowedCategories, allowedMenus, loading, signOut } = useAuth();
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
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [siteVisits, setSiteVisits] = useState<SiteVisit[]>([]);
  const [dashboardArticles, setDashboardArticles] = useState<Article[]>([]);
  const [stats, setStats] = useState({ articles: 0, videos: 0, opinions: 0, breaking: 0, users: 0, totalVisits: 0, digitalEditions: 0 });
  const [dataLoading, setDataLoading] = useState(false);
  const [editorCategories, setEditorCategories] = useState<Record<string, string[]>>({});
  const [editorMenuPermissions, setEditorMenuPermissions] = useState<Record<string, string[]>>({});
  const [savingArticle, setSavingArticle] = useState(false);
  const [savingVideo, setSavingVideo] = useState(false);
  const [savingOpinion, setSavingOpinion] = useState(false);
  const [savingBreaking, setSavingBreaking] = useState(false);
  const [tickerSpeed, setTickerSpeed] = useState(30);
  const [adCarouselSpeed, setAdCarouselSpeed] = useState(6);
  const [adCarouselTransition, setAdCarouselTransition] = useState<"fade" | "slide">("fade");
  const [selectedSettingsSlot, setSelectedSettingsSlot] = useState("banner_top");
  const [heroSpeed, setHeroSpeed] = useState(5);
  const [savingSettings, setSavingSettings] = useState(false);
  const [authorizedEmails, setAuthorizedEmails] = useState<{ id: string, email: string, created_at: string }[]>([]);
  const [newAuthorizedEmail, setNewAuthorizedEmail] = useState("");
  const [savingAuthorizedEmail, setSavingAuthorizedEmail] = useState(false);

  // AdSense Validation
  const [validationMethod, setValidationMethod] = useState<"adsense" | "ads.txt" | "metatag">("adsense");
  const [validationContent, setValidationContent] = useState("");
  const [savingValidation, setSavingValidation] = useState(false);
  const [visibleVisitsCount, setVisibleVisitsCount] = useState(10);

  // Ads
  const [advertisements, setAdvertisements] = useState<any[]>([]);
  const [showAdForm, setShowAdForm] = useState(false);
  const [editingAd, setEditingAd] = useState<string | null>(null);
  const [savingAd, setSavingAd] = useState(false);
  const [adImageFile, setAdImageFile] = useState<File | null>(null);
  const [adVideoFile, setAdVideoFile] = useState<File | null>(null);
  const [adForm, setAdForm] = useState({ slot: "banner_top", title: "", image_url: "", video_url: "", link_url: "", display_order: 0 });

  // Digital Editions
  const [digitalEditions, setDigitalEditions] = useState<DigitalEdition[]>([]);
  const [showDigitalForm, setShowDigitalForm] = useState(false);
  const [editingDigital, setEditingDigital] = useState<string | null>(null);
  const [savingDigital, setSavingDigital] = useState(false);
  const [digitalForm, setDigitalForm] = useState({
    title: "",
    description: "",
    edition_date: format(new Date(), "yyyy-MM-dd"),
    price_aoa: 0,
    price_usd: 0,
    is_free: false,
    cover_url: "",
    pdf_url: ""
  });
  const [digitalCoverFile, setDigitalCoverFile] = useState<File | null>(null);
  const [digitalPdfFile, setDigitalPdfFile] = useState<File | null>(null);

  // Newsletter
  const [newsletterLogs, setNewsletterLogs] = useState<any[]>([]);
  const [newsletterForm, setNewsletterForm] = useState({ subject: "", content: "" });
  const [sendingNewsletter, setSendingNewsletter] = useState(false);

  // Article form
  const [articleForm, setArticleForm] = useState({ title: "", summary: "", content: "", category: "Política", author: "Redacção", image_url: "", audio_url: "", is_hero: false, is_breaking: false, scheduled_at: "", seo_keywords: "", source_name: "", source_url: "" });
  const [articleImageFile, setArticleImageFile] = useState<File | null>(null);
  const [articleAudioFile, setArticleAudioFile] = useState<File | null>(null);
  const [editingArticle, setEditingArticle] = useState<string | null>(null);
  const [showArticleForm, setShowArticleForm] = useState(false);

  // Video form
  const [videoForm, setVideoForm] = useState({ title: "", description: "", video_url: "", thumbnail_url: "", duration: "", category: "Vídeo" });
  const [videoThumbnailFile, setVideoThumbnailFile] = useState<File | null>(null);
  const [editingVideo, setEditingVideo] = useState<string | null>(null);
  const [showVideoForm, setShowVideoForm] = useState(false);

  // Opinion form
  const [opinionForm, setOpinionForm] = useState({ title: "", author: "", content: "", excerpt: "", avatar_url: "", audio_url: "", scheduled_at: "", seo_keywords: "" });
  const [opinionAvatarFile, setOpinionAvatarFile] = useState<File | null>(null);
  const [opinionAudioFile, setOpinionAudioFile] = useState<File | null>(null);
  const [editingOpinion, setEditingOpinion] = useState<string | null>(null);
  const [showOpinionForm, setShowOpinionForm] = useState(false);

  // Breaking form
  const [breakingForm, setBreakingForm] = useState("");
  const [showBreakingForm, setShowBreakingForm] = useState(false);

  // User role form
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<"admin" | "editor">("editor");
  const [userSearch, setUserSearch] = useState("");

  // AI Discovery & Adaptation state (legacy)
  const [discoveryQuery, setDiscoveryQuery] = useState("");
  const [discoveryResults, setDiscoveryResults] = useState<any[]>([]);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discoveryFilter, setDiscoveryFilter] = useState("Tudo");
  const [discoveryTime, setDiscoveryTime] = useState("qdr:d2");
  const [aiWorkspace, setAiWorkspace] = useState({
    sourceUrl: "",
    sourceTitle: "",
    sourceContent: "",
    editorialLine: "Informativa",
    adaptedContent: "",
    adaptedTitle: "",
    adaptedSummary: "",
    category: "Geral",
    impacto: "",
    resumo: "",
    relevancia_para_angola: "",
    factos: "",
    contexto: "",
    leitura_critica: "",
    seo_keywords: ""
  });
  const [isAdapting, setIsAdapting] = useState(false);

  // AI Discovery v2 — Editor-Chefe Inteligente
  const [aiStep, setAiStep] = useState<'search' | 'selected' | 'generating' | 'preview'>('search');
  const [selectedNewsItem, setSelectedNewsItem] = useState<any>(null);
  const [generatedArticle, setGeneratedArticle] = useState<any>(null);
  const [generationSteps, setGenerationSteps] = useState<{ label: string; done: boolean; active: boolean }[]>([]);
  const [isPublishingAI, setIsPublishingAI] = useState(false);
  const [aiFormData, setAiFormData] = useState({
    title: '', summary: '', category: 'Política', author: 'Angola Sem Filtros',
    content: '', seo_keywords: '', image_url: '', meta_description: '',
    slug: '', tags: '', facebook: '', instagram: '', twitter: '',
    reliability_score: 0
  });

  // Site Settings
  const [siteSettingsForm, setSiteSettingsForm] = useState({
    siteName: "", primaryColor: "", facebookUrl: "", instagramUrl: "", youtubeUrl: "", contactEmail: "", whatsappNumber: "", copyrightText: "", logoUrl: "", geminiApiKey: "", puterApiKey: ""
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [savingSiteSettings, setSavingSiteSettings] = useState(false);
  const [siteSettingsLoading, setSiteSettingsLoading] = useState(false);

  const loadSiteSettings = async () => {
    setSiteSettingsLoading(true);
    const { data } = await supabase.from("site_config" as any).select("key, value");
    if (data) {
      const map: any = { site_name: "siteName", site_logo_url: "logoUrl", primary_color: "primaryColor", facebook_url: "facebookUrl", instagram_url: "instagramUrl", youtube_url: "youtubeUrl", contact_email: "contactEmail", whatsapp_number: "whatsappNumber", copyright_text: "copyrightText", gemini_api_key: "geminiApiKey", puter_api_key: "puterApiKey" };
      const config: any = { ...siteSettingsForm };
      data.forEach(row => { if (map[row.key] && row.value) config[map[row.key]] = row.value });
      setSiteSettingsForm(config as any);
    }
    setSiteSettingsLoading(false);
  };

  const handleSaveSiteSettings = async () => {
    setSavingSiteSettings(true);
    try {
      let finalLogoUrl = siteSettingsForm.logoUrl;
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `logo-${Math.random()}.${fileExt} `;
        const { error } = await supabase.storage.from("news").upload(fileName, logoFile, { upsert: true });
        if (error) throw new Error("Erro ao enviar logo: " + error.message);
        const { data: { publicUrl } } = supabase.storage.from("news").getPublicUrl(fileName);
        finalLogoUrl = publicUrl;
      }

      const configToSave = {
        site_name: siteSettingsForm.siteName,
        site_logo_url: finalLogoUrl,
        primary_color: siteSettingsForm.primaryColor,
        facebook_url: siteSettingsForm.facebookUrl,
        instagram_url: siteSettingsForm.instagramUrl,
        youtube_url: siteSettingsForm.youtubeUrl,
        contact_email: siteSettingsForm.contactEmail,
        whatsapp_number: siteSettingsForm.whatsappNumber,
        copyright_text: siteSettingsForm.copyrightText,
        gemini_api_key: siteSettingsForm.geminiApiKey,
        puter_api_key: siteSettingsForm.puterApiKey
      };

      for (const [key, value] of Object.entries(configToSave)) {
        await supabase.from("site_config" as any).upsert({ key, value });
      }
      toast.success("Configurações salvas com sucesso!");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSavingSiteSettings(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
    if (!loading && user && !isAdmin && !isEditor) navigate("/");
  }, [user, isAdmin, loading, navigate]);

  const allCategories = categories;
  const displayedCategories = useMemo(() => {
    return isAdmin || (isEditor && allowedCategories.length === 0)
      ? allCategories
      : allCategories.filter(c => allowedCategories.includes(c));
  }, [isAdmin, isEditor, allowedCategories]);

  useEffect(() => {
    if (isAdmin || isEditor) loadData(activeTab);
  }, [activeTab, isAdmin, isEditor]);

  useEffect(() => {
    if (showArticleForm && !editingArticle && !isAdmin && displayedCategories.length > 0) {
      if (!displayedCategories.includes(articleForm.category)) {
        setArticleForm(prev => ({ ...prev, category: displayedCategories[0] }));
      }
    }
  }, [showArticleForm, editingArticle, isAdmin, displayedCategories]);

  const activeTabRef = useRef(activeTab);
  activeTabRef.current = activeTab;

  // Setup real-time subscriptions
  useEffect(() => {
    if (!isAdmin && !isEditor) return;

    console.log("Setting up comprehensive real-time dashboard...");
    const channel = supabase
      .channel("admin-realtime-v2")
      // Monitor news, videos, and opinions for dashboard stats and tab updates
      .on("postgres_changes", { event: "*", schema: "public", table: "news_articles" }, () => {
        if (activeTabRef.current === "articles" || activeTabRef.current === "dashboard") loadData(activeTabRef.current);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "video_news" }, () => {
        if (activeTabRef.current === "videos" || activeTabRef.current === "dashboard") loadData(activeTabRef.current);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "opinion_articles" }, () => {
        if (activeTabRef.current === "opinions" || activeTabRef.current === "dashboard") loadData(activeTabRef.current);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "breaking_news" }, () => {
        if (activeTabRef.current === "breaking" || activeTabRef.current === "dashboard") loadData(activeTabRef.current);
      })
      // Monitor user profiles for registration stats
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => {
        if (activeTabRef.current === "users" || activeTabRef.current === "dashboard") loadData(activeTabRef.current);
      })
      // CRITICAL: Monitor site visits for real-time traffic dashboard
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "site_visits" }, () => {
        if (activeTabRef.current === "stats" || activeTabRef.current === "dashboard") loadData(activeTabRef.current);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin, isEditor]);

  const loadData = async (tab: Tab) => {
    console.log("Loading data for tab:", tab);
    setDataLoading(true);
    try {
      if (tab === "articles") {
        console.log("[LoadData] Fetching articles...");
        const { data, error } = await supabase.from("news_articles").select("*").order("created_at", { ascending: false }).limit(200);
        if (error) {
          console.error("Error loading articles:", error);
          toast.error("Erro ao carregar artigos: " + error.message);
        }
        if (data) {
          console.log(`[LoadData] Received ${data.length} articles.`);
          setArticles(data);
        }
      }

      if (tab === "dashboard") {
        // Efficiently fetch counts for dashboard stats
        const results = await Promise.all([
          supabase.from("news_articles").select("*", { count: 'exact', head: true }),
          supabase.from("video_news").select("*", { count: 'exact', head: true }),
          supabase.from("opinion_articles").select("*", { count: 'exact', head: true }),
          supabase.from("breaking_news").select("*", { count: 'exact', head: true }),
          supabase.from("profiles").select("*", { count: 'exact', head: true }),
          supabase.from("site_visits").select("*", { count: 'exact', head: true }),
          supabase.from("digital_editions").select("*", { count: 'exact', head: true })
        ]);

        const errors = results.filter(r => r.error).map(r => r.error?.message);
        if (errors.length > 0) {
          console.error("Errors in dashboard counts:", errors);
        }

        setStats({
          articles: results[0].count || 0,
          videos: results[1].count || 0,
          opinions: results[2].count || 0,
          breaking: results[3].count || 0,
          users: results[4].count || 0,
          totalVisits: results[5].count || 0,
          digitalEditions: results[6].count || 0
        });

        // Also fetch just a few recent articles for the dashboard preview
        const { data: recentArticles, error: recentError } = await supabase.from("news_articles").select("*").order("created_at", { ascending: false }).limit(10);
        if (recentError) console.error("Error loading recent articles:", recentError);
        if (recentArticles) setDashboardArticles(recentArticles);
      }

      if (tab === "videos") {
        const { data, error } = await supabase.from("video_news").select("*").order("created_at", { ascending: false }).limit(100);
        if (error) {
          console.error("Error loading videos:", error);
          toast.error("Erro ao carregar vídeos: " + error.message);
        }
        if (data) setVideos(data);
      }

      if (tab === "opinions") {
        const { data, error } = await supabase.from("opinion_articles").select("*").order("created_at", { ascending: false }).limit(100);
        if (error) {
          console.error("Error loading opinions:", error);
          toast.error("Erro ao carregar opiniões: " + error.message);
        }
        if (data) setOpinions(data);
      }

      if (tab === "breaking") {
        const { data, error } = await supabase.from("breaking_news").select("*").order("created_at", { ascending: false }).limit(100);
        if (error) {
          console.error("Error loading breaking news:", error);
          toast.error("Erro ao carregar notícias: " + error.message);
        }
        if (data) setBreakingNews(data);

        // Load ticker speed
        const { data: settings } = await supabase.from("system_settings").select("value").eq("key", "ticker").single();
        if (settings?.value && typeof settings.value === 'object') {
          const val = settings.value as any;
          if (val.speed) setTickerSpeed(Number(val.speed));
        }
      }

      if (tab === "stats") {
        const { data: visitData, error: visitError } = await supabase.from("site_visits").select("*").order("created_at", { ascending: false }).limit(500);
        if (visitError) {
          console.error("Error loading visits:", visitError);
          toast.error("Erro ao carregar dados de visitas: " + visitError.message);
        }
        if (visitData) setSiteVisits(visitData);

        // Also refresh total count for the summary cards
        const { count, error: countError } = await supabase.from("site_visits").select("*", { count: 'exact', head: true });
        if (!countError) {
          setStats(prev => ({ ...prev, totalVisits: count || 0 }));
        }
      }

      if (tab === "users") {
        // Consolidated users logic
        const [profilesRes, rolesRes, catRes, menuRes] = await Promise.all([
          supabase.from("profiles").select("*").order("last_access", { ascending: false }).limit(200),
          supabase.from("user_roles").select("*"),
          supabase.from("editor_categories" as any).select("*"),
          supabase.from("editor_menu_permissions" as any).select("*")
        ]) as any[];

        if (profilesRes.error) {
          console.error("Error loading profiles:", profilesRes.error);
          toast.error("Erro ao carregar perfis: " + profilesRes.error.message);
        }
        if (profilesRes.data) setProfiles(profilesRes.data);

        if (rolesRes.error) {
          console.error("Error loading user roles:", rolesRes.error);
          toast.error("Erro ao carregar permissões: " + rolesRes.error.message);
        }
        if (rolesRes.data) setUserRoles(rolesRes.data);

        if (catRes.data) {
          const catMapping: Record<string, string[]> = {};
          catRes.data.forEach((item: any) => {
            if (!catMapping[item.user_id]) catMapping[item.user_id] = [];
            catMapping[item.user_id].push(item.category);
          });
          setEditorCategories(catMapping);
        }

        if (menuRes.data) {
          const menuMapping: Record<string, string[]> = {};
          menuRes.data.forEach((item: any) => {
            if (!menuMapping[item.user_id]) menuMapping[item.user_id] = [];
            menuMapping[item.user_id].push(item.menu_id);
          });
          setEditorMenuPermissions(menuMapping);
        }
      }

      if (tab === "ads") {
        const { data, error } = await supabase.from("advertisements").select("*").order("slot").order("display_order");
        if (error) {
          console.error("Error loading ads:", error);
          toast.error("Erro ao carregar publicidade: " + error.message);
        }
        if (data) setAdvertisements(data);

        // Load ad carousel settings for the selected slot
        const settingsKey = `ad_carousel_${selectedSettingsSlot} `;
        const { data: adSettings } = await supabase.from("system_settings").select("value").eq("key", settingsKey).single();

        if (adSettings?.value && typeof adSettings.value === 'object') {
          const val = adSettings.value as any;
          if (val.speed) setAdCarouselSpeed(val.speed / 1000); // UI uses seconds
          if (val.transition) setAdCarouselTransition(val.transition);
        } else {
          // Fallback to global if slot-specific not found
          const { data: globalSettings } = await supabase.from("system_settings").select("value").eq("key", "ad_carousel").single();
          if (globalSettings?.value && typeof globalSettings.value === 'object') {
            const val = globalSettings.value as any;
            if (val.speed) setAdCarouselSpeed(val.speed / 1000);
            if (val.transition) setAdCarouselTransition(val.transition);
          } else {
            // Defaults
            setAdCarouselSpeed(6);
            setAdCarouselTransition("fade");
          }
        }

        const { data: heroSettings } = await supabase.from("system_settings").select("value").eq("key", "hero_speed").single();
        if (heroSettings?.value && typeof heroSettings.value === 'object') {
          const val = heroSettings.value as any;
          if (val.speed) setHeroSpeed(val.speed);
        }

        // Load AdSense validation settings
        const { data: validationSettings } = await supabase.from("system_settings").select("value").eq("key", "site_validation").single();
        if (validationSettings?.value && typeof validationSettings.value === 'object') {
          const val = validationSettings.value as any;
          if (val.method) setValidationMethod(val.method);
          if (val.content) setValidationContent(val.content);
        }
      }

      if (tab === "digital-editions") {
        const { data, error } = await supabase.from("digital_editions" as any).select("*").order("edition_date", { ascending: false }).limit(100) as any;
        if (error) {
          console.error("Error loading digital editions:", error);
          toast.error("Erro ao carregar edições digitais: " + error.message);
        }
        if (data) setDigitalEditions(data);
      }

      if (tab === "newsletter") {
        const { data, error } = await supabase.from("newsletter_logs" as any).select("*").order("created_at", { ascending: false }).limit(50) as any;
        if (error) {
          console.error("Error loading newsletter logs:", error);
          toast.error("Erro ao carregar histórico de newsletters: " + error.message);
        }
        if (data) setNewsletterLogs(data);
      }

      if (tab === "authorized-services") {
        const { data, error } = await supabase.from("authorized_services_emails").select("*").order("created_at", { ascending: false });
        if (error) {
          console.error("Error loading authorized emails:", error);
          toast.error("Erro ao carregar e-mails autorizados: " + error.message);
        }
        if (data) setAuthorizedEmails(data);
      }
      if (tab === "site-settings") {
        await loadSiteSettings();
      }
    } catch (err: any) {
      console.error("Unexpected error in loadData:", err);
      toast.error("Erro inesperado ao carregar dados: " + (err.message || "Tente novamente mais tarde."));
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

  const handleSetRole = async (userId: string, role: string) => {
    setDataLoading(true);
    try {
      // Clean up previous roles for this user to avoid confusion
      await supabase.from("user_roles" as any).delete().eq("user_id", userId);

      if (role !== "leitor") {
        const { error } = await supabase.from("user_roles" as any).insert({ user_id: userId, role });
        if (error) throw error;
      }

      toast.success("Estado do utilizador atualizado");
      await loadData("users");
    } catch (err: any) {
      console.error("Error setting role:", err);
      toast.error("Erro ao atualizar função: " + err.message);
    } finally {
      setDataLoading(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado!`);
  };

  const uploadFile = async (file: File, bucket: string = "news", returnPath = false) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt} `;
    const filePath = `${fileName} `;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    if (returnPath) return filePath;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSendNewsletter = async () => {
    if (!newsletterForm.subject || !newsletterForm.content) {
      toast.error("Assunto e conteúdo são obrigatórios.");
      return;
    }

    if (!confirm("Tem a certeza que deseja enviar esta newsletter para TODOS os utilizadores? Esta ação pode demorar alguns minutos e não pode ser desfeita.")) {
      return;
    }

    setSendingNewsletter(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-newsletter', {
        body: {
          subject: newsletterForm.subject,
          content: newsletterForm.content
        }
      });

      if (error) {
        let errorMsg = error.message;
        if (error.context) {
          try {
            const bodyText = typeof error.context.text === 'function'
              ? await error.context.text()
              : (error.context.body || "");
            if (bodyText) {
              const body = JSON.parse(bodyText);
              if (body.error) errorMsg = body.error;
            }
          } catch (e) {
            console.error("Could not parse error body:", e);
          }
        }
        throw new Error(errorMsg);
      };

      toast.success(`Newsletter enviada com sucesso para ${data.sent || 0} utilizadores!`);
      setNewsletterForm({ subject: "", content: "" });
      loadData("newsletter");
    } catch (err: any) {
      console.error("Error sending newsletter:", err);
      const msg = err.message || (typeof err === 'string' ? err : "Erro desconhecido");
      toast.error("Erro ao enviar newsletter: " + msg);
    } finally {
      setSendingNewsletter(false);
    }
  };

  const saveArticle = async () => {
    if (!articleForm.title || (!articleForm.content && !articleForm.summary)) {
      toast.error("Título e Conteúdo/Resumo são obrigatórios");
      return;
    }

    setSavingArticle(true);
    console.log("[SaveArticle] Starting...", { articleForm, editingArticle });
    try {
      let currentImageUrl = articleForm.image_url;
      let currentAudioUrl = articleForm.audio_url;

      if (articleImageFile) {
        console.log("[SaveArticle] Uploading image...", articleImageFile.name);
        toast.info("A carregar imagem...");
        currentImageUrl = await withTimeout(uploadFile(articleImageFile), 180000);
        console.log("[SaveArticle] Image upload success:", currentImageUrl);
      }

      if (articleAudioFile) {
        console.log("[SaveArticle] Uploading audio...", articleAudioFile.name);
        toast.info("A carregar áudio...");
        currentAudioUrl = await withTimeout(uploadFile(articleAudioFile), 180000);
        console.log("[SaveArticle] Audio upload success:", currentAudioUrl);
      }

      // Safety check: verify if the category is allowed for this editor
      if (!isAdmin && allowedCategories.length > 0 && !allowedCategories.includes(articleForm.category)) {
        toast.error(`Não tem permissão para publicar na categoria: ${articleForm.category} `);
        setSavingArticle(false);
        return;
      }

      // Scheduling logic
      const isScheduled = articleForm.scheduled_at && new Date(articleForm.scheduled_at) > new Date();

      // Filter payload to only include valid columns
      const payload = {
        title: articleForm.title,
        summary: articleForm.summary,
        content: articleForm.content,
        category: articleForm.category,
        author: articleForm.author,
        image_url: currentImageUrl,
        audio_url: currentAudioUrl,
        is_hero: articleForm.is_hero,
        is_breaking: articleForm.is_breaking,
        published: true,
        scheduled_at: isScheduled ? new Date(articleForm.scheduled_at).toISOString() : null,
        seo_keywords: articleForm.seo_keywords,
        source_name: articleForm.source_name || null,
        source_url: articleForm.source_url || null
      };

      console.log("[SaveArticle] Sending payload to DB...", payload);
      console.log("[SaveArticle] Payload size (chars):", JSON.stringify(payload).length);
      toast.info(isScheduled ? "A agendar artigo..." : "A gravar artigo...");

      const startTime = Date.now();
      let result;

      if (editingArticle) {
        console.log("[SaveArticle] Updating article:", editingArticle);
        result = await supabase.from("news_articles").update(payload as any).eq("id", editingArticle).select();
      } else {
        console.log("[SaveArticle] Inserting new article");
        result = await supabase.from("news_articles").insert(payload as any).select();
      }

      const duration = Date.now() - startTime;
      console.log(`[SaveArticle] DB Operation finished in ${duration} ms.`, result);

      if (result.error) {
        console.error("[SaveArticle] Supabase error:", result.error);
        toast.error("Erro ao guardar artigo: " + result.error.message);
      } else if (!result.data || result.data.length === 0) {
        console.warn("[SaveArticle] Empty data returned");
        toast.error("A notícia não foi guardada. Verifique as suas permissões.");
      } else {
        console.log("[SaveArticle] Success! Operation completed in", duration, "ms");
        if (isScheduled) {
          toast.success("Artigo agendado com sucesso para " + new Date(articleForm.scheduled_at).toLocaleString('pt-PT') + "!");
        } else {
          toast.success("Artigo guardado com sucesso!");
        }

        // Clear form and close
        setShowArticleForm(false);
        setEditingArticle(null);
        setArticleImageFile(null);
        setArticleAudioFile(null);
        setArticleForm({ title: "", summary: "", content: "", category: "Política", author: "Redacção", image_url: "", audio_url: "", is_hero: false, is_breaking: false, scheduled_at: "", seo_keywords: "", source_name: "", source_url: "" });

        // Reload data
        loadData("articles");
      }
    } catch (err: any) {
      console.error("[SaveArticle] Unexpected error:", err);
      toast.error("Erro inesperado ao gravar artigo: " + (err?.message || String(err)));
    } finally {
      console.log("[SaveArticle] Finished execution.");
      setSavingArticle(false);
    }
  };

  const saveVideo = async () => {
    if (!videoForm.title || !videoForm.video_url) {
      toast.error("Título e URL do vídeo são obrigatórios");
      return;
    }

    setSavingVideo(true);
    console.log("[SaveVideo] Starting...", { videoForm, editingVideo });
    try {
      let currentThumbnailUrl = videoForm.thumbnail_url;

      if (videoThumbnailFile) {
        console.log("[SaveVideo] Uploading thumbnail...", videoThumbnailFile.name);
        toast.info("A carregar miniatura...");
        currentThumbnailUrl = await uploadFile(videoThumbnailFile);
        console.log("[SaveVideo] Thumbnail upload success:", currentThumbnailUrl);
      }

      // Filter payload to only include valid columns
      const payload = {
        title: videoForm.title,
        description: videoForm.description,
        video_url: videoForm.video_url,
        thumbnail_url: currentThumbnailUrl,
        duration: videoForm.duration,
        category: videoForm.category,
        published: true
      };

      console.log("[SaveVideo] Sending payload to DB...", payload);
      toast.info("A gravar dados no servidor...");

      const queryBuilder = editingVideo
        ? supabase.from("video_news").update(payload).eq("id", editingVideo).select()
        : supabase.from("video_news").insert(payload).select();

      const result = await queryBuilder;

      console.log("[SaveVideo] Result from DB:", result);

      if (result.error) {
        console.error("[SaveVideo] Supabase error:", result.error);
        toast.error("Erro ao guardar vídeo: " + result.error.message);
      } else if (!result.data || result.data.length === 0) {
        console.warn("[SaveVideo] Empty data returned");
        toast.error("O vídeo não foi guardado. Verifique as suas permissões.");
      } else {
        toast.success("Vídeo guardado com sucesso!");
        setShowVideoForm(false);
        setEditingVideo(null);
        setVideoThumbnailFile(null);
        setVideoForm({ title: "", description: "", video_url: "", thumbnail_url: "", duration: "", category: "Vídeo" });
        loadData("videos");
      }
    } catch (err: any) {
      console.error("[SaveVideo] Unexpected error:", err);
      toast.error("Erro inesperado ao gravar vídeo: " + (err?.message || String(err)));
    } finally {
      console.log("[SaveVideo] Finished execution.");
      setSavingVideo(false);
    }
  };

  const saveOpinion = async () => {
    if (!opinionForm.title || !opinionForm.author) {
      toast.error("Título e autor são obrigatórios");
      return;
    }

    setSavingOpinion(true);
    console.log("[SaveOpinion] Starting...", { opinionForm, editingOpinion });
    try {
      let currentAvatarUrl = opinionForm.avatar_url;
      let currentAudioUrl = opinionForm.audio_url;

      if (opinionAvatarFile) {
        console.log("[SaveOpinion] Uploading avatar...", opinionAvatarFile.name);
        toast.info("A carregar avatar...");
        currentAvatarUrl = await uploadFile(opinionAvatarFile);
        console.log("[SaveOpinion] Avatar upload success:", currentAvatarUrl);
      }

      if (opinionAudioFile) {
        console.log("[SaveOpinion] Uploading audio...", opinionAudioFile.name);
        toast.info("A carregar áudio...");
        currentAudioUrl = await uploadFile(opinionAudioFile);
        console.log("[SaveOpinion] Audio upload success:", currentAudioUrl);
      }

      // Scheduling logic for opinions
      const isScheduled = opinionForm.scheduled_at && new Date(opinionForm.scheduled_at) > new Date();

      const payload = {
        title: opinionForm.title,
        author: opinionForm.author,
        avatar_url: currentAvatarUrl,
        audio_url: currentAudioUrl,
        excerpt: opinionForm.excerpt,
        content: opinionForm.content,
        published: true,
        scheduled_at: isScheduled ? new Date(opinionForm.scheduled_at).toISOString() : null,
        seo_keywords: opinionForm.seo_keywords
      };

      console.log("[SaveOpinion] Sending to DB...", payload);
      toast.info(isScheduled ? "A agendar opinião..." : "A gravar opinião...");

      const queryBuilder = editingOpinion
        ? supabase.from("opinion_articles").update(payload as any).eq("id", editingOpinion).select()
        : supabase.from("opinion_articles").insert(payload as any).select();

      const result = await queryBuilder;

      console.log("[SaveOpinion] Result:", result);

      if (result.error) {
        console.error("[SaveOpinion] Supabase error:", result.error);
        toast.error("Erro ao guardar opinião: " + result.error.message);
      } else if (!result.data || result.data.length === 0) {
        toast.error("A opinião não foi guardada. Verifique as suas permissões.");
      } else {
        if (isScheduled) {
          toast.success("Opinião agendada para " + new Date(opinionForm.scheduled_at).toLocaleString('pt-PT') + "!");
        } else {
          toast.success("Opinião guardada com sucesso!");
        }
        setShowOpinionForm(false);
        setEditingOpinion(null);
        setOpinionAvatarFile(null);
        setOpinionAudioFile(null);
        setOpinionForm({ title: "", author: "", avatar_url: "", audio_url: "", excerpt: "", content: "", scheduled_at: "", seo_keywords: "" });
        loadData("opinions");
      }
    } catch (err: any) {
      console.error("[SaveOpinion] Unexpected error:", err);
      toast.error("Erro inesperado ao gravar opinião: " + (err?.message || String(err)));
    } finally {
      console.log("[SaveOpinion] Finished execution.");
      setSavingOpinion(false);
    }
  };

  const saveTickerSpeed = async () => {
    setSavingSettings(true);
    try {
      const { error } = await supabase
        .from("system_settings")
        .update({ value: { speed: tickerSpeed } })
        .eq("key", "ticker");

      if (error) {
        toast.error("Erro ao salvar velocidade: " + error.message);
      } else {
        toast.success("Velocidade do ticker actualizada!");
      }
    } catch (err: any) {
      toast.error("Erro inesperado: " + err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  const saveHeroSpeed = async () => {
    setSavingSettings(true);
    try {
      const { error } = await supabase
        .from("system_settings")
        .update({ value: { speed: heroSpeed } })
        .eq("key", "hero_speed");

      if (error) {
        toast.error("Erro ao salvar velocidade do destaque: " + error.message);
      } else {
        toast.success("Velocidade do destaque principal actualizada!");
      }
    } catch (err: any) {
      toast.error("Erro inesperado: " + err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  const saveAuthorizedEmail = async () => {
    if (!newAuthorizedEmail || !newAuthorizedEmail.includes("@")) {
      toast.error("Por favor, introduza um e-mail válido.");
      return;
    }

    setSavingAuthorizedEmail(true);
    try {
      const { error } = await supabase
        .from("authorized_services_emails")
        .insert({ email: newAuthorizedEmail.trim().toLowerCase(), created_by: user?.id });

      if (error) {
        if (error.code === "23505") {
          toast.error("Este e-mail já está autorizado.");
        } else {
          toast.error("Erro ao autorizar e-mail: " + error.message);
        }
      } else {
        toast.success("E-mail autorizado com sucesso!");
        setNewAuthorizedEmail("");
        loadData("authorized-services");
      }
    } catch (err: any) {
      console.error("Error saving authorized email:", err);
      toast.error("Erro inesperado ao autorizar e-mail.");
    } finally {
      setSavingAuthorizedEmail(false);
    }
  };

  const saveAdCarouselSettings = async () => {
    setSavingSettings(true);
    try {
      const settingsKey = `ad_carousel_${selectedSettingsSlot} `;
      const { error } = await supabase
        .from("system_settings")
        .upsert({
          key: settingsKey,
          value: {
            speed: adCarouselSpeed * 1000,
            transition: adCarouselTransition
          }
        }, { onConflict: 'key' });

      if (error) {
        toast.error("Erro ao salvar configurações do carrossel: " + error.message);
      } else {
        toast.success(`Configurações para "${getSlotLabel(selectedSettingsSlot)}" actualizadas!`);
      }
    } catch (err: any) {
      toast.error("Erro inesperado: " + err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  const getSlotLabel = (slot: string) => {
    const labels: Record<string, string> = {
      banner_top: "Banner Topo",
      banner_bottom: "Banner Final",
      sidebar_carousel: "Carrossel Lateral",
      sidebar_video: "Vídeo Vertical",
      video_section_sidebar: "Destaque Vídeos (Lateral)"
    };
    return labels[slot] || slot;
  };

  const saveValidationSettings = async () => {
    setSavingValidation(true);
    try {
      const { error } = await supabase
        .from("system_settings")
        .upsert({
          key: "site_validation",
          value: {
            method: validationMethod,
            content: validationContent
          }
        }, { onConflict: 'key' });

      if (error) {
        toast.error("Erro ao salvar configurações de validação: " + error.message);
      } else {
        toast.success("Configurações de validação actualizadas!");
      }
    } catch (err: any) {
      toast.error("Erro inesperado: " + err.message);
    } finally {
      setSavingValidation(false);
    }
  };

  const saveBreaking = async () => {
    if (!breakingForm) {
      toast.error("O texto é obrigatório");
      return;
    }

    setSavingBreaking(true);
    console.log("[SaveBreaking] Starting...", breakingForm);
    try {
      const queryBuilder = supabase.from("breaking_news").insert({ text: breakingForm, active: true }).select();

      const result = await queryBuilder;
      console.log("[SaveBreaking] Result:", result);

      if (result.error) {
        console.error("[SaveBreaking] Error:", result.error);
        toast.error("Erro ao adicionar notícia: " + result.error.message);
      } else if (!result.data || result.data.length === 0) {
        toast.error("A notícia não foi guardada. Verifique as suas permissões.");
      } else {
        toast.success("Notícia de última hora adicionada!");
        setShowBreakingForm(false);
        setBreakingForm("");
        loadData("breaking");
      }
    } catch (err: any) {
      console.error("[SaveBreaking] Unexpected error:", err);
      toast.error("Erro inesperado ao gravar notícia: " + (err?.message || String(err)));
    } finally {
      setSavingBreaking(false);
    }
  };

  const saveDigitalEdition = async () => {
    if (!digitalForm.title) {
      toast.error("O título é obrigatório");
      return;
    }

    setSavingDigital(true);
    console.log("[SaveDigital] Starting...", { digitalForm, editingDigital });
    try {
      let currentCoverUrl = digitalForm.cover_url;
      let currentPdfUrl = digitalForm.pdf_url;

      if (digitalCoverFile) {
        console.log("[SaveDigital] Uploading cover...", digitalCoverFile.name);
        toast.info("A carregar capa...");
        currentCoverUrl = await uploadFile(digitalCoverFile);
        console.log("[SaveDigital] Cover upload success:", currentCoverUrl);
      }

      if (digitalPdfFile) {
        console.log("[SaveDigital] Uploading PDF...", digitalPdfFile.name);
        toast.info("A carregar PDF...");
        currentPdfUrl = await uploadFile(digitalPdfFile, "digital-editions", true);
        console.log("[SaveDigital] PDF upload success:", currentPdfUrl);
      }

      const payload = {
        title: digitalForm.title,
        description: digitalForm.description,
        edition_date: digitalForm.edition_date,
        price_aoa: Number(digitalForm.price_aoa),
        price_usd: Number(digitalForm.price_usd),
        is_free: digitalForm.is_free,
        cover_url: currentCoverUrl,
        pdf_url: currentPdfUrl,
        published: true
      };

      console.log("[SaveDigital] Sending to DB...", payload);
      toast.info("A gravar edição digital...");

      const queryBuilder = editingDigital
        ? supabase.from("digital_editions" as any).update(payload).eq("id", editingDigital).select()
        : supabase.from("digital_editions" as any).insert(payload).select();

      const result = await queryBuilder;

      console.log("[SaveDigital] Result:", result);

      if (result.error) {
        console.error("[SaveDigital] Supabase error:", result.error);
        toast.error("Erro ao guardar edição: " + result.error.message);
      } else {
        toast.success("Edição digital guardada com sucesso!");
        setShowDigitalForm(false);
        setEditingDigital(null);
        setDigitalCoverFile(null);
        setDigitalPdfFile(null);
        setDigitalForm({
          title: "",
          description: "",
          edition_date: format(new Date(), "yyyy-MM-dd"),
          price_aoa: 0,
          price_usd: 0,
          is_free: false,
          cover_url: "",
          pdf_url: ""
        });
        loadData("digital-editions");
      }
    } catch (err: any) {
      console.error("[SaveDigital] Unexpected error:", err);
      toast.error("Erro inesperado ao gravar edição: " + (err?.message || String(err)));
    } finally {
      console.log("[SaveDigital] Finished execution.");
      setSavingDigital(false);
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

  const handleDiscoverNews = async (filterOverride?: string) => {
    setIsDiscovering(true);
    setDiscoveryResults([]); // Clear previous results
    const activeFilter = filterOverride || discoveryFilter;

    // Garantir que a pesquisa é sempre contextualizada com "Angola"
    let queryBase = discoveryQuery.trim();
    let effectiveQuery = "";

    if (!queryBase) {
      // Se o utilizador não digitou nada, usa o filtro + Angola
      effectiveQuery = activeFilter !== 'Tudo' ? `${activeFilter} Angola` : 'Angola';
    } else {
      // Se o utilizador digitou, garante que "Angola" está lá se não for redundante
      if (!queryBase.toLowerCase().includes('angola')) {
        effectiveQuery = `${queryBase} Angola`;
      } else {
        effectiveQuery = queryBase;
      }
    }

    console.log("Discovery: Searching for:", effectiveQuery, "filter:", activeFilter);

    try {
      const { data, error } = await supabase.functions.invoke('news-osint', {
        body: {
          q: effectiveQuery,
          tbs: discoveryTime
        }
      });

      if (error) throw error;

      if (data?.results && data.results.length > 0) {
        // Ordenar por data (mais recente primeiro)
        const sorted = [...data.results].sort((a: any, b: any) => {
          const dateA = Date.parse(a.date) || 0;
          const dateB = Date.parse(b.date) || 0;
          return dateB - dateA;
        });
        setDiscoveryResults(sorted);
        toast.success(`Pesquisa OSINT concluída com ${sorted.length} resultados.`);
      } else {
        setDiscoveryResults([]);
        toast.info("Nenhum resultado encontrado. Tente outra pesquisa.");
      }
    } catch (err: any) {
      console.error("Discovery error:", err);
      toast.error("Erro na descoberta de notícias: " + (err?.message || "Erro desconhecido"));
    } finally {
      setIsDiscovering(false);
    }
  };

  const handleAdaptToEditorial = (item: any) => {
    const newData = {
      ...aiWorkspace,
      sourceTitle: item.title,
      sourceContent: item.content || item.snippet,
      sourceUrl: item.url || "",
      adaptedContent: "",
      adaptedTitle: "",
      adaptedSummary: "",
      category: item.category || "Geral"
    };

    setAiWorkspace(newData);
    toast.info("Iniciando reestruturação automática via IA...");

    // Aciona a automação imediatamente
    handleGenerateAI(newData);
  };

  const handleGenerateAI = async (customData?: any) => {
    const dataToUse = customData || aiWorkspace;
    if (!dataToUse.sourceContent && !dataToUse.sourceUrl) return;
    setIsAdapting(true);
    console.log("AI: Generating rewrite with line:", dataToUse.editorialLine);

    try {
      // Chamada à API de IA via Vercel Serverless Function (/api/ai-rewrite)
      const { data: configData } = await supabase.from("site_config" as any).select("value").eq("key", "gemini_api_key").maybeSingle() as any;
      const userApiKey = configData?.value || '';

      let data: any = null;
      let usePuterFallback = false;
      let puterPrompt = '';

      try {
        const res = await fetch('/api/ai-rewrite', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: dataToUse.sourceContent,
            title: dataToUse.sourceTitle,
            line: dataToUse.editorialLine,
            url: dataToUse.sourceUrl,
            apiKey: userApiKey
          })
        });

        if (res.status === 404) {
          console.warn("AI: /api/ai-rewrite returned 404. Falling back to Puter.js...");
          usePuterFallback = true;
          puterPrompt = buildPuterPrompt(dataToUse.sourceTitle || '', dataToUse.editorialLine || '', dataToUse.sourceUrl || '', dataToUse.sourceContent || '');
        } else {
          data = await res.json();
          if (data.status === "missing_api_key") {
            usePuterFallback = true;
            puterPrompt = data.prompt || buildPuterPrompt(dataToUse.sourceTitle || '', dataToUse.editorialLine || '', dataToUse.sourceUrl || '', dataToUse.sourceContent || '');
          }
        }
      } catch (fetchErr) {
        console.warn("AI: fetch to /api/ai-rewrite failed. Falling back to Puter.js...", fetchErr);
        usePuterFallback = true;
        puterPrompt = buildPuterPrompt(dataToUse.sourceTitle || '', dataToUse.editorialLine || '', dataToUse.sourceUrl || '', dataToUse.sourceContent || '');
      }

      if (usePuterFallback) {
        console.log("AI: Using client-side Puter.js for article generation...");
        const puter = (window as any).puter;
        if (!puter) {
          throw new Error("Não foi possível aceder ao servidor de Inteligência Artificial. Por favor, adicione uma chave de API Gemini no painel de administração ou verifique se o script do Puter.js foi bloqueado pelo seu navegador.");
        }

        const { data: puterConfig } = await supabase.from("site_config" as any).select("value").eq("key", "puter_api_key").maybeSingle() as any;
        const puterToken = puterConfig?.value || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InYyIn0.eyJ0IjoidCIsInYiOiIyIiwidG9rZW5fdWlkIjoiYzNhMThkYjgtNTc2NS00NjFiLThkYzQtYzFmNGE0YjhmNWRkIiwidXUiOiJjdnZSNHRTMlRXQ3ZQRnZNTzlIdDNBPT0iLCJzdSI6Iko2ZVlIa1BoUjg2VkZwMWliaUVsYnc9PSIsImFpIjoiY3Z2UjR0UzJUV0N2UEZ2TU85SHQzQT09IiwiZnVsbF9hY2Nlc3MiOnRydWUsImlhdCI6MTc4NDU3NTA0Nn0.K6gql00PGBMWr1N-Anlx8XHZ2e52ejIuHCti5JsGPLQ';

        // await puter.auth.setAuthToken(puterToken);
        const puterResponse = await puter.ai.chat(puterPrompt, {
          model: 'gemini-3.5-flash'
        });

        const rawText = typeof puterResponse === 'string' ? puterResponse : (puterResponse?.message?.content || puterResponse?.text || "");
        if (!rawText) {
          throw new Error("Ocorreu um erro ao comunicar com a inteligência artificial do Puter.js.");
        }

        let cleanedJsonText = rawText.trim();
        cleanedJsonText = cleanedJsonText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

        data = JSON.parse(cleanedJsonText);
      }

      // Helper to build HTML from the structured sections returned by Gemini
      const buildHtml = (d: any): string => {
        if (d.full_content_html) return d.full_content_html;
        if (typeof d.content === 'string') return d.content;
        const sections = d.content?.sections;
        if (!sections) return "";
        return sections.map((s: any) => {
          if (s.type === 'body' && Array.isArray(s.value))
            return s.value.map((p: string) => `<p>${p}</p>`).join('\n');
          if (s.type === 'analysis' && s.value)
            return `<p><br/><span style="color:#d32f2f;"> <strong>ANÁLISE – ANGOLA SEM FILTROS </strong> </span></p>\n<p>${s.value}</p>`;
          return '';
        }).filter(Boolean).join('\n');
      };

      const seoSection = data.content?.sections?.find((s: any) => s.type === 'seo_keywords');
      const seoKeywords = seoSection?.value || data.seo?.tags?.join(', ') || data.seo_keywords || "";

      setAiWorkspace({
        ...dataToUse,
        adaptedTitle: data.title || data.titulo || "",
        adaptedContent: buildHtml(data),
        adaptedSummary: data.summary || data.resumo || "",
        category: data.category || data.categoria || dataToUse.category,
        seo_keywords: seoKeywords,
        slug: data.slug || data.seo?.slug || "",
        tags: Array.isArray(data.seo?.tags) ? data.seo.tags.join(', ') : "",
        facebook: data.social?.facebook || "",
        instagram: data.social?.instagram || "",
        twitter: data.social?.twitter || "",
        reliability_score: data.reliability_score || 0
      });
      toast.success("Notícia reestruturada com sucesso pela IA!");
    } catch (err: any) {
      console.error("AI Error:", err);
      toast.warning("A IA não está disponível. Verifique se GEMINI_API_KEY está configurada nas variáveis de ambiente da Vercel.");
      // Fallback: usar o conteúdo original como base para edição manual
      await new Promise(r => setTimeout(r, 500));
      setAiWorkspace({
        ...dataToUse,
        adaptedTitle: dataToUse.sourceTitle,
        adaptedContent: dataToUse.sourceContent,
        adaptedSummary: dataToUse.sourceContent.substring(0, 200) + (dataToUse.sourceContent.length > 200 ? "..." : "")
      });
    } finally {
      setIsAdapting(false);
    }
  };

  const handleFinalizeAIArticle = () => {
    setArticleForm({
      title: aiWorkspace.adaptedTitle,
      summary: aiWorkspace.adaptedSummary || "Notícia adaptada via IA.",
      content: aiWorkspace.adaptedContent,
      category: aiWorkspace.category,
      author: "Redacção / IA",
      image_url: "",
      audio_url: "",
      is_hero: false,
      is_breaking: false,
      scheduled_at: "",
      seo_keywords: aiWorkspace.seo_keywords,
      source_name: aiWorkspace.sourceUrl ? new URL(aiWorkspace.sourceUrl).hostname.replace('www.', '') : '',
      source_url: aiWorkspace.sourceUrl || ''
    });
    setActiveTab("articles");
    setShowArticleForm(true);
    toast.success("Dados transferidos para o formulário de publicação.");
  };

  // ── Editor-Chefe v2 handlers ────────────────────────────────────────────

  const handleUseThisNews = (item: any) => {
    setSelectedNewsItem(item);
    setAiStep('selected');
    setGeneratedArticle(null);
    toast.info('Notícia importada. Clique em "Gerar Artigo Sem Filtros" para iniciar.');
  };

  const GENERATION_STEP_LABELS = [
    'Activar Modo Sem Filtros',
    'Pesquisa OSINT + ChatGPT Search',
    'Cruzamento de Fontes',
    'Fact Check Automático',
    'Geração SEO',
    'Compilar Artigo',
    'Preencher Formulário CMS',
  ];

  const handleGenerateSemFiltros = async () => {
    if (!selectedNewsItem) return;
    setAiStep('generating');
    const steps = GENERATION_STEP_LABELS.map((label, i) => ({ label, done: false, active: i === 0 }));
    setGenerationSteps(steps);

    const advanceStep = (index: number) => {
      setGenerationSteps(prev => prev.map((s, i) => ({
        ...s,
        done: i < index,
        active: i === index
      })));
    };

    try {
      advanceStep(0); await new Promise(r => setTimeout(r, 600));
      advanceStep(1); await new Promise(r => setTimeout(r, 700));
      advanceStep(2); await new Promise(r => setTimeout(r, 500));
      advanceStep(3);

      // Load Gemini API Key from site_config database
      const { data: configData } = await supabase.from("site_config" as any).select("value").eq("key", "gemini_api_key").maybeSingle() as any;
      const userApiKey = configData?.value || '';

      let data: any = null;
      let usePuterFallback = false;
      let puterPrompt = '';

      const newsContent = selectedNewsItem.content || selectedNewsItem.snippet || '';
      const newsTitle = selectedNewsItem.title || '';
      const newsUrl = selectedNewsItem.url || '';

      try {
        const res = await fetch('/api/ai-rewrite', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: newsContent,
            title: newsTitle,
            line: 'angola_sem_filtros',
            url: newsUrl,
            apiKey: userApiKey
          })
        });

        if (res.status === 404) {
          console.warn("AI: /api/ai-rewrite returned 404. Falling back to Puter.js...");
          usePuterFallback = true;
          puterPrompt = buildPuterPrompt(newsTitle, 'angola_sem_filtros', newsUrl, newsContent);
        } else if (!res.ok) {
          const errData = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
          throw new Error(errData.error || `HTTP ${res.status}`);
        } else {
          data = await res.json();
          if (data.status === "missing_api_key") {
            usePuterFallback = true;
            puterPrompt = data.prompt || buildPuterPrompt(newsTitle, 'angola_sem_filtros', newsUrl, newsContent);
          }
        }
      } catch (fetchErr: any) {
        if (fetchErr?.message?.includes('HTTP')) throw fetchErr;
        console.warn("AI: fetch to /api/ai-rewrite failed. Falling back to Puter.js...", fetchErr);
        usePuterFallback = true;
        puterPrompt = buildPuterPrompt(newsTitle, 'angola_sem_filtros', newsUrl, newsContent);
      }

      if (usePuterFallback) {
        console.log("AI: Using client-side Puter.js for article generation...");
        const puter = (window as any).puter;
        if (!puter) {
          throw new Error("Não foi possível aceder ao servidor de Inteligência Artificial. Por favor, adicione uma chave de API Gemini no painel de administração ou verifique se o script do Puter.js foi bloqueado pelo seu navegador.");
        }

        const { data: puterConfig } = await supabase.from("site_config" as any).select("value").eq("key", "puter_api_key").maybeSingle() as any;
        const puterToken = puterConfig?.value || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InYyIn0.eyJ0IjoidCIsInYiOiIyIiwidG9rZW5fdWlkIjoiYzNhMThkYjgtNTc2NS00NjFiLThkYzQtYzFmNGE0YjhmNWRkIiwidXUiOiJjdnZSNHRTMlRXQ3ZQRnZNTzlIdDNBPT0iLCJzdSI6Iko2ZVlIa1BoUjg2VkZwMWliaUVsYnc9PSIsImFpIjoiY3Z2UjR0UzJUV0N2UEZ2TU85SHQzQT09IiwiZnVsbF9hY2Nlc3MiOnRydWUsImlhdCI6MTc4NDU3NTA0Nn0.K6gql00PGBMWr1N-Anlx8XHZ2e52ejIuHCti5JsGPLQ';

        // await puter.auth.setAuthToken(puterToken);
        const puterResponse = await puter.ai.chat(puterPrompt, {
          model: 'gemini-3.5-flash'
        });

        const rawText = typeof puterResponse === 'string' ? puterResponse : (puterResponse?.message?.content || puterResponse?.text || "");
        if (!rawText) {
          throw new Error("Ocorreu um erro ao comunicar com a inteligência artificial do Puter.js.");
        }

        let cleanedJsonText = rawText.trim();
        cleanedJsonText = cleanedJsonText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

        data = JSON.parse(cleanedJsonText);
      }

      advanceStep(4); await new Promise(r => setTimeout(r, 400));
      advanceStep(5); await new Promise(r => setTimeout(r, 400));
      advanceStep(6); await new Promise(r => setTimeout(r, 300));

      setGenerationSteps(GENERATION_STEP_LABELS.map(label => ({ label, done: true, active: false })));

      // Build HTML from structured sections if full_content_html is not present
      const buildHtml = (d: any): string => {
        if (d.full_content_html) return d.full_content_html;
        if (typeof d.content === 'string') return d.content;
        const sections = d.content?.sections;
        if (!sections) return '';
        return sections.map((s: any) => {
          if (s.type === 'body' && Array.isArray(s.value))
            return s.value.map((p: string) => `<p>${p}</p>`).join('\n');
          if (s.type === 'analysis' && s.value)
            return `<p><br/><span style="color:#d32f2f;"> <strong>ANÁLISE – ANGOLA SEM FILTROS </strong> </span></p>\n<p>${s.value}</p>`;
          return '';
        }).filter(Boolean).join('\n');
      };

      const seoSection = data.content?.sections?.find((s: any) => s.type === 'seo_keywords');
      const seoKeywords = seoSection?.value || (data.seo?.tags || []).join(', ') || data.seo_keywords || '';

      setAiFormData({
        title: data.title || data.titulo || '',
        summary: data.summary || data.resumo || '',
        category: data.category || data.categoria || 'Política',
        author: data.author || 'Angola Sem Filtros',
        content: buildHtml(data),
        seo_keywords: seoKeywords,
        image_url: selectedNewsItem.image || selectedNewsItem.imageUrl || '',
        meta_description: data.seo?.meta_description || '',
        slug: data.slug || data.seo?.slug || '',
        tags: Array.isArray(data.seo?.tags) ? data.seo.tags.join(', ') : '',
        facebook: data.social?.facebook || '',
        instagram: data.social?.instagram || '',
        twitter: data.social?.twitter || '',
        reliability_score: data.reliability_score ?? 70,
      });

      setGeneratedArticle(data);
      setAiStep('preview');
      toast.success('Artigo Angola Sem Filtros gerado com sucesso!');
    } catch (err: any) {
      console.error('GenerateSemFiltros error:', err);
      toast.error('Erro ao gerar artigo: ' + (err?.message || 'Tente novamente.'));
      setAiStep('selected');
    }
  };

  const handlePublishArticleFromAI = async (published: boolean) => {
    if (!aiFormData.title) { toast.error('Título obrigatório.'); return; }
    setIsPublishingAI(true);
    try {
      const { error } = await supabase.from('news_articles').insert({
        title: aiFormData.title,
        summary: aiFormData.summary,
        content: aiFormData.content,
        category: aiFormData.category,
        author: aiFormData.author,
        image_url: aiFormData.image_url || null,
        seo_keywords: aiFormData.seo_keywords,
        published,
      });
      if (error) throw error;
      toast.success(published ? 'Artigo publicado com sucesso!' : 'Rascunho guardado!');
      if (published) {
        setAiStep('search');
        setSelectedNewsItem(null);
        setGeneratedArticle(null);
        loadData('articles');
      }
    } catch (err: any) {
      toast.error('Erro ao guardar: ' + err.message);
    } finally {
      setIsPublishingAI(false);
    }
  };

  const handleCopyAIContent = () => {
    const text = [aiFormData.title, '', aiFormData.summary, '', aiFormData.content.replace(/<[^>]+>/g, '')].join('\n');
    navigator.clipboard.writeText(text);
    toast.success('Conteúdo copiado!');
  };

  const handleExportDocxAI = () => {
    const text = `# ${aiFormData.title}\n\n${aiFormData.summary}\n\n${aiFormData.content.replace(/<[^>]+>/g, '')}\n\nSEO: ${aiFormData.seo_keywords}`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${aiFormData.slug || 'artigo-sem-filtros'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Ficheiro exportado!');
  };

  const handleExportPdfAI = () => { window.print(); };

  // Categories logic moved to top

  // If editor has restrictions, ensure the form starts with an allowed category
  useEffect(() => {
    if (isEditor && !isAdmin && allowedCategories.length > 0 && !allowedCategories.includes(articleForm.category)) {
      setArticleForm(f => ({ ...f, category: allowedCategories[0] }));
    }
  }, [allowedCategories, isAdmin, isEditor]);

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

  if (!isAdmin && !isEditor) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
        <Shield className="w-12 h-12 text-destructive mb-4" />
        <h1 className="text-xl font-bold text-foreground mb-2">Acesso Negado</h1>
        <p className="text-muted-foreground text-sm mb-6 max-w-xs">
          Não tem permissões de administrador ou editor. Se acabou de as receber, experimente reiniciar a sessão.
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
    { id: "digital-editions" as Tab, label: "Jornal Digital", icon: Newspaper },
    { id: "ai-discovery" as Tab, label: "Descoberta IA", icon: Sparkles },
    ...(isAdmin ? [
      { id: "stats" as Tab, label: "Estatísticas", icon: RefreshCw },
      { id: "ads" as Tab, label: "Publicidade", icon: Megaphone },
      { id: "users" as Tab, label: "Utilizadores", icon: Users },
      { id: "newsletter" as Tab, label: "Newsletter", icon: Mail },
      { id: "authorized-services" as Tab, label: "Serviços Autorizados", icon: Lock },
      { id: "site-settings" as Tab, label: "Configurações do Site", icon: Settings },
      { id: "backups" as Tab, label: "Backups", icon: HardDriveDownload }
    ] : []),
  ].filter(tab => {
    if (isAdmin) return true;
    if (tab.id === "dashboard") return true;
    if (isEditor) {
      // If editor has specific menu permissions, check them
      if (allowedMenus.length > 0) {
        return allowedMenus.includes(tab.id);
      }
      // Default: if no specific permissions but is editor, show articles/videos/opinions/breaking/digital/ai
      return true;
    }
    return false;
  });

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
          <h1 className="font-heading text-xl font-black tracking-tight text-foreground uppercase">Sem Filtros</h1>
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
            onClick={async () => { await signOut(); navigate("/"); }}
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
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                {[
                  { label: "Artigos", value: stats.articles, icon: Newspaper, color: "text-blue-400" },
                  { label: "Vídeos", value: stats.videos, icon: Video, color: "text-purple-400" },
                  { label: "Jornais", value: stats.digitalEditions, icon: Newspaper, color: "text-pink-400" },
                  { label: "Utilizadores", value: stats.users, icon: Users, color: "text-green-400" },
                  { label: "Visitas Reais", value: stats.totalVisits.toLocaleString(), icon: Eye, color: "text-orange-400" },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="bg-card border border-border p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <div className="text-2xl font-heading font-bold text-foreground">{value}</div>
                  </div>
                ))}
              </div>

              <div className="bg-card border border-border p-5">
                <h3 className="font-heading font-semibold text-foreground mb-4">Últimos artigos</h3>
                <div className="space-y-2">
                  {dashboardArticles.slice(0, 5).map(a => (
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
                  {dashboardArticles.length === 0 && <p className="text-sm text-muted-foreground">Sem artigos ainda.</p>}
                </div>
              </div>
            </div>
          )}

          {/* Articles */}
          {activeTab === "articles" && (
            <div>
              <div className="bg-card border border-border p-6 mb-8 rounded-sm">
                <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-primary" />
                  Configuração dos Destaques Principais (Hero)
                </h3>
                <div className="flex flex-col sm:flex-row items-end gap-6">
                  <div className="flex-1 max-w-xs">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Velocidade de Rotação (segundos)</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="3"
                        max="20"
                        step="1"
                        value={heroSpeed}
                        onChange={e => setHeroSpeed(Number(e.target.value))}
                        className="flex-1 accent-primary"
                      />
                      <span className="text-sm font-mono font-bold text-primary w-12 text-center">{heroSpeed}s</span>
                    </div>
                  </div>
                  <button
                    onClick={saveHeroSpeed}
                    disabled={savingSettings}
                    className="bg-primary text-primary-foreground px-6 py-2 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 h-10 rounded-sm"
                  >
                    {savingSettings ? "A guardar..." : "Salvar Configuração"}
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-3 italic">Esta configuração afecta apenas o slideshow principal na página inicial.</p>
              </div>

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
                        {displayedCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
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
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Palavras-chave SEO (separadas por vírgula)</label>
                      <input
                        value={articleForm.seo_keywords}
                        onChange={e => setArticleForm(f => ({ ...f, seo_keywords: e.target.value }))}
                        className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                        placeholder="angola, noticia, política, ..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Fonte da Notícia (opcional)</label>
                      <input
                        value={articleForm.source_name}
                        onChange={e => setArticleForm(f => ({ ...f, source_name: e.target.value }))}
                        className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                        placeholder="Ex: Jornal de Angola, Reuters, Lusa..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">URL da Fonte (opcional)</label>
                      <input
                        type="url"
                        value={articleForm.source_url}
                        onChange={e => setArticleForm(f => ({ ...f, source_url: e.target.value }))}
                        className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                        placeholder="https://..."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Imagem do Artigo</label>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => setArticleImageFile(e.target.files?.[0] || null)}
                            className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary file:bg-primary file:text-primary-foreground file:border-0 file:px-3 file:py-1 file:mr-4 file:text-xs file:font-bold file:uppercase file:cursor-pointer"
                          />
                          <p className="text-[10px] text-muted-foreground mt-1">Selecione um ficheiro para carregar para o servidor (recomendado)</p>
                        </div>
                        <div className="flex-1">
                          <input
                            value={articleForm.image_url}
                            onChange={e => setArticleForm(f => ({ ...f, image_url: e.target.value }))}
                            className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                            placeholder="Ou cole o URL da imagem da internet..."
                          />
                          <p className="text-[10px] text-muted-foreground mt-1">Apenas para links directos externos</p>
                        </div>
                      </div>
                      {(articleImageFile || articleForm.image_url) && (
                        <div className="mt-4 p-2 border border-dashed border-border rounded bg-secondary/30 flex items-center gap-4">
                          <img
                            src={articleImageFile ? URL.createObjectURL(articleImageFile) : articleForm.image_url}
                            alt="Preview"
                            className="w-20 h-12 object-cover rounded"
                          />
                          <span className="text-xs text-muted-foreground">Pré-visualização da imagem</span>
                        </div>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Conteúdo</label>
                      <textarea
                        value={articleForm.content}
                        onChange={e => setArticleForm(f => ({ ...f, content: e.target.value }))}
                        className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                        rows={10}
                        placeholder="Conteúdo completo do artigo"
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
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Agendar Publicação (opcional)
                      </label>
                      <input
                        type="datetime-local"
                        value={articleForm.scheduled_at}
                        min={new Date().toISOString().slice(0, 16)}
                        onChange={e => setArticleForm(f => ({ ...f, scheduled_at: e.target.value }))}
                        className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                      />
                      {articleForm.scheduled_at && new Date(articleForm.scheduled_at) > new Date() && (
                        <p className="text-xs text-amber-400 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> O artigo ficará oculto até {new Date(articleForm.scheduled_at).toLocaleString('pt-PT')}
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Áudio da Matéria (Opcional)</label>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="audio/*"
                            onChange={e => setArticleAudioFile(e.target.files?.[0] || null)}
                            className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary file:bg-primary file:text-primary-foreground file:border-0 file:px-3 file:py-1 file:mr-4 file:text-xs file:font-bold file:uppercase file:cursor-pointer"
                          />
                          <p className="text-[10px] text-muted-foreground mt-1">Selecione um ficheiro de áudio (MP3/WAV)</p>
                        </div>
                        <div className="flex-1">
                          <input
                            value={articleForm.audio_url}
                            onChange={e => setArticleForm(f => ({ ...f, audio_url: e.target.value }))}
                            className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                            placeholder="Ou cole o URL do áudio..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={saveArticle}
                      disabled={savingArticle}
                      className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {articleForm.scheduled_at && new Date(articleForm.scheduled_at) > new Date()
                        ? <><Clock className="w-4 h-4" />{savingArticle ? "A agendar..." : "Agendar"}</>
                        : <><Check className="w-4 h-4" />{savingArticle ? "A guardar..." : "Publicar"}</>
                      }
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
                          {article.scheduled_at && article.published && new Date(article.scheduled_at) > new Date() ? (
                            <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-400 flex items-center gap-1 w-fit">
                              <Clock className="w-3 h-3" />
                              {new Date(article.scheduled_at).toLocaleString('pt-PT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          ) : (
                            <span className={`text-xs px-2 py-0.5 ${article.published ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"}`}>
                              {article.published ? "Publicado" : "Rascunho"}
                            </span>
                          )}
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
                                setArticleForm({
                                  title: article.title,
                                  summary: article.summary || "",
                                  content: article.content || "",
                                  category: article.category,
                                  author: article.author || "Redacção",
                                  image_url: article.image_url || "",
                                  is_hero: !!article.is_hero,
                                  is_breaking: !!article.is_breaking,
                                  scheduled_at: article.scheduled_at
                                    ? new Date(article.scheduled_at).toISOString().slice(0, 16)
                                    : "",
                                  seo_keywords: article.seo_keywords || "",
                                  audio_url: article.audio_url || "",
                                  source_name: (article as any).source_name || "",
                                  source_url: (article as any).source_url || ""
                                });
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
                  onClick={() => { setShowVideoForm(true); setEditingVideo(null); }}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" />
                  Novo vídeo
                </button>
              </div>

              {showVideoForm && (
                <div className="bg-card border border-border p-6 mb-6">
                  <h3 className="font-heading font-semibold text-foreground mb-4">
                    {editingVideo ? "Editar vídeo" : "Novo vídeo"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Título *</label>
                      <input value={videoForm.title} onChange={e => setVideoForm(f => ({ ...f, title: e.target.value }))} className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">URL do vídeo (YouTube/Vimeo) *</label>
                      <input value={videoForm.video_url} onChange={e => setVideoForm(f => ({ ...f, video_url: e.target.value }))} className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary" placeholder="https://youtube.com/watch?v=..." />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Miniatura do Vídeo</label>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => setVideoThumbnailFile(e.target.files?.[0] || null)}
                            className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary file:bg-primary file:text-primary-foreground file:border-0 file:px-3 file:py-1 file:mr-4 file:text-xs file:font-bold file:uppercase file:cursor-pointer"
                          />
                          <p className="text-[10px] text-muted-foreground mt-1">Selecione uma imagem para a miniatura</p>
                        </div>
                        <div className="flex-1">
                          <input
                            value={videoForm.thumbnail_url}
                            onChange={e => setVideoForm(f => ({ ...f, thumbnail_url: e.target.value }))}
                            className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                            placeholder="Ou URL da miniatura..."
                          />
                        </div>
                      </div>
                      {(videoThumbnailFile || videoForm.thumbnail_url) && (
                        <div className="mt-4 p-2 border border-dashed border-border rounded bg-secondary/30 flex items-center gap-4">
                          <img
                            src={videoThumbnailFile ? URL.createObjectURL(videoThumbnailFile) : videoForm.thumbnail_url}
                            alt="Preview"
                            className="w-20 h-11 object-cover rounded"
                          />
                          <span className="text-xs text-muted-foreground">Pré-visualização da miniatura</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Duração (ex: 12:34)</label>
                      <input value={videoForm.duration} onChange={e => setVideoForm(f => ({ ...f, duration: e.target.value }))} className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Categoria</label>
                      <select
                        value={videoForm.category || "Vídeo"}
                        onChange={e => setVideoForm(f => ({ ...f, category: e.target.value }))}
                        className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                      >
                        {displayedCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Descrição</label>
                      <textarea value={videoForm.description} onChange={e => setVideoForm(f => ({ ...f, description: e.target.value }))} className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none" rows={2} />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={saveVideo}
                      disabled={savingVideo}
                      className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      {savingVideo ? "A guardar..." : "Guardar"}
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
                            <button onClick={() => togglePublished("video_news", v.id, v.published)} className="text-muted-foreground hover:text-foreground transition-colors" title={v.published ? "Despublicar" : "Publicar"}>
                              {v.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => {
                                setEditingVideo(v.id);
                                setVideoForm({
                                  title: v.title,
                                  description: v.description || "",
                                  video_url: v.video_url,
                                  thumbnail_url: v.thumbnail_url || "",
                                  duration: v.duration || "",
                                  category: v.category || "Vídeo"
                                });
                                setShowVideoForm(true);
                              }}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
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
              <div className="bg-card border border-border p-6 mb-8">
                <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-primary" />
                  Configurações do Ticker
                </h3>
                <div className="flex flex-col sm:flex-row items-end gap-4">
                  <div className="flex-1 max-w-xs">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Velocidade (segundos por ciclo)</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="10"
                        max="120"
                        step="5"
                        value={tickerSpeed}
                        onChange={e => setTickerSpeed(Number(e.target.value))}
                        className="flex-1 accent-primary"
                      />
                      <span className="text-sm font-mono font-bold text-primary w-12 text-center">{tickerSpeed}s</span>
                    </div>
                  </div>
                  <button
                    onClick={saveTickerSpeed}
                    disabled={savingSettings}
                    className="bg-primary text-primary-foreground px-6 py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-50 h-10"
                  >
                    {savingSettings ? "A guardar..." : "Salvar Velocidade"}
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-3">Quanto menor o valor, mais rápido as notícias deslizam.</p>
              </div>

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
                    <button
                      onClick={saveBreaking}
                      disabled={savingBreaking}
                      className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      {savingBreaking ? "A adicionar..." : "Adicionar"}
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

          {/* Stats */}
          {activeTab === "stats" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Eye className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground uppercase font-bold tracking-wider">Visitas Totais Reais</p>
                      <p className="text-3xl font-heading font-bold text-foreground">{stats.totalVisits.toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Soma de todos os acessos registados no sistema.</p>
                </div>

                <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground uppercase font-bold tracking-wider">Utilizadores Registados</p>
                      <p className="text-3xl font-heading font-bold text-foreground">{stats.users}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Utilizadores com perfil criado na plataforma.</p>
                </div>

                <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                      <Globe className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground uppercase font-bold tracking-wider">Países/Zonas (Visitantes)</p>
                      <p className="text-3xl font-heading font-bold text-foreground">{new Set(siteVisits.map(v => v.country).filter(Boolean)).size}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Diversidade geográfica baseada em todos os acessos.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="p-6 border-b border-border bg-secondary/20">
                    <h3 className="font-heading font-bold text-foreground flex items-center gap-2">
                      <Globe className="w-4 h-4 text-primary" /> Distribuição Geográfica
                    </h3>
                  </div>
                  <div className="p-0">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/30">
                          <th className="text-left px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Zona / País</th>
                          <th className="text-right px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Visitas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(
                          siteVisits.reduce((acc: Record<string, number>, v) => {
                            const c = v.country || "Desconhecido";
                            acc[c] = (acc[c] || 0) + 1;
                            return acc;
                          }, {})
                        )
                          .sort((a, b) => b[1] - a[1])
                          .map(([country, count]) => (
                            <tr key={country} className="border-b border-border/50 hover:bg-secondary/20">
                              <td className="px-6 py-4 text-sm font-medium text-foreground">{country}</td>
                              <td className="px-6 py-4 text-right text-sm text-muted-foreground font-mono">{count}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="p-6 border-b border-border bg-secondary/20">
                    <h3 className="font-heading font-bold text-foreground flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-primary" /> Atividade Recente
                    </h3>
                  </div>
                  <div className="p-0">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/30">
                          <th className="text-left px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Utilizador</th>
                          <th className="text-right px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Último Acesso</th>
                        </tr>
                      </thead>
                      <tbody>
                        {siteVisits
                          .slice(0, visibleVisitsCount)
                          .map((v) => (
                            <tr key={v.id} className="border-b border-border/50 hover:bg-secondary/20">
                              <td className="px-6 py-4">
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-2">
                                    {v.user_email ? (
                                      <span className="text-sm font-bold text-blue-400 flex items-center gap-1">
                                        <Users className="w-3 h-3" /> {v.user_email}
                                      </span>
                                    ) : (
                                      <span className="text-sm font-medium text-foreground">Visitante Anónimo</span>
                                    )}
                                    <span className="text-[10px] text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded border border-border/50">
                                      {v.country || "Desconhecido"}
                                    </span>
                                    {v.visitor_id && siteVisits.filter(sv => sv.visitor_id === v.visitor_id).length > 1 && (
                                      <span className="text-[10px] bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded-full border border-green-500/20 flex items-center gap-1">
                                        <Zap className="w-2.5 h-2.5" /> Recorrente
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 mt-1.5">
                                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 bg-muted/30 px-1.5 py-0.5 rounded">
                                      <Monitor className="w-3 h-3" /> {v.device_type || "—"} • {v.device_model || "—"}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 bg-muted/30 px-1.5 py-0.5 rounded">
                                      <Globe className="w-3 h-3" /> {v.browser || "—"} • {v.os || "—"}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right text-xs text-muted-foreground">
                                {v.created_at ? formatRelativeDate(v.created_at) : "—"}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>

                    {siteVisits.length > 0 && (
                      <div className="p-4 bg-secondary/10 border-t border-border flex justify-center gap-4">
                        {visibleVisitsCount < siteVisits.length && (
                          <button
                            onClick={() => setVisibleVisitsCount(prev => Math.min(prev + 20, siteVisits.length))}
                            className="text-xs font-bold uppercase tracking-widest text-primary hover:underline flex items-center gap-2"
                          >
                            Ver mais (+20) <ChevronDown className="w-3 h-3" />
                          </button>
                        )}
                        {visibleVisitsCount > 10 && (
                          <button
                            onClick={() => setVisibleVisitsCount(10)}
                            className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground flex items-center gap-2"
                          >
                            Ver menos <ChevronUp className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
                <h3 className="font-heading font-bold text-foreground mb-1">Atribuir função a utilizador</h3>
                <p className="text-xs text-muted-foreground mb-4">Introduza o UUID do utilizador para conceder acesso administrativo ou de edição.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <input
                      value={newUserEmail}
                      onChange={e => setNewUserEmail(e.target.value)}
                      className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary rounded-md"
                      placeholder="UUID do utilizador (ex: 550e8400-e29b-...)"
                    />
                  </div>
                  <select
                    value={newUserRole}
                    onChange={e => setNewUserRole(e.target.value as "admin" | "editor")}
                    className="bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary rounded-md"
                  >
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button
                  onClick={async () => {
                    const cleanUuid = newUserEmail.trim();
                    if (!cleanUuid) {
                      toast.error("Por favor, introduza um UUID válido.");
                      return;
                    }

                    console.log("Assigning role:", newUserRole, "to user:", cleanUuid);
                    setDataLoading(true);
                    try {
                      const { error } = await supabase
                        .from("user_roles" as any)
                        .insert({ user_id: cleanUuid, role: newUserRole });

                      if (error) {
                        console.error("Supabase error:", error);
                        toast.error("Erro ao atribuir função: " + error.message);
                      } else {
                        console.log("Role assigned successfully");
                        toast.success("Função atribuída com sucesso");
                        setNewUserEmail("");
                        await loadData("users");
                      }
                    } catch (err: any) {
                      console.error("Unexpected error assigning role:", err);
                      toast.error("Erro inesperado: " + (err.message || "Erro desconhecido"));
                    } finally {
                      setDataLoading(false);
                    }
                  }}
                  className="mt-4 flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 text-sm font-bold hover:opacity-90 transition-opacity rounded-md"
                >
                  <Plus className="w-4 h-4" />
                  Atribuir Função
                </button>
              </div>

              <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                    className="w-full bg-secondary border border-border text-foreground pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary rounded-md"
                    placeholder="Filtrar utilizadores por UUID, Email ou Nome..."
                  />
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-muted/30 border-b border-border">
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Utilizador</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">País/Zona</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Acessos</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Último Acesso</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Estado / Categorias</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles
                      .filter(p => {
                        const roles = userRoles.filter(r => r.user_id === p.user_id).map(r => r.role);
                        const isUserAdmin = roles.includes("admin");

                        // Ocultar administradores por segurança
                        if (isUserAdmin) return false;

                        // Filtrar por pesquisa
                        if (!userSearch) return true;
                        const query = userSearch.toLowerCase().trim();
                        return (
                          (p.email?.toLowerCase().includes(query)) ||
                          (p.user_id?.toLowerCase().includes(query)) ||
                          (p.full_name?.toLowerCase().includes(query))
                        );
                      })
                      .map(p => {
                        const roles = userRoles.filter(r => r.user_id === p.user_id).map(r => r.role);
                        const role = roles.includes("admin") ? "admin" : (roles.includes("editor") ? "editor" : (roles.includes("user") ? "user" : null));
                        return (
                          <tr key={p.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-bold text-foreground">{p.full_name || p.email || "Utilizador"}</p>
                                {p.email && (
                                  <button onClick={() => handleCopy(p.email!, "E-mail")} className="text-muted-foreground hover:text-primary transition-colors">
                                    <Copy className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <p className="text-[10px] text-muted-foreground font-mono">{p.user_id}</p>
                                <button onClick={() => handleCopy(p.user_id, "ID do utilizador")} className="text-muted-foreground hover:text-primary transition-colors">
                                  <Copy className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-xs text-muted-foreground hidden lg:table-cell">{p.country || "Desconhecido"}</td>
                            <td className="px-6 py-4 text-xs text-muted-foreground hidden sm:table-cell font-mono">{p.access_count || 0}</td>
                            <td className="px-6 py-4 text-xs text-muted-foreground hidden md:table-cell">
                              {p.last_access ? formatRelativeDate(p.last_access) : "Nunca"}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col gap-2">
                                {role ? (
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter w-fit ${role === "admin" ? "bg-primary/10 text-primary border border-primary/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"}`}>
                                    {role}
                                  </span>
                                ) : (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium uppercase tracking-tighter w-fit">Leitor</span>
                                )}

                                {role === "editor" && (
                                  <>
                                    <label className="text-[8px] font-bold uppercase text-muted-foreground mt-2">Categorias Permitidas</label>
                                    <div className="flex flex-wrap gap-1 mt-1 max-w-[200px]">
                                      {displayedCategories.map(cat => {
                                        const isSelected = editorCategories[p.user_id]?.includes(cat);
                                        return (
                                          <button
                                            key={cat}
                                            onClick={async () => {
                                              try {
                                                if (isSelected) {
                                                  const { error } = await supabase.from("editor_categories" as any).delete().eq("user_id", p.user_id).eq("category", cat);
                                                  if (error) throw error;
                                                  toast.success(`Categoria "${cat}" removida`);
                                                } else {
                                                  const { error } = await supabase.from("editor_categories" as any).insert({ user_id: p.user_id, category: cat });
                                                  if (error) throw error;
                                                  toast.success(`Categoria "${cat}" adicionada`);
                                                }
                                                await loadData("users");
                                              } catch (err: any) {
                                                console.error("Error toggling category:", err);
                                                toast.error("Erro ao atualizar categoria: " + err.message);
                                              }
                                            }}
                                            className={`text-[8px] px-1.5 py-0.5 rounded border transition-colors ${isSelected ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-muted-foreground border-border hover:border-primary/50"}`}
                                            title={isSelected ? "Remover categoria" : "Adicionar categoria"}
                                          >
                                            {cat}
                                          </button>
                                        );
                                      })}
                                    </div>

                                    <label className="text-[8px] font-bold uppercase text-muted-foreground mt-3">Módulos do Menu</label>
                                    <div className="flex flex-wrap gap-1 mt-1 max-w-[200px]">
                                      {[
                                        { id: "articles", label: "Artigos" },
                                        { id: "videos", label: "Vídeos" },
                                        { id: "opinions", label: "Opinião" },
                                        { id: "breaking", label: "Última Hora" },
                                        { id: "digital-editions", label: "Jornal Digital" },
                                        { id: "ai-discovery", label: "Descoberta IA" }
                                      ].map(menu => {
                                        const isSelected = editorMenuPermissions[p.user_id]?.includes(menu.id);
                                        return (
                                          <button
                                            key={menu.id}
                                            onClick={async () => {
                                              try {
                                                if (isSelected) {
                                                  const { error } = await supabase.from("editor_menu_permissions" as any).delete().eq("user_id", p.user_id).eq("menu_id", menu.id);
                                                  if (error) throw error;
                                                  toast.success(`Acesso a "${menu.label}" removido`);
                                                } else {
                                                  const { error } = await supabase.from("editor_menu_permissions" as any).insert({ user_id: p.user_id, menu_id: menu.id });
                                                  if (error) throw error;
                                                  toast.success(`Acesso a "${menu.label}" concedido`);
                                                }
                                                await loadData("users");
                                              } catch (err: any) {
                                                console.error("Error toggling menu:", err);
                                                toast.error("Erro ao atualizar menu: " + err.message);
                                              }
                                            }}
                                            className={`text-[8px] px-1.5 py-0.5 rounded border transition-colors ${isSelected ? "bg-blue-600 text-white border-blue-600" : "bg-secondary text-muted-foreground border-border hover:border-blue-400"}`}
                                            title={isSelected ? "Remover acesso ao menu" : "Permitir acesso ao menu"}
                                          >
                                            {menu.label}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <select
                                  className="bg-secondary border border-border text-[10px] px-2 py-1 rounded focus:outline-none"
                                  value={role || "leitor"}
                                  onChange={(e) => handleSetRole(p.user_id, e.target.value)}
                                >
                                  <option value="leitor">Leitor</option>
                                  <option value="editor">Editor</option>
                                  <option value="admin">Admin</option>
                                </select>
                                {role && (
                                  <button
                                    onClick={() => {
                                      const ur = userRoles.find(r => r.user_id === p.user_id);
                                      if (ur) deleteRecord("user_roles", ur.id);
                                    }}
                                    className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-all"
                                    title="Remover permissões"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    {profiles.length === 0 && <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-muted-foreground">Não foram encontrados perfis de utilizadores.</td></tr>}
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
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Avatar do Autor</label>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => setOpinionAvatarFile(e.target.files?.[0] || null)}
                            className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary file:bg-primary file:text-primary-foreground file:border-0 file:px-3 file:py-1 file:mr-4 file:text-xs file:font-bold file:uppercase file:cursor-pointer"
                          />
                        </div>
                        <div className="flex-1">
                          <input
                            value={opinionForm.avatar_url}
                            onChange={e => setOpinionForm(f => ({ ...f, avatar_url: e.target.value }))}
                            className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                            placeholder="Ou URL do avatar..."
                          />
                        </div>
                      </div>
                      {(opinionAvatarFile || opinionForm.avatar_url) && (
                        <div className="mt-4 p-2 border border-dashed border-border rounded bg-secondary/30 flex items-center gap-4">
                          <img
                            src={opinionAvatarFile ? URL.createObjectURL(opinionAvatarFile) : opinionForm.avatar_url}
                            alt="Preview"
                            className="w-12 h-12 object-cover rounded-full"
                          />
                          <span className="text-xs text-muted-foreground">Pré-visualização do avatar</span>
                        </div>
                      )}
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
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Palavras-chave SEO (separadas por vírgula)</label>
                      <input
                        value={opinionForm.seo_keywords}
                        onChange={e => setOpinionForm(f => ({ ...f, seo_keywords: e.target.value }))}
                        className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                        placeholder="angola, opinião, debate, ..."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Função / Cargo do Autor (Opcional)</label>
                      <input
                        type="text"
                        value={opinionForm.excerpt}
                        onChange={e => setOpinionForm(f => ({ ...f, excerpt: e.target.value }))}
                        className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                        placeholder="Ex: Economista, Analista Político, etc."
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
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Agendar Publicação (opcional)
                      </label>
                      <input
                        type="datetime-local"
                        value={opinionForm.scheduled_at}
                        min={new Date().toISOString().slice(0, 16)}
                        onChange={e => setOpinionForm(f => ({ ...f, scheduled_at: e.target.value }))}
                        className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                      />
                      {opinionForm.scheduled_at && new Date(opinionForm.scheduled_at) > new Date() && (
                        <p className="text-xs text-amber-400 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> A opinião ficará oculta até {new Date(opinionForm.scheduled_at).toLocaleString('pt-PT')}
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Áudio da Opinião (Opcional)</label>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="audio/*"
                            onChange={e => setOpinionAudioFile(e.target.files?.[0] || null)}
                            className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary file:bg-primary file:text-primary-foreground file:border-0 file:px-3 file:py-1 file:mr-4 file:text-xs file:font-bold file:uppercase file:cursor-pointer"
                          />
                          <p className="text-[10px] text-muted-foreground mt-1">Selecione um ficheiro de áudio (MP3/WAV)</p>
                        </div>
                        <div className="flex-1">
                          <input
                            value={opinionForm.audio_url}
                            onChange={e => setOpinionForm(f => ({ ...f, audio_url: e.target.value }))}
                            className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                            placeholder="Ou cole o URL do áudio..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={saveOpinion}
                      disabled={savingOpinion}
                      className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {opinionForm.scheduled_at && new Date(opinionForm.scheduled_at) > new Date()
                        ? <><Clock className="w-4 h-4" />{savingOpinion ? "A agendar..." : "Agendar"}</>
                        : <><Check className="w-4 h-4" />{savingOpinion ? "A guardar..." : "Publicar"}</>
                      }
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
                          {op.scheduled_at && op.published && new Date(op.scheduled_at) > new Date() ? (
                            <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-400 flex items-center gap-1 w-fit">
                              <Clock className="w-3 h-3" />
                              {new Date(op.scheduled_at).toLocaleString('pt-PT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          ) : (
                            <span className={`text-xs px-2 py-0.5 ${op.published ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"}`}>
                              {op.published ? "Publicado" : "Rascunho"}
                            </span>
                          )}
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
                              onClick={() => {
                                setEditingOpinion(op.id);
                                setOpinionForm({
                                  title: op.title,
                                  author: op.author,
                                  content: op.content || "",
                                  excerpt: op.excerpt || "",
                                  avatar_url: op.avatar_url || "",
                                  scheduled_at: op.scheduled_at
                                    ? new Date(op.scheduled_at).toISOString().slice(0, 16)
                                    : "",
                                  seo_keywords: op.seo_keywords || "",
                                  audio_url: op.audio_url || ""
                                });
                                setShowOpinionForm(true);
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
          )
          }
          {/* Digital Editions */}
          {
            activeTab === "digital-editions" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-muted-foreground">{digitalEditions.length} edições digitais no total</p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => window.open("/admin/gerar-jornal", "_blank")}
                      className="flex items-center gap-2 bg-[#b91c1c] text-white px-4 py-2 text-sm font-semibold hover:bg-[#991b1b] transition-all"
                    >
                      <Newspaper className="w-4 h-4" />
                      Gerar Jornal (12 Págs)
                    </button>
                    <button
                      onClick={() => {
                        setEditingDigital(null);
                        setDigitalForm({
                          title: "",
                          description: "",
                          edition_date: format(new Date(), "yyyy-MM-dd"),
                          price_aoa: 0,
                          price_usd: 0,
                          is_free: false,
                          cover_url: "",
                          pdf_url: ""
                        });
                        setShowDigitalForm(true);
                      }}
                      className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      <Plus className="w-4 h-4" />
                      Nova edição digital
                    </button>
                  </div>
                </div>

                {showDigitalForm && (
                  <div className="bg-card border border-border p-6 mb-6">
                    <h3 className="font-heading font-semibold text-foreground mb-4">
                      {editingDigital ? "Editar edição digital" : "Nova edição digital"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Título *</label>
                        <input
                          value={digitalForm.title}
                          onChange={e => setDigitalForm(f => ({ ...f, title: e.target.value }))}
                          className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                          placeholder="Edição nº X - JJ/MM/AAAA"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Descrição</label>
                        <textarea
                          value={digitalForm.description}
                          onChange={e => setDigitalForm(f => ({ ...f, description: e.target.value }))}
                          className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                          rows={2}
                          placeholder="Breve descrição da edição"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Data da Edição *</label>
                        <input
                          type="date"
                          value={digitalForm.edition_date}
                          onChange={e => setDigitalForm(f => ({ ...f, edition_date: e.target.value }))}
                          className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer mt-5">
                          <input
                            type="checkbox"
                            checked={digitalForm.is_free}
                            onChange={e => setDigitalForm(f => ({ ...f, is_free: e.target.checked }))}
                            className="accent-primary"
                          />
                          Edição Gratuita
                        </label>
                      </div>
                      {!digitalForm.is_free && (
                        <>
                          <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Preço (AOA)</label>
                            <input
                              type="number"
                              value={digitalForm.price_aoa}
                              onChange={e => setDigitalForm(f => ({ ...f, price_aoa: Number(e.target.value) }))}
                              className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Preço (USD)</label>
                            <input
                              type="number"
                              value={digitalForm.price_usd}
                              onChange={e => setDigitalForm(f => ({ ...f, price_usd: Number(e.target.value) }))}
                              className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                            />
                          </div>
                        </>
                      )}
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Capa da Edição (JPG/PNG) *</label>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={e => setDigitalCoverFile(e.target.files?.[0] || null)}
                              className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary file:bg-primary file:text-primary-foreground file:border-0 file:px-3 file:py-1 file:mr-4 file:text-xs file:font-bold file:uppercase file:cursor-pointer"
                            />
                          </div>
                          <div className="flex-1">
                            <input
                              value={digitalForm.cover_url}
                              onChange={e => setDigitalForm(f => ({ ...f, cover_url: e.target.value }))}
                              className="w-full bg-secondary border border-border text-foreground px-3 py-3 text-sm focus:outline-none focus:border-primary"
                              placeholder="Ou URL da capa..."
                            />
                          </div>
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Ficheiro PDF *</label>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1">
                            <input
                              type="file"
                              accept="application/pdf"
                              onChange={e => setDigitalPdfFile(e.target.files?.[0] || null)}
                              className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary file:bg-primary file:text-primary-foreground file:border-0 file:px-3 file:py-1 file:mr-4 file:text-xs file:font-bold file:uppercase file:cursor-pointer"
                            />
                          </div>
                          <div className="flex-1">
                            <input
                              value={digitalForm.pdf_url}
                              onChange={e => setDigitalForm(f => ({ ...f, pdf_url: e.target.value }))}
                              className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                              placeholder="Ou nome do ficheiro no storage..."
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-6">
                      <button
                        onClick={saveDigitalEdition}
                        disabled={savingDigital}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                        {savingDigital ? "A guardar..." : "Guardar Edição"}
                      </button>
                      <button onClick={() => setShowDigitalForm(false)} className="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 text-sm hover:bg-muted transition-colors">
                        <X className="w-4 h-4" />
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                <div className="bg-card border border-border overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-secondary/30">
                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Edição</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Data</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Preço</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {digitalEditions.map(edition => (
                        <tr key={edition.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-10 border border-border bg-muted flex-shrink-0 flex items-center justify-center overflow-hidden">
                                {edition.cover_url ? (
                                  <img src={edition.cover_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <FileText className="w-4 h-4 text-muted-foreground opacity-30" />
                                )}
                              </div>
                              <span className="text-sm font-medium text-foreground">{edition.title}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">
                            {format(new Date(edition.edition_date), "dd/MM/yyyy")}
                          </td>
                          <td className="px-4 py-3 text-xs font-mono">
                            {edition.is_free ? (
                              <span className="text-primary font-bold">GRÁTIS</span>
                            ) : (
                              <span>{edition.price_aoa} Kz / ${edition.price_usd}</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${edition.published ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"}`}>
                              {edition.published ? "Publicado" : "Rascunho"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => togglePublished("digital_editions", edition.id, edition.published)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                title={edition.published ? "Despublicar" : "Publicar"}
                              >
                                {edition.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => {
                                  setEditingDigital(edition.id);
                                  setDigitalForm({
                                    title: edition.title,
                                    description: edition.description || "",
                                    edition_date: edition.edition_date,
                                    price_aoa: edition.price_aoa || 0,
                                    price_usd: edition.price_usd || 0,
                                    is_free: !!edition.is_free,
                                    cover_url: edition.cover_url || "",
                                    pdf_url: edition.pdf_url || ""
                                  });
                                  setShowDigitalForm(true);
                                }}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteRecord("digital_editions", edition.id)}
                                className="text-muted-foreground hover:text-destructive transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {digitalEditions.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                            Sem edições digitais.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          }

          {/* AI Discovery v2 — Editor-Chefe Inteligente */}
          {activeTab === "ai-discovery" && (
            <div className="space-y-6">

              {/* Header Banner */}
              <div className="bg-gradient-to-r from-red-950/30 via-card to-card border border-red-900/20 p-5 rounded-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-600 flex items-center justify-center rounded-sm flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-base font-black uppercase tracking-tight text-foreground">Editor-Chefe Inteligente</h3>
                    <p className="text-[10px] text-muted-foreground">Angola Sem Filtros Engine · Modo Editorial Automático</p>
                  </div>
                  <span className="text-[10px] bg-red-600/20 text-red-400 border border-red-500/30 px-2 py-1 rounded-sm font-bold uppercase tracking-wider flex items-center gap-1.5 flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
                    Modo Sem Filtros
                  </span>
                </div>
                {/* Step indicators */}
                <div className="flex items-center gap-1">
                  {['1 · Pesquisar', '2 · Seleccionar', '3 · Gerar', '4 · Publicar'].map((label, i) => {
                    const stepOrder = ['search', 'selected', 'generating', 'preview'];
                    const currentIdx = stepOrder.indexOf(aiStep === 'generating' ? 'generating' : aiStep);
                    const isActive = currentIdx >= i;
                    return (
                      <div key={label} className="flex items-center gap-1 flex-1">
                        <div className={`flex-1 text-center py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-sm transition-all ${isActive ? 'bg-red-600 text-white' : 'bg-secondary text-muted-foreground'}`}>
                          {label}
                        </div>
                        {i < 3 && <div className={`w-2 h-px ${isActive && currentIdx > i ? 'bg-red-600' : 'bg-border'}`} />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* STEP 1 + 2: Search bar (always visible when not generating/previewing) */}
              {(aiStep === 'search' || aiStep === 'selected') && (
                <div className="bg-card border border-border p-5">
                  <div className="flex gap-3 mb-4">
                    <input
                      value={discoveryQuery}
                      onChange={e => setDiscoveryQuery(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleDiscoverNews()}
                      placeholder="Pesquise um tema: Sonangol, João Lourenço, Economia Angola, Petróleo, Namibe..."
                      className="flex-1 bg-secondary border border-border text-foreground px-4 py-2.5 text-sm focus:outline-none focus:border-red-600 transition-colors"
                    />
                    <button
                      onClick={() => handleDiscoverNews()}
                      disabled={isDiscovering}
                      className="bg-red-600 text-white px-6 py-2.5 text-sm font-bold uppercase tracking-wider hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50 flex-shrink-0"
                    >
                      {isDiscovering ? <RefreshCw className="w-4 h-4 animate-spin" /> : <SearchIcon className="w-4 h-4" />}
                      Pesquisar
                    </button>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Temas rápidos:</span>
                    {['Sonangol', 'João Lourenço', 'Economia Angola', 'Petróleo', 'Namibe', 'Luanda', 'MPLA', 'UNITA'].map(f => (
                      <button key={f} onClick={() => { setDiscoveryQuery(f); handleDiscoverNews(f); }} className="text-[10px] px-2.5 py-1 border border-border bg-secondary hover:border-red-500/50 hover:text-red-400 transition-colors font-bold text-muted-foreground rounded-sm">
                        {f}
                      </button>
                    ))}
                    <div className="ml-auto flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Período:</span>
                      <select value={discoveryTime} onChange={e => setDiscoveryTime(e.target.value)} className="bg-secondary border border-border text-[11px] text-foreground px-2 py-1 focus:outline-none focus:border-red-600">
                        <option value="">Qualquer</option>
                        <option value="qdr:h1">Última hora</option>
                        <option value="qdr:d1">24h</option>
                        <option value="qdr:d2">48h</option>
                        <option value="qdr:w1">Semana</option>
                        <option value="qdr:m1">Mês</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Loading */}
              {isDiscovering && (
                <div className="bg-card border border-border p-12 text-center">
                  <RefreshCw className="w-8 h-8 text-red-500 animate-spin mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">A pesquisar em múltiplas fontes OSINT...</p>
                </div>
              )}

              {/* Results grid */}
              {aiStep === 'search' && !isDiscovering && discoveryResults.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Globe className="w-4 h-4 text-red-500" />
                      {discoveryResults.length} notícias encontradas
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {discoveryResults.map((item, idx) => (
                      <div key={idx} className="bg-card border border-border hover:border-red-600/40 transition-all group overflow-hidden flex flex-col">
                        <div className="h-32 bg-gradient-to-br from-secondary to-muted overflow-hidden relative flex-shrink-0">
                          {item.image ? (
                            <img src={item.image} alt="" className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Globe className="w-8 h-8 text-muted-foreground/20" />
                            </div>
                          )}
                          {item.reliability !== undefined && (
                            <div className={`absolute top-2 right-2 text-[9px] font-black px-1.5 py-0.5 rounded-sm ${item.reliability > 70 ? 'bg-green-600 text-white' : item.reliability > 40 ? 'bg-amber-500 text-black' : 'bg-red-600 text-white'}`}>
                              {item.reliability}%
                            </div>
                          )}
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black text-red-500 uppercase tracking-tight truncate">{item.source || 'Fonte externa'}</span>
                            <span className="text-[10px] text-muted-foreground flex-shrink-0 ml-2">{item.date}</span>
                          </div>
                          <h5 className="text-sm font-bold text-foreground leading-tight mb-2 group-hover:text-red-400 transition-colors line-clamp-2 flex-1">{item.title}</h5>
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{item.snippet}</p>
                          <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                            {item.language && <span className="text-[9px] bg-secondary border border-border px-1.5 py-0.5 text-muted-foreground font-mono uppercase rounded-sm">{item.language}</span>}
                            {item.country && <span className="text-[9px] bg-secondary border border-border px-1.5 py-0.5 text-muted-foreground uppercase rounded-sm">{item.country}</span>}
                            {item.isTranslated && <span className="text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded-sm font-bold">TRADUZIDO</span>}
                          </div>
                          <button onClick={() => handleUseThisNews(item)} className="w-full bg-red-600 text-white py-2 text-[11px] font-black uppercase tracking-widest hover:bg-red-700 transition-colors flex items-center justify-center gap-2 mt-auto">
                            <Zap className="w-3.5 h-3.5" /> Usar Esta Notícia
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {aiStep === 'search' && !isDiscovering && discoveryResults.length === 0 && (
                <div className="bg-card border border-dashed border-border p-16 text-center">
                  <Bot className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground mb-1">Editor-Chefe aguarda tema de pesquisa</p>
                  <p className="text-xs text-muted-foreground/50">Pesquise um tema acima para descobrir notícias e gerar artigos automaticamente</p>
                </div>
              )}

              {/* STEP 2: Selected news + generate button */}
              {aiStep === 'selected' && selectedNewsItem && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-card border border-red-600/30 p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Zap className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="text-xs font-bold uppercase tracking-wider text-red-500">Notícia Seleccionada</span>
                      <button onClick={() => { setAiStep('search'); setSelectedNewsItem(null); }} className="ml-auto text-[10px] text-muted-foreground hover:text-foreground underline">Alterar</button>
                    </div>
                    {selectedNewsItem.image && (
                      <img src={selectedNewsItem.image} alt="" className="w-full h-36 object-cover mb-4 rounded-sm opacity-80" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    )}
                    <p className="text-[10px] font-black text-red-500 uppercase mb-2">{selectedNewsItem.source}</p>
                    <h4 className="font-bold text-foreground text-sm mb-3 leading-snug">{selectedNewsItem.title}</h4>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-3">{selectedNewsItem.snippet}</p>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground flex-wrap">
                      <span>{selectedNewsItem.date}</span>
                      {selectedNewsItem.url && (
                        <a href={selectedNewsItem.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                          <ExternalLink className="w-3 h-3" /> Ver fonte
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="bg-card border border-border p-5 flex flex-col">
                    <div className="bg-red-950/20 border border-red-900/30 p-4 rounded-sm mb-5">
                      <p className="text-[10px] font-bold uppercase text-red-400 mb-1 flex items-center gap-2"><Bot className="w-3 h-3" /> Angola Sem Filtros Engine — Activo</p>
                      <p className="text-xs text-muted-foreground">O sistema irá executar automaticamente: pesquisa OSINT, cruzamento de fontes, fact check, geração SEO e preenchimento completo do formulário CMS.</p>
                    </div>
                    <ul className="space-y-2 mb-5 flex-1">
                      {GENERATION_STEP_LABELS.map((s, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="w-4 h-4 rounded-full bg-red-600/20 border border-red-600/30 flex items-center justify-center flex-shrink-0">
                            <span className="text-[9px] text-red-400 font-bold">{i + 1}</span>
                          </div>
                          {s}
                        </li>
                      ))}
                    </ul>
                    <button onClick={handleGenerateSemFiltros} className="w-full bg-red-600 text-white py-4 font-heading font-black uppercase tracking-widest text-sm hover:bg-red-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-red-600/20 group">
                      <Bot className="w-5 h-5 group-hover:animate-pulse" />
                      Gerar Artigo Sem Filtros
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Animated generation progress */}
              {aiStep === 'generating' && (
                <div className="max-w-md mx-auto bg-card border border-border p-10 text-center">
                  <div className="w-16 h-16 bg-red-600/10 border-2 border-red-600 rounded-full flex items-center justify-center mx-auto mb-5 animate-pulse">
                    <Bot className="w-8 h-8 text-red-500" />
                  </div>
                  <h4 className="font-heading font-black text-base uppercase tracking-tight text-foreground mb-1">Editor-Chefe em Acção</h4>
                  <p className="text-xs text-muted-foreground mb-6">Angola Sem Filtros Engine a processar...</p>
                  <div className="space-y-2 text-left">
                    {generationSteps.map((step, i) => (
                      <div key={i} className={`flex items-center gap-3 px-4 py-2.5 rounded-sm transition-all ${step.done ? 'bg-green-500/10 border border-green-500/20' : step.active ? 'bg-red-600/10 border border-red-600/30' : 'bg-secondary/30 border border-border'}`}>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? 'bg-green-500' : step.active ? 'bg-red-600' : 'bg-muted-foreground/20'}`}>
                          {step.done ? <Check className="w-3 h-3 text-white" /> : step.active ? <RefreshCw className="w-3 h-3 text-white animate-spin" /> : <span className="text-[9px] text-muted-foreground font-bold">{i + 1}</span>}
                        </div>
                        <span className={`text-xs font-semibold ${step.done ? 'text-green-400' : step.active ? 'text-red-400' : 'text-muted-foreground'}`}>{step.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: Preview + auto-filled form */}
              {aiStep === 'preview' && (
                <div>
                  {/* Action bar */}
                  <div className="bg-card border border-border p-4 mb-5 flex items-center gap-2 flex-wrap">
                    <button onClick={() => handlePublishArticleFromAI(true)} disabled={isPublishingAI} className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 text-xs font-black uppercase tracking-wider hover:bg-green-700 transition-colors disabled:opacity-50 rounded-sm">
                      <Check className="w-3.5 h-3.5" />{isPublishingAI ? 'A publicar...' : 'Publicar'}
                    </button>
                    <button onClick={() => handlePublishArticleFromAI(false)} disabled={isPublishingAI} className="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-muted border border-border disabled:opacity-50 rounded-sm">
                      <FileText className="w-3.5 h-3.5" /> Guardar Rascunho
                    </button>
                    <button onClick={handleCopyAIContent} className="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-muted border border-border rounded-sm">
                      <Copy className="w-3.5 h-3.5" /> Copiar
                    </button>
                    <button onClick={handleExportDocxAI} className="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-muted border border-border rounded-sm">
                      <Download className="w-3.5 h-3.5" /> Exportar DOCX
                    </button>
                    <button onClick={handleExportPdfAI} className="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-muted border border-border rounded-sm">
                      <Monitor className="w-3.5 h-3.5" /> Exportar PDF
                    </button>
                    {aiFormData.reliability_score > 0 && (
                      <div className={`ml-auto flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-bold border ${aiFormData.reliability_score >= 70 ? 'bg-green-500/10 text-green-400 border-green-500/20' : aiFormData.reliability_score >= 40 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                        Confiabilidade: {aiFormData.reliability_score}%
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Auto-filled form */}
                    <div className="space-y-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-red-500" /> Formulário Auto-Preenchido (Editável)</p>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Título SEO *</label>
                        <input value={aiFormData.title} onChange={e => setAiFormData(f => ({ ...f, title: e.target.value }))} className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-red-600 font-bold" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Resumo</label>
                        <textarea value={aiFormData.summary} onChange={e => setAiFormData(f => ({ ...f, summary: e.target.value }))} rows={3} className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-red-600 resize-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Categoria</label>
                          <select value={aiFormData.category} onChange={e => setAiFormData(f => ({ ...f, category: e.target.value }))} className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-red-600">
                            {displayedCategories.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Autor</label>
                          <input value={aiFormData.author} onChange={e => setAiFormData(f => ({ ...f, author: e.target.value }))} className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-red-600" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Imagem (URL)</label>
                        <input value={aiFormData.image_url} onChange={e => setAiFormData(f => ({ ...f, image_url: e.target.value }))} className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-red-600" placeholder="https://..." />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Palavras-chave SEO</label>
                        <input value={aiFormData.seo_keywords} onChange={e => setAiFormData(f => ({ ...f, seo_keywords: e.target.value }))} className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-red-600" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Slug</label>
                          <input value={aiFormData.slug} onChange={e => setAiFormData(f => ({ ...f, slug: e.target.value }))} className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-xs font-mono focus:outline-none focus:border-red-600" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Tags</label>
                          <input value={aiFormData.tags} onChange={e => setAiFormData(f => ({ ...f, tags: e.target.value }))} className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-xs focus:outline-none focus:border-red-600" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Meta Description</label>
                        <textarea value={aiFormData.meta_description} onChange={e => setAiFormData(f => ({ ...f, meta_description: e.target.value }))} rows={2} className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-xs focus:outline-none focus:border-red-600 resize-none font-mono" />
                        <p className="text-[9px] text-muted-foreground mt-0.5">{aiFormData.meta_description.length}/155 caracteres</p>
                      </div>
                      <div className="border-t border-border pt-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2"><Globe className="w-3 h-3" /> Textos Redes Sociais</p>
                        {([['facebook', 'Facebook'], ['instagram', 'Instagram'], ['twitter', 'Twitter/X']] as const).map(([key, label]) => (
                          <div key={key} className="mb-3">
                            <label className="block text-[9px] font-bold uppercase text-muted-foreground/70 mb-1">{label}</label>
                            <div className="relative">
                              <textarea value={(aiFormData as any)[key]} onChange={e => setAiFormData(f => ({ ...f, [key]: e.target.value }))} rows={2} className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-xs focus:outline-none focus:border-red-600 resize-none pr-8" />
                              <button onClick={() => { navigator.clipboard.writeText((aiFormData as any)[key]); toast.success(`${label} copiado!`); }} className="absolute top-2 right-2 text-muted-foreground hover:text-foreground">
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Conteúdo Completo</label>
                        <textarea value={aiFormData.content} onChange={e => setAiFormData(f => ({ ...f, content: e.target.value }))} rows={10} className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-xs focus:outline-none focus:border-red-600 resize-none font-mono" />
                      </div>
                    </div>

                    {/* Article preview */}
                    <div className="space-y-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2"><Monitor className="w-3.5 h-3.5 text-red-500" /> Pré-visualização</p>
                      <div className="bg-card border border-border overflow-hidden sticky top-4">
                        {aiFormData.image_url && (
                          <img src={aiFormData.image_url} alt="" className="w-full h-44 object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        )}
                        <div className="p-6">
                          <span className="text-[10px] font-black uppercase text-red-500 tracking-widest">{aiFormData.category}</span>
                          <h2 className="font-heading text-xl font-black text-foreground mt-2 mb-3 leading-tight">{aiFormData.title || 'Título do artigo'}</h2>
                          {aiFormData.summary && <p className="text-sm text-muted-foreground border-l-2 border-red-600 pl-3 mb-4 italic">{aiFormData.summary}</p>}
                          <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: aiFormData.content }} />
                          <div className="mt-6 pt-4 border-t border-border">
                            <p className="text-[10px] text-muted-foreground">
                              <span className="font-bold text-foreground">{aiFormData.author}</span> · Angola Sem Filtros · {new Date().toLocaleDateString('pt-PT')}
                            </p>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => { setAiStep('search'); setSelectedNewsItem(null); setGeneratedArticle(null); }} className="w-full text-xs text-muted-foreground hover:text-foreground border border-border py-2 hover:bg-secondary transition-colors rounded-sm">
                        ← Nova pesquisa
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}


          {/* Ads management */}
          {
            activeTab === "ads" && (
              <div>
                <div className="bg-card border border-border p-6 mb-8">
                  <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    Validação do Site (AdSense)
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-1">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Método de Validação</label>
                        <select
                          value={validationMethod}
                          onChange={e => setValidationMethod(e.target.value as any)}
                          className="w-full bg-secondary border border-border text-foreground px-3 py-1.5 text-sm focus:outline-none focus:border-primary h-9"
                        >
                          <option value="adsense">Fragmento do código do AdSense</option>
                          <option value="ads.txt">Fragmento do ficheiro ads.txt</option>
                          <option value="metatag">Metatag</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Conteúdo / Fragmento</label>
                        <textarea
                          value={validationContent}
                          onChange={e => setValidationContent(e.target.value)}
                          className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-xs focus:outline-none focus:border-primary min-h-[80px] font-mono"
                          placeholder="Cole aqui o código ou conteúdo..."
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={saveValidationSettings}
                        disabled={savingValidation}
                        className="bg-primary text-primary-foreground px-6 py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-50 h-9"
                      >
                        {savingValidation ? "A guardar..." : "Salvar Validação"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border p-6 mb-8">
                  <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-primary" />
                    Configuração de Exibição
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 items-end gap-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Secção a Configurar</label>
                      <select
                        value={selectedSettingsSlot}
                        onChange={e => {
                          setSelectedSettingsSlot(e.target.value);
                          // Trigger a reload of settings for this slot
                          loadData("ads");
                        }}
                        className="w-full bg-secondary border border-border text-foreground px-3 py-1.5 text-sm focus:outline-none focus:border-primary h-10"
                      >
                        <option value="banner_top">Banner Topo</option>
                        <option value="banner_bottom">Banner Final</option>
                        <option value="sidebar_carousel">Carrossel Lateral</option>
                        <option value="sidebar_video">Vídeo Vertical</option>
                        <option value="video_section_sidebar">Destaque Vídeos (Lateral)</option>
                      </select>
                    </div>

                    <div className="md:col-span-1">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Velocidade (segundos)</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="3"
                          max="20"
                          step="1"
                          value={adCarouselSpeed}
                          onChange={e => setAdCarouselSpeed(Number(e.target.value))}
                          className="flex-1 accent-primary"
                        />
                        <span className="text-sm font-mono font-bold text-primary w-12 text-center">{adCarouselSpeed}s</span>
                      </div>
                    </div>

                    <div className="md:col-span-1">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Tipo de Transição</label>
                      <select
                        value={adCarouselTransition}
                        onChange={e => setAdCarouselTransition(e.target.value as "fade" | "slide")}
                        className="w-full bg-secondary border border-border text-foreground px-3 py-1.5 text-sm focus:outline-none focus:border-primary h-10"
                      >
                        <option value="fade">Desvanecer (Fade)</option>
                        <option value="slide">Deslizar (Slide)</option>
                      </select>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={saveAdCarouselSettings}
                        disabled={savingSettings}
                        className="w-full bg-primary text-primary-foreground px-6 py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-50 h-10"
                      >
                        {savingSettings ? "A guardar..." : "Salvar Configuração"}
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-3">Define quanto tempo cada anúncio permanece visível e como ele alterna para o próximo.</p>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-muted-foreground">Gerir espaços publicitários do site</p>
                  <button onClick={() => { setShowAdForm(true); setEditingAd(null); setAdForm({ slot: "banner_top", title: "", image_url: "", video_url: "", link_url: "", display_order: 0 }); }} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90">
                    <Plus className="w-4 h-4" /> Novo Anúncio
                  </button>
                </div>

                {showAdForm && (
                  <div className="bg-card border border-border p-6 mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-heading font-semibold text-foreground">{editingAd ? "Editar Anúncio" : "Novo Anúncio"}</h3>
                      <button onClick={() => setShowAdForm(false)}><X className="w-4 h-4 text-muted-foreground" /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Posição</label>
                        <select value={adForm.slot} onChange={e => setAdForm({ ...adForm, slot: e.target.value })} className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm">
                          <option value="banner_top">Banner Topo</option>
                          <option value="banner_bottom">Banner Final</option>
                          <option value="sidebar_carousel">Carrossel Lateral</option>
                          <option value="sidebar_video">Vídeo Vertical</option>
                          <option value="video_section_sidebar">Destaque Vídeos (Lateral)</option>
                          <option value="newspaper_full">Jornal (Pág. Inteira - 180×257mm)</option>
                          <option value="newspaper_half_h">Jornal (Meia Horiz. - 180×120mm)</option>
                          <option value="newspaper_banner">Jornal (Rodapé/Banner - 180×60mm)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Título</label>
                        <input value={adForm.title} onChange={e => setAdForm({ ...adForm, title: e.target.value })} className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm" placeholder="Nome do anúncio" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Imagem do Anúncio</label>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={e => setAdImageFile(e.target.files?.[0] || null)}
                              className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary file:bg-primary file:text-primary-foreground file:border-0 file:px-3 file:py-1 file:mr-4 file:text-xs file:font-bold file:uppercase file:cursor-pointer"
                            />
                          </div>
                          <div className="flex-1">
                            <input
                              value={adForm.image_url}
                              onChange={e => setAdForm({ ...adForm, image_url: e.target.value })}
                              className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                              placeholder="Ou URL da imagem..."
                            />
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Vídeo do Anúncio (Vertical 9:16 recomendado)</label>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1">
                            <input
                              type="file"
                              accept="video/*"
                              onChange={e => setAdVideoFile(e.target.files?.[0] || null)}
                              className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary file:bg-primary file:text-primary-foreground file:border-0 file:px-3 file:py-1 file:mr-4 file:text-xs file:font-bold file:uppercase file:cursor-pointer"
                            />
                          </div>
                          <div className="flex-1">
                            <input
                              value={adForm.video_url}
                              onChange={e => setAdForm({ ...adForm, video_url: e.target.value })}
                              className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                              placeholder="Ou URL do vídeo..."
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Link de Destino</label>
                        <input value={adForm.link_url} onChange={e => setAdForm({ ...adForm, link_url: e.target.value })} className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm" placeholder="https://..." />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Ordem</label>
                        <input type="number" value={adForm.display_order} onChange={e => setAdForm({ ...adForm, display_order: Number(e.target.value) })} className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm" />
                      </div>
                    </div>
                    <button
                      onClick={async () => {
                        if (!adForm.title) { toast.error("Título obrigatório"); return; }
                        setSavingAd(true);
                        try {
                          let currentImgUrl = adForm.image_url;
                          let currentVidUrl = adForm.video_url;

                          if (adImageFile) {
                            toast.info("A carregar imagem...");
                            currentImgUrl = await uploadFile(adImageFile);
                          }

                          if (adVideoFile) {
                            toast.info("A carregar vídeo...");
                            currentVidUrl = await uploadFile(adVideoFile);
                          }

                          const payload = {
                            ...adForm,
                            image_url: currentImgUrl,
                            video_url: currentVidUrl,
                            active: true
                          };

                          const { error } = editingAd
                            ? await supabase.from("advertisements").update(payload).eq("id", editingAd)
                            : await supabase.from("advertisements").insert(payload);

                          if (error) {
                            toast.error("Erro: " + error.message);
                          } else {
                            toast.success(editingAd ? "Anúncio actualizado!" : "Anúncio criado!");
                            setShowAdForm(false);
                            setAdImageFile(null);
                            setAdVideoFile(null);
                            loadData("ads");
                          }
                        } catch (err: any) {
                          toast.error("Erro: " + err.message);
                        } finally {
                          setSavingAd(false);
                        }
                      }}
                      disabled={savingAd}
                      className="mt-4 bg-primary text-primary-foreground px-6 py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                    >
                      {savingAd ? "A guardar..." : (editingAd ? "Actualizar" : "Criar Anúncio")}
                    </button>
                  </div>
                )}

                {/* Ads list grouped by slot */}
                {["banner_top", "banner_bottom", "sidebar_carousel", "sidebar_video", "video_section_sidebar", "newspaper_full", "newspaper_half_h", "newspaper_banner"].map(slot => {
                  const slotAds = advertisements.filter(a => a.slot === slot);
                  const labels: Record<string, string> = {
                    banner_top: "Banner Topo",
                    banner_bottom: "Banner Final",
                    sidebar_carousel: "Carrossel Lateral",
                    sidebar_video: "Vídeo Vertical",
                    video_section_sidebar: "Destaque Vídeos (Lateral)",
                    newspaper_full: "Jornal (Pág. Inteira - 180×257mm)",
                    newspaper_half_h: "Jornal (Meia Horizontal - 180×120mm)",
                    newspaper_banner: "Jornal (Rodapé/Banner - 180×60mm)"
                  };
                  return (
                    <div key={slot} className="mb-8">
                      <h3 className="text-sm font-heading font-bold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Megaphone className="w-3.5 h-3.5 text-primary" />
                        {labels[slot]}
                        <span className="text-xs font-normal text-muted-foreground">({slotAds.length})</span>
                      </h3>
                      {slotAds.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic">Nenhum anúncio nesta posição.</p>
                      ) : (
                        <div className="bg-card border border-border overflow-hidden">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-border bg-secondary/50">
                                <th className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Título</th>
                                <th className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Estado</th>
                                <th className="px-4 py-2 text-right text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Ações</th>
                              </tr>
                            </thead>
                            <tbody>
                              {slotAds.map(ad => (
                                <tr key={ad.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                                  <td className="px-4 py-3">
                                    <span className="text-sm font-medium text-foreground">{ad.title}</span>
                                    {ad.image_url && <img src={ad.image_url} alt="" className="mt-1 h-8 rounded-sm opacity-60" />}
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className={`text-xs px-2 py-0.5 ${ad.active ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"}`}>
                                      {ad.active ? "Ativo" : "Inativo"}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center justify-end gap-2">
                                      <button onClick={async () => { await supabase.from("advertisements").update({ active: !ad.active }).eq("id", ad.id); toast.success("Estado alterado"); loadData("ads"); }} className="text-muted-foreground hover:text-foreground" title={ad.active ? "Desativar" : "Ativar"}>
                                        {ad.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                      </button>
                                      <button onClick={() => { setEditingAd(ad.id); setAdForm({ slot: ad.slot, title: ad.title, image_url: ad.image_url || "", video_url: ad.video_url || "", link_url: ad.link_url || "", display_order: ad.display_order || 0 }); setShowAdForm(true); }} className="text-muted-foreground hover:text-foreground">
                                        <Pencil className="w-4 h-4" />
                                      </button>
                                      <button onClick={async () => { if (confirm("Eliminar anúncio?")) { await supabase.from("advertisements").delete().eq("id", ad.id); toast.success("Anúncio eliminado"); loadData("ads"); } }} className="text-muted-foreground hover:text-destructive">
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          }

          {/* Newsletter Panel */}
          {
            activeTab === "newsletter" && (
              <div className="space-y-6">
                <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
                  <h3 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    Enviar Nova Newsletter
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Assunto do E-mail *</label>
                      <input
                        value={newsletterForm.subject}
                        onChange={e => setNewsletterForm({ ...newsletterForm, subject: e.target.value })}
                        className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary rounded-md"
                        placeholder="Ex: Notícias da Semana - Portal Sem Filtros"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Conteúdo (Suporta HTML) *</label>
                      <textarea
                        value={newsletterForm.content}
                        onChange={e => setNewsletterForm({ ...newsletterForm, content: e.target.value })}
                        className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary rounded-md min-h-[300px]"
                        placeholder="<h1>Olá!</h1><p>Esta é a nossa newsletter...</p>"
                      />
                    </div>
                    <button
                      onClick={handleSendNewsletter}
                      disabled={sendingNewsletter}
                      className="mt-4 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 font-heading font-black uppercase tracking-widest text-sm hover:opacity-90 disabled:opacity-50 transition-opacity rounded-md w-full md:w-auto shadow-lg shadow-primary/20"
                    >
                      {sendingNewsletter ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                      {sendingNewsletter ? "A enviar para todos os utilizadores..." : "Enviar Newsletter Agora"}
                    </button>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl flex flex-col overflow-hidden shadow-sm">
                  <div className="p-4 border-b border-border bg-secondary/30">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Últimos Envios</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-muted/10 border-b border-border">
                          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Data do Envio</th>
                          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Assunto</th>
                          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-center">Destinatários</th>
                          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {newsletterLogs.map(log => (
                          <tr key={log.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                            <td className="px-6 py-4 text-xs text-muted-foreground">
                              {format(new Date(log.created_at), "dd/MM/yyyy • HH:mm")}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-foreground max-w-xs truncate flex items-center gap-2">
                              {log.subject}
                              <button onClick={() => handleCopy(log.subject, "Assunto")} className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0">
                                <Copy className="w-3 h-3" />
                              </button>
                            </td>
                            <td className="px-6 py-4 text-sm font-mono text-center">
                              {log.recipient_count}
                            </td>
                            <td className="px-6 py-4">
                              {log.status === "success" ? (
                                <span className="text-[10px] px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-bold uppercase">Enviado</span>
                              ) : (
                                <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/10 text-red-500 font-bold uppercase" title={log.error_details || "Erro desconhecido"}>Falhou</span>
                              )}
                            </td>
                          </tr>
                        ))}
                        {newsletterLogs.length === 0 && !dataLoading && (
                          <tr>
                            <td colSpan={4} className="px-6 py-8 text-center text-sm text-muted-foreground">
                              Nenhuma newsletter enviada ainda.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )
          }

          {/* Authorized Services */}
          {
            activeTab === "authorized-services" && (
              <div className="space-y-6">
                <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
                  <h3 className="font-heading font-bold text-foreground mb-1 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-primary" />
                    Autorizar Acesso aos Serviços
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4">Adicione e-mails de utilizadores que terão permissão para aceder à secção "Nossos Serviços".</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      value={newAuthorizedEmail}
                      onChange={e => setNewAuthorizedEmail(e.target.value)}
                      className="flex-1 bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary rounded-md"
                      placeholder="E-mail do utilizador (ex: usuario@email.com)"
                      onKeyDown={e => e.key === "Enter" && saveAuthorizedEmail()}
                    />
                    <button
                      onClick={saveAuthorizedEmail}
                      disabled={savingAuthorizedEmail}
                      className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-2 text-sm font-bold hover:opacity-90 transition-opacity rounded-md disabled:opacity-50"
                    >
                      {savingAuthorizedEmail ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                      Autorizar E-mail
                    </button>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                  <div className="p-4 border-b border-border bg-secondary/30 flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">E-mails Autorizados ({authorizedEmails.length})</h4>
                    <button
                      onClick={() => loadData("authorized-services")}
                      className="text-[10px] text-primary hover:underline font-bold uppercase"
                    >
                      Atualizar Lista
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-muted/30 border-b border-border">
                          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">E-mail</th>
                          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Data de Autorização</th>
                          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {authorizedEmails.map((item) => (
                          <tr key={item.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-foreground">{item.email}</span>
                                <button onClick={() => handleCopy(item.email, "E-mail")} className="text-muted-foreground hover:text-primary transition-colors">
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-xs text-muted-foreground">
                              {format(new Date(item.created_at), "dd/MM/yyyy • HH:mm")}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={async () => {
                                  if (confirm(`Tem a certeza que deseja revogar o acesso de ${item.email}?`)) {
                                    setDataLoading(true);
                                    try {
                                      const { error } = await supabase.from("authorized_services_emails").delete().eq("id", item.id);
                                      if (error) throw error;
                                      toast.success("Acesso revogado com sucesso!");
                                      await loadData("authorized-services");
                                    } catch (err: any) {
                                      toast.error("Erro ao revogar acesso: " + err.message);
                                    } finally {
                                      setDataLoading(false);
                                    }
                                  }
                                }}
                                className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-all"
                                title="Revogar acesso"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {authorizedEmails.length === 0 && (
                          <tr>
                            <td colSpan={3} className="px-6 py-12 text-center text-sm text-muted-foreground">
                              Nenhum e-mail autorizado ainda.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )
          }

          {/* Backup & Export Section */}
          {
            activeTab === "backups" && (
              <div className="space-y-6">
                <div className="bg-card border border-border p-8 rounded-xl shadow-sm text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <HardDriveDownload className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-foreground mb-2">Cópia de Segurança & Exportação</h3>
                  <p className="text-muted-foreground text-sm mb-10 max-w-lg mx-auto">
                    Exporte o conteúdo do seu portal para salvaguarda ou migração. Selecione o formato desejado abaixo para iniciar o download.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    {/* JSON Export */}
                    <div className="bg-secondary/20 border border-border p-6 rounded-lg text-left group hover:border-primary/50 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <Database className="w-6 h-6 text-primary" />
                        <span className="text-[10px] font-bold uppercase bg-primary/10 text-primary px-2 py-0.5 rounded">Recomendado</span>
                      </div>
                      <h4 className="font-bold text-foreground mb-2">Backup Completo (JSON)</h4>
                      <p className="text-xs text-muted-foreground mb-6">
                        Descarrega todos os artigos, vídeos, opiniões e configurações do sistema num único ficheiro estruturado.
                      </p>
                      <button
                        onClick={async () => {
                          toast.info("A preparar backup JSON...");
                          try {
                            const [news, videos, opinions, settings] = await Promise.all([
                              supabase.from("news_articles").select("*"),
                              supabase.from("video_news").select("*"),
                              supabase.from("opinion_articles").select("*"),
                              supabase.from("system_settings").select("*")
                            ]);
                            exportToJSON({
                              news: news.data || [],
                              videos: videos.data || [],
                              opinions: opinions.data || [],
                              settings: settings.data || []
                            });
                            toast.success("Backup JSON descarregado!");
                          } catch (err) {
                            toast.error("Erro ao gerar backup.");
                          }
                        }}
                        className="w-full bg-primary text-primary-foreground py-2 text-xs font-bold uppercase tracking-wider rounded border border-primary hover:opacity-90 flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Baixar JSON
                      </button>
                    </div>

                    {/* WordPress Export */}
                    <div className="bg-secondary/20 border border-border p-6 rounded-lg text-left group hover:border-primary/50 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <Globe className="w-6 h-6 text-blue-400" />
                      </div>
                      <h4 className="font-bold text-foreground mb-2">WordPress (XML/WXR)</h4>
                      <p className="text-xs text-muted-foreground mb-6">
                        Formato compatível com a ferramenta de importação do WordPress. Ideal para mover o conteúdo para blogs.
                      </p>
                      <button
                        onClick={async () => {
                          toast.info("A processar XML para WordPress...");
                          try {
                            const [news, opinions] = await Promise.all([
                              supabase.from("news_articles").select("*"),
                              supabase.from("opinion_articles").select("*")
                            ]);
                            exportToWordPressXML({
                              news: news.data || [],
                              videos: [],
                              opinions: opinions.data || [],
                              settings: []
                            });
                            toast.success("Ficheiro XML gerado!");
                          } catch (err) {
                            toast.error("Erro ao gerar XML.");
                          }
                        }}
                        className="w-full bg-white text-black py-2 text-xs font-bold uppercase tracking-wider rounded border border-border hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Gerar XML
                      </button>
                    </div>

                    {/* SQL Export */}
                    <div className="bg-secondary/20 border border-border p-6 rounded-lg text-left group hover:border-primary/50 transition-all md:col-span-2">
                      <div className="flex items-start justify-between mb-4">
                        <Database className="w-6 h-6 text-green-500" />
                        <span className="text-[10px] font-bold uppercase bg-green-500/10 text-green-500 px-2 py-0.5 rounded">Avançado</span>
                      </div>
                      <h4 className="font-bold text-foreground mb-2">Base de Dados (SQL)</h4>
                      <p className="text-xs text-muted-foreground mb-6">
                        Gera um ficheiro .sql com instruções INSERT compatíveis com PostgreSQL/Supabase. Esta é a representação mais fiel dos dados técnicos da base de dados.
                      </p>
                      <button
                        onClick={async () => {
                          toast.info("A gerar instruções SQL...");
                          try {
                            const [news, videos, opinions, settings] = await Promise.all([
                              supabase.from("news_articles").select("*"),
                              supabase.from("video_news").select("*"),
                              supabase.from("opinion_articles").select("*"),
                              supabase.from("system_settings").select("*")
                            ]);
                            exportToSQL({
                              news: news.data || [],
                              videos: videos.data || [],
                              opinions: opinions.data || [],
                              settings: settings.data || []
                            });
                            toast.success("Backup SQL descarregado!");
                          } catch (err) {
                            toast.error("Erro ao gerar SQL.");
                          }
                        }}
                        className="w-full bg-green-600 text-white py-2.5 text-xs font-bold uppercase tracking-wider rounded border border-green-700 hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <HardDriveDownload className="w-4 h-4" />
                        Baixar SQL (.sql)
                      </button>
                    </div>
                  </div>

                  <div className="mt-12 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-md max-w-lg mx-auto text-left">
                    <p className="text-[10px] text-yellow-500 font-bold uppercase mb-1 flex items-center gap-2">
                      <Shield className="w-3 h-3" /> Aviso de Segurança
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Os ficheiros de backup contêm os dados públicos e administrativos do portal. Guarde-os num local seguro e não os partilhe com terceiros não autorizados.
                    </p>
                  </div>
                </div>
              </div>
            )
          }

          {/* Site Settings */}
          {activeTab === "site-settings" && (
            <div className="max-w-4xl mx-auto space-y-8">
              {siteSettingsLoading ? (
                <div className="flex justify-center p-12">
                  <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : (
                <>
                  <div className="bg-card border border-border overflow-hidden">
                    <div className="p-6 border-b border-border">
                      <h3 className="font-heading font-bold text-foreground flex items-center gap-2">
                        <Settings className="w-5 h-5 text-primary" />
                        Identidade Visual
                      </h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Nome do Site</label>
                        <input value={siteSettingsForm.siteName} onChange={e => setSiteSettingsForm(f => ({ ...f, siteName: e.target.value }))} className="w-full bg-secondary border border-border px-3 py-2 text-sm focus:border-primary" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Cor Primária (Tema)</label>
                        <div className="flex gap-2 items-center">
                          <input type="color" value={siteSettingsForm.primaryColor} onChange={e => setSiteSettingsForm(f => ({ ...f, primaryColor: e.target.value }))} className="w-10 h-10 border-0 bg-transparent cursor-pointer" />
                          <input value={siteSettingsForm.primaryColor} onChange={e => setSiteSettingsForm(f => ({ ...f, primaryColor: e.target.value }))} className="w-full bg-secondary border border-border px-3 py-2 text-sm focus:border-primary font-mono" />
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Logótipo do Site</label>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1">
                            <input type="file" accept="image/*" onChange={e => setLogoFile(e.target.files?.[0] || null)} className="w-full bg-secondary border border-border px-3 py-2 text-sm file:bg-primary file:text-primary-foreground file:border-0 file:px-3 file:py-1 file:mr-4 file:text-xs file:font-bold file:cursor-pointer p-0" />
                          </div>
                          <div className="flex-1">
                            <input value={siteSettingsForm.logoUrl} onChange={e => setSiteSettingsForm(f => ({ ...f, logoUrl: e.target.value }))} className="w-full bg-secondary border border-border px-3 py-2 text-sm focus:border-primary" placeholder="Ou cole o URL..." />
                          </div>
                        </div>
                        {(logoFile || siteSettingsForm.logoUrl) && (
                          <div className="mt-4 p-4 border border-dashed border-border bg-black rounded w-max">
                            <img src={logoFile ? URL.createObjectURL(logoFile) : siteSettingsForm.logoUrl} alt="Logo Preview" className="h-10 object-contain" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-card border border-border overflow-hidden">
                    <div className="p-6 border-b border-border">
                      <h3 className="font-heading font-bold text-foreground flex items-center gap-2">
                        <Globe className="w-5 h-5 text-blue-500" />
                        Redes Sociais
                      </h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">URL Facebook</label>
                        <input value={siteSettingsForm.facebookUrl} onChange={e => setSiteSettingsForm(f => ({ ...f, facebookUrl: e.target.value }))} className="w-full bg-secondary border border-border px-3 py-2 text-sm focus:border-primary" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">URL Instagram</label>
                        <input value={siteSettingsForm.instagramUrl} onChange={e => setSiteSettingsForm(f => ({ ...f, instagramUrl: e.target.value }))} className="w-full bg-secondary border border-border px-3 py-2 text-sm focus:border-primary" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">URL YouTube</label>
                        <input value={siteSettingsForm.youtubeUrl} onChange={e => setSiteSettingsForm(f => ({ ...f, youtubeUrl: e.target.value }))} className="w-full bg-secondary border border-border px-3 py-2 text-sm focus:border-primary" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-card border border-border overflow-hidden">
                    <div className="p-6 border-b border-border">
                      <h3 className="font-heading font-bold text-foreground flex items-center gap-2">
                        <Mail className="w-5 h-5 text-green-500" />
                        Contactos e Rodapé
                      </h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Email de Redacção</label>
                        <input value={siteSettingsForm.contactEmail} onChange={e => setSiteSettingsForm(f => ({ ...f, contactEmail: e.target.value }))} className="w-full bg-secondary border border-border px-3 py-2 text-sm focus:border-primary" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Número de WhatsApp</label>
                        <input value={siteSettingsForm.whatsappNumber} onChange={e => setSiteSettingsForm(f => ({ ...f, whatsappNumber: e.target.value }))} className="w-full bg-secondary border border-border px-3 py-2 text-sm focus:border-primary" placeholder="+244..." />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Texto de Direitos Autorais (Copyright)</label>
                        <input value={siteSettingsForm.copyrightText} onChange={e => setSiteSettingsForm(f => ({ ...f, copyrightText: e.target.value }))} className="w-full bg-secondary border border-border px-3 py-2 text-sm focus:border-primary" placeholder="Portal Sem Filtros." />
                        <p className="text-[10px] text-muted-foreground mt-1">O ano é atualizado automaticamente.</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Chave de API Gemini (Editor-Chefe Inteligente)</label>
                        <input type="password" value={siteSettingsForm.geminiApiKey} onChange={e => setSiteSettingsForm(f => ({ ...f, geminiApiKey: e.target.value }))} className="w-full bg-secondary border border-border px-3 py-2 text-sm focus:border-primary font-mono" placeholder="AQ.Ab8RN..." />
                        <p className="text-[10px] text-muted-foreground mt-1">Insira a chave obtida no Google AI Studio. Esta chave será usada no servidor de produção de forma segura para reescrever as notícias livre de bloqueios CORS do navegador.</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Token / Chave de API Puter.js (Fallback de IA)</label>
                        <input type="password" value={siteSettingsForm.puterApiKey} onChange={e => setSiteSettingsForm(f => ({ ...f, puterApiKey: e.target.value }))} className="w-full bg-secondary border border-border px-3 py-2 text-sm focus:border-primary font-mono" placeholder="eyJhbGciOiJIUzI1Ni..." />
                        <p className="text-[10px] text-muted-foreground mt-1">Token de autenticação do Puter.js utilizado como sistema de reserva (fallback) client-side quando a API Gemini não estiver configurada no servidor.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleSaveSiteSettings}
                      disabled={savingSiteSettings}
                      className="bg-primary text-primary-foreground px-8 py-3 font-semibold uppercase tracking-wider hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-2"
                    >
                      <Check className="w-5 h-5" />
                      {savingSiteSettings ? "A Guardar..." : "Salvar Configurações"}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

        </div >
      </main >
    </div >
  );
};

export default AdminPage;
