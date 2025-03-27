import { create } from 'zustand';

const useProjectStore = create((set) => ({
    isMember: false,
    setIsMember: (isMember) => set({ isMember }),
}));

export default useProjectStore;