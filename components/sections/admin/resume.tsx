"use client";

import { FileText, Upload, Trash2, Globe, CheckCircle, AlertCircle, Loader2, Eye, ToggleLeft, ToggleRight } from "lucide-react";
import { uploadAndSaveResume, deleteResume, toggleResumeActive } from "@/utils/actions/resume";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, Badge, Switch, Label } from "@/components/index";
import type { Resumes } from "@/utils/supabase/types";
import { useRef, useState } from "react";

const RESUME_LANGUAGES = [
    { language: "pt-BR", label: "Português (PT-BR)", flag: "🇧🇷", color: "text-green-400", border: "border-green-500/30", bg: "bg-green-900/20" },
    { language: "en",    label: "English (EN)",      flag: "🇺🇸", color: "text-blue-400",  border: "border-blue-500/30",  bg: "bg-blue-900/20"  },
] as const;

type FeedbackState = { type: "success" | "error"; message: string } | null;

interface ResumeManagerProps {
    initialResumes: Resumes[];
}

interface LanguageCardProps {
    config: typeof RESUME_LANGUAGES[number];
    resume: Resumes | undefined;
    onUpload: (language: string, label: string, file: File) => Promise<void>;
    onDelete: (id: string, language: string) => Promise<void>;
    onToggle: (id: string, isActive: boolean) => Promise<void>;
    uploading: boolean;
    feedback: FeedbackState;
}

function LanguageCard({ config, resume, onUpload, onDelete, onToggle, uploading, feedback }: LanguageCardProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);

    const handleFile = async (file: File) => {
        if (file.type !== "application/pdf") return;
        await onUpload(config.language, config.label.split(" ")[0], file);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) await handleFile(file);
    };

    return (
        <Card className={`bg-gray-800/50 border-gray-700 backdrop-blur-sm transition-all duration-300 hover:border-gray-600`}>
            <CardHeader className="pb-3">
                <CardTitle className={`text-base font-semibold flex items-center gap-2 ${config.color}`}>
                    <span className="text-xl">{config.flag}</span>
                    {config.label}
                    {resume ? (
                        <Badge className="ml-auto bg-green-600/20 text-green-400 border-green-500/30 text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" /> Ativo
                        </Badge>
                    ) : (
                        <Badge className="ml-auto bg-gray-600/20 text-gray-400 border-gray-500/30 text-xs">
                            Não configurado
                        </Badge>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Current file info */}
                {resume && (
                    <div className={`p-3 rounded-lg ${config.bg} border ${config.border}`}>
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                                <FileText className={`w-4 h-4 flex-shrink-0 ${config.color}`} />
                                <div className="min-w-0">
                                    <p className="text-sm text-white font-medium truncate">{resume.file_name}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        Atualizado em {new Date(resume.updated_at).toLocaleDateString("pt-BR")}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <a
                                    href={resume.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Visualizar PDF"
                                >
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                </a>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                    onClick={() => onDelete(resume.id, resume.language)}
                                    title="Deletar currículo"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        {/* Active toggle */}
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-700/50">
                            <Switch
                                id={`active-${config.language}`}
                                checked={resume.is_active}
                                onCheckedChange={(checked) => onToggle(resume.id, checked)}
                            />
                            <Label htmlFor={`active-${config.language}`} className="text-xs text-gray-400 cursor-pointer">
                                {resume.is_active ? "Visível no site" : "Oculto do site"}
                            </Label>
                        </div>
                    </div>
                )}

                {/* Upload drop zone */}
                <div
                    className={`
                        relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer
                        ${dragging
                            ? `${config.border} bg-gray-700/50 scale-[1.01]`
                            : "border-gray-600 hover:border-gray-500 hover:bg-gray-700/20"
                        }
                        ${uploading ? "opacity-50 pointer-events-none" : ""}
                    `}
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) await handleFile(file);
                            e.target.value = ""; // reset so same file can be re-uploaded
                        }}
                    />
                    {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className={`w-6 h-6 animate-spin ${config.color}`} />
                            <p className="text-sm text-gray-400">Fazendo upload...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <Upload className={`w-6 h-6 ${config.color}`} />
                            <p className="text-sm text-white font-medium">
                                {resume ? "Substituir currículo" : "Adicionar currículo"}
                            </p>
                            <p className="text-xs text-gray-500">
                                Arraste um PDF aqui ou clique para selecionar • Máx. 5MB
                            </p>
                        </div>
                    )}
                </div>

                {/* Feedback */}
                {feedback && (
                    <div className={`flex items-center gap-2 p-2 rounded-lg text-xs ${
                        feedback.type === "success"
                            ? "bg-green-900/20 text-green-400 border border-green-500/30"
                            : "bg-red-900/20 text-red-400 border border-red-500/30"
                    }`}>
                        {feedback.type === "success"
                            ? <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                            : <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        }
                        {feedback.message}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export function ResumeManager({ initialResumes }: ResumeManagerProps) {
    const [resumes, setResumes] = useState<Resumes[]>(initialResumes);
    const [uploadingLang, setUploadingLang] = useState<string | null>(null);
    const [feedbacks, setFeedbacks] = useState<Record<string, FeedbackState>>({});

    const showFeedback = (language: string, feedback: FeedbackState) => {
        setFeedbacks((prev) => ({ ...prev, [language]: feedback }));
        if (feedback?.type === "success") {
            setTimeout(() => setFeedbacks((prev) => ({ ...prev, [language]: null })), 4000);
        }
    };

    const handleUpload = async (language: string, label: string, file: File) => {
        setUploadingLang(language);
        setFeedbacks((prev) => ({ ...prev, [language]: null }));

        const form = new FormData();
        form.append("file", file);
        form.append("language", language);
        form.append("label", label);

        const result = await uploadAndSaveResume(form);

        if (result.success) {
            // Optimistically update local state
            setResumes((prev) => {
                const exists = prev.find((r) => r.language === language);
                const now = new Date().toISOString();
                if (exists) {
                    return prev.map((r) =>
                        r.language === language
                            ? { ...r, file_url: result.url, file_name: result.fileName, is_active: true, updated_at: now }
                            : r
                    );
                }
                return [
                    ...prev,
                    {
                        id: crypto.randomUUID(),
                        language,
                        label,
                        file_url: result.url,
                        file_name: result.fileName,
                        is_active: true,
                        created_at: now,
                        updated_at: now,
                    },
                ];
            });
            showFeedback(language, { type: "success", message: "Currículo atualizado com sucesso!" });
        } else {
            showFeedback(language, { type: "error", message: result.error });
        }

        setUploadingLang(null);
    };

    const handleDelete = async (id: string, language: string) => {
        if (!confirm(`Tem certeza que deseja remover o currículo em ${language === "pt-BR" ? "Português" : "Inglês"}?`)) return;

        const result = await deleteResume(id, language);
        if (result.success) {
            setResumes((prev) => prev.filter((r) => r.id !== id));
            showFeedback(language, { type: "success", message: "Currículo removido." });
        } else {
            showFeedback(language, { type: "error", message: result.error });
        }
    };

    const handleToggle = async (id: string, isActive: boolean) => {
        const ok = await toggleResumeActive(id, isActive);
        if (ok) {
            setResumes((prev) =>
                prev.map((r) => (r.id === id ? { ...r, is_active: isActive } : r))
            );
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                    <Globe className="w-6 h-6 text-purple-400" />
                    Gerenciar Currículos
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                    Faça upload dos seus currículos em PT-BR e EN. Eles ficam disponíveis para download na landing page.
                </p>
            </div>

            {/* Cards por idioma */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {RESUME_LANGUAGES.map((config) => (
                    <LanguageCard
                        key={config.language}
                        config={config}
                        resume={resumes.find((r) => r.language === config.language)}
                        onUpload={handleUpload}
                        onDelete={handleDelete}
                        onToggle={handleToggle}
                        uploading={uploadingLang === config.language}
                        feedback={feedbacks[config.language] ?? null}
                    />
                ))}
            </div>

            {/* Info box */}
            <Card className="bg-gray-800/30 border-gray-700/50">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-gray-400 space-y-1">
                            <p className="text-white font-medium">Como funciona</p>
                            <p>• Apenas arquivos PDF são aceitos (máx. 5MB por arquivo).</p>
                            <p>• Cada idioma mantém apenas um currículo ativo. O upload substitui o anterior.</p>
                            <p>• Desativar um idioma o esconde do site sem removê-lo do storage.</p>
                            <p>• As mudanças aparecem no site imediatamente após o upload.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
