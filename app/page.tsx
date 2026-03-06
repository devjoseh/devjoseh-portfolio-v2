import { QuoteSection, AboutSection, HeroSection, Navigation, Footer, SkillsToolsSection, ExperienceSection, ProjectsSection, HackathonsSection, LinksCTASection, StoreCTASection } from "@/components/index";

import { getAboutSettings } from "@/utils/actions/about";
import { getSkillCategories, getSkillsPublic } from "@/utils/actions/skills";
 
export default async function Home() {
    const [
        aboutSettings,
        skillCategories,
        skills,
    ] = await Promise.all([
        getAboutSettings(),
        getSkillCategories(),
        getSkillsPublic(),
    ]);

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navigation />
            <HeroSection />
            <div className="mx-4 md:mx-8 lg:mx-12 xl:mx-16">
                <div id="about">
                    <AboutSection aboutSettings={aboutSettings} />
                </div>
                <div id="skills">
                    <SkillsToolsSection categories={skillCategories} skills={skills} />
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
