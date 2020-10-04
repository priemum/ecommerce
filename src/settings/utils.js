
const path = require("path");

exports.clean = function(string){
  if(string !== "" && string !== undefined  && string !== null){
    var to_replace = /[',",`,´,]/gi;
    string = string.replace(to_replace, '');
  }
  return string;
};

exports.Auth = (req, res, next) => {
    if (!req.session.loggedin) {
        res.redirect('/admin/login');
    } else next();
}
exports.Admin = (req, res, next) => {
    if (!+req.session.admin) {
        res.redirect('/admin/login');
    } else next();
}
exports.notAuth = (req, res, next) => {
    if (req.session.loggedin) {
        res.redirect('/admin/dashboard');
    } else next();
}

exports.renderTemplate = (req, res, template, data) => {
const dataDir = path.resolve(`${process.cwd()}${path.sep}src${path.sep}components`);

const templateDir = path.resolve(`${dataDir}${path.sep}ejs${path.sep}${template}.ejs`);
var all = {req, res, data};
res.render(templateDir, all);
};

exports.renderDashboard = (req, res, template, data) => {
const dataDir = path.resolve(`${process.cwd()}${path.sep}src${path.sep}components${path.sep}dashboard`);

const templateDir = path.resolve(`${dataDir}${path.sep}${template}.ejs`);
var all = {req, res, data};
res.render(templateDir, all);
};

exports.database = (db) => {
  const sqlite3 = require('sqlite3').verbose();
  db = new sqlite3.Database("./every.sqlite");
  return db;
}

exports.getParams = (req, res) => {
    var url_partial = req.protocol + '://' + req.get('host') + req.originalUrl;
    url_partial = url_partial.split('?').slice(1).join(' ').split('&');
    var url = [];
    url_partial.forEach(u => {
        var u_partial = u.split('=');
        var u = {
            param : u_partial[0],
            value : u_partial[1],
        }
        url.push(u);
    })
    return url;
}