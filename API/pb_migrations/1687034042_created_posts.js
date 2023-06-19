migrate((db) => {
  const collection = new Collection({
    "id": "bffxz3b6p8tgj9o",
    "created": "2023-06-17 20:34:02.248Z",
    "updated": "2023-06-17 20:34:02.248Z",
    "name": "posts",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "owasenm6",
        "name": "title",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "mghzmdnd",
        "name": "description",
        "type": "editor",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "jlsuzlod",
        "name": "isActive",
        "type": "bool",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "aiiurayk",
        "name": "type",
        "type": "select",
        "required": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "admin",
            "user"
          ]
        }
      }
    ],
    "indexes": [
      "CREATE INDEX `idx_hbVG8bW` ON `posts` (`created`)"
    ],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("bffxz3b6p8tgj9o");

  return dao.deleteCollection(collection);
})
