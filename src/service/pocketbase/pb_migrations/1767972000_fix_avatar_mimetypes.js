/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("users");
  const avatarField = collection.fields.getByName("avatar");
  
  if (avatarField) {
    avatarField.mimeTypes = [
      "image/jpeg",
      "image/png",
      "image/svg+xml",
      "image/gif",
      "image/webp",
      "image/heic",
      "image/heif"
    ];
    app.save(collection);
  }
}, (app) => {
  // No-op
})