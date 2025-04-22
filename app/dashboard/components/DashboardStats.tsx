'use client';

import {
  ShoppingBag,
  Eye,
  MessageCircle,
  Star,
  TrendingUp,
  ChevronRight,
  CalendarDays,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DashboardStats } from '@/lib/types';

interface StatsProps {
  stats: DashboardStats;
  isSeller: boolean;
}

// Define the StatsItem type with optional link property
interface StatsItem {
  title: string;
  value: number | string;
  icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  color: string;
  trend: string;
  trendUp: boolean;
  link?: string;
}

export function DashboardStatsSection({ stats, isSeller }: StatsProps) {
  const commonItems: StatsItem[] = [
    {
      title: 'Total Views',
      value: stats.totalViews,
      icon: Eye,
      color: '#4a51e5',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Messages',
      value: stats.totalMessages,
      icon: MessageCircle,
      color: '#ff7b24',
      trend: '+5%',
      trendUp: true,
    },
    {
      title: 'Pending Reviews',
      value: stats.pendingReviews,
      icon: Star,
      color: '#ffb126',
      trend: '-',
      trendUp: false,
    },
  ];

  const sellerItems: StatsItem[] = [
    {
      title: 'Active Listings',
      value: stats.totalListings,
      icon: ShoppingBag,
      color: '#2fd48f',
      trend: 'View all',
      link: '/dashboard/listings',
      trendUp: false,
    },
    ...commonItems,
  ];

  const buyerItems: StatsItem[] = [
    {
      title: 'Recent Activity',
      value: '3 days ago',
      icon: CalendarDays,
      color: '#85e56f',
      trend: 'View history',
      link: '/dashboard/activity',
      trendUp: false,
    },
    ...commonItems,
  ];

  const items = isSeller ? sellerItems : buyerItems;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => (
        <Card
          key={index}
          className="overflow-hidden transition-all hover:shadow-md"
        >
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center">
              <div
                className="p-2 rounded-md mr-2"
                style={{ backgroundColor: `${item.color}10` }}
              >
                <item.icon className="h-4 w-4" style={{ color: item.color }} />
              </div>
              {item.title}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-2xl font-bold">{item.value}</CardTitle>
          </CardContent>
          <CardFooter className="pt-0">
            {item.link ? (
              <a
                href={item.link}
                className="text-xs text-muted-foreground flex items-center hover:text-primary transition-colors"
                style={{ color: item.color }}
              >
                {item.trend}
                <ChevronRight className="h-3 w-3 ml-1" />
              </a>
            ) : (
              <div
                className={`text-xs flex items-center ${
                  item.trendUp ? 'text-success' : 'text-muted-foreground'
                }`}
              >
                {item.trend}
                {item.trendUp && <TrendingUp className="h-3 w-3 ml-1" />}
              </div>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
