import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService, type User, type PaginationMeta } from '../services/UserService';
import { useToast } from '../components/common/Toast';

export const useUsers = (page = 1, perPage = 10, role?: string) => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const {
        data,
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ['users', page, perPage, role],
        queryFn: () => UserService.getAllUsers(page, perPage, role),
    });

    const users: User[] = data?.data ?? [];
    const meta: PaginationMeta = data?.meta ?? {
        current_page: 1,
        next_page: null,
        prev_page: null,
        total_pages: 1,
        total_count: 0,
    };

    const createMutation = useMutation({
        mutationFn: (userData: Partial<User> & { password?: string, password_confirmation?: string }) =>
            UserService.createUser(userData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            showToast('Created successfully', 'success');
        },
        onError: (err: any) => {
            showToast(err.message || 'Failed to create', 'error');
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
            UserService.updateUser(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['artist_profiles'] });
            showToast('User updated successfully', 'success');
        },
        onError: (err: any) => {
            showToast(err.message || 'Failed to update user', 'error');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => UserService.deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['artist_profiles'] });
            showToast('User deleted successfully', 'success');
        },
        onError: (err: any) => {
            showToast(err.message || 'Failed to delete user', 'error');
        }
    });

    return {
        users,
        meta,
        isLoading,
        error,
        refetch,
        createUser: createMutation.mutateAsync,
        updateUser: updateMutation.mutate,
        deleteUser: deleteMutation.mutate,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending
    };
};
