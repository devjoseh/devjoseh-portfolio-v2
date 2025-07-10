import { LinksCTAContent } from "./content";

export function LinksCTASection() {
    return (
        <section
            className="py-12 md:py-16 bg-gray-900/30"
        >
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-10 left-10 w-32 h-32 bg-pink-500/5 rounded-full blur-2xl animate-pulse" />
                <div className="absolute bottom-10 right-10 w-48 h-48 bg-purple-600/3 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-radial from-pink-500/3 to-transparent rounded-full" />
            </div>

            <div className="container mx-auto px-0 relative z-10">
                <LinksCTAContent />
            </div>
        </section>
    );
}
