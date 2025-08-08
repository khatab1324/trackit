import app from "./app";
import authRoute from "./interface/http/routers/auth.route";
import commentRouter from "./interface/http/routers/comment.route";
import followRouter from "./interface/http/routers/follow.route";
import helloRouters from "./interface/http/routers/hello.route";
import memoryRouter from "./interface/http/routers/memory.route";
import userRouters from "./interface/http/routers/user.route";

async function main() {
  try {
    app.register(helloRouters);
    app.register(userRouters);
    app.register(authRoute);
    app.register(memoryRouter);
    app.register(followRouter);
    app.register(commentRouter);
    app.listen({ port: 3000, host: "0.0.0.0" });
    console.log("Fastify server ready at http://localhost:3000");
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

main();
