import app from "./app";
import helloRouters from "./interface/http/routers/hello.route";

async function main() {
  try {
    await app.register(helloRouters);
    await app.listen({ port: 3000 });
    console.log("Fastify server ready at http://localhost:3000");
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

main();
