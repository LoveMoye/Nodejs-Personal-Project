module.exports = {
    isOwner: function(request, response) {
        if(request.session.is_logined) {
            return true;
        } else {
            return false;
        }
    },

    statusUI: function(request, response) {
        if(this.isOwner(request, response)) {
          return `${request.session.nickname} | <a href = /auth/logout>Logout<a>`;
        } else {
          return `<a href = /auth/login>Login<a>`;
        }
    }

}