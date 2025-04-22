import React from 'react';
import { Badge } from './ui/badge';

export const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'approved':
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-100 dark:hover:bg-green-800 border-green-200 dark:border-green-800">
          Approved
        </Badge>
      );
    case 'rejected':
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800 border-red-200 dark:border-red-800">
          Rejected
        </Badge>
      );
    default:
      return (
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-100 dark:hover:bg-amber-800 border-amber-200 dark:border-amber-800">
          Pending
        </Badge>
      );
  }
};
