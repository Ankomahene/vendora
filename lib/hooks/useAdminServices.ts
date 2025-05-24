import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSellerStatus } from '@/services/admin';

export function useAdminServices() {
  const queryClient = useQueryClient();

  // Update seller status mutation
  const updateSellerStatusMutation = useMutation({
    mutationFn: ({
      userId,
      status,
      rejectionReason,
    }: {
      userId: string;
      status: 'approved' | 'rejected';
      rejectionReason: string;
    }) => updateSellerStatus({ userId, status, rejectionReason }),
    onSuccess: () => {
      // Invalidate sellers list and specific seller data
      queryClient.invalidateQueries({ queryKey: ['sellers'] });
    },
  });

  return {
    updateSellerStatus: updateSellerStatusMutation,
  };
}
