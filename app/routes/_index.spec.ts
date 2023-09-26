import { setupServer } from "msw/node";
import { rest } from "msw";
import { loader } from "./_index";
import { afterAll, afterEach, beforeAll } from "vitest";

const data = { data: "test" };

const restHandlers = [
  rest.get("http://localhost:3001/test", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(data));
  }),
];

const server = setupServer(...restHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

//  Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers());

test("bug reproduction", async () => {
  try {
    const response = await loader();
    const body = await response.json();

    expect(body).toMatchObject(data);
  } catch (e) {
    console.error("We are failing", e);
    expect(1).toBe(2);
  }
});
