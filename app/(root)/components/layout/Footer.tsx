import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  Twitter,
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div className="space-y-4">
            <Logo />
            <p className="text-zinc-600 dark:text-zinc-400">
              Discover local businesses, services, and products in your
              neighborhood. Vendora connects you with the best nearby options.
            </p>
            <div className="flex space-x-4">
              <SocialIcon icon={<Facebook size={18} />} />
              <SocialIcon icon={<Twitter size={18} />} />
              <SocialIcon icon={<Instagram size={18} />} />
              <SocialIcon icon={<Linkedin size={18} />} />
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-zinc-900 dark:text-white">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <FooterLink href="#about">About Us</FooterLink>
              <FooterLink href="#features">Features</FooterLink>
              <FooterLink href="#testimonials">Testimonials</FooterLink>
              <FooterLink href="#faq">FAQ</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-zinc-900 dark:text-white">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-zinc-600 dark:text-zinc-400">
                <Phone size={18} />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3 text-zinc-600 dark:text-zinc-400">
                <Mail size={18} />
                <span>contact@vendora.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-zinc-900 dark:text-white">
              Newsletter
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              Subscribe to our newsletter to get updates on new features and
              local vendors.
            </p>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Your email address"
                className="bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
              />
              <Button className="w-full bg-primary/90 hover:bg-primary">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4 md:mb-0">
            © 2025 Vendora. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a
              href="#"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-orange-500 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-orange-500 transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-orange-500 transition-colors"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

function FooterLink({ href, children }: FooterLinkProps) {
  return (
    <li>
      <a
        href={href}
        className="text-zinc-600 dark:text-zinc-400 hover:text-orange-500 transition-colors"
      >
        {children}
      </a>
    </li>
  );
}

interface SocialIconProps {
  icon: React.ReactNode;
}

function SocialIcon({ icon }: SocialIconProps) {
  return (
    <a
      href="#"
      className="h-9 w-9 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-orange-500 hover:text-white transition-colors"
    >
      {icon}
    </a>
  );
}
