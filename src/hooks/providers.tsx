"use client"; // Required in Next.js for Context Providers

import { Provider, TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, store } from "@/store/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
// Typed dispatch and selector hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;