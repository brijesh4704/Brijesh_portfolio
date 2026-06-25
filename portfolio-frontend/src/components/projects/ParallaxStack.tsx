'use client';

import Image from 'next/image';
import * as motion from 'motion/react-client';
import { useTransform, useScroll, MotionValue } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { SquareArrowOutUpRight, Code } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
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
}

// Define the props for the ParallaxStack component
interface ParallaxStackProps {
    projects: Project[]; // Array of projects
}

export default function ParallaxStack({ projects }: ParallaxStackProps) {
    const containerRef = useRef<HTMLDivElement>(null); // Typed as HTMLDivElement

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    return (
        <main ref={containerRef} className="max-mobile-lg:space-y-6">
            {projects.map((project, i) => {
                const targetScale = 1 - (projects.length - i) * 0.03; // Smooth scaling effect
                return (
                    <Card
                        key={project.id}
                        index={i}
                        project={project}
                        progress={scrollYProgress}
                        range={[i * 0.15, 1]} // Adjusted range for smooth transition
                        targetScale={targetScale}
                    />
                );
            })}
        </main>
    );
}

// Define the props for the Card component
interface CardProps {
    project: Project; // Project data
    progress: MotionValue<number>; // Corrected type for progress
    range: [number, number]; // Range for the animation
    targetScale: number; // Target scale for the card
    index: number; // Index of the card
}

const Card: React.FC<CardProps> = ({ project, progress, range, targetScale, index }) => {
    const cardRef = useRef<HTMLDivElement>(null); // Typed as HTMLDivElement

    // Slight initial up-scale for effect (applied to the card, not the image)
    const scale = useTransform(progress, range, [1, targetScale]);

    // Moves cards up smoothly
    const translateY = useTransform(progress, [0, 1.5], [index * 50, 15]);

    // Hydration fix: Only apply transforms on client after mount
    const [isDesktop, setIsDesktop] = useState(false);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsDesktop(window.innerWidth > 1024);
        }
    }, []);

    return (
        <motion.div 
            ref={cardRef} 
            className="sticky w-full top-20 h-screen max-mobile-lg:relative max-mobile-lg:top-auto max-mobile-lg:h-auto max-mobile-lg:sticky-none" 
            style={{ translateY: isDesktop ? translateY : 0 }}
        >
            <motion.div
                className={`w-full max-tablet-lg:min-h-[50vh] max-mobile-lg:min-h-auto rounded-2xl overflow-hidden bg-card relative shadow-lg hover:shadow-[0px_5px_20px] hover:shadow-muted border border-border ${project.color} origin-top z-10`}
                style={{ scale: isDesktop ? scale : 1 }}
            >
                <div className="flex max-mobile-lg:flex-col justify-between w-full relative z-20">
                    {/* Image Section */}
                    <div className="basis-4/6 rounded-3xl p-4 max-mobile-sm:p-2 overflow-hidden max-mobile-lg:basis-auto">
                        <div className={`w-full h-full overflow-hidden rounded-xl border border-border max-mobile-lg:h-48`}>
                            <Image
                                src={project.image}
                                width={1400}
                                height={1000}
                                alt={project.title}
                                className="w-full h-full object-cover"
                                style={project.id === 2 ? { objectPosition: 'top' } : {}}
                            />
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="basis-2/6 flex flex-col gap-3 justify-between p-4 max-mobile-sm:p-2 max-mobile-sm:pt-0 relative max-mobile-lg:basis-auto">
                        <div>
                            <h1 className="max-mobile-sm:text-xl max-mobile-xs:text-lg font-bold">{project.title}</h1>
                            <p className="text-lg max-mobile-sm:text-sm max-mobile-xs:text-xs max-mobile-sm:max-h-[15vh] max-mobile-sm:overflow-y-auto max-mobile-sm:text-ellipsis leading-relaxed">
                                {project.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-3 max-mobile-sm:gap-1">
                                {project.techUsed.map(tech => (
                                    <Badge
                                        className="rounded-sm text-base shadow-lg text-nowrap max-mobile-sm:text-xs max-mobile-xs:text-xs"
                                        key={tech}
                                    >
                                        {tech}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Buttons Section */}
                        <div className="flex gap-2 justify-between mt-6 mb-8 max-mobile-lg:flex-col max-mobile-lg:gap-3">
                            <div className="flex gap-3 h-15 max-mobile-lg:w-full max-mobile-lg:justify-center">
                                <Link
                                href={project.codeLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                    className="text-foreground no-underline max-mobile-lg:flex-1"
                                >
                                    <Button size="lg" className='flex items-center text-base font-bold max-mobile-lg:w-full max-mobile-lg:text-sm'>
                                    Live Website
                                        <Code className="translate-y-[-2.5px] mt-1 max-mobile-sm:w-4 max-mobile-sm:h-4" />
                                </Button>
                                </Link>
                                <Link
                                    href={project.demoLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-foreground no-underline max-mobile-lg:flex-1"
                                >
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="flex items-center text-base font-bold max-mobile-lg:w-full max-mobile-lg:text-sm"
                                    >
                                        Demo <SquareArrowOutUpRight className="translate-y-[-2.5px] mt-1 max-mobile-sm:w-4 max-mobile-sm:h-4" />
                                    </Button>
                                </Link>
                            </div>
                            <Image
                                src={project.logo}
                                alt="project logo"
                                className="absolute right-2 bottom-2 w-20 max-mobile-lg:relative max-mobile-lg:right-auto max-mobile-lg:bottom-auto max-mobile-lg:w-16 max-mobile-sm:w-12"
                            />
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};
