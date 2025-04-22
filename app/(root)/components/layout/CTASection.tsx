import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="py-16 bg-gradient-to-br from-primary/70 to-primary/90 dark:from-primary/40 dark:to-primary relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to discover amazing local businesses?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of users who are finding the best local vendors in
            their area. Download our app today and start exploring!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-gray-200"
            >
              Get Started - It&apos;s Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white bg-primary/5 hover:bg-white/10"
            >
              How It Works
            </Button>
          </div>

          <div className="mt-12 pt-12 border-t border-white/20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatBox value="10K+" label="Active Users" />
            <StatBox value="500+" label="Vendor Partners" />
            <StatBox value="50+" label="Cities Covered" />
            <StatBox value="4.8/5" label="App Store Rating" />
          </div>
        </div>
      </div>
    </section>
  );
}

interface StatBoxProps {
  value: string;
  label: string;
}

function StatBox({ value, label }: StatBoxProps) {
  return (
    <div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-white/80 text-sm">{label}</div>
    </div>
  );
}
