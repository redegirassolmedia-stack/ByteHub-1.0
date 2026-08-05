import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
    Tag,
    Plus,
    Search,
    Edit2,
    Trash2,
    Loader2
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const AdminCategories = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [formData, setFormData] = useState({ name: "", slug: "", icon: "tag" });

    const queryClient = useQueryClient();

    const { data: categories, isLoading } = useQuery({
        queryKey: ["admin-categories"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("categories")
                .select("*")
                .order("name", { ascending: true });

            if (error) throw error;
            return data;
        }
    });

    const createMutation = useMutation({
        mutationFn: async (newCat: any) => {
            const { error } = await supabase.from("categories").insert(newCat);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
            toast.success("Categoria criada com sucesso!");
            handleCloseDialog();
        },
        onError: (error: any) => toast.error("Erro ao criar: " + error.message)
    });

    const updateMutation = useMutation({
        mutationFn: async (updatedCat: any) => {
            const { error } = await supabase
                .from("categories")
                .update({ name: updatedCat.name, slug: updatedCat.slug, icon: updatedCat.icon })
                .eq("id", updatedCat.id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
            toast.success("Categoria atualizada com sucesso!");
            handleCloseDialog();
        },
        onError: (error: any) => toast.error("Erro ao atualizar: " + error.message)
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from("categories").delete().eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
            toast.success("Categoria excluída com sucesso!");
        },
        onError: (error: any) => toast.error("Erro ao excluir: " + error.message)
    });

    const handleOpenDialog = (category?: any) => {
        if (category) {
            setEditingCategory(category);
            setFormData({ name: category.name, slug: category.slug, icon: category.icon });
        } else {
            setEditingCategory(null);
            setFormData({ name: "", slug: "", icon: "tag" });
        }
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingCategory(null);
        setFormData({ name: "", slug: "", icon: "tag" });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCategory) {
            updateMutation.mutate({ ...formData, id: editingCategory.id });
        } else {
            createMutation.mutate(formData);
        }
    };

    const filteredCategories = categories?.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Pesquisar categorias..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button className="gap-2" onClick={() => handleOpenDialog()}>
                        <Plus className="h-4 w-4" />
                        Nova Categoria
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {isLoading ? (
                        <div className="col-span-full p-12 text-center">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                        </div>
                    ) : filteredCategories?.length === 0 ? (
                        <div className="col-span-full p-12 text-center text-muted-foreground">Nenhuma categoria encontrada.</div>
                    ) : (
                        filteredCategories?.map((category) => (
                            <div key={category.id} className="bg-card border rounded-xl p-4 flex items-center justify-between hover:shadow-sm transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                        <Tag className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm">{category.name}</h4>
                                        <p className="text-xs text-muted-foreground">{category.slug}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenDialog(category)}>
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => {
                                            if (confirm("Tem certeza que deseja excluir esta categoria?")) {
                                                deleteMutation.mutate(category.id);
                                            }
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingCategory ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug</Label>
                            <Input id="slug" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="icon">Ícone (nome lucide)</Label>
                            <Input id="icon" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} required />
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={handleCloseDialog}>Cancelar</Button>
                            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                                {createMutation.isPending || updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                {editingCategory ? "Salvar Alterações" : "Criar Categoria"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default AdminCategories;

