"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormMessage, SubmitButton, Input, Label } from "@/components/index";
import { useState, useCallback, useTransition, useMemo } from "react";
import { signIn } from "@/utils/actions/sign-in";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const Turnstile = dynamic(() => import("react-turnstile"), {
    ssr: false,
    loading: () => <div className="h-16 flex items-center justify-center text-sm text-muted-foreground">Carregando captcha...</div>
});

const TURNSTILE_CONFIG = {
    sitekey: process.env.NEXT_PUBLIC_SITE_KEY!,
    theme: "dark" as const
};

const INITIAL_FORM_DATA = {
    email: "",
    password: ""
};

export default function SignInClient() {
    const [formError, setFormError] = useState<string | null>(null);
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const [turnstileKey, setTurnstileKey] = useState<number>(Date.now());
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [isPending, startTransition] = useTransition();
    
    const router = useRouter();

    const handleTurnstileSuccess = useCallback((token: string) => {
        setTurnstileToken(token);
        setFormError(null);
    }, []);

    const handleTurnstileError = useCallback(() => {
        setFormError("Erro ao validar captcha");
        setTurnstileToken(null);
    }, []);

    const handleTurnstileExpire = useCallback(() => {
        setTurnstileToken(null);
    }, []);

    const resetTurnstile = useCallback(() => {
        const newKey = Date.now();
        setTurnstileKey(newKey);
        setTurnstileToken(null);
    }, []);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (formError) {
            setFormError(null);
        }
    }, [formError]);

    const handleSubmit = useCallback(async (formDataObj: FormData) => {
        if (!turnstileToken) {
            setFormError("Aguarde a validação do captcha");
            return;
        }

        if (!formData.email.trim()) {
            setFormError("Email é obrigatório");
            return;
        }

        if (!formData.password.trim()) {
            setFormError("Senha é obrigatória");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setFormError("Email inválido");
            return;
        }

        setFormError(null);

        startTransition(async () => {
            try {
                formDataObj.append("turnstileToken", turnstileToken);
                const result = await signIn(formDataObj);

                resetTurnstile();

                if (result.success) {
                    setFormData(INITIAL_FORM_DATA);
                    router.replace("/admin");
                } else {
                    setFormError(result.message as string);
                }
            } catch (_error) {
                setFormError("Erro interno. Tente novamente.");
                resetTurnstile();
            }
        });
    }, [turnstileToken, formData.email, formData.password, router, resetTurnstile]);

    // Separar a key das outras props para evitar o erro do React
    const turnstileProps = useMemo(() => ({
        ...TURNSTILE_CONFIG,
        onSuccess: handleTurnstileSuccess,
        onError: handleTurnstileError,
        onExpire: handleTurnstileExpire
    }), [handleTurnstileSuccess, handleTurnstileError, handleTurnstileExpire]);

    const isFormDisabled = isPending || !turnstileToken;

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-6 relative bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text">
            <Card className="w-full max-w-md z-10 bg-background/80 backdrop-blur-md border-primary/20">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        Painel Administrativo
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="flex-1 flex flex-col min-w-64">
                        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-4">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Seu email"
                                required
                                autoComplete="email"
                                disabled={isPending}
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                            <div className="flex justify-between items-center">
                                <Label htmlFor="password">Senha</Label>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Sua senha"
                                required
                                autoComplete="current-password"
                                disabled={isPending}
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                            <div className="my-4 flex justify-center">
                                <Turnstile 
                                    key={turnstileKey}
                                    {...turnstileProps} 
                                />
                            </div>
                            <SubmitButton
                                pendingText="Entrando..."
                                formAction={handleSubmit}
                                disabled={isFormDisabled}
                            >
                                Entrar
                            </SubmitButton>
                            <FormMessage message={formError ? { error: formError } : null} />
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}