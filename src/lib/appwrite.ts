import { Client, Account, ID, Storage, Databases } from "appwrite";

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1"
  )
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "your-project-id");

// Export initialized services
export const account = new Account(client);
export const storage = new Storage(client);
export const databases = new Databases(client);
export { client };
