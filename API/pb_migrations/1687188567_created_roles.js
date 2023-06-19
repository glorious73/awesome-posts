migrate((db) => {
  const collection = new Collection({
    "id": "y0mxlsocbbhjss6",
    "created": "2023-06-19 15:29:27.216Z",
    "updated": "2023-06-19 15:29:27.216Z",
    "name": "roles",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "ruzgrf6l",
        "name": "name",
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
  const collection = dao.findCollectionByNameOrId("y0mxlsocbbhjss6");

  return dao.deleteCollection(collection);
})
