const [lists, items] = require('./data');
const express = require('express')
const cors = require('cors')
const server = express()
const port = 3002

server.use(cors());
server.use(express.json());
server.use(express.static('public'));
server.listen(port, () => console.log(`Server is running on port ${port}`))
server.locals = {
  lists,
  items
};

//Routes

//Get All Lists
server.get("/api/v1/lists", (req, res) => {
  res.status(200).json(server.locals.lists);
});

//Get Specific List
server.get("/api/v1/lists/:id", (req, res) => {
  const {
    id
  } = req.params;
  const list = server.locals.lists.find(list => list.id == id);
  if (!list) return res.status(404).json("List not found");
  return res.status(200).json(list);
});

//Post a Specific List

server.post("/api/v1/lists", (req, res) => {
  const listData = req.body;
  if (!listData || !listData['title'])
    return res.status(422).json("Please provide a list title");
  const newList = {
    id: server.locals.lists.length + 1,
    ...listData
  };
  server.locals.lists.push(newList);
  res.status(201).json(newList);
});

//Update Specific List

server.put("/api/v1/lists/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const list = req.body;
  if (!list)
    return res.status(422).json("Please provide a list title");
  for (let param of ['title']) {
    if (!list[param]) {
      return res.sendStatus(422);
    }
  }
  const listIndex = server.locals.lists.findIndex(l => l.id === id);
  if (listIndex === -1) return res.status(404).json("List not found");
  server.locals.lists.splice(listIndex, 1, list);
  return res.sendStatus(204);
});

//Delete Specific List

server.delete('/api/v1/lists/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const listIndex = server.locals.lists.findIndex(list => list.id === id);
  if (listIndex === -1) return res.status(404).json("List does not exist");
  server.locals.lists.splice(listIndex, 1);
  console.log('list', server.locals.lists)
  return res.sendStatus(204);
});

//Get All Items
server.get("/api/v1/items", (req, res) => {
  res.status(200).json(server.locals.items);
});

//Get Specific Item
server.get("/api/v1/items/:id", (req, res) => {
  const {
    id
  } = req.params;
  const item = server.locals.items.find(item => item.id == id);
  if (!item) return res.status(404).json("Item not found");
  return res.status(200).json(item);
});

//Post a Specific Item

server.post("/api/v1/items", (req, res) => {
  const itemData = req.body;
  if (!itemData)
    return res.status(422).json("Please provide an item task");
  for (let param of ['list_id', 'title']) {
    if (!itemData[param]) {
      return res.sendStatus(422);
    }
  }
  const newItem = {
    id: server.locals.items.length + 1,
    completed: false,
    ...itemData
  };
  server.locals.items.push(newItem);
  res.status(201).json(newItem);
});

//Update Specific Item

server.put("/api/v1/items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const item = req.body;
  if (!item)
    return res.status(422).json("Please provide an item task");
  for (let param of ['list_id', 'title', 'completed', 'id']) {
    if (!item[param]) {
      return res.sendStatus(422);
    }
  }
  const itemIndex = server.locals.items.findIndex(i => i.id === id);
  if (itemIndex === -1) return res.status(404).json("Item not found");
  server.locals.items.splice(itemIndex, 1, item);
  return res.sendStatus(204);
});

//Delete Specific Item

server.delete("/api/v1/items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const itemIndex = server.locals.items.findIndex(item => item.id === id);
  if (itemIndex === -1) return res.status(404).json("Item does not exist");
  server.locals.items.splice(itemIndex, 1);
  return res.sendStatus(204);
});


//404 Route
server.use(function (req, res, next) {
  res.status(404).send("Sorry, can't find that!")
  next()
});

module.exports = server