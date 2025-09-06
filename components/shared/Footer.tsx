import React from 'react';

const SocialIcon: React.FC<{ href: string, children: React.ReactNode }> = ({ href, children }) => (
    <a href={href} className="text-gray-400 hover:text-white transition-colors">
        {children}
    </a>
);

const FooterLink: React.FC<{ href: string, children: React.ReactNode }> = ({ href, children }) => (
    <li>
        <a href={href} className="text-gray-400 hover:text-white transition-colors text-sm">
            {children}
        </a>
    </li>
);

const Footer: React.FC = () => {
    return (
        <footer className="w-full bg-gray-900 border-t border-gray-700 mt-auto">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Column 1: Logo and mission */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center space-x-3">
                            <img src="/public/assets/logo.png" alt="CareerAid Clinic Logo" className="h-8 w-auto" />
                            <span className="text-xl font-bold text-white">CareerAid Clinic</span>
                        </div>
                        <p className="mt-4 text-sm text-gray-400">Smart choices, brighter tomorrow!</p>
                    </div>

                    {/* Column 2: Resources */}
                    <div>
                        <h4 className="font-semibold text-white tracking-wider uppercase">Resources</h4>
                        <ul className="mt-4 space-y-3">
                            <FooterLink href="#">Blog</FooterLink>
                            <FooterLink href="#">FAQ</FooterLink>
                            <FooterLink href="#">Help Center</FooterLink>
                            <FooterLink href="#">Success Stories</FooterLink>
                        </ul>
                    </div>
                    
                    {/* Column 3: Company */}
                    <div>
                        <h4 className="font-semibold text-white tracking-wider uppercase">Company</h4>
                        <ul className="mt-4 space-y-3">
                            <FooterLink href="#">About Us</FooterLink>
                            <FooterLink href="#">Contact Us</FooterLink>
                            <FooterLink href="#">Careers</FooterLink>
                            <FooterLink href="#">Partnerships</FooterLink>
                        </ul>
                    </div>

                    {/* Column 4: Legal */}
                    <div>
                        <h4 className="font-semibold text-white tracking-wider uppercase">Legal</h4>
                        <ul className="mt-4 space-y-3">
                            <FooterLink href="#">Privacy Policy</FooterLink>
                            <FooterLink href="#">Terms of Service</FooterLink>
                            <FooterLink href="#">Cookie Policy</FooterLink>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col md:flex-row items-center justify-between">
                    <p className="text-sm text-gray-400 text-center md:text-left">&copy; {new Date().getFullYear()} CareerAid Clinic. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <SocialIcon href="#">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                        </SocialIcon>
                        <SocialIcon href="#">
                           <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                        </SocialIcon>
                        <SocialIcon href="#">
                           <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.389 0-1.601 1.086-1.601 2.206v4.248H8.014V8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.71zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.128 0c0 1.14-.931 2.065-2.065 2.065zm1.338 8.905H4.002V8.59h2.673v7.748zM17.668 1H6.328C3.965 1 2 2.981 2 5.354V18.646C2 21.019 3.965 23 6.328 23h11.34c2.363 0 4.328-1.981 4.328-4.354V5.354C22 2.981 20.032 1 17.668 1z"></path></svg>
                        </SocialIcon>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;