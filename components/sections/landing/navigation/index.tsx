import { getActiveResumes } from "@/utils/actions/resume";
import { NavigationContent } from "./content";

export async function Navigation() {
    const resumes = await getActiveResumes();
    return <NavigationContent resumes={resumes} />;
}
