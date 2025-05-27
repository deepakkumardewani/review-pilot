import { ID, Query, Permission, Role } from "appwrite";

import { account } from "@/lib/appwrite";
import { databases } from "@/lib/appwrite";
import logger from "@/lib/logger";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";
const USER_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID || "";

/**
 * Create a new user document when a user signs up
 */
export const createUserDocument = async (
  userId: string,
  name: string,
  email: string
) => {
  try {
    // Check if user document already exists
    const existingDocs = await databases.listDocuments(
      DATABASE_ID,
      USER_COLLECTION_ID,
      [Query.equal("userId", userId)]
    );

    if (existingDocs.total > 0) {
      return existingDocs.documents[0];
    }

    // Create new user document
    const newUser = await databases.createDocument(
      DATABASE_ID,
      USER_COLLECTION_ID,
      ID.unique(),
      {
        userId,
        name,
        email,
        bio: "",
        skills: "",
        workExperience: "",
        projects: "",
        contact: "",
        selectedTemplate: "",
        deploymentDetails: "",
        remainingRequests: 10,
        allowedRequestsPerDay: 10,
        requestsLastResetAt: new Date().toISOString(),
      },
      [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ]
    );
    return newUser;
  } catch (error) {
    // Handle specific error for duplicate documents
    // This helps in case two requests try to create a document simultaneously
    if (error instanceof Error && error.message.includes("duplicate")) {
      // Retrieve the existing document instead
      const docs = await databases.listDocuments(
        DATABASE_ID,
        USER_COLLECTION_ID,
        [Query.equal("userId", userId)]
      );

      if (docs.total > 0) {
        return docs.documents[0];
      }
    }
    throw error;
  }
};

/**
 * Helper function to get or create a user document
 */
export const getUserDocument = async (userId: string) => {
  try {
    logger.info(
      `[${new Date().toISOString()}] getUserDocument called for user: ${userId}`
    );

    // Check if user document already exists
    const existingDocs = await databases.listDocuments(
      DATABASE_ID,
      USER_COLLECTION_ID,
      [Query.equal("userId", userId)]
    );

    if (existingDocs.total > 0) {
      // Return existing document
      logger.info(
        `[${new Date().toISOString()}] getUserDocument found existing document: ${
          existingDocs.documents[0].$id
        }`
      );
      return {
        exists: true,
        document: existingDocs.documents[0],
      };
    } else {
      // Use createUserDocument to create a new document
      // This ensures we use a single path for document creation
      logger.info(
        `[${new Date().toISOString()}] No document found, calling createUserDocument...`
      );

      try {
        // Get user account info to pass to createUserDocument
        const userInfo = await account.get();

        // Call createUserDocument which already has duplicate checking logic
        const newDoc = await createUserDocument(
          userId,
          userInfo.name,
          userInfo.email
        );

        logger.info(
          `[${new Date().toISOString()}] Document created via createUserDocument: ${
            newDoc.$id
          }`
        );

        return {
          exists: false,
          document: newDoc,
        };
      } catch (error) {
        logger.error(
          `[${new Date().toISOString()}] Error in getUserDocument while creating:`,
          error
        );

        // Final attempt to get document in case it was created by another process
        const finalCheckDocs = await databases.listDocuments(
          DATABASE_ID,
          USER_COLLECTION_ID,
          [Query.equal("userId", userId)]
        );

        if (finalCheckDocs.total > 0) {
          logger.info(
            `[${new Date().toISOString()}] Found document in final check: ${
              finalCheckDocs.documents[0].$id
            }`
          );
          return {
            exists: true,
            document: finalCheckDocs.documents[0],
          };
        }

        throw error;
      }
    }
  } catch (error) {
    logger.error(
      `[${new Date().toISOString()}] Error in getUserDocument:`,
      error
    );
    throw error;
  }
};
