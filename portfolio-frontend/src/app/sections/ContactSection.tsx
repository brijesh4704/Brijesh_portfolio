import React from 'react';
import ContactForm from '@/components/Contact/ContactForm';
import Section from '@/components/global/Section';
import HugeiconsMailOpen from '@/assets/icons/HugeiconsMailOpen';
import SiPhoneDuotone from '@/assets/icons/SiPhoneDuotone';
import AkarIconsLocation from '@/assets/icons/AkarIconsLocation';
import MingcuteFacebookLine from '@/assets/icons/MingcuteFacebookLine';
import JamLinkedinCircle from '@/assets/icons/JamLinkedinCircle';
import RaphaelGithubalt from '@/assets/icons/RaphaelGithubalt';
import contact from '@/assets/elements/contact.gif';
import Image from 'next/image';

const ContactSection: React.FC = () => {
    return (
        <Section className={'relative z-20 min-h-screen flex items-center max-mobile-lg:min-h-auto max-mobile-lg:py-8'}>
            <div className="text-center py-10 mobile-lg:w-9/12 mx-auto max-mobile-lg:py-6 max-mobile-lg:px-4">
                <h1 className="max-mobile-lg:text-2xl">
    Let&apos;s connect
</h1>

<p className="max-mobile-lg:text-sm max-mobile-xs:text-xs">
    Whether you have an AI/ML project, software development opportunity,
    data analytics requirement, internship offer, or collaboration idea,
    feel free to connect. I am always excited to work on innovative and
    impactful technology solutions.
</p>

<p className="text-muted-foreground text-lg max-mobile-lg:text-base">
    I&apos;m always open to discussing new opportunities, interesting
    projects, Artificial Intelligence, Machine Learning, Data Science,
    Software Development, and emerging technologies.
</p>
       <div className="basis-1/3 bg-card p-4 border border-border rounded-xl max-mobile-lg:basis-auto max-mobile-lg:p-3">
    <Image
        src={contact}
        alt="Contact"
        className="w-[50%] mx-auto max-mobile-lg:w-[40%] max-mobile-sm:w-[60%]"
    />

    <div className="mb-4 text-center">
        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            Open to Internships • Full-Time Roles • Collaborations
        </span>
    </div>

    <div className="flex flex-col gap-3 max-mobile-lg:gap-2">
        <span className="flex items-center text-primary text-xl gap-2 font-bold max-mobile-lg:text-lg max-mobile-sm:text-base">
            <HugeiconsMailOpen />
            <a
                href="mailto:brijeshdhaka3208@gmail.com"
                className="no-underline font-bold hover:text-primary/90 translate-y-1 max-mobile-sm:break-all"
            >
                brijeshdhaka3208@gmail.com
            </a>
        </span>

        <span className="flex items-center text-primary text-xl gap-2 font-bold max-mobile-lg:text-lg max-mobile-sm:text-base">
            <SiPhoneDuotone />
            <a
                href="tel:+919116750627"
                className="no-underline font-bold hover:text-primary/90 translate-y-1"
            >
                +91 9116750627
            </a>
        </span>

        <span className="flex items-center text-primary text-xl gap-2 font-bold max-mobile-lg:text-lg max-mobile-sm:text-base">
            <AkarIconsLocation />
            <span className="translate-y-1">
                Jaipur, Rajasthan, India
            </span>
        </span>
    </div>

    <div className="flex gap-3 text-4xl mt-4 max-mobile-lg:text-3xl max-mobile-sm:text-2xl max-mobile-lg:justify-center">
        <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-110 transition-transform"
            aria-label="LinkedIn"
        >
            <JamLinkedinCircle />
        </a>

        <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-110 transition-transform"
            aria-label="GitHub"
        >
            <RaphaelGithubalt />
        </a>
    </div>
    
                    <div className="flex gap-3 text-4xl mt-4 max-mobile-lg:text-3xl max-mobile-sm:text-2xl max-mobile-lg:justify-center">
                        <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:scale-110 transition-transform"
                            aria-label="Facebook"
                        >
                            <MingcuteFacebookLine />
                        </a>
                        <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:scale-110 transition-transform"
                            aria-label="LinkedIn"
                        >
                            <JamLinkedinCircle />
                        </a>
                        <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:scale-110 transition-transform"
                            aria-label="GitHub"
                        >
                            <RaphaelGithubalt />
                        </a>
                    </div>
                </div>
                <div className="basis-2/3 max-mobile-lg:basis-auto">
                    <ContactForm />
                </div>
            </div>
        </Section>
    );
};

export default ContactSection;
