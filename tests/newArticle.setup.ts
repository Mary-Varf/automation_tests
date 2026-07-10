import { test as setup } from "../test-option-conduit";
import { expect } from "@playwright/test";

setup("create new article", async ({ page, conduitQaURL, request }) => {
  const articleResponse = await request.post(`${conduitQaURL}/articles/`, {
    data: {
      article: {
        title: "Likes Test title",
        description: "Likes Test description",
        body: "Likes Test body",
        tagList: [],
      },
    },
  });

  expect(articleResponse.status()).toEqual(201);

  const response = await articleResponse.json();
  const slugId = response.article.slug;
  process.env["SLUG_ID"] = slugId;
});
