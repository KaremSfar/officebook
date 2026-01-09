migrate((app) => {
  const collection = app.findCollectionByNameOrId('attendance');

  collection.createRule = '@request.auth.id != "" && @request.auth.id = user_id';
  collection.deleteRule = '@request.auth.id != "" && @request.auth.id = user_id';

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId('attendance');

  collection.createRule = '@request.auth.id != ""';
  collection.deleteRule = '@request.auth.id != ""';

  return app.save(collection);
})
