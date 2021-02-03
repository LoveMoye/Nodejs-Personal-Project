const path = require('path');
const fs = require('fs');
const content = require('./content.js');
const auth = require('./auth.js');

var authData = {
  email: 'thinkCat@gmail.com',
  password: "123456",
  nickname: "thinkCat"
}

const fileIO = {
  // Enter homepage
  home: (request, response) => {
    var control;
    fs.readdir('./Cat', (err1, files) => {
      var authStatusUI = auth.statusUI(request, response);
      if(auth.isOwner(request, response)) {
        control = `<a href = "/create">Create</a>`;
      } else {
        control = `<a></a>`
      }
      var catList = content.CatList(files);
      var body = `
        <h3>hahaha의 고양이들 에 오신것을 환영합니다!!</h3>
        <p>이 곳에서 hahaha 고양이들을 마음껏 귀여워하시면 됩니다!😺</p>
        <img src = http://localhost:3000/삼색냥이.gif>
      `;
      var template = content.HTML(authStatusUI, catList, control, body);
      response.send(template);
    })
  },
  // Enter Question Page
  catInfo: (request, response) => {
    var title = request.params.catId;
    var authStatusUI = auth.statusUI(request, response);
    var control;
    fs.readdir('./Cat', (err1, files) => {
      fs.readFile(`./Cat/${title}`, 'utf8', (err2, description) => {
        var jsonFile = JSON.parse(description);
        var catList = content.CatList(files);
        if(auth.isOwner(request, response)) {
          control = content.Control(title);;
        } else {
          control = `<a></a>`
        }
        var catPage = content.catArticle(title, jsonFile.description, jsonFile.imgsrc);
        var template = content.HTML(authStatusUI, catList, control, catPage);
        response.send(template);
      })
    })
  },
  // Enter create Page
  create: (request, response) => {
    var authStatusUI = auth.statusUI(request, response);
    fs.readdir('./Cat', (err1, files) => {
      var createPage = content.createPage();
      var catList = content.CatList(files);
      var control = `<a href = "/create">Create</a>`;
      var template = content.HTML(authStatusUI, catList, control,createPage);
      response.send(template);
    });
  },

  // Write our own question
  process_create: (request, response) => {
    var post = request.body;
    var files = request.file;
    var title = post.title;
    var desc = post.description;
    post.imgsrc = files.originalname;
    if(title === '' || desc === '') {
      response.redirect(`/create`);
    } else {
      fs.writeFile(`./Cat/${title}`, JSON.stringify(post), 'utf8', (err) => {
        response.redirect(`/cat/${title}`);
      });
    }
  },
  // Update page
  update: (request, response) => {
    var authStatusUI = auth.statusUI(request, response);
    var title = request.params.catId;
    fs.readdir('./Cat', (err1, files) => {
      fs.readFile(`./Cat/${title}`, 'utf8', (err2, description) => {
        var jsonFile = JSON.parse(description);
        var sideBar = content.CatList(files);
        var updatePage = content.updatePage(title, jsonFile.description, jsonFile.imgsrc);
        var control = content.Control(title);
        var template = content.HTML(authStatusUI, sideBar, control, updatePage);
        response.send(template);
      })
    })
  },
  process_update: (request, response) => {
    var post = request.body;
    var files = request.file;
    var title = post.title;
    var desc = post.description;
    if(files !== undefined) {
      post.imgsrc = files.originalname;
    }
    if(title === '' || desc === '') {
      response.redirect(`/create`);
    } else {
      fs.writeFile(`./Cat/${title}`, JSON.stringify(post), 'utf8', (err) => {
        response.redirect(`/cat/${title}`);
      });
    }
  },

  // Delete page
  process_delete: (request, response) => {
    var post = request.body;
    var id = post.id;
    fs.unlink(`./Cat/${id}`, (err) => {
      response.redirect(`/`);
    });
  },
  
  login: (request, response) => {
    fs.readdir('./Cat', (err1, files) => {
      var loginPage = content.loginPage();
      var template = content.Login(loginPage);
      response.send(template);
    });
  },

  process_login: (request, response) => {
    var post = request.body;
    var email = post.email;
    var password = post.password;
    if(email === authData.email && password === authData.password) {
      request.session.is_logined = true;
      request.session.nickname = authData.nickname;
      request.session.save(function(err) {
        response.redirect("/");
      })
    } else {
      response.send("Login Falied")
    }
  },

  process_logout: (request, response) => {
    request.session.destroy(function(err) {
      response.redirect('/');
    })
  }
}

module.exports = fileIO;
