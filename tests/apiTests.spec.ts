import { test, expect, request } from "@playwright/test";
import tags from "../test-data/tags.json";

test.beforeEach(async ({ page }) => {
  await page.route(
    "https://conduit-api.bondaracademy.com/api/tags",
    async (route) => {
      await route.fulfill({ body: JSON.stringify(tags) });
    },
  );

  await page.goto("https://conduit.bondaracademy.com/");
});

test("has title", async ({ page }) => {
  await page.route(
    "https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0",
    async (route) => {
      const response = await route.fetch();
      const responseBody = await response.json();
      responseBody.articles[0].title = "MOCK Test title";
      responseBody.articles[0].description = "MOCK Test description";

      await route.fulfill({
        body: JSON.stringify(responseBody),
      });
    },
  );

  await page.getByText("Global Feed").click();

  await page.waitForTimeout(500);
  await expect(page.locator("nav .navbar-brand")).toHaveText("conduit");
  await expect(page.locator("app-article-list h1").first()).toContainText(
    "MOCK Test title",
  );
  await expect(page.locator("app-article-list p").first()).toContainText(
    "MOCK Test description",
  );
});

test("delete article", async ({ page, request }) => {
  const articleResponse = await request.post(
    "https://conduit-api.bondaracademy.com/api/articles/",
    {
      data: {
        article: {
          title: "Test title",
          description: "Test description",
          body: "Test body",
          tagList: [],
        },
      },
    },
  );

  expect(articleResponse.status()).toEqual(201);

  await page.getByText("Global Feed").click();
  await page.getByText("Test title").click();
  await page.getByRole("button", { name: "Delete Article" }).first().click();
  await page.getByText("Global Feed").click();

  await expect(page.locator("app-article-list h1").first()).not.toContainText(
    "Test title",
  );
});

test("crete article", async ({ page, request }) => {
  await page.getByText("New Article").click();
  await page
    .getByRole("textbox", { name: "Article Title" })
    .fill("new article");
  await page
    .getByRole("textbox", { name: "What's this article about?" })
    .fill("new article about");
  await page
    .getByRole("textbox", { name: "Write your article (in markdown)" })
    .fill("new article body");
  await page.getByRole("button", { name: " Publish Article " }).click();
  const articleResponse = await page.waitForResponse(
    "https://conduit-api.bondaracademy.com/api/articles/",
  );
  const articleResponseBody = await articleResponse.json();
  const slugId = articleResponseBody?.article?.slug;

  await expect(page.locator(".article-page h1")).toContainText("new article");

  await page.getByText("Home").click();
  await page.getByText("Global Feed").click();

  await expect(page.locator("app-article-preview h1").first()).toContainText(
    "new article",
  );

  const deleteArticleResponse = await request.delete(
    `https://conduit-api.bondaracademy.com/api/articles/${slugId}`,
  );

  await expect(deleteArticleResponse.status()).toEqual(204);
});
