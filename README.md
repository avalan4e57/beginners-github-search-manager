# BGSM: Beginners Github Search Manager
Helps beginners to search and contribute to open source projects with github

Our goal: to find projects friendly to beginners and try to give a hand.

BGSM filters search list from projects for which user already has made
a Pull Request and from projects he/she is currently working on and also
from projects user doesn't want to contribute to (not visible in search list).

When user clicks 'In Work' button the issue is added to 'issues in work' box.
In this box user has two clickable buttons: 'PR' and 'DEL'.
If 'PR' is clicked then issue is moved from 'issues in work' to 'PR-ed issues'.
If 'DEL' is clicked then issue is just deleted from 'issues in work' and
doesn't appear in search list again.

# How to use
1) Download or clone the project. 
2) Use node.js global http-server https://www.npmjs.com/package/http-server.
   - Download & install node.js and npm https://www.npmjs.com/get-npm
   - Install http-server globally ( run this line `npm install http-server -g` in terminal )
   - Run http-server with path to beginners-github-search-manager ( run in terminal `http-server /{path_to_project_folder}` )
3) Open `http://localhost:8080` in your browser.
4) Enjoy the app.

# How to contribute
1) Fork the repo.
2) Clone your fork.
3) Create a branch.
4) Make your changes.
5) Push changes to your fork.
6) Create Pull Request.
