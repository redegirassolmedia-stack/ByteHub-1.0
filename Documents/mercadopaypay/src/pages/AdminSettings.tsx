import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Save, Globe, Shield, Zap, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

const AdminSettings = () => {
    const queryClient = useQueryClient();
    const [settingsState, setSettingsState] = useState<any>(null);

    const { data: settings, isLoading } = useQuery<any>({
        queryKey: ["admin-settings"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("system_settings" as any)
                .select("*")
                .single();

            if (error) throw error;
            return data;
        }
    });

    useEffect(() => {
        if (settings) {
            setSettingsState(settings);
        }
    }, [settings]);

    const saveMutation = useMutation({
        mutationFn: async (newSettings: any) => {
            const { error } = await supabase
                .from("system_settings" as any)
                .update(newSettings)
                .eq("id", settings?.id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
            toast.success("Configurações salvas com sucesso!");
        },
        onError: (error: any) => {
            toast.error("Erro ao salvar: " + error.message);
        }
    });

    const handleSave = () => {
        saveMutation.mutate(settingsState);
    };

    if (isLoading || !settingsState) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-[60vh]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-4xl space-y-8">
                <Tabs defaultValue="geral" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-8">
                        <TabsTrigger value="geral" className="gap-2">
                            <Globe className="h-4 w-4" />
                            Geral
                        </TabsTrigger>
                        <TabsTrigger value="seguranca" className="gap-2">
                            <Shield className="h-4 w-4" />
                            Segurança
                        </TabsTrigger>
                        <TabsTrigger value="performance" className="gap-2">
                            <Zap className="h-4 w-4" />
                            Performance
                        </TabsTrigger>
                        <TabsTrigger value="anuncios" className="gap-2">
                            <Save className="h-4 w-4" />
                            Anúncios
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="geral" className="space-y-6">
                        <div className="bg-card border rounded-xl p-6 space-y-6">
                            <div className="space-y-4">
                                <h3 className="font-bold text-lg">Preferências do Site</h3>
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="site-name">Nome do Site</Label>
                                        <Input
                                            id="site-name"
                                            value={settingsState.site_name}
                                            onChange={(e) => setSettingsState({ ...settingsState, site_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="support-email">Email de Suporte</Label>
                                        <Input
                                            id="support-email"
                                            value={settingsState.support_email}
                                            onChange={(e) => setSettingsState({ ...settingsState, support_email: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="font-bold text-lg">Funcionalidades</h3>
                                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                                    <div className="space-y-1">
                                        <Label className="text-base">Aprovação Automática</Label>
                                        <p className="text-sm text-muted-foreground">Aprovar novos anúncios automaticamente sem moderação.</p>
                                    </div>
                                    <Switch
                                        checked={settingsState.auto_approve_listings}
                                        onCheckedChange={(checked) => setSettingsState({ ...settingsState, auto_approve_listings: checked })}
                                    />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                                    <div className="space-y-1">
                                        <Label className="text-base">Chat Interno</Label>
                                        <p className="text-sm text-muted-foreground">Habilitar sistema de mensagens entre compradores e vendedores.</p>
                                    </div>
                                    <Switch
                                        checked={settingsState.enable_chat}
                                        onCheckedChange={(checked) => setSettingsState({ ...settingsState, enable_chat: checked })}
                                    />
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="seguranca" className="space-y-6">
                        <div className="bg-card border rounded-xl p-6">
                            <h3 className="font-bold text-lg mb-6">Políticas de Segurança</h3>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label className="text-base">Verificação de Email</Label>
                                        <p className="text-sm text-muted-foreground">Exigir que usuários confirmem o email antes de anunciar.</p>
                                    </div>
                                    <Switch
                                        checked={settingsState.require_email_verification}
                                        onCheckedChange={(checked) => setSettingsState({ ...settingsState, require_email_verification: checked })}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label className="text-base">Autenticação de Dois Fatores (2FA)</Label>
                                        <p className="text-sm text-muted-foreground">Habilitar 2FA para contas administrativas.</p>
                                    </div>
                                    <Switch
                                        checked={settingsState.enable_2fa_admin}
                                        onCheckedChange={(checked) => setSettingsState({ ...settingsState, enable_2fa_admin: checked })}
                                    />
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="performance" className="space-y-6">
                        <div className="bg-card border rounded-xl p-6 space-y-6">
                            <h3 className="font-bold text-lg">Otimização</h3>
                            <div className="grid gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="carousel-speed">Velocidade do Carrossel Principal (ms)</Label>
                                    <Input
                                        id="carousel-speed"
                                        type="number"
                                        value={settingsState.carousel_speed_ms}
                                        onChange={(e) => setSettingsState({ ...settingsState, carousel_speed_ms: parseInt(e.target.value) })}
                                    />
                                    <p className="text-xs text-muted-foreground">Tempo de transição entre os banners principais da home.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cache-ttl">Tempo de Cache (segundos)</Label>
                                    <Input
                                        id="cache-ttl"
                                        type="number"
                                        value={settingsState.cache_ttl_seconds}
                                        onChange={(e) => setSettingsState({ ...settingsState, cache_ttl_seconds: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="anuncios" className="space-y-6">
                        <div className="bg-card border rounded-xl p-6 space-y-6">
                            <h3 className="font-bold text-lg">Configurações de Publicidade</h3>
                            <div className="grid gap-6">
                                <div className="space-y-4">
                                    <h4 className="font-bold text-sm text-primary uppercase tracking-wider">Slot: Carrossel Home</h4>
                                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                                        <div className="space-y-1">
                                            <Label className="text-base">Habilitar Carrossel</Label>
                                            <p className="text-sm text-muted-foreground">Exibir o carrossel de publicidade na página inicial.</p>
                                        </div>
                                        <Switch
                                            checked={settingsState.enable_home_ads_carousel ?? true}
                                            onCheckedChange={(checked) => setSettingsState({ ...settingsState, enable_home_ads_carousel: checked })}
                                        />
                                    </div>
                                    <div className="space-y-2 px-4">
                                        <Label htmlFor="home-ads-speed">Velocidade (ms)</Label>
                                        <Input
                                            id="home-ads-speed"
                                            type="number"
                                            value={settingsState.home_ads_carousel_speed ?? 5000}
                                            onChange={(e) => setSettingsState({ ...settingsState, home_ads_carousel_speed: parseInt(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t">
                                    <h4 className="font-bold text-sm text-primary uppercase tracking-wider">Slot: Barra Lateral</h4>
                                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                                        <div className="space-y-1">
                                            <Label className="text-base">Habilitar Anúncios na Sidebar</Label>
                                            <p className="text-sm text-muted-foreground">Exibir banners de publicidade na lateral das listagens.</p>
                                        </div>
                                        <Switch
                                            checked={settingsState.enable_sidebar_ads ?? true}
                                            onCheckedChange={(checked) => setSettingsState({ ...settingsState, enable_sidebar_ads: checked })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-4">
                    <Button variant="outline" onClick={() => setSettingsState(settings)}>Cancelar</Button>
                    <Button
                        className="gap-2"
                        onClick={handleSave}
                        disabled={saveMutation.isPending}
                    >
                        {saveMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        {saveMutation.isPending ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminSettings;

