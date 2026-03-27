var express = require('express');
var router = express.Router();
let inventoryModel = require('../schemas/inventories')
let productModel = require('../schemas/products')
let { InventoryQuantityValidator, validatedResult } = require('../utils/validator')

const inventoryPopulate = {
  path: 'product',
  match: {
    isDeleted: false
  },
  populate: {
    path: 'category',
    select: 'name slug image'
  }
}

async function ensureInventoryForProduct(productId) {
  let product = await productModel.findOne({
    _id: productId,
    isDeleted: false
  });

  if (!product) {
    return null;
  }

  await inventoryModel.updateOne(
    {
      product: productId
    },
    {
      $setOnInsert: {
        product: productId,
        stock: 0,
        reserved: 0,
        soldCount: 0
      }
    },
    {
      upsert: true
    }
  )

  return product;
}

router.get('/', async function (req, res, next) {
  let result = await inventoryModel.find().populate(inventoryPopulate);
  result = result.filter(function (item) {
    return item.product !== null;
  })
  res.send(result);
});

router.get('/:id', async function (req, res, next) {
  try {
    let result = await inventoryModel.findById(req.params.id).populate(inventoryPopulate);
    if (!result || !result.product) {
      res.status(404).send({
        message: "INVENTORY NOT FOUND"
      });
      return;
    }

    res.send(result);
  } catch (error) {
    res.status(404).send({
      message: "INVENTORY NOT FOUND"
    });
  }
});

router.post('/add-stock', InventoryQuantityValidator, validatedResult, async function (req, res, next) {
  let product = await ensureInventoryForProduct(req.body.product);
  if (!product) {
    res.status(404).send({
      message: "PRODUCT NOT FOUND"
    });
    return;
  }

  let result = await inventoryModel.findOneAndUpdate(
    {
      product: req.body.product
    },
    {
      $inc: {
        stock: req.body.quantity
      }
    },
    {
      returnDocument: 'after',
      runValidators: true
    }
  ).populate(inventoryPopulate)

  res.send(result);
});

router.post('/remove-stock', InventoryQuantityValidator, validatedResult, async function (req, res, next) {
  let product = await ensureInventoryForProduct(req.body.product);
  if (!product) {
    res.status(404).send({
      message: "PRODUCT NOT FOUND"
    });
    return;
  }

  let result = await inventoryModel.findOneAndUpdate(
    {
      product: req.body.product,
      stock: {
        $gte: req.body.quantity
      }
    },
    {
      $inc: {
        stock: -req.body.quantity
      }
    },
    {
      returnDocument: 'after',
      runValidators: true
    }
  ).populate(inventoryPopulate)

  if (!result) {
    res.status(400).send({
      message: "STOCK IS NOT ENOUGH"
    });
    return;
  }

  res.send(result);
});

router.post('/reservation', InventoryQuantityValidator, validatedResult, async function (req, res, next) {
  let product = await ensureInventoryForProduct(req.body.product);
  if (!product) {
    res.status(404).send({
      message: "PRODUCT NOT FOUND"
    });
    return;
  }

  let result = await inventoryModel.findOneAndUpdate(
    {
      product: req.body.product,
      stock: {
        $gte: req.body.quantity
      }
    },
    {
      $inc: {
        stock: -req.body.quantity,
        reserved: req.body.quantity
      }
    },
    {
      returnDocument: 'after',
      runValidators: true
    }
  ).populate(inventoryPopulate)

  if (!result) {
    res.status(400).send({
      message: "STOCK IS NOT ENOUGH"
    });
    return;
  }

  res.send(result);
});

router.post('/sold', InventoryQuantityValidator, validatedResult, async function (req, res, next) {
  let product = await ensureInventoryForProduct(req.body.product);
  if (!product) {
    res.status(404).send({
      message: "PRODUCT NOT FOUND"
    });
    return;
  }

  let result = await inventoryModel.findOneAndUpdate(
    {
      product: req.body.product,
      reserved: {
        $gte: req.body.quantity
      }
    },
    {
      $inc: {
        reserved: -req.body.quantity,
        soldCount: req.body.quantity
      }
    },
    {
      returnDocument: 'after',
      runValidators: true
    }
  ).populate(inventoryPopulate)

  if (!result) {
    res.status(400).send({
      message: "RESERVED IS NOT ENOUGH"
    });
    return;
  }

  res.send(result);
});

module.exports = router;
