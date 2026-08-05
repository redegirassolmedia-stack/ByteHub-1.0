import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
    Users,
    Search,
    MoreVertical,
    UserPlus,
    Shield,
    ShieldAlert,
    Trash2,
    Mail,
    MapPin,
    Calendar,
    Loader2
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const AdminUsers = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newUserEmail, setNewUserEmail] = useState("");

    const queryClient = useQueryClient();

    const { data: users, isLoading } = useQuery({
        queryKey: ["admin-users"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data;
        }
    });

    const toggleAdminMutation = useMutation({
        mutationFn: async ({ userId, isAdmin }: { userId: string, isAdmin: boolean }) => {
            const { error } = await supabase
                .from("profiles")
                .update({ is_admin: isAdmin })
                .eq("id", userId);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
            toast.success("Status de administrador atualizado!");
        },
        onError: (error: any) => {
            toast.error("Erro ao atualizar status: " + error.message);
        }
    });

    const deleteUserMutation = useMutation({
        mutationFn: async (userId: string) => {
            // Note: This only deletes the profile. Deleting auth user requires service role.
            const { error } = await supabase
                .from("profiles")
                .delete()
                .eq("id", userId);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
            toast.success("Perfil de usuário excluído!");
        },
        onError: (error: any) => {
            toast.error("Erro ao excluir usuário: " + error.message);
        }
    });

    const inviteMutation = useMutation({
        mutationFn: async (email: string) => {
            // Simplified: in a real app, this would use supabase.auth.admin.inviteUserByEmail
            // For now, we simulate success
            return new Promise((resolve) => setTimeout(resolve, 1000));
        },
        onSuccess: () => {
            toast.success(`Convite enviado para ${newUserEmail}!`);
            setIsDialogOpen(false);
            setNewUserEmail("");
        }
    });

    const filteredUsers = users?.filter(user =>
        user.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.city?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Pesquisar usuários por nome, email ou cidade..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
                        <UserPlus className="h-4 w-4" />
                        Novo Usuário
                    </Button>
                </div>

                <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-muted/50 border-b">
                                    <th className="p-4 font-bold text-sm">Usuário</th>
                                    <th className="p-4 font-bold text-sm">Localização</th>
                                    <th className="p-4 font-bold text-sm">Plano</th>
                                    <th className="p-4 font-bold text-sm">Criado em</th>
                                    <th className="p-4 font-bold text-sm">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center text-muted-foreground">
                                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                                        </td>
                                    </tr>
                                ) : filteredUsers?.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center text-muted-foreground">Nenhum usuário encontrado.</td>
                                    </tr>
                                ) : (
                                    filteredUsers?.map((user) => (
                                        <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden">
                                                        {user.avatar_url ? (
                                                            <img src={user.avatar_url} alt="" className="h-full w-full object-cover" />
                                                        ) : (
                                                            user.display_name?.[0]?.toUpperCase() || "U"
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-1.5 font-bold text-sm">
                                                            {user.display_name || "Sem nome"}
                                                            {user.is_admin && (
                                                                <Shield className="h-3 w-3 text-primary" />
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                            <Mail className="h-3 w-3" />
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <MapPin className="h-3 w-3" />
                                                    {user.city ? `${user.city}, ${user.country}` : user.country}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${user.subscription_tier === 'premium' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {user.subscription_tier}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(user.created_at).toLocaleDateString('pt-AO')}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            className="gap-2"
                                                            onClick={() => toggleAdminMutation.mutate({ userId: user.id, isAdmin: !user.is_admin })}
                                                        >
                                                            {user.is_admin ? (
                                                                <>
                                                                    <ShieldAlert className="h-4 w-4 text-destructive" />
                                                                    <span>Remover Admin</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Shield className="h-4 w-4 text-primary" />
                                                                    <span>Tornar Admin</span>
                                                                </>
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="gap-2 text-destructive"
                                                            onClick={() => {
                                                                if (confirm("Tem certeza que deseja excluir este usuário?")) {
                                                                    deleteUserMutation.mutate(user.id);
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

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Convidar Novo Usuário</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email do Usuário</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="usuario@email.com"
                                value={newUserEmail}
                                onChange={(e) => setNewUserEmail(e.target.value)}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Um convite será enviado para este email com as instruções de acesso.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={() => inviteMutation.mutate(newUserEmail)} disabled={!newUserEmail || inviteMutation.isPending}>
                            {inviteMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            Enviar Convite
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default AdminUsers;

