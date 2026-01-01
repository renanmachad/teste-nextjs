"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LayoutGrid, LogOut, Save } from "lucide-react";
import { useLayoutPreference } from "@/hooks/use-layout-preference";
import { logout } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import type { LayoutType } from "@/lib/types";

export default function AdminPage() {
    const router = useRouter();
    const { layout: currentLayout, isLoading, updateLayout } = useLayoutPreference();
    const [selectedLayout, setSelectedLayout] = useState<LayoutType>("layout-a");
    const [isSaving, setIsSaving] = useState(false);

    // Sync selected layout with current layout when it loads
    useEffect(() => {
        if (!isLoading && currentLayout) {
            setSelectedLayout(currentLayout);
        }
    }, [currentLayout, isLoading]);

    const handleSave = async () => {
        if (selectedLayout === currentLayout) {
            toast.info("O layout já está configurado como selecionado");
            return;
        }

        setIsSaving(true);
        try {
            await updateLayout(selectedLayout);
            toast.success("Layout atualizado com sucesso!");
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Erro ao atualizar layout",
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = () => {
        logout();
        toast.success("Logout realizado com sucesso");
        router.push("/admin/login");
    };

    if (isLoading) {
        return (
            <div className="container mx-auto flex min-h-screen items-center justify-center p-4">
                <div className="text-muted-foreground">Carregando...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto min-h-screen p-4 py-8">
            <div className="mx-auto max-w-2xl">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Painel Administrativo</CardTitle>
                                <CardDescription>
                                    Gerencie as configurações da aplicação
                                </CardDescription>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleLogout}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Sair
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <LayoutGrid className="h-5 w-5 text-muted-foreground" />
                                <h3 className="font-medium text-sm">Layout da Página Inicial</h3>
                            </div>
                            <p className="text-muted-foreground text-xs">
                                Escolha qual layout será exibido na página inicial do portal.
                            </p>

                            <Tabs
                                value={selectedLayout}
                                onValueChange={(value) =>
                                    setSelectedLayout(value as LayoutType)
                                }
                            >
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="layout-a">Layout A (Política)</TabsTrigger>
                                    <TabsTrigger value="layout-b">Layout B (Economia)</TabsTrigger>
                                </TabsList>
                            </Tabs>

                            {currentLayout && (
                                <div className="rounded-md bg-muted/50 px-3 py-2">
                                    <p className="text-muted-foreground text-xs">
                                        Layout atual:{" "}
                                        <span className="font-medium text-foreground">
                                            {currentLayout === "layout-a"
                                                ? "Layout A (Política)"
                                                : "Layout B (Economia)"}
                                        </span>
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 border-t pt-4">
                            <Button
                                variant="outline"
                                onClick={() => router.push("/")}
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={isSaving || selectedLayout === currentLayout}
                            >
                                <Save className="mr-2 h-4 w-4" />
                                {isSaving ? "Salvando..." : "Salvar"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
