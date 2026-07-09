import { test as setup, request } from "@playwright/test";
import user from "../.auth/user.json";
import fs from "fs";
const authFile = ".auth/user.json";

setup("authentication", async ({ request }) => {
  const response = await request.post(
    "https://conduit-api.bondaracademy.com/api/users/login",
    {
      data: {
        user: { email: "mary-test@test.com", password: "123456789" },
      },
    },
  );

  const responseBody = await response.json();
  const token = responseBody.user.token;
  user.origins[0].localStorage[0].value = token;
  fs.writeFileSync(authFile, JSON.stringify(user));

  process.env["ACCESS_TOKEN"] = token;
});
