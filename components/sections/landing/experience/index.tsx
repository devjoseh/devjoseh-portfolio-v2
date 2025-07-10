import { getExperiences } from "@/utils/actions/data";
import { ExperienceContent } from "./content";

export async function ExperienceSection() {
    const experiences = await getExperiences();

    return (
        <section className="py-16 md:py-20 bg-gray-900/50 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-48 h-48 bg-purple-600/3 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="container mx-auto px-0 relative z-10">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent animate-fadeInUp">
                        Experiência
                    </h2>
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-4 animate-fadeInUp delay-200">
                        Minha jornada no desenvolvimento backend
                    </p>
                </div>

                <ExperienceContent experiences={experiences as any} />
            </div>

            
        </section>
    );
}
