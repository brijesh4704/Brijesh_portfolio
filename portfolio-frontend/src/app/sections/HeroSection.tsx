import React from 'react';
import Section from '@/components/global/Section';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import * as motion from 'motion/react-client'; // Keep the motion import as it is
import TypingEffect from '@/components/client/TypingEffect';

// Import assets
import heroImage from '@/assets/images/hero.png';
import heroBg from '@/assets/images/backgrounds/heroBackground.svg';
import crossArrow from '@/assets/elements/crossArrow.svg';
import headShine from '@/assets/elements/headShine.svg';
import dottedArrow from '@/assets/elements/dottedArrow.svg';
import dots2 from '@/assets/elements/dots2.svg';
import dots3 from '@/assets/elements/dots3.svg';
import TextReveal from '@/components/global/TextReveal';
import SocialIcons from '@/components/hero/SocialIcons';
import Link from 'next/link';

const HeroSection: React.FC = () => {
    return (
        <div className="relative">
            {/* Background Image */}
            <Image
                src={heroBg}
                alt="Hero Background"
                priority
                fill
                className="opacity-5 dark:opacity-40 absolute z-0 object-cover"
            />

            <Section className={'!p-0 z-10 relative'}>
                {/* Hero Section */}
                <div className="flex max-tablet-lg:flex-col pt-5 min-h-[75vh] relative max-mobile-lg:pt-2 max-mobile-lg:min-h-[60vh]">
                    {/* Animated Gradient Background */}
                    <div className="absolute z-0 top-0 left-0 max-tablet-lg:top-[40%] max-mobile-sm:top-[55%] w-full h-full max-tablet-lg:h-1/2 flex justify-center items-start">
                        <div className="relative w-full h-[30%] flex justify-center items-center">
                            {/* Animated Gradient Background */}
                            <div className="absolute inset-0 z-0 transform-gpu overflow-hidden blur-[50px] flex justify-center items-center ">
                                <div
                                    style={{
                                        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                                    }}
                                    className="relative inset-0 h-[90%] w-full bg-gradient-to-tr from-accent/10 to-secondary/10 animate-gradient-shift"
                                />
                            </div>

                            {/* Animated Text */}
                            <svg
                                width="100%"
                                height="100%"
                                className="absolute top-0 left-0 opacity-100 animate-floating object-contain "
                            >
                                <text
                                    x="50%"
                                    y="50%"
                                    textAnchor="middle"
                                    dy="0.35em"
                                    fontSize="clamp(3rem, 15vw, 13rem)"
                                    fontWeight="bold"
                                    fill="transparent"
                                    className="text-primary stroke-primary stroke-[5px] opacity-10"
                                >
                                    Brijesh Singh
                                </text>
                            </svg>
                        </div>
                    </div>
                    {/* Animated Dots */}
                    <div className="absolute bottom-[15%] left-[5%] right-[30%] w-44 flex flex-col gap-2 z-0 max-tablet-lg:hidden">
                        <motion.div
                            animate={{ x: [-5, 5, -5] }}
                            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <Image src={dots2} alt="dots2" />
                        </motion.div>
                        <motion.div
                            animate={{ x: [5, -5, 5] }}
                            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <Image src={dots3} alt="dots3" />
                        </motion.div>
                    </div>
                   {/* Left Content */}
<div className="basis-1/2 flex flex-col justify-center items-start gap-2 p-4 z-10 relative max-mobile-lg:items-center max-mobile-lg:text-center">
    <TextReveal>
        <span className="text-4xl font-bold max-mobile-lg:text-2xl max-mobile-xs:text-lg">
            Hello, I&apos;m
        </span>
    </TextReveal>

    <TextReveal className={'bg-primary'}>
        <h1 className="text-6xl font-bold relative text-primary max-mobile-lg:text-3xl max-mobile-xs:text-xl">
            Brijesh Singh
        </h1>
    </TextReveal>

    <TextReveal>
        <TypingEffect
            staticText={"I'm a"}
            words={[
                'AI & ML Enthusiast',
                'Software Developer',
                'Data Science Student',
                'Data Analyst',
                'Celebal Technologies Intern',
            ]}
            className="max-mobile-lg:text-base"
        />
    </TextReveal>

    <TextReveal className={'bg-muted-foreground'}>
        <span className="max-mobile-lg:text-sm">
            I am a Computer Science (Data Science) student passionate about
            Artificial Intelligence, Machine Learning, Software Development,
            Data Analytics, and Problem Solving. Through internships at
            Celebal Technologies and Honda Cars India Ltd., I have worked on
            real-world software systems, data-driven applications, analytics
            dashboards, and enterprise solutions.
        </span>
    </TextReveal>

    <TextReveal>
        <div className="mt-2 text-primary font-semibold max-mobile-lg:text-sm">
            🚀 Currently Interning at Celebal Technologies
        </div>
    </TextReveal>

    <div className="my-3 flex gap-2 flex-wrap max-mobile-lg:flex-col max-mobile-lg:w-full max-mobile-lg:items-center">
        <Link href={'#contact'} className="w-full max-mobile-lg:w-full">
            <Button size="lg" className="w-full max-mobile-lg:w-full">
                Contact Me
            </Button>
        </Link>

        <a href={'#projects'} className="w-full max-mobile-lg:w-full">
            <Button
                variant="outline"
                size="lg"
                className="ml-2 w-full max-mobile-lg:ml-0 max-mobile-lg:w-full"
            >
                View My Work
            </Button>
        </a>

        <a href="/resume.pdf" download>
            <Button
                variant="secondary"
                size="lg"
                className="max-mobile-lg:w-full"
            >
                Download Resume
            </Button>
        </a>
    </div>
</div>
                   
                    {/* Right Content - Hero Image */}
                    <div className="basis-1/2 flex justify-end items-end z-20 max-mobile-lg:mt-10 relative max-mobile-lg:justify-center">
                        <SocialIcons />
                        <div>
                            <motion.div
                                initial={{ rotateX: 90, y: 10, opacity: 0 }}
                                animate={{ rotateX: 0, y: 0, opacity: 1 }}
                                transition={{
                                    duration: 2,
                                    ease: 'easeOut',
                                    type: 'spring',
                                    stiffness: 120,
                                    damping: 15,
                                }}
                                className="relative origin-bottom"
                            >
                                <Image
                                    src={heroImage}
                                    alt="Brijesh Singh"
                                    priority
                                    className="w-[80%] ml-20 mt-20 drop-shadow-[2px_-2px_2px_rgba(0,0,0,1)] max-mobile-lg:w-40 max-mobile-lg:ml-0 max-mobile-lg:mt-4 max-mobile-lg:mx-auto max-mobile-xs:w-28"
                                />

                                {/* Head Shine Animation */}
                                <motion.div
                                    animate={{
                                        scale: [1, 1.05, 1],
                                        y: [0, '-5px', 0],
                                        x: [0, '5px', 0],
                                        rotate: [15],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                    }}
                                    className="absolute -top-0 max-mobile-sm:-top-12 max-mobile-sm:right-[25%] right-[30%] w-26 max-mobile-lg:right-[10%] max-mobile-lg:w-16 max-mobile-xs:hidden"
                                >
                                    <Image src={headShine} alt="headShine" />
                                </motion.div>
                            </motion.div>

                            {/* Dotted Arrow Animation */}
                            <motion.div
                                animate={{ x: [0, '5px', 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute top-[50%] left-[15%] max-tablet-lg:top-1/2 max-tablet-lg:left-[10%] max-mobile-lg:top-[45%]  max-mobile-lg:left-[5%] w-20 max-tablet-lg:w-32 max-mobile-lg:w-24 opacity-65 dark:opacity-100 dark:brightness-[3] max-mobile-sm:top-[45%] max-mobile-lg:hidden"
                            >
                                <Image src={dottedArrow} alt="dottedArrow" />
                            </motion.div>
                        </div>
                    </div>

                    {/* Cross Arrow Animation */}
                    <motion.div
                        animate={{ rotate: [0, 10, 0], y: [0, '15px', 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute top-5 right-16 w-20 max-mobile-sm:w-12 max-mobile-sm:top-2 max-tablet-lg:right-24 max-mobile-sm:right-28 max-mobile-xs:hidden"
                    >
                        <Image src={crossArrow} alt="crossArrow" />
                    </motion.div>

                    {/* Gradient Blur Effect */}
                    <div className="absolute inset-0 -z-10 transform-gpu overflow-hidden blur-[100px] flex justify-center items-end">
                        <div
                            style={{
                                clipPath:
                                    'polygon(0% 90.5%, 36.75% 77.5%, 73.07% 74.24%, 100% 68.25%, 92.28% 77.5%, 100% 100%, 87.37% 79.84%, 75% 75%, 57.48% 85.62%, 32.25% 58.25%, 32.25% 90.5%)',
                            }}
                            className="relative inset-0 aspect-video w-full bg-gradient-to-tr from-primary/60 to-chart-5/50"
                        />
                    </div>
                </div>
            </Section>
        </div>
    );
};

export default HeroSection;
