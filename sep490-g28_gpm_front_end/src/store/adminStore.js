import {create} from "zustand"

const adminStore = create((set) => ({
    isLoading: false,
    setIsLoading: (loading) => set({ isLoading: loading }),
}))

export default adminStore