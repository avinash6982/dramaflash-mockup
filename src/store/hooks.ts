import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "./index";

// Typed versions of the react-redux hooks, used everywhere instead of the plain ones
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
