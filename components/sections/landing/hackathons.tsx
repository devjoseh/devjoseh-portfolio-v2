"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Calendar, Trophy } from "lucide-react";
import { getHackathons, type Hackathon } from "@/utils/actions/data";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import Image from "next/image";

export function HackathonsSection() {
    const [hackathons, setHackathons] = useState<Hackathon[]>([]);
    const [selectedHackathon, setSelectedHackathon] = useState<Hackathon | null>(null);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [loading, setLoading] = useState(true);

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
                return "bg-yellow-500/80 text-yellow-100 border-yellow-400/80 hover:bg-yellow-400/90 hover:border-yellow-300";
            case "finalist":
                return "bg-blue-500/80 text-blue-100 border-blue-400/80 hover:bg-blue-400/90 hover:border-blue-300";
            default:
                return "bg-purple-500/80 text-purple-100 border-purple-400/80 hover:bg-purple-400/90 hover:border-purple-300";
        }
    };

    const openModal = (hackathon: Hackathon) => {
        setSelectedHackathon(hackathon);
        setCurrentPhotoIndex(0);
    };

    const closeModal = () => {
        setSelectedHackathon(null);
        setCurrentPhotoIndex(0);
    };

    const nextPhoto = () => {
        if (selectedHackathon) {
            setCurrentPhotoIndex(
                (prev) => (prev + 1) % selectedHackathon.photos.length
            );
        }
    };

    const prevPhoto = () => {
        if (selectedHackathon) {
            setCurrentPhotoIndex(
                (prev) =>
                    (prev - 1 + selectedHackathon.photos.length) %
                    selectedHackathon.photos.length
            );
        }
    };

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
        <section className="py-16 md:py-20 bg-gray-900">
            <div className="container mx-auto px-0">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                        Hackathons
                    </h2>
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-4">
                        Experiências em competições de programação,
                        desenvolvendo soluções inovadoras em tempo limitado.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                    {hackathons.map((hackathon, index) => (
                        <Card
                            key={hackathon.id}
                            className="bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-black/20 cursor-pointer relative overflow-hidden"
                            style={{ animationDelay: `${index * 0.1}s` }}
                            onClick={() => openModal(hackathon)}
                        >
                            {/* Placement Badge */}
                            <Badge
                                className={`absolute top-4 right-4 z-10 ${getPlacementColor(
                                    hackathon.placementType
                                )} font-semibold backdrop-blur-sm transition-all duration-300`}
                            >
                                {hackathon.placement}
                            </Badge>

                            <CardHeader className="pb-4">
                                <div className="w-full h-48 md:h-56 bg-gradient-to-br from-purple-900/20 to-gray-800 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                                    <Image
                                        src={
                                            hackathon.coverImage ||
                                            "/placeholder.svg"
                                        }
                                        alt={hackathon.title}
                                        width={400}
                                        height={300}
                                        className="rounded-lg object-cover w-full h-full transition-transform duration-300 hover:scale-110"
                                        loading="lazy"
                                    />
                                </div>
                                <CardTitle className="text-white text-lg md:text-xl line-clamp-2">
                                    {hackathon.title}
                                </CardTitle>
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <Calendar className="w-4 h-4" />
                                    <span>{hackathon.date}</span>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>

                {/* Modal */}
                <Dialog open={!!selectedHackathon} onOpenChange={closeModal}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700 text-white rounded-lg md:rounded-lg">
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
                                {/* Close button */}
                                {/* Result Highlight */}
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

                                {/* Cover Image */}
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

                                {/* Photo Carousel */}
                                {selectedHackathon.photos.length > 0 && (
                                    <div>
                                        <h3 className="text-xl font-semibold mb-4 text-white">
                                            Galeria de Fotos
                                        </h3>
                                        <div className="relative">
                                            <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden bg-gray-900">
                                                <Image
                                                    src={
                                                        selectedHackathon
                                                            .photos[
                                                            currentPhotoIndex
                                                        ].url ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt={
                                                        selectedHackathon
                                                            .photos[
                                                            currentPhotoIndex
                                                        ].alt
                                                    }
                                                    width={800}
                                                    height={400}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                            </div>

                                            {/* Navigation Buttons */}
                                            {selectedHackathon.photos.length >
                                                1 && (
                                                <>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-900/80 border-gray-600 hover:bg-gray-800"
                                                        onClick={prevPhoto}
                                                    >
                                                        <ChevronLeft className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-900/80 border-gray-600 hover:bg-gray-800"
                                                        onClick={nextPhoto}
                                                    >
                                                        <ChevronRight className="w-4 h-4" />
                                                    </Button>
                                                </>
                                            )}

                                            {/* Photo Indicators */}
                                            {selectedHackathon.photos.length >
                                                1 && (
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
                                                                }`}
                                                                onClick={() =>
                                                                    setCurrentPhotoIndex(
                                                                        index
                                                                    )
                                                                }
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
            </div>
        </section>
    );
}
