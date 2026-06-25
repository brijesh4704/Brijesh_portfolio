'use client';

import { motion } from 'motion/react'; // Keep the motion import as it is

// Define the type for a skill
interface Skill {
    name: string; // Name of the skill
}

// Define the type for the categories object
interface Categories {
    [key: string]: Skill[]; // Each category is a key with an array of Skill objects
}

const Skills: React.FC = () => {
    // Define the categories object with comprehensive skills
    const categories: Categories = {
        programming: [
            { name: 'JavaScript' },
            { name: 'Python' },
            { name: 'C' },
            { name: 'C++' },
            { name: 'Java' },
            { name: 'TypeScript' },
            { name: 'SQL' },
        ],
        frontend: [
            { name: 'React.js' },
            { name: 'Next.js' },
            { name: 'Tailwind CSS' },
            { name: 'Material UI' },
        ],
        backend: [
            { name: 'Node.js' },
            { name: 'Express.js' },
            { name: 'Flask' },
            { name: 'REST APIs' },
            { name: 'GraphQL' },
        ],
        dataML: [
            { name: 'NumPy' },
            { name: 'Pandas' },
            { name: 'Scikit-learn' },
            { name: 'TensorFlow' },
        ],
        databases: [
            { name: 'MySQL' },
            { name: 'PostgreSQL' },
            { name: 'MongoDB' },
            { name: 'Firebase' },
        ],
        blockchain: [
            { name: 'Ethereum' },
            { name: 'Solidity' },
            { name: 'Hardhat' },
            { name: 'Ethers.js' },
            { name: 'Smart Contracts' },
        ],
        tools: [
            { name: 'VS Code' },
            { name: 'WebStorm' },
            { name: 'Postman' },
            { name: 'Git' },
            { name: 'GitHub' },
            { name: 'Linux' },
        ],
    };

    return (
        <div className="flex flex-col gap-6 p-4 max-mobile-lg:gap-4 max-mobile-lg:p-2">
            {Object.entries(categories).map(([category, skills]) => (
                <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl font-semibold mb-3 capitalize max-mobile-lg:text-2xl max-mobile-xs:text-xl">
                        {category === 'dataML' ? 'Data & ML' : category}
                    </h2>
                    <div className="flex flex-wrap justify-start items-center gap-5 max-mobile-lg:gap-3 max-mobile-xs:gap-2">
                        {skills.map((skill, index) => (
                            <motion.div
                                key={skill.name}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.1, // Cascading effect
                                    ease: 'easeOut',
                                }}
                                viewport={{ once: true }}
                                className="bg-secondary text-secondary-foreground text-2xl py-2 px-3 font-bold flex items-center justify-center border border-border rounded-lg hover:bg-secondary/90 hover:shadow-lg max-mobile-lg:text-lg max-mobile-lg:py-1.5 max-mobile-lg:px-2 max-mobile-xs:text-sm max-mobile-xs:py-1 max-mobile-xs:px-1.5"
                            >
                                <span>{skill.name}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default Skills;
