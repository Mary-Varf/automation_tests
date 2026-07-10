import { test } from "../test-options";
import { faker } from "@faker-js/faker";

test("parametrized methods", async ({ pageManager }) => {
  const randomFullName = faker.person.fullName();
  const randomEmail = `${randomFullName.replace(/ /g, "")}${faker.number.int(10000)}@test.com`;

  await pageManager
    .onFormLayoutPage()
    .submitInlineFormWithNameEmailAndCheckbox(
      randomFullName,
      randomEmail,
      true,
    );
});
