// import modules
import { Application } from "https://deno.land/x/oak/mod.ts";
import { green, yellow } from "https://deno.land/std@0.53.0/fmt/colors.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { Router } from "https://deno.land/x/oak/mod.ts";

const app = new Application();  // create a new instance of the application
const port: number = 8099; // set the port
app.use(
  oakCors({
    origin: "*",
    maxAge: 8640033
  }),
); // enable CORS


const router = new Router(); // create a new instance of the router
app.use(router.routes());
app.use(router.allowedMethods()) // enable routers

router.get('/health', async (ctx: any) => {
  ctx.response.body = {
    status: 'OK',
    message: 'SMS Server is running'
  };
}),  // health check


router
.post("/csv_upload", async (ctx: any) => {
  try {
    const body = await ctx.request.body(); // read the request body
    const data = await body.value.read({ maxSize: 20000000000 }); // read the request body

    // storage directory
    const uploadFile = await Deno.writeFile(`STORAGE_DIR/${data.files[0].originalName}`, data.files[0].content);
    if (data) {
      ctx.response.body = {
        status: true,
        status_code: 200,
        data: 'success',
      };  // send a response

      // let final = [];
      // const f = await Deno.open(`csvFiles/${data.files[0].originalName}`); // open the file

      // ctx.response.body = {
      //   status: true,
      //   status_code: 200,
      //   data: 'success',
      // };  // send a response
    }
  } catch (error) {
    ctx.response.status = 400;
    ctx.response.body = {
      status: false,
      message: `Error: ${error}`,
    };
  }

}), // file upload


app.addEventListener("error", (evt) => {
    console.log(evt.error);
  }); // error handler
app.use((ctx) => {
  ctx.throw(500);
}); // default error handler

app.addEventListener("listen", ({ secure, hostname, port }) => {
  const protocol = secure ? "https://" : "http://";
  const url = `${protocol}${hostname ?? "localhost"}:${port}`;
  console.log(`${yellow("Listening on:")} ${green(url)}`,);
}); // listen for requests
await app.listen({ port });   // listen for requests 
