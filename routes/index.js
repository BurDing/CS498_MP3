/*
 * Connect all of your endpoints together here.
 */
module.exports = function (app, router) {
    app.use('/api', require('./home.js')(router));

    var finduser = require('../api/finduser');

	  // finduser Routes
    app.route('/api/users')
        .get(finduser.list_all_Users)
        .post(finduser.create_a_User)
        .options(finduser.options_a_User);

    app.route('/api/users/:id')
  		  .get(finduser.read_a_User)
  		  .put(finduser.update_a_User)
  		  .delete(finduser.delete_a_User);

    var findtask = require('../api/findtask');

    // findtask Routes
    app.route('/api/tasks')
        .get(findtask.list_all_Tasks)
        .post(findtask.create_a_Task)
        .options(findtask.options_a_Task);

    app.route('/api/tasks/:id')
        .get(findtask.read_a_Task)
        .put(findtask.update_a_Task)
        .delete(findtask.delete_a_Task);

};
