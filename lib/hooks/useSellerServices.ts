import { useQuery } from '@tanstack/react-query';
import { getSellerProfile, getAllSellers } from '@/services/seller';

export function useSellerServices() {
  // Get seller profile query
  const useSellerProfile = (userId?: string) =>
    useQuery({
      queryKey: ['sellerProfile', userId],
      queryFn: () => getSellerProfile(userId),
      enabled: userId !== undefined,
    });

  // Get all sellers query
  const useAllSellers = (status?: string) =>
    useQuery({
      queryKey: ['sellers', status],
      queryFn: () => getAllSellers(status),
    });

  return {
    useSellerProfile,
    useAllSellers,
  };
}
