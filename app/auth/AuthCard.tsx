import { Logo } from '@/components/Logo';
import { Card } from '@/components/ui/card';
import { ReactNode } from 'react';

interface Props {
  title: string;
  description?: string;
  children: ReactNode;
}

export const AuthCard = ({ title, description, children }: Props) => {
  return (
    <div className="container flex min-h-screen w-screen flex-col items-center justify-center mx-auto p-4 space-y-12">
      <Logo />
      <Card className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] p-6 bg-gray-50 dark:bg-black">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {children}
      </Card>
    </div>
  );
};
