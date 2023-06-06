const ItemModel = require('../Models/itemModel')
const mongoose = require('mongoose')


const isValidObjectId = function (value) {
    if (mongoose.Types.ObjectId.isValid(value)) {
        return true
    } else {
        return false
    }
}

const isValidString = function (data) {
    if (typeof data !== 'string' || data.trim().length == 0) {
        return false
    }
    return true
}


const getAllItems = async (req, res) => {
    try {
        let allItems = await ItemModel.find({ isDeleted: false })
        if (allItems.length == 0) {
            return res.status(404).send({ status: false, message: "No items found. Item list is empty." })
        } else {
            return res.status(200).send({ status: true, message: "All Items", data: allItems })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message })
    }
}

const getItemsById = async (req, res) => {
    try {
        let id = req.params.id
        if (!isValidObjectId(id)) {
            return res.status(400).send({ status: false, message: "Please provide valid id" });
        }

        let details = await ItemModel.findOne({ _id: id, isDeleted: false });
        if (!details) {
            return res.status(404).send({ status: false, message: "No such item exists" });
        }
        return res.status(200).send({ status: true, message: "Success", data: details });
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message })
    }
}

const createItem = async (req, res) => {
    try {
        let data = req.body

        if ((Object.keys(data).length == 0)) {
            return res.status(400).send({ status: false, message: "Please provide appropriate details" })
        }

        let { itemName, description, price, isDeleted } = data

        if (!itemName || !description) {
            return res.status(400).send({ status: false, message: "Invalid request body" })
        }

        if (!itemName) {
            return res.status(400).send({ status: false, message: "Item name is required" })
        }
        itemName = itemName.trim().toLowerCase()
        let itemNameExists = await ItemModel.findOne({ itemName: itemName })
        if (itemNameExists) {
            return res.status(409).send({ status: false, message: ` ItemName: ${itemName} already exists` })
        }

        if (!description) {
            return res.status(400).send({ status: false, message: "Item description is required" })
        }
        description = description.trim()

        if (isDeleted) {
            return res.status(400).send({ status: false, message: "You cannot delete a item at the time of creation" })
        }

        let newItem = ItemModel.create(data)
        return res.status(201).send({ status: true, message: "Item created successfully", data: newItem })

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message })
    }
}

const updateItem = async (req, res) => {
    try {
        let id = req.params.id
        if (!isValidObjectId(id)) {
            return res.status(400).send({ status: false, message: "Please provide valid id" });
        }

        let details = await ItemModel.findOne({ _id: id, isDeleted: false });
        if (!details) {
            return res.status(404).send({ status: false, message: "No such item exists" });
        }

        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: 'No data provided to update' })
        }

        let { itemName, description } = data

        let arr = ["itemName", "description"]
        if (!(Object.keys(data).every(ele => arr.includes(ele)))) {
            console.log(Object.keys(data))
            return res.status(400).send({ status: false, message: "Please Enter Valid Details To Updates" })
        }

        if (itemName) {
            if (!isValidString(itemName)) {
                return res.status(400).send({ status: false, message: 'Please enter valid item name' })
            }
            let isUniqueItemName = await ItemModel.findOne({ itemName: itemName })
            if (isUniqueItemName) {
                return res.status(400).send({ status: false, message: 'Item name already exist, Please provide a unique item name' })
            }
        }

        if (description) {
            if (!isValidString(description)) {
                return res.status(400).send({ status: false, message: 'Please enter valid description' })
            }
        }

        let updatedItem = await ItemModel.findOneAndUpdate({ _id: id, isDeleted: false }, data, { new: true })
        return res.status(200).send({ status: true, message: 'Success', data: updatedItem })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message })
    }
}

const deleteItem = async (req, res) => {
    try {
        let id = req.params.id
        if (!isValidObjectId(id)) {
            return res.status(400).send({ status: false, message: 'Please provide a valid id' })
        }

        let item = await ItemModel.findOne({ _id: id, isDeleted: false })
        if (!item) {
            return res.status(404).send({ status: false, message: 'No item present with this id, please provide another valid id ' })
        }


        let deletedItem = await ItemModel.findOneAndUpdate({ _id: id },
            {
                $set: { isDeleted: true }
            })

        return res.status(200).send({ status: true, message: 'Item deleted successfully' })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { getAllItems, getItemsById, createItem, updateItem, deleteItem }