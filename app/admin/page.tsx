import { getAllLinks, getProfileSettings, getLinkAnalytics } from "@/utils/actions/links";
import { AdminDashboard } from "@/components/index";
import { getProjects, getExperiences } from "@/utils/actions/data";
import { getHackathons } from "@/utils/actions/admin";
import { getAllResumes } from "@/utils/actions/resume";
import { getAboutSettings } from "@/utils/actions/about";
import { getSkillCategories, getSkillsPublic } from "@/utils/actions/skills";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Dashboard - DevJoseH",
    description: "Gerenciar conteúdo do portfólio",
};

export default async function AdminPage() {
    const [
        projects,
        experiences,
        links,
        profileSettings,
        analytics,
        hackathons,
        resumes,
        aboutSettings,
        skillCategories,
        skills,
    ] = await Promise.all([
        getProjects(),
        getExperiences(),
        getAllLinks(),
        getProfileSettings(),
        getLinkAnalytics(30),
        getHackathons(),
        getAllResumes(),
        getAboutSettings(),
        getSkillCategories(),
        getSkillsPublic(),
    ]);

    return (
        <AdminDashboard
            initialProjects={projects}
            initialExperiences={experiences}
            initialLinks={links}
            profileSettings={profileSettings}
            analytics={analytics}
            initialHackathons={hackathons}
            initialResumes={resumes}
            initialAboutSettings={aboutSettings}
            initialSkillCategories={skillCategories}
            initialSkills={skills}
        />
    );
}
