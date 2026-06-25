import React from 'react';
import Section from '@/components/global/Section';
import ParallaxStack from '@/components/projects/ParallaxStack';
import linux from '@/assets/icons/skill/skill-icons--linux-light.svg';
import projectImage from '@/assets/images/projects/1.png';
import projectImage2 from '@/assets/images/projects/2.png';
import projectImage3 from '@/assets/images/projects/3.png';
import projectImage4 from '@/assets/images/projects/4.png';
// import projectImage5 from '@/assets/images/projects/5.png';
import { StaticImageData } from 'next/image'; // Correct type for static images

// Define the type for a project
interface Project {
    id: number;
    title: string;
    description: string;
    image: StaticImageData; // Use StaticImageData for imported images
    color: string;
    logo: StaticImageData; // Use StaticImageData for imported logos
    techUsed: string[];
    demoLink: string;
    codeLink: string;
    Github: string;
}

// Array of projects
const projects: Project[] = [
    {
        id: 1,
        title: 'AI-Powered Health Tracker & Report Analyzer',
        description:
            'Developed an intelligent healthcare platform featuring medical report analysis, symptom-based disease prediction, doctor appointment booking, Databricks integration, and Power BI dashboards for healthcare analytics.',
        image: projectImage,
        color: 'bg-card',
        logo: linux,
        techUsed: [
            'Python',
            'Flask',
            'MongoDB',
            'Databricks',
            'PySpark',
            'Power BI',
            'Machine Learning',
        ],
        demoLink: '',
        codeLink: '',
        Github: '',
    },

    {
        id: 2,
        title: 'Honda QICS & Manufacturing Analytics Platform',
        description:
            'Enhanced Honda Cars India Ltd. Quality Information Control System (QICS) by implementing VIN-wise quality document retrieval, quality reporting automation, defect analysis, production monitoring, inventory analytics, waste cost tracking, and Power BI dashboards for manufacturing insights.',
        image: projectImage2,
        color: 'bg-card',
        logo: linux,
        techUsed: [
            'ASP.NET',
            'SQL Server',
            'Power BI',
            'SSRS',
            'Python',
            'Data Analytics',
            'Manufacturing Analytics',
            'Enterprise Applications',
            'Database Management',
        ],
        demoLink: '',
        codeLink: '',
        Github: '',
    },

    {
        id: 3,
        title: 'Premium Payment Prediction System',
        description:
            'Machine Learning web application using Random Forest algorithm to predict insurance premium payment defaults with 89%+ accuracy. Built a Flask-based prediction API with real-time inference capabilities.',
        image: projectImage3,
        color: 'bg-card',
        logo: linux,
        techUsed: [
            'Machine Learning',
            'Random Forest',
            'Python',
            'Flask',
            'Pandas',
            'NumPy',
            'Data Science',
        ],
        demoLink: '',
        codeLink: '',
        Github: '',
    },

    {
        id: 4,
        title: 'Construction Company Management Website',
        description:
            'Designed and developed a full-stack construction company website with responsive UI, project showcase, contact management system, database integration, and dynamic content handling.',
        image: projectImage4,
        color: 'bg-card',
        logo: linux,
        techUsed: [
            'HTML5',
            'CSS3',
            'JavaScript',
            'PHP',
            'Bootstrap',
            'MySQL',
        ],
        demoLink: '',
        codeLink: '',
        Github: '',
    },
];

const ProjectSection: React.FC = () => {
    return (
        <div className="relative">
            {/* Main Section */}
            <Section className={'py-10 relative max-mobile-lg:py-6'}>
                <div className="flex flex-col justify-center text-center py-10 w-2/3 mx-auto max-mobile-lg:w-full max-mobile-lg:px-4 z-10">
                    <h1 className="max-mobile-lg:text-2xl">Projects</h1>
                    <p className="max-mobile-lg:text-sm max-mobile-xs:text-xs">
                        Explore a collection of my projects that showcase my skills in web
                        development, problem-solving, and creating user-friendly applications. Each
                        project is built with modern technologies and designed to deliver a seamless
                        user experience.
                    </p>
                </div>

                {/* Parallax Stack */}
                <div>
                    <ParallaxStack projects={projects as Project[]} />
                </div>

                {/* Gradient Blur Effect */}
                <div className="absolute top-0 inset-0 blur-[120px] -z-10">
                    <div
                        style={{
                            clipPath:
                                'polygon(0% 90.5%, 36.75% 77.5%, 73.07% 74.24%, 100% 68.25%, 92.28% 77.5%, 100% 100%, 87.37% 79.84%, 75% 75%, 57.48% 85.62%, 32.25% 58.25%, 32.25% 90.5%)',
                        }}
                        className="sticky top-0 h-[100vh] w-full object-cover -z-10 bg-gradient-to-r from-primary/60 to-destructive/50"
                    />
                </div>
            </Section>
        </div>
    );
};

export default ProjectSection;
