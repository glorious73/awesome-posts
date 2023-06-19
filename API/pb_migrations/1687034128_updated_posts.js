migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bffxz3b6p8tgj9o")

  // remove
  collection.schema.removeField("9yo9hvkd")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "5tbrecqf",
    "name": "userId",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bffxz3b6p8tgj9o")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "9yo9hvkd",
    "name": "userId",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  // remove
  collection.schema.removeField("5tbrecqf")

  return dao.saveCollection(collection)
})
