import { create } from 'zustand';

interface CanvasState {
  selectedTaskId: string | null;
  isAddingTask: boolean;
  selectTask: (id: string | null) => void;
  setAddingTask: (value: boolean) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  selectedTaskId: null,
  isAddingTask: false,

  selectTask: (id) => set({ selectedTaskId: id }),
  setAddingTask: (value) => set({ isAddingTask: value }),
}));
