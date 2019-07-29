const lists = [{id: 1, title: 'Groceries'}, {id: 2, title: 'House Work'}, {id: 3, title: 'Yard Work'}];

const items = [{id: 1, list_id: 1, task: 'Buy milk', completed: false}, {id: 2, list_id: 1, task: 'Buy bread', completed: false}, {id: 3, list_id: 1, task: 'Buy eggs', completed: false}, {id: 4, list_id: 2, task: 'Clean room', completed: false}, {id: 5, list_id: 2, task: 'Wash dishes', completed: false}, {id: 6, list_id: 2, task: 'Dust the house', completed: false}, {id: 7, list_id: 3, task: 'Mow the lawn', completed: false}];

module.exports = [lists, items];