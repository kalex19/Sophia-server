require( "@babel/polyfill");
const request = require( "supertest");
const server = require ( "./server");


describe("API", () => {
  let lists, items, mockBadItem, mockBadList, mockGoodItem, mockGoodList;
  beforeEach(() => {
    lists = [
      {
        id: 1,
        title: "grocery list",
      },
      {
        id: 2,
        title: "shopping list",
      }
    ];
    server.locals.lists = lists;

    items = [
      {
        id: 1,
        list_id: 1,
        task: "buy bread",
        competed: false
      },
      {
        id: 2,
        list_id: 2,
        title: "mail letters",
        completed: false
      }
    ];
    server.locals.items = items;

    mockGoodList = {
      title: "groceries",
    };
    
    mockBadList = {
      body: "",
    };
    
    mockGoodItem = {
      list_id:1,
      task: "buy milk",
    };
    
    mockBadItem = {
      body: "",
    };
  });
  describe("GET /api/v1/lists", () => {
    it("should return a status of 200", () => {
      request(server)
        .get("/api/v1/lists")
        .then(res => {
          expect(res.statusCode).toBe(200);
        });
    });
    it("should return an array of lists", async () => {
      const response = await request(server).get("/api/v1/lists");
      expect(response.body).toEqual(lists);
    });
  });
  describe("GET /api/v1/lists/:id", () => {
    it("should return a status of 404", async () => {
      const response = await request(server).get("/api/v1/lists/10");
      expect(response.status).toBe(404);
    });
    it("should return an error message", async () => {
      const response = await request(server).get("/api/v1/lists/10");
      expect(response.body).toEqual("List not found");
    });
    it("should return a status of 200", async () => {
      const response = await request(server).get("/api/v1/lists/1");
      expect(response.status).toBe(200);
    });
    it("should return a list", async () => {
      const response = await request(server).get("/api/v1/lists/1");
      expect(response.body).toEqual(lists[0]);
    });
  });
  describe("POST /api/v1/lists/", () => {
    it("should return a status of 422", async () => {
      const response = await request(server)
        .post("/api/v1/lists")
        .send(mockBadList);
      expect(response.statusCode).toBe(422);
    });
    it("should return an error message", async () => {
      const response = await request(server)
        .post("/api/v1/lists")
        .send(mockBadList);
      expect(response.body).toEqual("Please provide a list title");
      expect(server.locals.lists.length).toBe(2);
    });
    it("should return a status of 201", async () => {
      const response = await request(server)
        .post("/api/v1/lists")
        .send(mockGoodList);
      expect(response.status).toBe(201);
    });
    it("should return a new list if ok", async () => {
      Date.now = jest.fn().mockImplementation(() => 3);
      expect(server.locals.lists.length).toEqual(2);

      const response = await request(server)
        .post("/api/v1/lists")
        .send(mockGoodList);
      expect(response.body).toEqual({ id: 3, ...mockGoodList });
      expect(server.locals.lists.length).toEqual(3);
    });
  });
  describe("PUT /api/v1/lists/:id", () => {
    it("should return a status of 204 if list succesfully updated", async () => {
      const response = await request(server)
        .put("/api/v1/lists/1")
        .send(mockGoodList);
      expect(response.status).toBe(204);
    });
    it("should update the list if successful", async () => {
      const expected = { id: 1, title:'new title'};
      expect(server.locals.lists).toEqual(lists);
      const response = await request(server)
        .put("/api/v1/lists/1")
        .send(expected);
      expect(response).toEqual(expected);
      expect(server.locals.lists[1]).toEqual(expected);
    });
    it("should return a status of 422 and error message if there is no title", async () => {
      const response = await request(server)
        .put("/api/v1/lists/1")
        .send(mockBadList);
      expect(response.status).toBe(422);
      expect(response.body).toBe("Please provide a list title");
    });
    it("should return a status of 422 and error message if there are no tasks", async () => {
      const response = await request(server)
        .put("/api/v1/lists/1")
        .send(mockBadList);
      expect(response.status).toBe(422);
      expect(response.body).toBe("Please provide a list title");
    });
  });
  describe("DELETE /api/v1/lists/:id", () => {
    it("should return a status of 204 if list is succesfully deleted", async () => {
      const response = await request(server).delete("/api/v1/lists/1");
      expect(response.status).toBe(204);
    });
    it("should delete the list if it exists", async () => {
      const expected = [lists[1]];
      expect(server.locals.lists.length).toBe(2);
      await request(server).delete("/api/v1/lists/1");
      expect(server.locals.lists.length).toBe(1);
      expect(server.locals.lists).toEqual(expected);
    });
    it("should return a 404 if the list does not exist", async () => {
      const response = await request(server).delete("/api/v1/lists/3");
      expect(response.status).toBe(404);
    });
    it("should return a message if list not found", async () => {
      const response = await request(server).delete("/api/v1/lists/3");
      expect(response.body).toBe("List does not exist");
    });
  });

//items
  describe("GET /api/v1/items", () => {
    it("should return a status of 200", () => {
      request(server)
        .get("/api/v1/items")
        .then(res => {
          expect(res.statusCode).toBe(200);
        });
    });
    it("should return an array of items", async () => {
      const response = await request(server).get("/api/v1/items");
      expect(response.body).toEqual(items);
    });
  });
  describe("GET /api/v1/items/:id", () => {
    it("should return a status of 404", async () => {
      const response = await request(server).get("/api/v1/items/10");
      expect(response.status).toBe(404);
    });
    it("should return an error message", async () => {
      const response = await request(server).get("/api/v1/items/10");
      expect(response.body).toEqual("Item not found");
    });
    it("should return a status of 200", async () => {
      const response = await request(server).get("/api/v1/items/1");
      expect(response.status).toBe(200);
    });
    it("should return an item", async () => {
      const response = await request(server).get("/api/v1/items/1");
      expect(response.body).toEqual(items[0]);
    });
  });
  describe("POST /api/v1/items/", () => {
    it("should return a status of 422", async () => {
      const response = await request(server)
        .post("/api/v1/items")
        .send(mockBadItem);
      expect(response.statusCode).toBe(422);
    });
    it("should return an error message", async () => {
      const response = await request(server)
        .post("/api/v1/items")
        .send(mockBadItem);
      expect(response.body).toEqual("Please provide an item task");
      expect(server.locals.items.length).toBe(2);
    });
    it("should return a status of 201", async () => {
      const response = await request(server)
        .post("/api/v1/items")
        .send(mockGoodItem);
      expect(response.status).toBe(201);
    });
    it("should return a new item if ok", async () => {
      Date.now = jest.fn().mockImplementation(() => 3);
      expect(server.locals.items.length).toEqual(2);

      const response = await request(server)
        .post("/api/v1/items")
        .send(mockGoodItem);
      expect(response.body).toEqual({ id: 3, ...mockGoodItem });
      expect(server.locals.items.length).toEqual(3);
    });
  });
  describe("PUT /api/v1/items/:id", () => {
    it("should return a status of 204 if item is succesfully updated", async () => {
      const response = await request(server)
        .put("/api/v1/items/1")
        .send({id:1, task:'new task', list_id:1,completed:false});
      expect(response.status).toBe(204);
    });
    it("should update the item if successful", async () => {;
      const expected = [{ id: 1, ...mockGoodItem }, items[1]];
      expect(server.locals.items).toEqual(items);
      const response = await request(server)
        .put("/api/v1/items/1")
        .send(mockGoodItem);
      expect(server.locals.items).toEqual(expected);
    });
    it("should return a status of 422 and error message if there is no task", async () => {
      const response = await request(server)
        .put("/api/v1/items/1")
        .send(mockBadItem);
      expect(response.status).toBe(422);
      expect(response.body).toBe("Please provide an item task");
    });
    it("should return a status of 422 and error message if there are no tasks", async () => {
      const response = await request(server)
        .put("/api/v1/items/1")
        .send(mockBadItem);
      expect(response.status).toBe(422);
      expect(response.body).toBe("Please provide an item task");
    });
  });
  describe("DELETE /api/v1/items/:id", () => {
    it("should return a status of 204 if item is succesfully deleted", async () => {
      const response = await request(server).delete("/api/v1/items/1");
      expect(response.status).toBe(204);
    });
    it("should delete the item if it exists", async () => {
      const expected = [items[1]];
      expect(server.locals.items.length).toBe(2);
      await request(server).delete("/api/v1/items/1");
      expect(server.locals.items.length).toBe(1);
      expect(server.locals.items).toEqual(expected);
    });
    it("should return a 404 if the item does not exist", async () => {
      const response = await request(server).delete("/api/v1/items/3");
      expect(response.status).toBe(404);
    });
    it("should return a message if item not found", async () => {
      const response = await request(server).delete("/api/v1/items/3");
      expect(response.body).toBe("Item does not exist");
    });
  });
  describe("404 error", () => {
    it('should return a 404 if the route does not exist', async () => {
      const response = await request(server)
      expect(response.status).toBe(404);
    });
    it('should return a message if the route does not exist', async () => {
      const response = await request(server)
      expect(response.body).toBe("Sorry, can't find that!")
    });
  })
});

