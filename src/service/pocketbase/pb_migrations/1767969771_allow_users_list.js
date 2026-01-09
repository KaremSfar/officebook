/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("users");

  collection.listRule = "@request.auth.id != ''";
  collection.viewRule = "@request.auth.id != ''";

  app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("users");

  collection.listRule = null;
  collection.viewRule = "id = @request.auth.id";

  app.save(collection);
})
