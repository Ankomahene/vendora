'use client';
import { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { Separator } from '@/components/ui/separator';
import { createClient } from '@/lib/supabase/client';
import { signOutUser } from '@/lib/auth';
import { usePathname, useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';

export function Header() {
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function getUser() {
      setIsLoading(true);
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setIsLoading(false);
    }

    getUser();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      router.refresh();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white dark:bg-zinc-900 shadow-md py-4'
          : 'bg-transparent py-6'
      )}
    >
      <div className="container flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <NavLink href="#features" isScrolled={isScrolled}>
            Features
          </NavLink>
          <NavLink href="#trending" isScrolled={isScrolled}>
            Explore
          </NavLink>
          <NavLink href="#testimonials" isScrolled={isScrolled}>
            Testimonials
          </NavLink>
          <NavLink href="#about" isScrolled={isScrolled}>
            About
          </NavLink>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </Button>

          {!isLoading && (
            <>
              {user ? (
                <div className="flex items-center space-x-2">
                  {pathname !== '/dashboard' && (
                    <>
                      <Link href="/dashboard">Dashboard</Link>
                      <Separator orientation="vertical" className="h-4 w-0.5" />
                    </>
                  )}
                  <Button variant="ghost" size="sm" onClick={handleSignOut}>
                    <LogOut size={18} className="mr-2" />
                    Sign out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/auth/login">Log in</Link>
                  <Separator orientation="vertical" className="h-4 w-0.5" />
                  <Link href="/auth/signup">Sign up</Link>
                </div>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-900 shadow-lg">
          <nav className="container py-4 flex flex-col space-y-4">
            <MobileNavLink
              href="#features"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </MobileNavLink>
            <MobileNavLink
              href="#trending"
              onClick={() => setIsMenuOpen(false)}
            >
              Explore
            </MobileNavLink>
            <MobileNavLink
              href="#testimonials"
              onClick={() => setIsMenuOpen(false)}
            >
              Testimonials
            </MobileNavLink>
            <MobileNavLink href="#about" onClick={() => setIsMenuOpen(false)}>
              About
            </MobileNavLink>

            {!isLoading && (
              <>
                {user ? (
                  <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 flex flex-col space-y-2">
                    <Link href="/dashboard">
                      <Button
                        variant="link"
                        size="sm"
                        className="w-full justify-start"
                      >
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="default" size="sm" onClick={handleSignOut}>
                      Sign out
                    </Button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 flex space-x-4">
                    <Link href="/auth/login">
                      <Button variant="link" size="sm" className="flex-1">
                        Log in
                      </Button>
                    </Link>
                    <Link href="/auth/signup">
                      <Button variant="default" size="sm">
                        Sign up
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

interface NavLinkProps {
  href: string;
  isScrolled: boolean;
  children: React.ReactNode;
}

function NavLink({ href, isScrolled, children }: NavLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        'font-medium hover:text-orange-500 transition-colors',
        isScrolled
          ? 'text-zinc-700 dark:text-zinc-300'
          : 'text-zinc-700 dark:text-zinc-300'
      )}
    >
      {children}
    </a>
  );
}

interface MobileNavLinkProps {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}

function MobileNavLink({ href, onClick, children }: MobileNavLinkProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="font-medium text-zinc-700 dark:text-zinc-300 hover:text-orange-500 transition-colors py-2"
    >
      {children}
    </a>
  );
}
