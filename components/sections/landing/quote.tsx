export function QuoteSection() {
    return (
        <section className="py-16 md:py-20 bg-gray-900/50">
            <div className="container mx-auto px-0">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="relative">
                        {/* Responsive Quote marks */}
                        <div className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 md:-top-4 md:-left-4 text-4xl sm:text-5xl md:text-6xl lg:text-8xl text-purple-500/20 font-serif leading-none select-none">
                            &quot;
                        </div>
                        <div className="absolute -bottom-4 -right-2 sm:-bottom-6 sm:-right-3 md:-bottom-8 md:-right-4 text-4xl sm:text-5xl md:text-6xl lg:text-8xl text-purple-500/20 font-serif leading-none rotate-180 select-none">
                            &quot;
                        </div>

                        {/* Quote content with responsive padding */}
                        <blockquote className="relative z-10 px-6 sm:px-8 md:px-12 lg:px-16">
                            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-gray-200 leading-relaxed mb-4 sm:mb-5 md:mb-6 italic">
                                Se a educação sozinha não transforma a
                                sociedade, sem ela tampouco a sociedade muda.
                            </p>
                            <footer className="text-sm sm:text-base md:text-lg text-purple-400 font-medium">
                                — Paulo Freire
                            </footer>
                        </blockquote>
                    </div>
                </div>
            </div>
        </section>
    );
}
