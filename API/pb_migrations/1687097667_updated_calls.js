migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zuzsuudhwz6accf")

  collection.indexes = [
    "CREATE INDEX `idx_Jl4L6RH` ON `calls` (`created`)"
  ]

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "pdhxjrqs",
    "name": "callType",
    "type": "select",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "Retail",
        "Tadawul"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zuzsuudhwz6accf")

  collection.indexes = []

  // remove
  collection.schema.removeField("pdhxjrqs")

  return dao.saveCollection(collection)
})
