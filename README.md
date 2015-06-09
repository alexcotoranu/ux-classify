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

To add a new card, there is currently no UI and so you need to open the following URL in your browser: http://localhost:3000/cards/new

You will need to do that each time you wish to add a card.

# todo

- add necessary fields to cards for tracking and ordering
- store card position
- allow for the definition of customized groupings of cards
- have different decks of cards (to allow multiple experiments)
- a lot more stuff :)