import { QuoteSection, AboutSection, HeroSection, Navigation, Footer, SkillsToolsSection, ExperienceSection, ProjectsSection, HackathonsSection, LinksCTASection, StoreCTASection } from "@/components/index";
 
export default function Home() {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navigation />
            <HeroSection />
            <div className="mx-4 md:mx-8 lg:mx-12 xl:mx-16">
                <div id="about">
                    <AboutSection />
                </div>
                <div id="skills">
                    <SkillsToolsSection />
                </div>
                <div id="experience">
                    <ExperienceSection />
                </div>
                <div id="projects">
                    <ProjectsSection />
                </div>
                <StoreCTASection />
                <LinksCTASection />
                <div id="hackathons">
                    <HackathonsSection />
                </div>
                <QuoteSection />
            </div>
            <Footer />
        </div>
    );
}
