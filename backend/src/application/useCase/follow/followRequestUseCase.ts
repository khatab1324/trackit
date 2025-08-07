import { FollowRequestInput, FollowRequestActionInput } from "../../DTO/followRequestDTO";
import { FollowRequestRepository } from "../../../domain/repositories/followRequestRepository";

export class FollowRequestUseCase {
  constructor(private followRequestRepository: FollowRequestRepository) {}

  async send(input: FollowRequestInput) {
    return this.followRequestRepository.sendFollowRequest(input);
  }

  async accept(input: FollowRequestActionInput) {
    return this.followRequestRepository.acceptFollowRequest(input);
  }

  async reject(input: FollowRequestActionInput) {
    return this.followRequestRepository.rejectFollowRequest(input);
  }

  async getRequests(user_id: string) {
    return this.followRequestRepository.getFollowRequests(user_id);
  }
}