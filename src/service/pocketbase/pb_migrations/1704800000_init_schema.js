migrate((app) => {
  // 1. Update the default 'users' collection to match Supabase 'profiles'
  const usersCollection = app.findCollectionByNameOrId("users");
  
  // Add fields from profiles
  usersCollection.fields.add(new TextField({
    "name": "full_name",
  }));
  usersCollection.fields.add(new URLField({
    "name": "website",
  }));
  // PocketBase already has 'avatar' (file) and 'username' (text) by default in 'users'

  app.save(usersCollection);

  // 2. Create 'attendance' collection
  const attendance = new Collection({
    "name": "attendance",
    "type": "base",
    "listRule": "", // Publicly viewable
    "viewRule": "", // Publicly viewable
    "createRule": "@request.auth.id != ''",
    "updateRule": null,
    "deleteRule": "@request.auth.id != ''",
  });

  attendance.fields.add(new RelationField({
    "name": "user_id",
    "required": true,
    "collectionId": usersCollection.id,
    "cascadeDelete": true,
    "maxSelect": 1
  }));

  attendance.fields.add(new DateField({
    "name": "date",
    "required": true
  }));

  attendance.indexes = [
    "CREATE UNIQUE INDEX idx_user_date ON attendance (user_id, date)"
  ];

  app.save(attendance);

}, (app) => {
  // Down migration (optional but good practice)
  try {
    const attendance = app.findCollectionByNameOrId("attendance");
    app.delete(attendance);
  } catch (e) {}
})
