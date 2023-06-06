const express = require('express')
const router = express.Router()

const { getAllItems, getItemsById, createItem, updateItem, deleteItem } = require('../Controllers/itemController')

router.get("/api/items", getAllItems)
router.get("/api/items/:id", getItemsById)
router.post("/api/items", createItem)
router.put("/api/items/:id", updateItem)
router.delete("/api/items/:id", deleteItem)

module.exports = router