import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileService, Profile } from '../services/profileService';
import { useUser } from './useAuth';

export const useProfile = () => {
  const { data: user } = useUser();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => (user ? profileService.getProfile(user.id) : null),
    enabled: !!user?.id,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (updates: Partial<Profile>) => {
      if (!user) throw new Error('User not authenticated');
      return profileService.updateProfile(user.id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: (password: string) => profileService.updatePassword(password),
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!user) throw new Error('User not authenticated');
      return profileService.uploadAvatar(user.id, file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  return {
    profile,
    isLoading,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
    updatePassword: updatePasswordMutation.mutateAsync,
    isUpdatingPassword: updatePasswordMutation.isPending,
    uploadAvatar: uploadAvatarMutation.mutateAsync,
    isUploading: uploadAvatarMutation.isPending,
  };
};
