import { AuthSlice } from "./slices/authSlice";
import { RepositorySlice } from "./slices/repositorySlice";
import { FileSlice } from "./slices/fileSlice";
import { ReviewSlice } from "./slices/reviewSlice";

// This type is used to prevent circular dependencies
export type StoreState = AuthSlice & RepositorySlice & FileSlice & ReviewSlice;
