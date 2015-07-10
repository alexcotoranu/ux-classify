# ux-classify
User Experience (UX) Card Sorting App

# setup

1 Clone the ux-classify repository to a folder of your choice.

2 Download + install Node.js for your operating system from: https://nodejs.org/

3 Open terminal/command prompt/bash in the folder that you chose above or navigate to that folder and enter: 
> npm install

4 Download + install MongoDB for your operating system from the MongoDB website: https://www.mongodb.org/
In windows you might need to add it to your path (default: "C:\Program Files\MongoDB\Server\3.0\bin\")
If you don't have it, you might need to install Hotfix KB2731284 before you can use MongoDB.

5 Create a data folder at the default location that MongoDB expects: "C:\Data\db\"

6 Start MongoDB by opening another terminal/command prompt/bash and entering: 

> mongod


# usage

You can access the server at: http://localhost:3000/cards

To add a new card, you need to have an admin user. Admin users can currently only be set through the database to users that have already signed up.
> "isAdmin" : true  
Is what you need to set in an update query for that user (if you are not familiar with the MongoDB CLI, you can use a GUI such as Robomongo or Mongovue). 

Currently (and I apologize for the clunky admin interface), you click on 'Sessions' in the top right of the header bar (as an admin) and create each project, experiment, and deck.

As an admin you can also view your hierarchy clusters in the results listing for each experiment :)


# todo

- add necessary fields to cards for tracking and ordering

- add user access permissions per project / experiment (possibly through signup token and/or admin approval)
- a lot more stuff :)