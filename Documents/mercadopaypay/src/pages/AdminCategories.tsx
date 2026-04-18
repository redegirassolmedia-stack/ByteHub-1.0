import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
    Tag,
    Plus,
    Search,
    Edit2,
    Trash2,
    Image as ImageIcon,
    ChevronRight
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

const AdminCategories = () => {
    const [searchTerm, setSearchTerm] = useState("");
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
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Nova Categoria
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {isLoading ? (
                        <div className="col-span-full p-12 text-center text-muted-foreground">Carregando categorias...</div>
                    ) : filteredCategories?.length === 0 ? (
                        <div className="col-span-full p-12 text-center text-muted-foreground">Nenhuma categoria encontrada.</div>
                    ) : (
                        filteredCategories?.map((category) => (
                            <div key={category.id} className="bg-card border rounded-xl p-4 flex items-center justify-between hover:shadow-sm transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                        {/* Assuming icon name maps to lucide icons, for now just a placeholder */}
                                        <Tag className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm">{category.name}</h4>
                                        <p className="text-xs text-muted-foreground">{category.slug}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminCategories;
