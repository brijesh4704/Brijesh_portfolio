import React from 'react';
import Section from '@/components/global/Section';

const FooterSection: React.FC = () => {
    // Get the current year
    const currentYear = new Date().getFullYear();

    return (
        <Section className={'border-t border-border py-6 max-mobile-lg:py-4'}>
            <div className="text-center">
                <p className="text-muted-foreground max-mobile-lg:text-sm max-mobile-xs:text-xs">
                    Made by Brijesh Singh @ All rights reserved | {currentYear}
                </p>
            </div>
        </Section>
    );
};

export default FooterSection;
