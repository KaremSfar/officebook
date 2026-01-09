migrate((db) => {
  const dao = new Dao(db);

  // 1. Update the default 'users' collection to match Supabase 'profiles'
  const usersCollection = dao.findCollectionByNameOrId("users");
  
  // Add fields from profiles
  usersCollection.schema.addField(new SchemaField({
    "name": "full_name",
    "type": "text",
  }));
  usersCollection.schema.addField(new SchemaField({
    "name": "website",
    "type": "url",
  }));
  // PocketBase already has 'avatar' (file) and 'username' (text) by default in 'users'

  dao.saveCollection(usersCollection);

  // 2. Create 'attendance' collection
  const attendance = new Collection({
    "name": "attendance",
    "type": "base",
    "schema": [
      {
        "name": "user",
        "type": "relation",
        "required": true,
        "options": {
          "collectionId": usersCollection.id,
          "cascadeDelete": true,
          "maxSelect": 1
        }
      },
      {
        "name": "date",
        "type": "date",
        "required": true
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX idx_user_date ON attendance (user, date)"
    ],
    "listRule": "", // Publicly viewable
    "viewRule": "", // Publicly viewable
    "createRule": "@request.auth.id = user",
    "updateRule": null,
    "deleteRule": "@request.auth.id = user",
  });

  dao.saveCollection(attendance);

}, (db) => {
  // Down migration (optional but good practice)
  const dao = new Dao(db);
  
  try {
    const attendance = dao.findCollectionByNameOrId("attendance");
    dao.deleteCollection(attendance);
  } catch (e) {}
})
