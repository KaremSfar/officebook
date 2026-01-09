/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("attendance");

  collection.fields.add(new TextField({
    "name": "comment",
    "required": false,
  }));

  app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("attendance");

  collection.fields.removeByName("comment");

  app.save(collection);
})
