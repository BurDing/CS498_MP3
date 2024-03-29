var mongoose = require('mongoose'),
  Task = mongoose.model('Task'),
  User = mongoose.model('User');
var url = require('url');


exports.list_all_Tasks = function(req, res) {
  var qurl = url.parse(req.url, true);
  if (qurl.search == '') {
    limitT = Task.find();
    limitT = limitT.limit(JSON.parse(100));
    limitT.exec(function(err, Task) {
      if (err) {
        return res.status(500).json({
          message: "Request for tasks failed",
          data: []
        });
      } else {
        return res.status(200).json({
          message: 'OK',
          data: Task
        })
      }
    });
  } else {
    q = Task.find();
    if (qurl.query.where) q = q.where(JSON.parse(qurl.query.where));
    if (qurl.query.sort) q = q.sort(JSON.parse(qurl.query.sort));
    if (qurl.query.select) q = q.select(JSON.parse(qurl.query.select));
    if (qurl.query.skip) q = q.skip(JSON.parse(qurl.query.skip));
    if (qurl.query.limit) {
      q = q.limit(JSON.parse(qurl.query.limit));
    } else {
      q = q.limit(JSON.parse(100));
    }
    if (qurl.query.count) q = q.count(JSON.parse(qurl.query.count));
    q.exec(function(err, Task) {
      if (err) {
        return res.status(500).json({
          message: "Request for a task failed",
          data: []
        });
      } else if (Task == null || Task.length == 0) {
        return res.status(404).json({
          message: "Can't find the task under your conditions",
          data: []
        });
      } else {
        return res.status(200).json({
          message: 'OK',
          data: Task
        })
      }
    });
  }
};


exports.create_a_Task = function(req, res) {
  var new_Task = {
    name: req.body.name,
    deadline: req.body.deadline,
    description: req.body.description || "",
    completed: req.body.completed || false,
    assignedUser: req.body.assignedUser || "",
    assignedUserName: req.body.assignedUserName || "unassigned"
  }
  if (new_Task.name == null || new_Task.name == "") {
    return res.status(400).json({
      message: "You can't create a task without a name",
      data: []
    });
  } else if (new_Task.deadline == null || new_Task.deadline == "") {
    return res.status(400).json({
      message: "You can't create a task without a deadline",
      data: []
    });
  } else {
    Task.create(new_Task, function(err, Task) {
      if (err) {
        return res.status(500).json({
          message: "Request for creating a task failed",
          data: []
        });
      } else {
        return res.status(201).json({
          message: 'OK',
          data: Task
        })
      }
    });
  }
};

exports.read_a_Task = function(req, res) {
  var qurl = url.parse(req.url, true);
  if (qurl.search == '') {
    Task.findById(req.params.id, function(err, Task) {
      if (err) {
        return res.status(500).json({
          message: "Request for a task failed",
          data: []
        });
      } else if (Task == null || Task.length == 0) {
        return res.status(404).json({
          message: "Can't find the task",
          data: []
        });
      } else {
        return res.status(200).json({
          message: 'OK',
          data: Task
        })
      }
    });
  } else {
    q = Task.findById(req.params.id);
    if (qurl.query.where) q = q.where(JSON.parse(qurl.query.where));
    if (qurl.query.sort) q = q.sort(JSON.parse(qurl.query.sort));
    if (qurl.query.select) q = q.select(JSON.parse(qurl.query.select));
    if (qurl.query.skip) q = q.skip(JSON.parse(qurl.query.skip));
    if (qurl.query.limit) {
      q = q.limit(JSON.parse(qurl.query.limit));
    } else {
      q = q.limit(JSON.parse(100));
    }
    if (qurl.query.count) q = q.count(JSON.parse(qurl.query.count));
    q.exec(function(err, Task) {
      if (err) {
        return res.status(500).json({
          message: "Request for a task failed",
          data: []
        });
      } else if (Task == null || Task.length == 0) {
        return res.status(404).json({
          message: "Can't find the task under your conditions",
          data: []
        });
      } else {
        return res.status(200).json({
          message: 'OK',
          data: Task
        })
      }
    });
  }
};

exports.update_a_Task = function(req, res) {
  if (req.body.name == null || req.body.name == "") {
    return res.status(400).json({
      message: "You can't update a task to no name",
      data: []
    });
  } else if (req.body.deadline == null || req.body.deadline == "") {
    return res.status(400).json({
      message: "You can't update a task to no deadline",
      data: []
    });
  } else {
    Task.findById(req.params.id, function(err, Task) {
      if (err) {
        return res.status(500).json({
          message: "Update request failed",
          data: []
        });
      } else if (Task == null || Task.length == 0) {
        return res.status(404).json({
          message: "Can't find the task",
          data: []
        });
      } else {
        Task.name = req.body.name || Task.name;
        Task.deadline = req.body.deadline || Task.deadline;
        Task.description = req.body.description || Task.description;
        Task.completed = req.body.completed || Task.completed;
        Task.assignedUser = req.body.assignedUser || Task.assignedUser;
        Task.assignedUserName = req.body.assignedUserName || Task.assignedUserName;
        Task.save(function(err) {
          if (err) {
            return res.status(500).json({
              message: "Update request failed",
              data: []
            });
          }
        });
        return res.status(200).json({
          message: 'OK',
          data: Task
        })
      }
    });
  }
};

exports.delete_a_Task = function(req, res) {
  // User.find({"pendingTasks":req.params.id}, function(err, user_p) {
  //   res.json({
  //     user_p
  //   });
  // });
  Task.findByIdAndRemove(req.params.id, function(err, Task) {
    if (err) {
      return res.status(500).json({
        message: "Delete request failed",
        data: []
      });
    } else if (Task == null || Task.length == 0) {
      return res.status(404).json({
        message: "Can't find the task",
        data: []
      });
    } else {
      return res.status(200).json({
        message: 'successfully deleted',
        data: Task
      })
    }
  });
};

exports.options_a_Task = function(req, res){
      return res.status(200).json({
        message: 'OK',
        data: {
          where: "filter results based on JSON query",
          sort: "specify the order in which to sort each specified field (1- ascending; -1 - descending)",
          select: "specify the set of fields to include or exclude in each document (1 - include; 0 - exclude)",
          skip: "specify the number of results to skip in the result set; useful for pagination",
          limit: "specify the number of results to return (default should be 100 for tasks and unlimited for users)",
          count: "if set to true, return the count of documents that match the query (instead of the documents themselves)"
        }
      })
};
