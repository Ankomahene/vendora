import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { BecomeSeller } from './components/BecomeSeller';

export default async function BecomeSellerPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/auth/login');
  }

  // Get user profile to check if already a seller
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  // If user is already a seller, redirect to dashboard
  if (profile?.role === 'seller') {
    redirect('/dashboard');
  }

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-[#4a51e5]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-[#4a51e5] to-[#2fd48f] bg-clip-text text-transparent">
            Become a Seller
          </CardTitle>
          <CardDescription className="text-center">
            Start selling your services on our platform
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3 bg-muted p-3 rounded-md">
              <div className="bg-[#4a51e5] text-white rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <h3 className="font-medium">Showcase Your Services</h3>
                <p className="text-sm text-muted-foreground">
                  List your services, set your prices, and reach more customers
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 bg-muted p-3 rounded-md">
              <div className="bg-[#ff7b24] text-white rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <h3 className="font-medium">Get Discovered</h3>
                <p className="text-sm text-muted-foreground">
                  Customers can find you through search, location or category
                  filters
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 bg-muted p-3 rounded-md">
              <div className="bg-[#2fd48f] text-white rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <h3 className="font-medium">Grow Your Business</h3>
                <p className="text-sm text-muted-foreground">
                  Build a reputation with reviews and gain loyal customers
                </p>
              </div>
            </div>
          </div>

          <BecomeSeller />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            By becoming a seller, you agree to our{' '}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
          </div>

          <Button variant="outline" asChild className="w-full">
            <Link href="/dashboard">Cancel and Return to Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
