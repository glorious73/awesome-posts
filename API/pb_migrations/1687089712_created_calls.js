migrate((db) => {
  const collection = new Collection({
    "id": "zuzsuudhwz6accf",
    "created": "2023-06-18 12:01:52.940Z",
    "updated": "2023-06-18 12:01:52.940Z",
    "name": "calls",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "yc4rvrxb",
        "name": "callId",
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
        "id": "aeve3qzb",
        "name": "dialedNumber",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": "",
    "deleteRule": "",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("zuzsuudhwz6accf");

  return dao.deleteCollection(collection);
})
