# General description of project

Building a points system for RICP (Raffles Institution Competitive Programming)

# Goals of project

In order to encourage more active participation during training, as well as to
do the practice problems after training.

# Listing of features

- Points leaderboard
- Ability for admins to add and subtract points with reasons
- View the point history of each member
- Have a task system where members can view what stuff they can do to get points
  - only admins can mark tasks as complete for the members to prevent abuse
  - each task can have a custom function for the score (e.g. have the score
    decrease by 10 each day to encourage people to do the task earlier)

# External Scanning

I guess just using Excel/Google sheets works, but its not particularly elegant.
I also just want an excuse to code something.

This might also be similar to Class Dojo but that's kind of childish and also if
I'm not wrong there is no way to have custom messages when adding or subtracting
points, and the amount of points that you can subtract is also limited to a few
choices.

There are also a few points bots for Discord, but again I don't think they
support custom messages, nor viewing the point history of a particular person.

# Listing of Key Use Cases

- When people answer questions during training, we give them points
- When people do the practice problems, we give them points
- When people troll and fool around during, we subtract points
- At the end of the month of something we give out prizes based on the points

# Skills that my project requires me to pick up

- having a database to store the stuff in, probably gonna use Firebase firestore
