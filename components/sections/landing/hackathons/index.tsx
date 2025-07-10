import { getHackathons } from "@/utils/actions/data";
import { HackathonsContent } from "./content";

export async function HackathonsSection() {
    const hackathons = await getHackathons();

    return (
        <section className="py-16 md:py-20 bg-gray-900 relative">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-20 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/3 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="container mx-auto px-0 relative z-10">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                        Hackathons
                    </h2>
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-4">
                        Experiências em competições de programação,
                        desenvolvendo soluções inovadoras em tempo limitado.
                    </p>

                    <div className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-400">
                        <span className="text-xs text-purple-300 font-medium">
                            Clique nos cards para ver mais detalhes e fotos
                        </span>
                    </div>
                </div>

                <HackathonsContent hackathons={hackathons} />
            </div>
        </section>
    );
}
