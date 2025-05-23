'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  ShoppingBag,
  Star,
  Settings,
  Layers,
  LineChart,
  ChevronRight,
} from 'lucide-react';

export default function AdminPage() {
  const [stats, setStats] = useState({
    categories: 0,
    productTypes: 0,
    sellers: 0,
    pendingApprovals: 0,
    totalListings: 0,
    flaggedReviews: 0,
  });
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch categories count
        const { count: categoriesCount, error: categoriesError } =
          await supabase
            .from('categories')
            .select('*', { count: 'exact', head: true });

        if (categoriesError) throw categoriesError;

        // Fetch product types count
        const { count: productTypesCount, error: productTypesError } =
          await supabase
            .from('product_types')
            .select('*', { count: 'exact', head: true });

        if (productTypesError) throw productTypesError;

        // Fetch sellers count
        const { count: sellersCount, error: sellersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'seller');

        if (sellersError) throw sellersError;

        // Fetch pending sellers count
        const { count: pendingApprovals, error: pendingApprovalsError } =
          await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'seller')
            .eq('seller_status', 'pending');

        if (pendingApprovalsError) throw pendingApprovalsError;

        // Fetch total listings count
        const { count: totalListings, error: totalListingsError } =
          await supabase
            .from('listings')
            .select('*', { count: 'exact', head: true });

        if (totalListingsError) throw totalListingsError;

        setStats((prev) => ({
          ...prev,
          categories: categoriesCount || 0,
          productTypes: productTypesCount || 0,
          sellers: sellersCount || 0,
          pendingApprovals: pendingApprovals || 0,
          totalListings: totalListings || 0,
        }));
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage your platform and monitor key metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-[#4a51e5]/10 to-transparent border-[#4a51e5]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="h-5 w-5 mr-2 text-[#4a51e5]" />
              Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loading ? '...' : stats.pendingApprovals}
            </div>
            <p className="text-sm text-muted-foreground">
              Sellers awaiting approval
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" asChild className="px-0 text-[#4a51e5]">
              <Link href="/admin/sellers">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-gradient-to-br from-[#ff7b24]/10 to-transparent border-[#ff7b24]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2 text-[#ff7b24]" />
              Total Listings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loading ? '...' : stats.totalListings}
            </div>
            <p className="text-sm text-muted-foreground">
              Products and services listed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#2fd48f]/10 to-transparent border-[#2fd48f]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Star className="h-5 w-5 mr-2 text-[#2fd48f]" />
              Flagged Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.flaggedReviews}</div>
            <p className="text-sm text-muted-foreground">
              Reviews needing moderation
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" asChild className="px-0 text-[#2fd48f]">
              <Link href="/admin/reviews">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="analytics">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="recent">Recent Activity</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="analytics" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LineChart className="h-5 w-5 mr-2 text-primary" />
                    Platform Overview
                  </CardTitle>
                  <CardDescription>
                    Key metrics and platform performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center border rounded-lg bg-muted/40">
                    <p className="text-muted-foreground">
                      Analytics dashboard will be displayed here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recent" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest actions and events on the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <div className="flex justify-between items-center mb-1">
                        <div className="font-medium">
                          New Seller Registration
                        </div>
                        <div className="text-xs text-muted-foreground">
                          2 hours ago
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        John Doe registered as a new seller
                      </p>
                    </div>

                    <div className="border-b pb-4">
                      <div className="flex justify-between items-center mb-1">
                        <div className="font-medium">Listing Approved</div>
                        <div className="text-xs text-muted-foreground">
                          5 hours ago
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Admin approved &quot;Professional Plumbing
                        Services&quot;
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="font-medium">Review Flagged</div>
                        <div className="text-xs text-muted-foreground">
                          1 day ago
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        A review for &quot;Home Cleaning Service&quot; was
                        flagged
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Reports</CardTitle>
                  <CardDescription>
                    Generated reports and data exports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No reports have been generated yet</p>
                    <Button variant="outline" className="mt-4">
                      Generate Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Layers className="h-5 w-5 mr-2 text-primary" />
                Platform Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-muted p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">
                    Categories
                  </div>
                  <div className="text-xl font-bold">
                    {loading ? '...' : stats.categories}
                  </div>
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">
                    Product Types
                  </div>
                  <div className="text-xl font-bold">
                    {loading ? '...' : stats.productTypes}
                  </div>
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">
                    Active Sellers
                  </div>
                  <div className="text-xl font-bold">
                    {loading ? '...' : stats.sellers}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Settings className="h-5 w-5 mr-2 text-primary" />
                Admin Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-between"
                >
                  <Link href="/admin/settings">
                    Platform Settings
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-between"
                >
                  <Link href="/admin/categories">
                    Manage Categories
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-between"
                >
                  <Link href="/admin/product-types">
                    Manage Product Types
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-between"
                >
                  <Link href="/admin/sellers">
                    User Management
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
