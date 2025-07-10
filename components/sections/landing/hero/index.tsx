import { HeroContent } from "./content";

export function HeroSection() {
    return (
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-purple-500/5 to-transparent rounded-full" />

                {/* Floating particles */}
                <div className="absolute top-20 left-20 w-2 h-2 bg-purple-400/30 rounded-full animate-bounce delay-300" />
                <div className="absolute top-40 right-32 w-1 h-1 bg-purple-300/40 rounded-full animate-bounce delay-700" />
                <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-purple-500/20 rounded-full animate-bounce delay-1000" />
                <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-purple-400/25 rounded-full animate-bounce delay-500" />

                {/* Subtle moving gradients */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/2 to-transparent animate-pulse duration-4000" />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-purple-600/1 to-transparent animate-pulse duration-6000 delay-2000" />
            </div>

            <div className="container mx-auto px-4 md:px-8 lg:px-12 xl:px-16 z-10 w-full">
                <HeroContent />
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900 pointer-events-none" />

            <div className="absolute bottom-0 left-0 right-0 h-40 overflow-hidden pointer-events-none">
                <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-purple-500/3 rounded-full blur-3xl animate-pulse delay-2000" />
                <div className="absolute bottom-0 right-1/3 w-32 h-32 bg-purple-600/5 rounded-full blur-2xl animate-pulse delay-3000" />
            </div>
        </section>
    );
}
