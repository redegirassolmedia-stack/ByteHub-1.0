import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
    Package,
    Search,
    MoreVertical,
    CheckCircle2,
    XCircle,
    Trash2,
    ExternalLink,
    MapPin,
    Tag,
    Clock
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AdminListings = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const queryClient = useQueryClient();

    const { data: listings, isLoading } = useQuery({
        queryKey: ["admin-listings"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("listings")
                .select("*, profiles(display_name, email), categories(name)")
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data;
        }
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string, status: string }) => {
            const { error } = await supabase
                .from("listings")
                .update({ status })
                .eq("id", id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-listings"] });
            toast.success("Status do anúncio atualizado!");
        },
        onError: (error) => {
            toast.error("Erro ao atualizar status: " + error.message);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from("listings")
                .delete()
                .eq("id", id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-listings"] });
            toast.success("Anúncio excluído com sucesso!");
        },
        onError: (error) => {
            toast.error("Erro ao excluir: " + error.message);
        }
    });

    const filteredListings = listings?.filter(item =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.profiles?.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.city?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Pesquisar anúncios por título, vendedor ou cidade..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">Pendentes</Button>
                        <Button variant="outline" size="sm">Ativos</Button>
                    </div>
                </div>

                <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-muted/50 border-b">
                                    <th className="p-4 font-bold text-sm">Anúncio</th>
                                    <th className="p-4 font-bold text-sm">Vendedor</th>
                                    <th className="p-4 font-bold text-sm">Categoria</th>
                                    <th className="p-4 font-bold text-sm">Preço</th>
                                    <th className="p-4 font-bold text-sm">Status</th>
                                    <th className="p-4 font-bold text-sm">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="p-12 text-center text-muted-foreground">Carregando anúncios...</td>
                                    </tr>
                                ) : filteredListings?.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-12 text-center text-muted-foreground">Nenhum anúncio encontrado.</td>
                                    </tr>
                                ) : (
                                    filteredListings?.map((listing) => (
                                        <tr key={listing.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
                                                        {listing.images?.[0] ? (
                                                            <img src={listing.images[0]} alt="" className="h-full w-full object-cover" />
                                                        ) : (
                                                            <Package className="h-6 w-6 text-muted-foreground" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-sm line-clamp-1">{listing.title}</div>
                                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                            <MapPin className="h-3 w-3" />
                                                            {listing.city}, {listing.country}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-sm">
                                                    <p className="font-medium text-foreground">{listing.profiles?.display_name || "Usuário"}</p>
                                                    <p className="text-xs text-muted-foreground">{listing.profiles?.email}</p>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <Tag className="h-3 w-3" />
                                                    {listing.categories?.name}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <p className="font-bold text-sm">
                                                    {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(listing.price)}
                                                </p>
                                            </td>
                                            <td className="p-4">
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${listing.status === 'active' ? 'bg-green-100 text-green-700' :
                                                        listing.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {listing.status === 'active' ? 'Ativo' :
                                                        listing.status === 'pending' ? 'Pendente' : 'Inativo'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link to={`/anuncio/${listing.id}`} target="_blank" className="gap-2">
                                                                <ExternalLink className="h-4 w-4" />
                                                                <span>Ver no Site</span>
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="gap-2"
                                                            onClick={() => updateStatusMutation.mutate({ id: listing.id, status: 'active' })}
                                                        >
                                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                            <span>Aprovar</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="gap-2"
                                                            onClick={() => updateStatusMutation.mutate({ id: listing.id, status: 'pending' })}
                                                        >
                                                            <Clock className="h-4 w-4 text-amber-600" />
                                                            <span>Marcar Pendente</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="gap-2 text-destructive"
                                                            onClick={() => {
                                                                if (confirm("Tem certeza que deseja excluir este anúncio?")) {
                                                                    deleteMutation.mutate(listing.id);
                                                                }
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            <span>Excluir</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminListings;
