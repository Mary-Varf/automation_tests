import { request, expect } from "@playwright/test";

const globalTeardown = async () => {
  const context = await request.newContext();

  const deleteArticleResponse = await context.delete(
    `${process.env.CONDUIT_QA_URL}/articles/${process.env.SLUG_ID}`,
  );

  await expect(deleteArticleResponse.status()).toEqual(204);
};

export default globalTeardown;
