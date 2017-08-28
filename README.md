# BGSM: Beginners Github Search Manager
Helps beginners to search and contribute to open source projects with github

Our goal: to find and manage projects friendly to beginners.

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
2) Go to project directory in terminal and run `npm install` command in it
   ( Download & install node.js and npm https://www.npmjs.com/get-npm )
3) Go to https://github.com/settings/tokens and generate a TOKEN
4) Type `npm start` command in terminal and add the TOKEN generated on previous step. 
5) Open in browser `http://localhost:8080`
6) Enjoy the app.

There's also a better way if you use UNIX os. After you got your token go to project's 
root folder add create a `start.sh` file. Inside it write the folowing two lines of code:
   `TOKEN="paste your token here"\n`
   `npm start $TOKEN`
Then you can start the app any time just by typing `sh start.sh` in terminal. Now just
press enter and run the script, but remember to do this while in project's root folder.

# How to contribute
1) Fork the repo.
2) Clone your fork.
3) Create a branch.
4) Make your changes.
5) Push changes to your fork.
6) Create Pull Request.
