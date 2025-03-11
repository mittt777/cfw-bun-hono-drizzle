import { Hono } from 'hono';
import {streamSSE } from 'hono/streaming';
import postgres from "postgres";

const sql = postgres(
  "postgresql://postgres.nfzomzhmgexrwhdgpexo:GqSrLZbwWtIrwy7H@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
  //"postgresql://postgres:GqSrLZbwWtIrwy7H@db.nfzomzhmgexrwhdgpexo.supabase.co:5432/postgres",
);
//"postgresql://postgres.nfzomzhmgexrwhdgpexo:GqSrLZbwWtIrwy7H@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
const app = new Hono()

app.get('/ss', async (c) => {
  const resp = await sql`
    SELECT * 
    FROM test_table`
  return c.json(resp)
})
//const app = new Hono();
app.get('/sse', async (c) => {
  let id = 0;
  return streamSSE(c, async (stream) => {
    let ended = false;
    while (true) {
      stream.onAbort(() => {
        if (!ended) {
          ended = true
          console.log('Stream aborted')
        }
      })
      const message = `It is ${new Date().toISOString()}`
      await stream.writeSSE({
        data: String(id++)
      })
      await stream.sleep(100)
    }
  })
})

app.get("/api/hello", (c) => {
  return c.json({
    ok: true,
    message: "Hello Hono!",
  });
});
app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.get('/codebrew', (c) => {
  return c.text('subscribe!');
});

export default app;
