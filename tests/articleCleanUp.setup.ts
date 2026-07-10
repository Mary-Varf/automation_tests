import { test as setup } from "../test-option-conduit";
import { expect } from "@playwright/test";

setup("delete article", async ({ request, conduitQaURL }) => {
  const deleteArticleResponse = await request.delete(
    `${conduitQaURL}/articles/${process.env.SLUG_ID}`,
  );
  console.log(process.env.SLUG_ID);

  await expect(deleteArticleResponse.status()).toEqual(204);
});
