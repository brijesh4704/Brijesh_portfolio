import Link from 'next/link';
import Section from '../global/Section';
import { ModeToggle } from '../theme/theme-toggle';
import { Button } from '../ui/button';
import logo from '@/assets/images/logo.svg';
import Image from 'next/image';
import NavMenu from './NavMenu';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { MenuIcon } from 'lucide-react';

const Header: React.FC = () => {
    return (
        <Section className="bg-background/60 backdrop-blur-lg py-4 border-b border-border sticky top-0 z-50">
            <div className="flex justify-between items-center">
                <h1 className="basis-1/6 flex justify-center items-center min-w-0">
                    <Link
                        href="/"
                        className="text-primary text-2xl font-bold hover:text-primary no-underline text-nowrap select-none flex items-center gap-2 h-10 max-mobile-sm:h-8 max-mobile-sm:text-lg max-mobile-xs:text-base"
                        aria-label="Home"
                    >
                        <Image
                            src={logo}
                            alt="Brijesh Singh Logo"
                            className="h-full max-w-10 -translate-y-1 max-mobile-sm:max-w-8 max-mobile-xs:max-w-6"
                        />
                        <span className="truncate">Brijesh Singh</span>
                    </Link>
                </h1>
                <div className="max-tablet-lg:hidden basis-4/6 flex justify-center">
                    <NavMenu />
                </div>
                <div className="basis-1/6 flex items-center justify-end gap-2">
                    <Link
                        href="#"
                        target="_blank"
                    >
                        <Button className="font-bold">Resume</Button>
                    </Link>
                    <ModeToggle />
                    <div className="hidden max-tablet-lg:block">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="w-10 h-10 rounded-full" aria-label="Open menu">
                                    <MenuIcon />
                                </Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetTitle>Menu</SheetTitle>
                                <NavMenu />
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default Header;
