const Task = require('../../models/Tasks');

module.exports = (app) => {
  app.get('/api/tasks', (req, res, next) => {
    Task.find()
        .exec()
        .then((tasks) => res.json(tasks))
        .catch((err) => next(err));
  });

  app.post('/api/tasks/', (req, res, next) => {
    if (!req.body) {
      return next();
    }

    const task = new Task(req.body);
    task.save((err) => {
      if (err) return next(err);
      res.json(task);
    });
  });

  app.delete('/api/tasks/:id', (req, res, next) => {
    if (!req.params && !req.params.id) {
      return next();
    }

    Task.findOneAndDelete({ _id: req.params.id })
        .exec()
        .then(() => res.json())
        .catch((err) => next(err));
  });

  app.put('/api/tasks/:id/update', (req, res, next) => {
    if (!req.body || !req.params.id) {
      return next();
    }

    Task.findOneAndUpdate({ _id: req.params.id}, req.body, {new: true})
        .exec()
        .then((task) => res.json(task))
        .catch((err) => next(err));
  });

  app.post('/api/tasks/search', (req, res, next) => {
    if (!req.body && !req.body.query) {
        return next();
    }

    const query = new RegExp(req.body.query.trim(), 'i');

    Task.find({
        $or: [
              {'name': {$regex: query}},
              {'description': {$regex: query}},
              {'tags': {$in: query}},
              {'childTasks': {$elemMatch: {'description': query}}},
              {'childTasks': {$elemMatch: {'name': query}}}
            ]
        })
        .exec()
        .then((tasks) => res.json(tasks))
        .catch((err) => next(err));
  });
}