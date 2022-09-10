const given = require("../../steps/given");
const when = require("../../steps/when");
const then = require("../../steps/then");
const chance = require("chance").Chance();
const path = require("path");

describe("Given an authenticated user", () => {
  let user;
  let profile;
  beforeAll(async () => {
    user = await given.an_authenticated_user();
  });

  it("The user can fetch his profile with getMyProfile", async () => {
    profile = await when.a_user_calls_getMyProfile(user);

    expect(profile).toMatchObject({
      id: user.username,
      name: user.name,
      createdAt: expect.stringMatching(
        /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?Z?/g
      ),
    });
  });

  it("The user can get an URL to upload new profile image", async () => {
    const uploadUrl = await when.a_user_calls_getImageUploadUrl(
      user,
      ".png",
      "image/png"
    );

    const bucketName = process.env.BUCKET_NAME;
    const regex = new RegExp(
      `https://${bucketName}.s3-accelerate.amazonaws.com/${user.username}/.*\.png\?.*Content-Type=image%2Fpng.*`
    );

    expect(uploadUrl).toMatch(regex);

    const filePath = path.join(__dirname, "../../data/LogoBig.png");
    await then.user_can_upload_image_to_url(uploadUrl, filePath, "image/png");

    const downloadUrl = uploadUrl.split("?")[0];
    await then.user_can_download_image_from(downloadUrl);
  });

  it("The user can edit his profile with editMyProfile", async () => {
    const newName = chance.first();
    const input = {
      name: newName,
    };

    const newProfile = await when.a_user_calls_editMyProfile(user, input);

    expect(newProfile).toMatchObject({
      ...profile,
      name: newName,
    });
  });
});
