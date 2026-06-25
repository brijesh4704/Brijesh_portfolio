import Section from '@/components/global/Section';
import Image from 'next/image';
import profile1 from '@/assets/images/profile1.png';
import AnimatedText from '@/components/global/ScrollFadeParagraph';
import HugeiconsUniversity from '@/assets/icons/HugeiconsUniversity';
import * as motion from 'motion/react-client';
import { Mail, Phone, MapPin } from 'lucide-react';

const aboutText = `
Hi, I'm Brijesh Singh, a Computer Science (Data Science) student at Swami Keshvanand Institute of Technology (SKIT), Jaipur.

I am passionate about Artificial Intelligence, Machine Learning, Software Development, Data Analytics, and Problem Solving. Through internships at Celebal Technologies, Honda Cars India Ltd., and KisTechno Software, I have gained hands-on experience in enterprise applications, data-driven solutions, analytics dashboards, database management, and software engineering practices.

At Honda Cars India Ltd., I worked on the Quality Information Control System (QICS), developing VIN-wise quality information retrieval modules, Power BI reporting solutions, and enterprise-level application enhancements. Currently, I am expanding my expertise in AI, Machine Learning, and Data Science while building scalable software solutions that create real-world impact.
`;

const AboutSection = () => {
return ( <Section className="relative py-10 max-mobile-lg:py-6"> <div className="flex max-mobile-lg:flex-col-reverse justify-start items-stretch gap-4 max-mobile-lg:gap-3 overflow-hidden">

```
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="bg-primary/5 border border-border rounded-lg p-4 max-mobile-lg:p-3 flex-1"
            >
                <h1 className="mb-3 max-mobile-lg:text-xl">
                    About Me
                </h1>

                <AnimatedText
                    wordClass="text-xl max-mobile-lg:text-base max-mobile-xs:text-sm"
                    motionClass="text-primary text-xl max-mobile-lg:text-base max-mobile-xs:text-sm"
                    text={aboutText}
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                className="bg-card flex flex-col max-mobile-lg:flex-row gap-4 max-mobile-lg:gap-3 rounded-lg p-4 max-mobile-lg:p-3 border border-border max-w-sm max-mobile-lg:max-w-none"
            >
                <div className="w-60 h-60 max-mobile-lg:w-32 max-mobile-lg:h-32 max-mobile-xs:w-28 max-mobile-xs:h-28 flex-shrink-0">
                    <Image
                        src={profile1}
                        alt="Brijesh Singh Profile"
                        className="rounded-lg w-full h-full object-cover"
                    />
                </div>

                <div className="flex flex-col gap-2 max-mobile-lg:gap-1">
                    <h3 className="font-semibold text-lg max-mobile-lg:text-base">
                        Contact Information
                    </h3>

                    <a
                        href="mailto:brijeshdhaka3208@gmail.com"
                        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                    >
                        <Mail className="w-4 h-4" />
                        <span className="text-sm max-mobile-xs:text-xs break-all">
                            brijeshdhaka3208@gmail.com
                        </span>
                    </a>

                    <a
                        href="tel:+919116750627"
                        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                    >
                        <Phone className="w-4 h-4" />
                        <span className="text-sm max-mobile-xs:text-xs">
                            +91 9116750627
                        </span>
                    </a>

                    <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm max-mobile-xs:text-xs">
                            Jaipur, Rajasthan, India
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            AI & ML Enthusiast
                        </span>

                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            Software Developer
                        </span>

                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            Data Science Student
                        </span>
                    </div>
                </div>
            </motion.div>
        </div>

        <div className="py-5 max-mobile-lg:py-3">
            <h1 className="py-2 max-mobile-lg:text-xl">
                Education
            </h1>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
                className="flex max-mobile-lg:flex-col justify-between bg-card p-4 max-mobile-lg:p-3 border border-border rounded-lg gap-4 max-mobile-lg:gap-2"
            >
                <div className="flex gap-2 flex-1">
                    <div className="border-l-4 border-primary pl-2">
                        <h3 className="text-lg max-mobile-lg:text-base font-semibold">
                            B.Tech in Computer Science (Data Science)
                        </h3>

                        <span className="flex items-center gap-2 text-sm max-mobile-xs:text-xs text-muted-foreground">
                            <HugeiconsUniversity className="w-4 h-4" />
                            <span>
                                Swami Keshvanand Institute of Technology, Jaipur
                            </span>
                        </span>
                    </div>
                </div>

                <div className="max-mobile-lg:mt-2 flex-shrink-0">
                    <span className="text-sm max-mobile-xs:text-xs text-muted-foreground">
                        2023 - 2027 | CGPA: 8.6/10
                    </span>
                </div>
            </motion.div>
        </div>

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
);
};

export default AboutSection;
