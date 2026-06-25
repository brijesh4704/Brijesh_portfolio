'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import HugeiconsUniversity from '@/assets/icons/HugeiconsUniversity';
import { LucideExternalLink } from '@/assets/icons/LucideExternalLink';

interface WorkExperience {
    id: number;
    company: string;
    position: string;
    duration: string;
    location: string;
    description: string[];
    technologies: string[];
    companyUrl?: string;
    logo?: string;
}
const workExperiences: WorkExperience[] = [
    {
        id: 1,
        company: "Celebal Technologies",
        position: "Data Science Intern",
        duration: "2026 - Present",
        location: "Remote",
        description: [
            "Working on real-world Data Science and AI projects.",
            "Building machine learning and analytics solutions for business use cases.",
            "Performing data preprocessing, visualization, and model development.",
            "Collaborating with industry professionals on enterprise-level projects.",
            "Gaining hands-on experience with modern data science workflows and tools."
        ],
        technologies: [
            "Python",
            "Machine Learning",
            "Data Analytics",
            "SQL",
            "Power BI",
            "Data Visualization",
            "Git",
            "AI"
        ],
        companyUrl: "#"
    },

    {
        id: 2,
        company: "Honda Cars India Ltd.",
        position: "IT Department Intern",
        duration: "Jul 2025 - Aug 2025",
        location: "Tapukara, Rajasthan",
        description: [
            "Worked on the QICS (Quality Information Control System) supporting 8+ quality departments.",
            "Developed VIN-wise quality data integration modules for centralized information retrieval.",
            "Implemented 5+ application features including DPC tracking and defect comparison reports.",
            "Automated data extraction workflows for Power BI dashboards and KPI monitoring.",
            "Performed debugging, User Acceptance Testing (UAT), and requirement analysis.",
            "Assisted in role-based authentication and security enhancements."
        ],
        technologies: [
            "SQL",
            "Power BI",
            "Software Testing",
            "Database Management",
            "Data Analytics",
            "UAT",
            "Enterprise Applications",
            "QICS"
        ],
        companyUrl: "#"
    },

    {
        id: 3,
        company: "KisTechno Software",
        position: "Web Development Intern",
        duration: "May 2024",
        location: "Remote",
        description: [
            "Developed responsive web pages using HTML, CSS, and JavaScript.",
            "Improved website accessibility and cross-browser compatibility.",
            "Enhanced UI/UX design for improved user interaction.",
            "Worked on front-end development and responsive design practices.",
            "Collaborated on website optimization and usability improvements."
        ],
        technologies: [
            "HTML",
            "CSS",
            "JavaScript",
            "Responsive Design",
            "UI/UX",
            "Web Development",
            "Git"
        ],
        companyUrl: "#"
    }
];


export default function WorkExperienceSection() {
    return (
        <section className="py-20 px-4 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Work Experience
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    My journey across Data Science, Artificial Intelligence, Software Development, Analytics, and Enterprise Applications through industry internships and real-world projects.
                </p>
            </motion.div>

            <div className="space-y-8">
                {workExperiences.map((experience, index) => (
                    <motion.div
                        key={experience.id}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                    >
                        <Card className="bg-[linear-gradient(135deg,theme(colors.card)_25%,theme(colors.background)_25%,theme(colors.background)_50%,theme(colors.card)_50%,theme(colors.card)_75%,theme(colors.background)_75%,theme(colors.background)_100%)] bg-[length:32px_32px] border border-border hover:shadow-lg transition-all duration-300 hover:transform hover:translate-y-[-2px]">
                            <CardHeader>
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <HugeiconsUniversity className="w-6 h-6 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className="text-xl md:text-2xl font-bold text-foreground mb-2">
                                                {experience.position}
                                            </CardTitle>
                                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-foreground">{experience.company}</span>
                                                    {experience.companyUrl && (
                                                        <a 
                                                            href={experience.companyUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-primary hover:text-primary/80 transition-colors"
                                                        >
                                                            <LucideExternalLink className="w-4 h-4" />
                                                        </a>
                                                    )}
                                                </div>
                                                <span className="hidden md:inline">•</span>
                                                <span>{experience.duration}</span>
                                                <span className="hidden md:inline">•</span>
                                                <span>{experience.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            
                            <CardContent className="space-y-6">
                                <div>
                                    <h4 className="font-semibold text-foreground mb-3">Key Responsibilities:</h4>
                                    <ul className="space-y-2">
                                        {experience.description.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                                                <span className="text-primary mt-1.5">•</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                
                                <div>
                                    <h4 className="font-semibold text-foreground mb-3">Technologies Used:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {experience.technologies.map((tech) => (
                                            <Badge 
                                                key={tech} 
                                                variant="secondary"
                                                className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
                                            >
                                                {tech}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-center mt-12"
            >
                <p className="text-muted-foreground text-base max-mobile-lg:text-sm">
                    Passionate about Artificial Intelligence, Machine Learning, Data Science, and Software Development while continuously building impactful solutions for real-world challenges.
                </p>
                <a 
                    href="#contact" 
                    className="inline-block mt-4 px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                >
                    Let&apos;s Connect
                </a>
            </motion.div>
        </section>
    );
} 