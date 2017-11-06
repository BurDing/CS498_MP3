var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Task = mongoose.model('Task');
var url = require('url');


exports.list_all_Users = function(req, res) {
  var qurl = url.parse(req.url, true);
  if (qurl.search == '') {
    limitU = User.find();
    limitU = limitU.limit(JSON.parse(100));
    limitU.exec(function(err, User) {
      if (err) {
        return res.status(500).json({
          message: "Request for users failed",
          data: []
        });
      } else {
        return res.status(200).json({
          message: 'OK',
          data: User
        })
      }
    });
  } else {
    q = User.find();
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
    q.exec(function(err, User) {
      if (err) {
        return res.status(500).json({
          message: "Request for a user failed",
          data: []
        });
      } else if (User == null || User.length == 0) {
        return res.status(404).json({
          message: "Can't find the user under your conditions",
          data: []
        });
      } else {
        return res.status(200).json({
          message: 'OK',
          data: User
        })
      }
    });
  }
};


exports.create_a_User = function(req, res) {
  var new_User = {
    name: req.body.name,
    email: req.body.email,
    pendingTasks: req.body.pendingTasks || []
  }
  if (new_User.name == null || new_User.name == "") {
    return res.status(400).json({
      message: "You can't create a user without a name",
      data: []
    });
  } else if (new_User.email == null || new_User.email == "") {
    return res.status(400).json({
      message: "You can't create a user without a email",
      data: []
    });
  } else {
    User.create(new_User, function(err, User) {
      if (err) {
        if (err.code == 11000) {
          return res.status(400).json({
            message: "Eamil must be unique",
            data: []
          });
        }
        return res.status(500).json({
          message: "Request for creating a user failed",
          data: []
        });
      } else {
        return res.status(201).json({
          message: 'OK',
          data: User
        })
      }
    });
  }
};

exports.read_a_User = function(req, res) {
  var qurl = url.parse(req.url, true);
  if (qurl.search == '') {
    User.findById(req.params.id, function(err, User) {
      if (err) {
        return res.status(500).json({
          message: "Request for a user failed",
          data: []
        });
      } else if (User == null || User.length == 0) {
        return res.status(404).json({
          message: "Can't find the user",
          data: []
        });
      } else {
        return res.status(200).json({
          message: 'OK',
          data: User
        })
      }
    });
  } else {
    q = User.findById(req.params.id);
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
    q.exec(function(err, User) {
      if (err) {
        return res.status(500).json({
          message: "Request for a user failed",
          data: []
        });
      } else if (User == null || User.length == 0) {
        return res.status(404).json({
          message: "Can't find the user under your conditions",
          data: []
        });
      } else {
        return res.status(200).json({
          message: 'OK',
          data: User
        })
      }
    });
  }
};

exports.update_a_User = function(req, res) {
  if (req.body.name == null || req.body.name == "") {
    return res.status(400).json({
      message: "You can't update a user to no name",
      data: []
    });
  } else if (req.body.email == null || req.body.email == "") {
    return res.status(400).json({
      message: "You can't update a user to no email",
      data: []
    });
  } else {
    User.findById(req.params.id, function(err, User) {
      if (err) {
        return res.status(500).json({
          message: "Update request failed",
          data: []
        });
      } else if (User == null || User.length == 0) {
        return res.status(404).json({
          message: "Can't find the user",
          data: []
        });
      } else {
        User.name = req.body.name || User.name;
        User.email = req.body.email || User.email;
        User.pendingTasks = req.body.pendingTasks || User.pendingTasks;
        User.save(function(err) {
          if (err) {
            return res.status(500).json({
              message: "Update request failed",
              data: []
            });
          }
        });
        var new_name = {
          assignedUserName: req.body.name
        };
        Task.findOneAndUpdate({"assignedUser":req.params.id}, new_name, {new: true}, function(err, Task) {
          if (err) {
            return res.status(500).json({
              message: "Update request failed",
              data: []
            });
          }
        });
        return res.status(200).json({
          message: 'OK',
          data: User
        });
      }
    });
  }
};

exports.delete_a_User = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, User) {
    if (err) {
      return res.status(500).json({
        message: "Delete request failed",
        data: []
      });
    } else if (User == null || User.length == 0) {
      return res.status(404).json({
        message: "Can't find the user",
        data: []
      });
    } else {
      var new_name = {
        assignedUser: "",
        assignedUserName: "unassigned"
      }
      Task.findOneAndUpdate({"assignedUser":req.params.id}, new_name, {new: true}, function(err, Task) {
        if (err) {
          return res.status(500).json({
            message: "Delete request failed",
            data: []
          });
        }
      });
      return res.status(200).json({
        message: 'successfully deleted',
        data: User
      })
    }
  });
};

exports.options_a_User = function(req, res){
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
