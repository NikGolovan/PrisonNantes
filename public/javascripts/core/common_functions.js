var dbConn  = require('../../../lib/db');

module.exports = {
    initTableData: function(query, page, options, req, res) {
          dbConn.all(query, options, function(err, rows) {
              if(err) {
                  req.flash('error', err);
                  res.render(page, {data:''});
              } else {
                  res.render(page, {data:rows, options});
              }
          });
      },
    renderPage: function(page, options, req, res, message, msgStatus) {
        if (message !== null && message !== '')
            req.flash(msgStatus, message);
        res.render(page, options);
    },
    deleteRecord: function (query, page, success_message, req, res) {
        dbConn.all(query, function(err, result) {
            if (err) {
                req.flash('error', err)
                res.redirect(page)
            } else {
                req.flash('success', success_message);
                res.redirect(page)
            }
        });
    },
    execQuery: function (query, page, options, form_data, err_msg, success_message, req, res) {
        dbConn.all(query, form_data, function(err, rows) {
            if (err) {
                let error = err.toString().indexOf('UNIQUE CONSTRAINT FAILED') ? err_msg : err;
                req.flash('error', err)
                res.render(page, options);
            } else {
                req.flash('success', success_message);
                res.redirect('/');
            }
        })
    },
    allFieldsAreFilled: function (fields) {
        for (let key in fields) {
            if (fields[key].length === 0)
                return false;
        }
        return true;
    }
}
