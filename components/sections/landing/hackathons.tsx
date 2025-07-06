"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X, ChevronLeft, ChevronRight, Calendar, Trophy, Eye, MousePointer, Sparkles, Maximize2 } from "lucide-react"
import { getHackathons, type Hackathon } from "@/utils/actions/data"

// O componente FullScreenImageViewer foi removido, pois sua lógica foi integrada ao Dialog.

export function HackathonsSection() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([])
  const [selectedHackathon, setSelectedHackathon] = useState<Hackathon | null>(null)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  
  // Este estado agora controla se a visualização de imagem em tela cheia está ativa DENTRO do Dialog
  const [isFullScreen, setIsFullScreen] = useState(false)

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const data = await getHackathons()
        setHackathons(data)
      } catch (error) {
        console.error("Error fetching hackathons:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchHackathons()
  }, [])

  const getPlacementColor = (type: string) => {
    switch (type) {
      case "winner":
        return "bg-yellow-500/80 text-yellow-100 border-yellow-400/80 hover:bg-yellow-400/90"
      case "finalist":
        return "bg-blue-500/80 text-blue-100 border-blue-400/80 hover:bg-blue-400/90"
      default:
        return "bg-purple-500/80 text-purple-100 border-purple-400/80 hover:bg-purple-400/90"
    }
  }

  const openModal = useCallback((hackathon: Hackathon) => {
    setSelectedHackathon(hackathon)
    setCurrentPhotoIndex(0)
    setIsFullScreen(false) // Garante que o modal sempre abra na visualização de detalhes
  }, [])

  const closeModal = useCallback(() => {
    setSelectedHackathon(null)
    setIsFullScreen(false)
  }, [])

  const nextPhoto = useCallback(() => {
    if (selectedHackathon) {
      setCurrentPhotoIndex((prev) => (prev + 1) % selectedHackathon.photos.length)
    }
  }, [selectedHackathon])

  const prevPhoto = useCallback(() => {
    if (selectedHackathon) {
      setCurrentPhotoIndex((prev) => (prev - 1 + selectedHackathon.photos.length) % selectedHackathon.photos.length)
    }
  }, [selectedHackathon])

  // Gerencia o estado de abertura do Dialog
  const handleModalOpenChange = useCallback((open: boolean) => {
    if (!open) {
      closeModal()
    }
  }, [closeModal])

  // Gerencia as teclas de seta e Esc
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!selectedHackathon) return

      if (event.key === "Escape") {
        event.preventDefault()
        // Se estiver em tela cheia, primeiro sai da tela cheia. Senão, fecha o modal.
        if (isFullScreen) {
          setIsFullScreen(false)
        } else {
          closeModal()
        }
      }

      // A navegação por setas só funciona se houver fotos e não estiver em tela cheia
      if (selectedHackathon.photos.length > 1 && !isFullScreen) {
        if (event.key === "ArrowLeft") {
          event.preventDefault()
          prevPhoto()
        }
        if (event.key === "ArrowRight") {
          event.preventDefault()
          nextPhoto()
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [selectedHackathon, isFullScreen, closeModal, prevPhoto, nextPhoto])

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
              <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 animate-pulse">
                <div className="w-full h-48 md:h-56 bg-gray-700 rounded-lg mb-4" />
                <div className="h-6 bg-gray-700 rounded mb-2" />
                <div className="h-4 bg-gray-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
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
    )
  }

  return (
    <>
      <section className="py-16 md:py-20 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/3 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-0 relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Hackathons
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-4">
              Experiências em competições de programação, desenvolvendo soluções inovadoras em tempo limitado.
            </p>

            <div className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-400">
              <MousePointer className="w-4 h-4" />
              <span>Clique nos cards para ver mais detalhes e fotos</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            {hackathons.map((hackathon, index) => (
              <Card
                key={hackathon.id}
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
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => openModal(hackathon)}
                onMouseEnter={() => setHoveredCard(hackathon.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 z-40">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>

                <Badge
                  className={`absolute top-4 right-4 z-40 ${getPlacementColor(hackathon.placementType)} font-semibold backdrop-blur-sm transition-all duration-300`}
                >
                  {hackathon.placement}
                </Badge>

                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-40">
                  <div className="bg-gray-900/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-2 border border-purple-500/30">
                    <Eye className="w-3 h-3 text-purple-400" />
                    <span className="text-xs text-purple-300 font-medium">Ver detalhes</span>
                  </div>
                </div>

                <CardHeader className="pb-4 relative z-10">
                  <div className="w-full h-48 md:h-56 bg-gradient-to-br from-purple-900/20 to-gray-800 rounded-lg mb-4 overflow-hidden relative group/image">
                    <div className="w-full h-full relative">
                      <Image
                        src={hackathon.coverImage || "/placeholder.svg"}
                        alt={hackathon.title}
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-110"
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />

                      {hackathon.photos.length > 0 && (
                        <div className="absolute bottom-3 right-3 bg-gray-900/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <div className="w-2 h-2 bg-purple-400 rounded-full" />
                          <span className="text-xs text-white font-medium">{hackathon.photos.length} fotos</span>
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
                        <span>Clique para explorar</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* O Dialog agora gerencia tanto a visualização de detalhes quanto a de tela cheia */}
          <Dialog open={!!selectedHackathon} onOpenChange={handleModalOpenChange}>
            <DialogContent
              className={isFullScreen
                // Estilos para a visualização em tela cheia
                ? "p-0 m-0 w-screen h-screen max-w-full max-h-full bg-black/95 border-none rounded-none"
                // Estilos para a visualização de detalhes padrão
                : "max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700 text-white"
              }
              // Impede que o Dialog seja fechado clicando fora quando em tela cheia
              onInteractOutside={(e) => {
                if (isFullScreen) {
                  e.preventDefault();
                }
              }}
            >
              {isFullScreen && selectedHackathon ? (
                // --- VISUALIZAÇÃO DE IMAGEM EM TELA CHEIA ---
                <>
                  <button
                    onClick={() => setIsFullScreen(false)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
                    aria-label="Fechar visualização em tela cheia"
                  >
                    <X className="w-8 h-8" />
                  </button>
                  <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8">
                    <Image
                      src={selectedHackathon.photos[currentPhotoIndex]?.url || "/placeholder.svg"}
                      alt={selectedHackathon.photos[currentPhotoIndex]?.alt || "Foto do Hackathon"}
                      fill
                      sizes="100vw"
                      className="object-contain"
                      priority
                    />
                  </div>
                </>
              ) : selectedHackathon ? (
                // --- VISUALIZAÇÃO DE DETALHES DO HACKATHON ---
                <>
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-white pr-8">{selectedHackathon.title}</DialogTitle>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{selectedHackathon.date}</span>
                    </div>
                  </DialogHeader>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-900/30 to-purple-800/30 rounded-lg border border-purple-500/30">
                      <Trophy className="w-6 h-6 text-yellow-400" />
                      <div>
                        <span className="text-gray-300">Resultado: </span>
                        <span className="font-semibold text-white">{selectedHackathon.placement}</span>
                      </div>
                    </div>
                    <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden">
                      <Image
                        src={selectedHackathon.coverImage || "/placeholder.svg"}
                        alt={selectedHackathon.title}
                        width={800} height={400}
                        className="w-full h-full object-cover" priority
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-white">Sobre o Projeto</h3>
                      <p className="text-gray-300 leading-relaxed">{selectedHackathon.description}</p>
                    </div>
                    {selectedHackathon.photos.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold mb-4 text-white">Galeria de Fotos</h3>
                        <div className="relative">
                          <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden bg-gray-900 relative group">
                            <div
                              className="w-full h-full relative cursor-pointer"
                              onClick={() => setIsFullScreen(true)}
                            >
                              <Image
                                src={selectedHackathon.photos[currentPhotoIndex]?.url || "/placeholder.svg"}
                                alt={selectedHackathon.photos[currentPhotoIndex]?.alt || "Hackathon photo"}
                                width={800} height={400}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                                <div className="bg-gray-900/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
                                  <Maximize2 className="w-4 h-4 text-white" />
                                  <span className="text-white text-sm font-medium">
                                    <span className="hidden sm:inline">Clique para expandir</span>
                                    <span className="sm:hidden">Toque para expandir</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                            {selectedHackathon.photos.length > 1 && (
                              <>
                                <Button
                                  variant="outline" size="icon"
                                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-900/80 border-gray-600 hover:bg-gray-800"
                                  onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                                >
                                  <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline" size="icon"
                                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-900/80 border-gray-600 hover:bg-gray-800"
                                  onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                                >
                                  <ChevronRight className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                          {selectedHackathon.photos.length > 1 && (
                            <div className="flex justify-center gap-2 mt-4">
                              {selectedHackathon.photos.map((_, index) => (
                                <button
                                  key={index}
                                  className={`w-2 h-2 rounded-full transition-colors ${index === currentPhotoIndex ? "bg-purple-500" : "bg-gray-600"}`}
                                  onClick={() => setCurrentPhotoIndex(index)}
                                  aria-label={`Ir para a foto ${index + 1}`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : null}
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </>
  )
}
