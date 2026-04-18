import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, X, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import { useSubscription } from "@/hooks/useSubscription";

const CreateListingPage = () => {
  const { user } = useAuth();
  const { hasAccess, loading: subLoading } = useSubscription();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category_id: "",
    city: "",
    state: "",
  });

  useEffect(() => {
    supabase.from("categories").select("id, name").then(({ data }) => {
      if (data) setCategories(data);
    });
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 6) {
      toast.error("Máximo de 6 imagens");
      return;
    }
    setImages((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => setPreviews((prev) => [...prev, e.target?.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || subLoading) return;
    setLoading(true);

    try {
      // Check publishing limit for non-premium users
      if (!hasAccess) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { count, error: countError } = await supabase
          .from("listings")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .gte("created_at", today.toISOString());

        if (countError) throw countError;

        if (count && count >= 1) {
          toast.error("Limite diário atingido! Faça upgrade para Premium para publicar ilimitado.");
          navigate("/planos");
          return;
        }
      }

      // Upload images
      const imageUrls: string[] = [];
      for (const file of images) {
        const ext = file.name.split(".").pop();
        const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from("listings").upload(path, file);
        if (error) throw error;
        const { data: urlData } = supabase.storage.from("listings").getPublicUrl(path);
        imageUrls.push(urlData.publicUrl);
      }

      // Get seller's country
      const { data: profileData } = await supabase
        .from("profiles")
        .select("country")
        .eq("user_id", user.id)
        .single();

      const { error } = await supabase.from("listings").insert({
        user_id: user.id,
        title: form.title,
        description: form.description,
        price: parseFloat(form.price),
        category_id: form.category_id,
        city: form.city,
        state: form.state,
        country: profileData?.country || "Angola",
        images: imageUrls,
        status: "active",
      });

      if (error) throw error;
      toast.success("Anúncio criado com sucesso!");
      navigate("/meus-anuncios");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-2xl py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>
        <h1 className="text-2xl font-extrabold mb-6">Criar anúncio</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Images */}
          <div>
            <Label>Fotos (até 6)</Label>
            <div className="mt-2 grid grid-cols-3 gap-3">
              {previews.map((preview, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border bg-muted">
                  <img src={preview} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 h-6 w-6 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {images.length < 6 && (
                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border hover:border-primary transition-colors">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground mt-1">Adicionar</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" multiple />
                </label>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="title">Título</Label>
            <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex: iPhone 14 Pro Max" required />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descreva seu produto..." rows={4} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Preço (R$)</Label>
              <Input id="price" type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0,00" required />
            </div>
            <div>
              <Label>Categoria</Label>
              <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">Cidade</Label>
              <Input id="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="São Paulo" />
            </div>
            <div>
              <Label htmlFor="state">Estado</Label>
              <Input id="state" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="SP" maxLength={2} />
            </div>
          </div>

          <Button type="submit" className="w-full font-bold" disabled={loading}>
            {loading ? "Publicando..." : "Publicar anúncio"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateListingPage;
