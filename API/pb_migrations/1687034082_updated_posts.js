migrate((db) => {
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

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bffxz3b6p8tgj9o")

  // remove
  collection.schema.removeField("9yo9hvkd")

  return dao.saveCollection(collection)
})
