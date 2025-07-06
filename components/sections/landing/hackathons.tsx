"use client";

import { X, ChevronLeft, ChevronRight, Calendar, Trophy, Eye, MousePointer, Sparkles, Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getHackathons, type Hackathon } from "@/utils/actions/data";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createPortal } from "react-dom";
import type React from "react";
import Image from "next/image";

function FullScreenImageViewer({
    imageUrl,
    imageAlt,
    onClose,
}: {
    imageUrl: string;
    imageAlt: string;
    onClose: () => void;
}) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        // Prevent body scroll and ensure proper layering
        const originalOverflow = document.body.style.overflow;
        const originalPosition = document.body.style.position;

        document.body.style.overflow = "hidden";
        document.body.style.position = "relative";

        // Keyboard handling
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                event.stopPropagation();
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown, { capture: true });

        return () => {
            document.body.style.overflow = originalOverflow;
            document.body.style.position = originalPosition;
            document.removeEventListener("keydown", handleKeyDown, {
                capture: true,
            });
            setIsMounted(false);
        };
    }, [onClose]);

    // Secure backdrop click handling
    const handleBackdropClick = useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
            if (event.target === event.currentTarget) {
                event.preventDefault();
                event.stopPropagation();
                onClose();
            }
        },
        [onClose]
    );

    // Prevent image interactions
    const handleImageClick = useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
    }, []);

    // Secure close button handling
    const handleCloseClick = useCallback(
        (event: React.MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();
            onClose();
        },
        [onClose]
    );

    // Don't render on server
    if (!isMounted || typeof window === "undefined") {
        return null;
    }

    const fullScreenContent = (
        <div
            className="fixed inset-0 bg-black/95 flex items-center justify-center p-4"
            style={{
                zIndex: 99999, // Highest z-index to ensure it's above everything
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
            }}
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-label="Full screen image view"
        >
            {/* Close button with maximum z-index */}
            <button
                type="button"
                onClick={handleCloseClick}
                className="absolute top-4 right-4 p-3 rounded-full bg-gray-900/90 hover:bg-gray-800/95 text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-lg"
                style={{ zIndex: 100001 }} // Even higher than the backdrop
                aria-label="Close full screen view"
            >
                <X className="w-6 h-6" />
            </button>

            {/* Zoom out button */}
            <button
                type="button"
                onClick={handleCloseClick}
                className="absolute top-4 left-4 p-3 rounded-full bg-gray-900/90 hover:bg-gray-800/95 text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-lg"
                style={{ zIndex: 100001 }}
                aria-label="Zoom out"
            >
                <Maximize2 className="w-6 h-6 rotate-180" />
            </button>

            {/* Image container */}
            <div
                className="relative max-w-[95vw] max-h-[95vh] flex items-center justify-center"
                style={{ zIndex: 100000 }}
                onClick={handleImageClick}
            >
                <Image
                    src={imageUrl || "/placeholder.svg"}
                    alt={imageAlt}
                    width={1920}
                    height={1080}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    priority
                    quality={90}
                    style={{
                        maxWidth: "95vw",
                        maxHeight: "95vh",
                        userSelect: "none",
                        pointerEvents: "none",
                    }}
                    draggable={false}
                    onError={() =>
                        console.warn("Failed to load full-screen image")
                    }
                />
            </div>

            {/* Instructions */}
            <div
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900/90 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-600/50"
                style={{ zIndex: 100001 }}
            >
                <span className="text-white text-sm font-medium">
                    Press ESC, click X, or click outside to close
                </span>
            </div>
        </div>
    );

    // Use portal to render at document body level with highest z-index
    return createPortal(fullScreenContent, document.body);
}

export function HackathonsSection() {
    const [hackathons, setHackathons] = useState<Hackathon[]>([]);
    const [selectedHackathon, setSelectedHackathon] =
        useState<Hackathon | null>(null);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const [fullScreenImage, setFullScreenImage] = useState<{
        url: string;
        alt: string;
    } | null>(null);

    useEffect(() => {
        const fetchHackathons = async () => {
            try {
                const data = await getHackathons();
                setHackathons(data);
            } catch (error) {
                console.error("Error fetching hackathons:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHackathons();
    }, []);

    const getPlacementColor = (type: string) => {
        switch (type) {
            case "winner":
                return "bg-yellow-500/80 text-yellow-100 border-yellow-400/80 hover:bg-yellow-400/90";
            case "finalist":
                return "bg-blue-500/80 text-blue-100 border-blue-400/80 hover:bg-blue-400/90";
            default:
                return "bg-purple-500/80 text-purple-100 border-purple-400/80 hover:bg-purple-400/90";
        }
    };

    // Modal management - preserve modal state when full-screen is active
    const openModal = useCallback((hackathon: Hackathon) => {
        setSelectedHackathon(hackathon);
        setCurrentPhotoIndex(0);
    }, []);

    const closeModal = useCallback(() => {
        // Only close modal if full-screen is not active
        if (!fullScreenImage) {
            setSelectedHackathon(null);
            setCurrentPhotoIndex(0);
        }
    }, [fullScreenImage]);

    // Force close modal (used when modal dialog itself is closed)
    const forceCloseModal = useCallback(() => {
        setSelectedHackathon(null);
        setCurrentPhotoIndex(0);
        setFullScreenImage(null); // Also close full-screen if open
    }, []);

    // Photo navigation - only when not in full-screen
    const nextPhoto = useCallback(() => {
        if (
            selectedHackathon &&
            selectedHackathon.photos.length > 1 &&
            !fullScreenImage
        ) {
            setCurrentPhotoIndex(
                (prev) => (prev + 1) % selectedHackathon.photos.length
            );
        }
    }, [selectedHackathon, fullScreenImage]);

    const prevPhoto = useCallback(() => {
        if (
            selectedHackathon &&
            selectedHackathon.photos.length > 1 &&
            !fullScreenImage
        ) {
            setCurrentPhotoIndex(
                (prev) =>
                    (prev - 1 + selectedHackathon.photos.length) %
                    selectedHackathon.photos.length
            );
        }
    }, [selectedHackathon, fullScreenImage]);

    // Full-screen image handling - preserves parent modal
    const openFullScreenImage = useCallback(() => {
        if (selectedHackathon && selectedHackathon.photos[currentPhotoIndex]) {
            const photo = selectedHackathon.photos[currentPhotoIndex];
            setFullScreenImage({
                url: photo.url,
                alt: photo.alt,
            });
        }
    }, [selectedHackathon, currentPhotoIndex]);

    const closeFullScreenImage = useCallback(() => {
        setFullScreenImage(null);
        // Parent modal (selectedHackathon) remains open
    }, []);

    // Keyboard navigation for modal (disabled when full-screen is active)
    useEffect(() => {
        if (!selectedHackathon || fullScreenImage) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            switch (event.key) {
                case "ArrowLeft":
                    event.preventDefault();
                    prevPhoto();
                    break;
                case "ArrowRight":
                    event.preventDefault();
                    nextPhoto();
                    break;
                case "Escape":
                    event.preventDefault();
                    closeModal();
                    break;
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [selectedHackathon, fullScreenImage, prevPhoto, nextPhoto, closeModal]);

    // Handle modal dialog open/close - prevent closing when full-screen is active
    const handleModalOpenChange = useCallback(
        (open: boolean) => {
            if (!open) {
                if (fullScreenImage) {
                    // If full-screen is open, close it first but keep modal open
                    setFullScreenImage(null);
                } else {
                    // If full-screen is not open, close the modal
                    forceCloseModal();
                }
            }
        },
        [fullScreenImage, forceCloseModal]
    );

    if (loading) {
        return (
            <section className="py-16 md:py-20 bg-gray-900">
                <div className="container mx-auto px-0">
                    <div className="text-center mb-12 md:mb-16">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                            Hackathons
                        </h2>
                        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-4">
                            Carregando experiências em competições...
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 animate-pulse"
                            >
                                <div className="w-full h-48 md:h-56 bg-gray-700 rounded-lg mb-4" />
                                <div className="h-6 bg-gray-700 rounded mb-2" />
                                <div className="h-4 bg-gray-700 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (hackathons.length === 0) {
        return (
            <section className="py-16 md:py-20 bg-gray-900">
                <div className="container mx-auto px-0">
                    <div className="text-center mb-12 md:mb-16">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                            Hackathons
                        </h2>
                        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-4">
                            Nenhum hackathon encontrado no momento.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <>
            <section className="py-16 md:py-20 bg-gray-900 relative overflow-hidden">
                {/* Background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-20 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/3 rounded-full blur-3xl animate-pulse delay-1000" />
                </div>

                <div className="container mx-auto px-0 relative z-10">
                    <div className="text-center mb-12 md:mb-16">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                            Hackathons
                        </h2>

                        <div className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-400">
                            <MousePointer className="w-4 h-4" />
                            <span>
                                Clique nos cards para ver mais detalhes e fotos
                            </span>
                        </div>
                    </div>

                    {/* Grid container with proper overflow handling */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 relative">
                        {hackathons.map((hackathon, index) => (
                            <div
                                key={hackathon.id}
                                className="relative"
                                style={{ 
                                    zIndex: hoveredCard === hackathon.id ? 20 : 10,
                                    animationDelay: `${index * 0.1}s`
                                }}
                            >
                                <Card
                                    className={`
                                        group relative overflow-hidden cursor-pointer
                                        bg-gray-800/50 border-2 transition-all duration-500 ease-out
                                        ${
                                            hoveredCard === hackathon.id
                                                ? "border-purple-500/70 bg-gray-800/80 shadow-2xl shadow-purple-500/20 scale-[1.02]"
                                                : "border-gray-700/50 hover:border-purple-500/50"
                                        }
                                        transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10
                                    `}
                                    onClick={() => openModal(hackathon)}
                                    onMouseEnter={() =>
                                        setHoveredCard(hackathon.id)
                                    }
                                    onMouseLeave={() => setHoveredCard(null)}
                                >
                                    {/* Sparkle effect */}
                                    <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 z-40">
                                        <Sparkles className="w-5 h-5 text-purple-400" />
                                    </div>

                                    {/* Placement badge */}
                                    <Badge
                                        className={`absolute top-4 right-4 z-40 ${getPlacementColor(
                                            hackathon.placementType
                                        )} font-semibold backdrop-blur-sm transition-all duration-300`}
                                    >
                                        {hackathon.placement}
                                    </Badge>

                                    {/* Click indicator */}
                                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-40">
                                        <div className="bg-gray-900/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-2 border border-purple-500/30">
                                            <Eye className="w-3 h-3 text-purple-400" />
                                            <span className="text-xs text-purple-300 font-medium">
                                                Ver detalhes
                                            </span>
                                        </div>
                                    </div>

                                    <CardHeader className="pb-4 relative z-10">
                                        <div className="w-full h-48 md:h-56 bg-gradient-to-br from-purple-900/20 to-gray-800 rounded-lg mb-4 overflow-hidden relative group/image">
                                            <div className="w-full h-full relative">
                                                <Image
                                                    src={
                                                        hackathon.coverImage ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt={hackathon.title}
                                                    fill
                                                    className="object-cover transition-all duration-700 group-hover:scale-110"
                                                    loading="lazy"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />

                                                {/* Photo count indicator */}
                                                {hackathon.photos.length > 0 && (
                                                    <div className="absolute bottom-3 right-3 bg-gray-900/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                        <div className="w-2 h-2 bg-purple-400 rounded-full" />
                                                        <span className="text-xs text-white font-medium">
                                                            {
                                                                hackathon.photos
                                                                    .length
                                                            }{" "}
                                                            fotos
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <CardTitle className="text-white text-lg md:text-xl line-clamp-2 group-hover:text-purple-300 transition-colors duration-300">
                                            {hackathon.title}
                                        </CardTitle>

                                        <div className="flex items-center gap-2 text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                                            <Calendar className="w-4 h-4 text-purple-400" />
                                            <span>{hackathon.date}</span>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="pt-0 relative z-10">
                                        <p className="text-gray-400 text-sm line-clamp-2 group-hover:text-gray-300 transition-colors duration-300">
                                            {hackathon.description}
                                        </p>

                                        <div className="mt-4 flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-xs text-gray-500 group-hover:text-purple-400 transition-colors duration-300">
                                                <Trophy className="w-3 h-3" />
                                                <span>Competição</span>
                                            </div>

                                            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                                <div className="flex items-center gap-1 text-xs text-purple-400 font-medium">
                                                    <span>
                                                        Clique para explorar
                                                    </span>
                                                    <ChevronRight className="w-3 h-3" />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>

                    {/* Hackathon Details Modal - Standard z-index */}
                    <Dialog
                        open={!!selectedHackathon}
                        onOpenChange={handleModalOpenChange}
                    >
                        <DialogContent
                            className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700 text-white"
                            style={{ zIndex: 50 }} // Standard modal z-index
                        >
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold text-white pr-8">
                                    {selectedHackathon?.title}
                                </DialogTitle>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Calendar className="w-4 h-4" />
                                    <span>{selectedHackathon?.date}</span>
                                </div>
                            </DialogHeader>

                            {selectedHackathon && (
                                <div className="space-y-6">
                                    {/* Result highlight */}
                                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-900/30 to-purple-800/30 rounded-lg border border-purple-500/30">
                                        <Trophy className="w-6 h-6 text-yellow-400" />
                                        <div>
                                            <span className="text-gray-300">
                                                Resultado:{" "}
                                            </span>
                                            <span className="font-semibold text-white">
                                                {selectedHackathon.placement}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Cover image */}
                                    <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden">
                                        <Image
                                            src={
                                                selectedHackathon.coverImage ||
                                                "/placeholder.svg"
                                            }
                                            alt={selectedHackathon.title}
                                            width={800}
                                            height={400}
                                            className="w-full h-full object-cover"
                                            priority
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <h3 className="text-xl font-semibold mb-3 text-white">
                                            Sobre o Projeto
                                        </h3>
                                        <p className="text-gray-300 leading-relaxed">
                                            {selectedHackathon.description}
                                        </p>
                                    </div>

                                    {/* Photo carousel */}
                                    {selectedHackathon.photos.length > 0 && (
                                        <div>
                                            <h3 className="text-xl font-semibold mb-4 text-white">
                                                Galeria de Fotos
                                            </h3>
                                            <div className="relative">
                                                <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden bg-gray-900 relative group">
                                                    {/* Main image with click to expand */}
                                                    <div
                                                        className={`w-full h-full relative ${
                                                            fullScreenImage
                                                                ? "cursor-default"
                                                                : "cursor-pointer"
                                                        }`}
                                                        onClick={
                                                            fullScreenImage
                                                                ? undefined
                                                                : openFullScreenImage
                                                        }
                                                    >
                                                        <Image
                                                            src={
                                                                selectedHackathon
                                                                    .photos[
                                                                    currentPhotoIndex
                                                                ]?.url ||
                                                                "/placeholder.svg"
                                                            }
                                                            alt={
                                                                selectedHackathon
                                                                    .photos[
                                                                    currentPhotoIndex
                                                                ]?.alt ||
                                                                "Hackathon photo"
                                                            }
                                                            width={800}
                                                            height={400}
                                                            className={`w-full h-full object-cover transition-transform duration-300 ${
                                                                fullScreenImage
                                                                    ? ""
                                                                    : "group-hover:scale-105"
                                                            }`}
                                                            loading="lazy"
                                                        />

                                                        {/* Expand indicator - only show when not in full-screen */}
                                                        {!fullScreenImage && (
                                                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                                <div className="bg-gray-900/80 backdrop-blur-sm rounded-full p-2">
                                                                    <Maximize2 className="w-4 h-4 text-white" />
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Click hint - only show when not in full-screen */}
                                                        {!fullScreenImage && (
                                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                                                                <div className="bg-gray-900/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
                                                                    <Maximize2 className="w-4 h-4 text-white" />
                                                                    <span className="text-white text-sm font-medium">
                                                                        Clique
                                                                        para
                                                                        expandir
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Navigation buttons - disabled when full-screen is active */}
                                                    {selectedHackathon.photos
                                                        .length > 1 && (
                                                        <>
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-900/80 border-gray-600 hover:bg-gray-800"
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    prevPhoto();
                                                                }}
                                                                disabled={
                                                                    !!fullScreenImage
                                                                }
                                                            >
                                                                <ChevronLeft className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-900/80 border-gray-600 hover:bg-gray-800"
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    nextPhoto();
                                                                }}
                                                                disabled={
                                                                    !!fullScreenImage
                                                                }
                                                            >
                                                                <ChevronRight className="w-4 h-4" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>

                                                {/* Photo indicators - disabled when full-screen is active */}
                                                {selectedHackathon.photos
                                                    .length > 1 && (
                                                    <div className="flex justify-center gap-2 mt-4">
                                                        {selectedHackathon.photos.map(
                                                            (_, index) => (
                                                                <button
                                                                    key={index}
                                                                    className={`w-2 h-2 rounded-full transition-colors ${
                                                                        index ===
                                                                        currentPhotoIndex
                                                                            ? "bg-purple-500"
                                                                            : "bg-gray-600"
                                                                    } ${
                                                                        fullScreenImage
                                                                            ? "cursor-default"
                                                                            : "cursor-pointer"
                                                                    }`}
                                                                    onClick={
                                                                        fullScreenImage
                                                                            ? undefined
                                                                            : () =>
                                                                                  setCurrentPhotoIndex(
                                                                                      index
                                                                                  )
                                                                    }
                                                                    disabled={
                                                                        !!fullScreenImage
                                                                    }
                                                                    aria-label={`Go to photo ${
                                                                        index +
                                                                        1
                                                                    }`}
                                                                />
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>

                    {/* Full-screen image viewer - Highest z-index with portal */}
                    {fullScreenImage && (
                        <FullScreenImageViewer
                            imageUrl={fullScreenImage.url}
                            imageAlt={fullScreenImage.alt}
                            onClose={closeFullScreenImage}
                        />
                    )}
                </div>
            </section>
        </>
    );
}