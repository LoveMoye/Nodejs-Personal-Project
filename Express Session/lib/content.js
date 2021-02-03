const fs = require('fs');

const content = {
  HTML: (authStatusUI, list, control,body) => {
    return `
    <html lang="kr">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CatInfo</title>
      </head>
      <body>
        <h1>Welcome!</h1>
        ${authStatusUI}
        <header>
          <h1>
            <a href = "/">hahaha의 고양이들</a>
          </h1>
        </header>
        ${list}
        ${control}
        ${body}
      </body>
    </html>`
  },

  Login: (control) => {
    return `
    <html lang="kr">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CatInfo</title>
      </head>
      <body>
        <h1>Welcome!</h1>
        <a href = "/auth/login">Login</a>
        <header>
          <h1>
            <a href = "/">hahaha의 고양이들</a>
          </h1>
        </header>
        ${control}
      </body>
    </html>`
  },

  CatList: (files) => {
    var list = `<ul>`;
    if (files.length === 0){
      return list += `<span> No Cat Infos </span> </ul>`;
    } else {
      var i = 0;
      while(i < files.length) {
        var data = fs.readFileSync(`./Cat/${files[i]}`, 'utf8')
        var jsonFile = JSON.parse(data)
        var title = jsonFile.title;
        list += `<li>
          <a href = "/cat/${title}">${title}</a>
        </li>`;

        i += 1;
      };
      return list += '</ul>';
    }
  },

  Control: (title) => {
    return`
      <a href = "/create">Create</a>
      <a href = "/update/${title}">Update</a>
      <form action = "/process_delete" method="post" style="display:inline-block">
        <input type="hidden" name="id" value="${title}">
        <input type="submit" value = "delete">
      </form>
    `;
  },


  catArticle: (title, description, imgSrc) => {
    return `
    <article>
      <h2>${title}</h2>
      <p>${description}</p>
      <img src=http://localhost:3000/${imgSrc} alt=${title} style="max-width:500px">
    </article>
    `
  },

  createPage: () => {
    return `
    <div class="questionPage">
      <h2 style="font-size: 40px">고양이 게시판</h2>
      <form action="/process_create" method="post" enctype="multipart/form-data"> 
        <p>
          <input type = "text" name = "title" placeholder="title">
        </p>
        <p>
          <textarea name = "description" placeholder="description"></textarea>
        </p>
        <p>
          <input type = "file" name = "img" id = "img">
        </p>
        <button type = "submit">Submit</button>
      </form>
    </div>
    `
  },

  updatePage: (title, description, imgsrc) => {
    return `
    <form action = "/process_update" method = "post" enctype = "multipart/form-data">
      <input type = 'hidden' name = "id" value = "${title}">
      <input type = "text" name = "title" placeholder = "title", value = "${title}"><br>
      <textarea name = "description" placeholder = 'description'>  ${description}</textarea><br>
      <input type = 'hidden' name = "imgsrc" value = "${imgsrc}">
      <input type = "file" name = "img">
      <input type = "submit">
    </form>
    `
  },

  loginPage: () => {
    return `
    <div>
      <h2 style="font-size: 40px">Login</h2>
      <form action="/auth/process_login" method="post"> 
        <p>
          <input type = "text" name = "email" placeholder="email">
        </p>
        <p>
          <input type = "password" name = "password" placeholder="password">
        </p>
        <button type = "submit">Login</button>
      </form>
    </div>
    `
  }
}

module.exports = content;
