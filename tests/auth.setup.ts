import { request } from "@playwright/test";
import { test as setup } from "../test-option-conduit";
import user from "../.auth/user.json";
import fs from "fs";
const authFile = ".auth/user.json";

setup("authentication", async ({ request, conduitQaURL }) => {
  const response = await request.post(`${conduitQaURL}/users/login`, {
    data: {
      user: { email: "mary-test@test.com", password: "123456789" },
    },
  });

  const responseBody = await response.json();
  const token = responseBody.user.token;
  user.origins[0].localStorage[0].value = token;
  fs.writeFileSync(authFile, JSON.stringify(user));

  process.env["ACCESS_TOKEN"] = token;
});
