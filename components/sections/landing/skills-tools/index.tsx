import { SkillsToolsContent } from "./content";

export function SkillsToolsSection() {
    return (
        <section className="py-16 md:py-20 bg-gray-900/50">
            <div className="container mx-auto px-0">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 py-2 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                        Linguagens e Ferramentas
                    </h2>
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-4">
                        Tecnologias e ferramentas que utilizo no desenvolvimento de projetos e soluções.
                    </p>
                </div>

                <SkillsToolsContent />
            </div>
        </section>
    );
}
