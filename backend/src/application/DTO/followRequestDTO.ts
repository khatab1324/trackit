export interface FollowRequestInput {
  requester_id: string;
  target_id: string;
}

export interface FollowRequestActionInput {
  request_id: string;
  user_id: string;
}

export interface FollowRequestResponse {
  success: boolean;
  message: string;
}

export interface FollowRequest {
  id: string;
  requester_id: string;
  target_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: Date;
}