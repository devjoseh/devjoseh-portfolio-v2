import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Linkedin, Instagram, Youtube, Github, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

export function AboutSection() {
    const socialLinks = [
        {
            name: "LinkedIn",
            icon: Linkedin,
            url: "https://www.linkedin.com/in/devjoseh/",
            color: "hover:bg-blue-600/10 hover:border-blue-500",
        },
        {
            name: "Instagram",
            icon: Instagram,
            url: "https://instagram.com/dev_joseh",
            color: "hover:bg-pink-600/10 hover:border-pink-500",
        },
        {
            name: "YouTube",
            icon: Youtube,
            url: "https://youtube.com/@devjoseh",
            color: "hover:bg-red-600/10 hover:border-red-500",
        },
        {
            name: "GitHub",
            icon: Github,
            url: "https://github.com/devjoseh",
            color: "hover:bg-gray-600/10 hover:border-gray-500",
        },
    ];

    const softSkills = [
        "Mente estratégica",
        "Líder nato",
        "Comunicador direto",
        "Especialista em eficiência",
        "Ambicioso",
        "Autoconfiante",
        "Focado em objetivos",
        "Resolução de problemas lógicos",
        "Intelectualmente Estimulante",
    ];

    return (
        <section className="py-16 md:py-20 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-900/95 relative overflow-hidden">
            {/* Subtle background elements for continuity */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-500/3 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-20 right-1/3 w-48 h-48 bg-purple-600/2 rounded-full blur-2xl animate-pulse delay-2000" />
                <div className="absolute bottom-20 left-1/3 w-32 h-32 bg-purple-500/4 rounded-full blur-xl animate-pulse delay-3000" />

                {/* Subtle gradient overlay for smooth transition */}
                <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-gray-900/80 to-transparent" />
            </div>

            <div className="container mx-auto px-0 relative z-10">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                        Quem sou eu
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left Side - Photo, Social Links, and About Text */}
                    <div className="space-y-6">
                        {/* Profile Photo */}
                        <div className="flex justify-center lg:justify-start">
                            <div className="relative">
                                <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-purple-500/30 shadow-2xl">
                                    <Image
                                        src="/pfp2.webp?height=224&width=224"
                                        alt="José Hernanes - DevJoseH"
                                        width={224}
                                        height={224}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto lg:mx-0">
                            {socialLinks.map((social) => (
                                <Button
                                    key={social.name}
                                    asChild
                                    variant="outline"
                                    className={`border-gray-600 bg-gray-800/50 text-gray-300 transition-all duration-300 ${social.color} flex items-center gap-2 justify-start px-4 py-3 h-auto backdrop-blur-sm`}
                                >
                                    <Link
                                        href={social.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2"
                                    >
                                        <social.icon className="w-4 h-4" />
                                        <span className="text-sm font-medium">{social.name}</span>
                                    </Link>
                                </Button>
                            ))}
                        </div>

                        {/* About Text */}
                        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                                    Tenho 17 anos, estou cursando Análise e
                                    Desenvolvimento de Sistemas e iniciei na
                                    programação aos 12 criando e ensinando as
                                    pessoas a criarem bots para o discord no meu
                                    canal do YouTube.
                                    <br />
                                    <br />
                                    Sou fundador e idealizador do projeto
                                    EducaAvalia, um aplicativo de avaliações de
                                    escolas inclusivas e acessíveis para alunos
                                    com deficiência.
                                    <br />
                                    <br />
                                    Atualmente, atuo como desenvolvedor
                                    back-end, apaixonado por resolver desafios.
                                    Nas horas vagas, sou designer e rato de
                                    hackathons.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Side - Personality and Soft Skills */}
                    <div className="space-y-6">
                        {/* Personality Section */}
                        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    <Link
                                        href="https://www.16personalities.com/br/personalidade-entj"
                                        target="_blank"
                                    >
                                        <div className="p-2 w-16 h-16 rounded-full bg-white flex items-center justify-center cursor-pointer transition-transform hover:scale-105 overflow-hidden">
                                            <Image
                                                src="/logo_16personalities.svg?height=64&width=64"
                                                alt="16Personalities Logo"
                                                width={64}
                                                height={64}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </Link>
                                    <div>
                                        <Link
                                            href="https://www.16personalities.com/br/personalidade-entj"
                                            target="_blank"
                                        >
                                            <CardTitle className="text-white text-xl cursor-pointer hover:text-purple-400 transition-colors flex items-center gap-2">
                                                Comandante (ENTJ-T)
                                                <ExternalLink className="w-4 h-4" />
                                            </CardTitle>
                                        </Link>
                                        <CardDescription className="text-gray-400">
                                            16Personalities
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                                    Realizei o teste de personalidade
                                    16Personalities e obtive o resultado{" "}
                                    <Link
                                        href="https://www.16personalities.com/br/personalidade-entj"
                                        target="_blank"
                                        className="text-purple-400 hover:text-purple-300 underline decoration-purple-400/50 hover:decoration-purple-300 transition-colors font-medium"
                                    >
                                        ENTJ-T (Comandante)
                                    </Link>
                                    . Esse perfil destaca minha liderança,
                                    pensamento estratégico e foco em resultados,
                                    características que impulsionam meu
                                    desenvolvimento profissional.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Soft Skills Section */}
                        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-white text-xl">
                                    Soft Skills
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Principais habilidades comportamentais
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-3">
                                    {softSkills.map((skill, index) => (
                                        <Badge
                                            key={index}
                                            variant="secondary"
                                            className="bg-purple-900/30 text-purple-300 border-purple-500/30 px-3 py-2 text-sm font-medium justify-center hover:bg-purple-900/50 transition-colors"
                                        >
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}