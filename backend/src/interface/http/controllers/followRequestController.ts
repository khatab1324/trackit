import { FastifyReply, FastifyRequest } from "fastify";
import { FollowRequestUseCase } from "../../../application/useCase/follow/followRequestUseCase";
import { FollowRequestRepositoryImp } from "../../../infrastructure/repositories/followRequestRepo";

export const sendFollowRequestController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { target_id } = request.body as { target_id: string };
    const userReq = request.user as { id: string };
    const requester_id = userReq.id;
    if (!requester_id) {
      return reply.code(401).send({ error: "Unauthorized" });
    }
    const result = await new FollowRequestUseCase(
      new FollowRequestRepositoryImp()
    ).send({ requester_id, target_id });
    reply.code(200).send({
      message: "Follow request sent",
      result,
    });
  } catch (error) {
    console.log(error);
    reply
      .code(500)
      .send({ error: "An error occurred while sending follow request" });
  }
};

export const acceptFollowRequestController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { request_id } = request.body as { request_id: string };
    const userReq = request.user as { id: string };
    const user_id = userReq.id;
    if (!user_id) {
      return reply.code(401).send({ error: "Unauthorized" });
    }
    const result = await new FollowRequestUseCase(
      new FollowRequestRepositoryImp()
    ).accept({ request_id, user_id });
    reply.code(200).send({
      message: "Follow request accepted",
      result,
    });
  } catch (error) {
    console.log(error);
    reply
      .code(500)
      .send({ error: "An error occurred while accepting follow request" });
  }
};

export const rejectFollowRequestController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { request_id } = request.body as { request_id: string };
    const userReq = request.user as { id: string };
    const user_id = userReq.id;
    if (!user_id) {
      return reply.code(401).send({ error: "Unauthorized" });
    }
    const result = await new FollowRequestUseCase(
      new FollowRequestRepositoryImp()
    ).reject({ request_id, user_id });
    reply.code(200).send({
      message: "Follow request rejected",
      result,
    });
  } catch (error) {
    console.log(error);
    reply
      .code(500)
      .send({ error: "An error occurred while rejecting follow request" });
  }
};

export const getFollowRequestsController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const userReq = request.user as { id: string };
    const user_id = userReq.id;
    if (!user_id) {
      return reply.code(401).send({ error: "Unauthorized" });
    }
    const result = await new FollowRequestUseCase(
      new FollowRequestRepositoryImp()
    ).getRequests(user_id);
    reply.code(200).send({
      message: "Follow requests retrieved",
      result,
    });
  } catch (error) {
    console.log(error);
    reply
      .code(500)
      .send({ error: "An error occurred while getting follow requests" });
  }
};