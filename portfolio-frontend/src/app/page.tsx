// frontend/src/app/page.tsx
import React from 'react';
import TextParalaxEffect from '@/components/global/TextParalaxEffect';
import HeroSection from './sections/HeroSection';
import LogoSlideSection from './sections/LogoSlideSection';
import ProjectSection from './sections/ProjectSection';
import AboutSection from './sections/AboutSection';
import SkillSection from './sections/SkillSection';
import WorkExperienceSection from './sections/WorkExperienceSection';
import SectionBackgrpound1 from '@/components/global/SectionBackgrpound1';
import ContactSection from './sections/ContactSection';
import FooterSection from './sections/FooterSection';
// import LeetCodeSection from './sections/LeetCodeSection';

const Home: React.FC = () => {
    return (<>
        <div id="home">
            <HeroSection/>
        </div>
        <div className="relative">
            <SectionBackgrpound1/>
            <LogoSlideSection/>
            <div id="about">
                <AboutSection/>
            </div>
            <div id="skills">
                <SkillSection/>
            </div>
            <div id="experience">
                <WorkExperienceSection/>
            </div>
            <TextParalaxEffect/>
            <div id="projects">
                <ProjectSection/>
            </div>
            {/* <div id="leetcode" className="py-10 px-5 w-5/6 mx-auto transition-all duration-300 hover:shadow-[0_0_15px_5px_rgba(255,255,255,0.3)] hover:transform hover:translate-y-[-5px] bg-[linear-gradient(135deg,theme(colors.card)_25%,theme(colors.background)_25%,theme(colors.background)_50%,theme(colors.card)_50%,theme(colors.card)_75%,theme(colors.background)_75%,theme(colors.background)_100%)] bg-[length:32px_32px] border border-border">
    <LeetCodeSection/>
</div> */}
            <div id="contact">
                <ContactSection/>
            </div>
        </div>
        <FooterSection/>
    </>);
};

export default Home;
