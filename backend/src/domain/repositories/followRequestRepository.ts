import { FollowRequestInput, FollowRequestActionInput, FollowRequestResponse, FollowRequest } from "../../application/DTO/followRequestDTO";
import { Follower } from "../entities/Follower";

export interface FollowRequestRepository {
  sendFollowRequest(input: FollowRequestInput): Promise<FollowRequestResponse>;
  acceptFollowRequest(input: FollowRequestActionInput): Promise<FollowRequestResponse>;
  rejectFollowRequest(input: FollowRequestActionInput): Promise<FollowRequestResponse>;
  getFollowRequests(user_id: string): Promise<FollowRequest[]>;
  getFollowers(user_id: string): Promise<Follower[]>;
}