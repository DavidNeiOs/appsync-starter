const given = require("../../steps/given");
const when = require("../../steps/when");
const chance = require("chance").Chance();
const path = require("path");

describe("Mutation.editMyProfile.request template", () => {
  it("should use newProfile fields in expression values", () => {
    const templatePath = path.resolve(
      __dirname,
      "../../../mapping-templates/Mutation.editMyProfile.request.vtl"
    );

    const username = chance.guid();
    const newProfile = {
      name: "TestName",
      imageUrl: null,
    };
    const context = given.an_appsync_context(
      { username },
      {
        newProfile,
      }
    );
    const result = when.we_invoke_an_appsync_template(templatePath, context);

    expect(result).toEqual({
      version: "2018-05-29",
      operation: "UpdateItem",
      key: {
        id: {
          S: username,
        },
      },
      update: {
        expression: "set #name = :name, imageUrl = :imageUrl",
        expressionNames: {
          "#name": "name",
        },
        expressionValues: {
          ":name": {
            S: "TestName",
          },
          ":imageUrl": {
            NULL: true,
          },
        },
      },
      condition: {
        expression: "attribute_exists(id)",
      },
    });
  });
});
