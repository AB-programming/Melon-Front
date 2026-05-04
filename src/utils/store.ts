import { create } from 'zustand';
import { User } from '@/utils/types';

type State = {
  user: User;
  avatarVersion: number;
};

type Action = {
  updateUser: (user: State['user']) => void;
  updateAvatarVersion: () => void;
};

const useStore = create<State & Action>((set) => ({
  user: { id: '', username: '', avatarUrl: '', nickname: '', signature: '' },
  avatarVersion: 0,
  updateUser: (user) => set(() => ({ user: { ...user } })),
  updateAvatarVersion: () => set((state) => ({avatarVersion: state.avatarVersion + 1}))
}));

export { useStore };
