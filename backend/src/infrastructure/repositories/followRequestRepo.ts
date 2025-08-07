import { eq, and } from "drizzle-orm";
import { FollowRequestInput, FollowRequestActionInput, FollowRequestResponse, FollowRequest } from "../../application/DTO/followRequestDTO";
import { FollowRequestRepository } from "../../domain/repositories/followRequestRepository";
import { db } from "../db/connection";
import { followRequests } from "../db/schema/followRequestSchema";

export class FollowRequestRepositoryImp implements FollowRequestRepository {
  async sendFollowRequest(input: FollowRequestInput): Promise<FollowRequestResponse> {
    try {
      // Check if a pending request already exists
      const existing = await db
        .select()
        .from(followRequests)
        .where(
          and(
            eq(followRequests.requester_id, input.requester_id),
            eq(followRequests.target_id, input.target_id),
            eq(followRequests.status, "pending")
          )
        )
        .limit(1);
      if (existing.length > 0) {
        return { success: false, message: "Follow request already sent and pending." };
      }
      await db.insert(followRequests).values({
        requester_id: input.requester_id,
        target_id: input.target_id,
        status: "pending",
      });
      return { success: true, message: "Follow request sent." };
    } catch (error) {
      console.error("Error sending follow request:", error);
      throw new Error("Failed to send follow request");
    }
  }

  async acceptFollowRequest(input: FollowRequestActionInput): Promise<FollowRequestResponse> {
    try {
      const updated = await db
        .update(followRequests)
        .set({ status: "accepted" })
        .where(
          and(
            eq(followRequests.id, input.request_id),
            eq(followRequests.target_id, input.user_id),
            eq(followRequests.status, "pending")
          )
        );
      if (updated.rowCount === 0) {
        return { success: false, message: "No pending follow request found to accept." };
      }
      return { success: true, message: "Follow request accepted." };
    } catch (error) {
      console.error("Error accepting follow request:", error);
      throw new Error("Failed to accept follow request");
    }
  }

  async rejectFollowRequest(input: FollowRequestActionInput): Promise<FollowRequestResponse> {
    try {
      const updated = await db
        .update(followRequests)
        .set({ status: "rejected" })
        .where(
          and(
            eq(followRequests.id, input.request_id),
            eq(followRequests.target_id, input.user_id),
            eq(followRequests.status, "pending")
          )
        );
      if (updated.rowCount === 0) {
        return { success: false, message: "No pending follow request found to reject." };
      }
      return { success: true, message: "Follow request rejected." };
    } catch (error) {
      console.error("Error rejecting follow request:", error);
      throw new Error("Failed to reject follow request");
    }
  }

  async getFollowRequests(user_id: string): Promise<FollowRequest[]> {
    try {
      const requests = await db
        .select()
        .from(followRequests)
        .where(eq(followRequests.target_id, user_id));
      return requests as FollowRequest[];
    } catch (error) {
      console.error("Error getting follow requests:", error);
      throw new Error("Failed to get follow requests");
    }
  }
}