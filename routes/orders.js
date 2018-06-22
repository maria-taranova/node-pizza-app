let express = require("express");
let Order = require("../model/Order");
const PriceCalculator = require("../model/pricecalculator");
const menu = require("../public/data/menu.json");
let router = express.Router();
var phoneFormatter = require('phone-formatter');

router.get("/", function(req, res) {
  var vm = { title: "Pizza Order" };
  res.render("index", vm);
});

router.get("/orders", function(req, res) {
  var vm = { title: "Pizza Order" };
  res.render("orders", vm);
});

//REST Endpoint

router.get("/api/orders", function(req, res) {
  Order.find().sort('-createdOn').limit(100).exec(function(err, orders) {
    res.json(orders);
  });
});

router.get("/api/orders/search/:address?/:tel?", (req, res) => {
  const tel = req.query.tel;
  const address = req.query.address;
  let details = {};
  if (tel && address) {
    details = { tel: tel, address: address };
  } else if (tel) {
    details = { tel: tel };
  } else if (address) {
    details = { address: address };
  }
  Order.find(details, (err, item) => {
    if (err) {
      res.send({ error: "An error has occurred" });
    } else {
      res.send(item);
    }
  });
});
router.post("/api/orders", function(req, res) {
  var order = {
    qty: req.body.qty,
    size: req.body.size,
    tel: req.body.tel,
    name: req.body.name,
    address: req.body.address,
    detail: req.body.orderDetail,
    priceArray: [],
    sum: 0
  };
  if (!order.name || !order.address || !order.tel) {
    //Missing some key information
    res.status(400).
    json({error : "Missing key information for the order"});
    return;
}
if (!order.detail) {
    //Missing some key information
    res.status(400).
    json({error : "Missing order detail"});
    return;
}
  order.detail.forEach(function(item) {
    //check the json for a price if the item
    var cat = menu.find(function(obj) {
      return obj.category == item.name;
    });
    cat["options"].filter(function(obj) {
      if (obj.name == item.value) order.priceArray.push(obj);
    });
  });

  var priceCalculator = new PriceCalculator(
    order.priceArray,
    order.qty,
    order.size
  );
  order.sum = priceCalculator.calculate();
  order = new Order(order);
  if (order.sum) {
    order.save(function(err) {
      if (err) {
        console.log("Error : ", err);
        res.status(500).json({ status: "Failed to save the order" });
        return;
      }
      res.json({ status: "Successfully added a order" });
    });
  }
});

module.exports = router;
