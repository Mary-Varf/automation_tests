import fs from "fs";
import { request, expect } from "@playwright/test";
// @ts-ignore
import user from "./.auth/user.json";

const globalSetup = async () => {
  const authFile = "./.auth/user.json";
  const context = await request.newContext();

  const responseToken = await context.post(
    `${process.env.CONDUIT_QA_URL}/users/login`,
    {
      data: {
        user: { email: "mary-test@test.com", password: "123456789" },
      },
    },
  );

  const responseBody = await responseToken.json();
  const token = responseBody.user.token;
  user.origins[0].localStorage[0].value = token;
  fs.writeFileSync(authFile, JSON.stringify(user));

  process.env["ACCESS_TOKEN"] = token;

  const articleResponse = await context.post(
    `${process.env.CONDUIT_QA_URL}/articles/`,
    {
      data: {
        article: {
          title: "Likes Test title",
          description: "Likes Test description",
          body: "Likes Test body",
          tagList: [],
        },
      },
      headers: {
        Authorization: `Token ${process.env.ACCESS_TOKEN}`,
      },
    },
  );

  expect(articleResponse.status()).toEqual(201);

  const response = await articleResponse.json();
  const slugId = response.article.slug;
  process.env["SLUG_ID"] = slugId;
};

export default globalSetup;
