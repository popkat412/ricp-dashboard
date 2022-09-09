# Development Log

> A successful final project is built slowly over many weeks not thrown together
> at the last minute. To incentivize good project pacing and to let your project
> mentor stay informed about the status of your work, each week you should add
> an entry to your log.md file in the development directory.

> Each entry should describe:

> - What goals you had set for the week and whether they were accomplished or
>   not
> - What problems you encountered (if any) that prevented you from meeting your
>   goals
> - What you plan to accomplish or attempt next week

> The development log will be graded for completion, detail, and honesty – not
> progress. It is much better to truthfully evaluate the work you completed in a
> week then lie to make the project sound further along then it really is. It is
> totally acceptable to have an entry that says you tried nothing and
> accomplished nothing. However if every week starts to say that, both yourself
> and your project mentor will be able to identify the issue before it becomes
> impossible to fix.

## Week 2 (5 Jul - 11 Aug)

So I actually started working on this project way before the CEP WA3 was
introduced. This first week, I was mostly just doing some UI stuff with dummy
values, not caring too much about logic. My thinking was that when the time came
for me to implement logic, it would be easier to debug since I could see what
was goign on.

The first week was kind of a drag for me because I decided that I would write
the styles myself and try out using [Tailwind CSS](https://tailwindcss.com/) and
[Headless UI](https://headlessui.com/). However, because I suck at UI design and
I'm very bad at making CSS do what I want it to do, it took quite a bit of time
(and copy pasting) to settle on a design that I liked.

I also originally planned to have a "problemset" section which will communicate
with the Online Judge that we use to automiatcally give points for solving
problems, but afterwards I realisd that this was not very feasible so I scrapped
it.

I also decided to use Firebae for the backend since I didn't want to spend the
time writing a backend myself. So, started planning how I would structure my
data in Firestore.

In conclusion, I did most the UI for the leaderboard and history tabs this week.
Next, I plan on starting to implement some actual logic.

## Week 3 (12 Jul - 18 Jul)

This week I got kind of busy with other stuff (mostly SMP, Science Mentorship
Programme), so I didn't do anything. Since this was still before the CEP WA3 got
announced, I didn't really have a hard deadline so other things took priority.

## Week 4 (19 Jul - 25 Jul)

Same as week 3 xD.

## Week 5 (26 Jul - 1 Aug)

Same as week 4... However, the CEP WA3 did get actually announced this week and
I realised that I could use this point system project as my WA3 project.

## Week 6 (2 Aug - 8 Aug)

This week, development finally resumed. Yay. First, I got user authentication
working so I only people who are authenticated can modify points. I also added
some more UI (a modal popup) for organising points, although actually talking
with Firestore to persist the data was still not implemented. The CSS (or rather
the tailwind classes) were still a pain but at least I didn't have to implement
the UI logic myself because I was using headlessui.

I also learnt how to use [Pinia](https://pinia.vuejs.org/) with the composition
API since that's the new recommended state management system for Vue 3. It was
also here that I discovered [VueUse](https://vueuse.org/), a collection of
extremely useful helper functions.

I also improved my old history UI and switched from a flexbox based one to just
a plain old table becuase it was just easier and looked nicer.

I wouldn't say I encountered any major challenge this week, it was mostly me
learning some new stuff such as Pinia and VueUse. If you really want though,
there were a few mildly annoying things I encountered:

1. I didn't understand how CSS focus works, so I spent _way_ too long figuring
   out how to get those nice looking outline thingies. Probably not the smartest
   to spend so long on an aesthetic thing at this stage of the project, but at
   least I know how focus stuff works in CSS (which i've already forgotten by
   the time I'm writing this devlog .\_.)
2. I wrote a bunch of code, only to find VueUse and relise a lot of it I didn't
   even have to write myself
3. There are way too many snackbar libraries for Vue. After some searching I
   finally found one I liked that worked with Vue3, but it didn't come with
   TypeScript type definitions, so I had to write them myself (i might open a PR
   and contribute back to the project once I have the time to make the
   definitions complete).

Another thing worth mentioning (ahem foreshadowing) is that I wanted to use
async/await but I didn't want to use try catch (it just makes everything so
clunky) so I figured I'd take some inspiration from functional programming and
make everything explicit. I defined a type
`type Either<T, E> = [T, null] | [null, E]` and have functions that can throw
return this instead of throwing. Then I can do something like
`[result, err] = await myFunction()`, instead of the 5 lines of code it would
need if I were to do try catch. Furthermore, it made all the errors explicit and
forces you to handle them, as opposed to try catch (side note: this is why I
love Swift, it makes you mark functions as "throwing" and whenever you use a
throwing function you have to explicity handle it, so you can (theoretically)
never have an unhandled exception). There is absolutely no way this decision can
come back to bite me later, right?

## Week 7 (9 Aug - 15 Aug)

Here's where the fun begins. I finally ditched all the dummy data and started
working with the actual Firestore database. I also realised that since this CEP
WA3 was supposed to be about OOP and so far I don't have a single class in my
project (I was just using plain JS objects + TS interfaces), I refactored to put
everything into classes. I also wrote some scuffed code to convert the data from
Firestore into the classes in code.

I also added another modal for adding a member. I did realise that I was
copypasting a lot of code from the add points modal, but I thought I'll just
refactor this later. This time, since I already had code for working with
Firestore set up, I also added the logic of adding a member.

There was another less essential feature that I worked on: loading indicators.
And normally I would just use one from a library and be done with it, but I
needed an indeterminate one (I'm not bothered to go and calculate how much data
has been transferred and all that) and I just couldn't find one that I liked, so
I decided to roll my own. This was probably harder than everything else I did
this week, it was really challenging to get the maths right, and it took a lot
of trial and error (and desmos). Looking back, I have no idea how the maths
works or why it works, so I'm just never touching the loading indicator
component again.

I also realised that working with the whole Either thing was actually quite
annoying and it got in the way of things, so I slowly just stopped using it and
started swithcing to try catch (sometimes not even having a try catch and just
letting it crash). I just wanted to have a working site at this point so I
didn't bother too much and just left myself a todo saying to fix the error
handling and make things more consistent across the project.

## Week 8 (16 Aug - 22 Aug)

I don't remember what I was busy with this week, but according to git I did
nothing this week (as you tell I am clearly not writing this development log in
a month late by looking at the git history).

At this point, I have a basically usable system already, but I still have the
tasks system I wanted to add.

## Week 9 (23 Aug - 29 Aug)

Same as week 8.

## Week 10 (30 Aug - 5 Sep)

This week I realised that the dealine is drawing close and I still have some
ways before my project is complete. I keep finding more things I want to add. So
I started working on the task system. Originally I didn't design my database
structure to account for the task system, so I had to modify all my classes and
readme a bit. Here is where a lot of new bad design decisions (which I later,
during the September holidays correct) were made and old bad design decisions
surfaced. This kind of spans two weeks, but I'm just including everything under
this entry becuase it makes more sense to talk about the problem and how I
solevd it together instead of under separate weeks.

1. The "point" field on the member document. I knew this was questionable from
   the start (week 2) when I included it, but my thinknig was that it would be
   relatively easy to keep the history and the score fields in sync, and it
   would make getting the number of points a lot more efficient. Just keep this
   in mind as I discuss the next design mistake.
2. So originally each history entry would just have info on the change in
   points, message, timestamp and admin responsible, but now I also needed
   something that would indicate that these points came from completing a task
   and not just manually added by an admin. So I just tacked on and additional
   optional field that stores the task id, if there is one.

So here comes the problem, Now tasks are also a thing, and I was planning to
have the ability to modify tasks (more foreshadowing). Ideally, the history
should be immutable. However, what if someone completes a task worth 100 points,
then the task gets edited such that its now worth 200 points? What should be the
expected behaviour? After some deliberation, I decided it would make more sense
for the member to have an increase in 100 points after the task gets edited, so
it's more fair to the people who solved the task before the edit. In order to do
this, it seems like I would either have to mutate history, or to add a new
history entry accounting for the change, both of which would be rather difficult
to do. What to do?

First, I made the distinction between history entries generated from tasks
(TaskHistoryEntry) and history entries from admins manually adding/subtracting
points (ManualHistoryEntry). In the TaskHistoryEntry, I would just store a
reference to the task and that's all. The ManualHistoryEntry would just be the
same as the original with a change and message I also removed the "points" field
for a member and instead just computed the points as the sum of all the changes
of the history entries on the client. For the change of a TaskHistoryEntry, I
would evalute the task's score function at the time when the task was completed.
Yay, problem mostly solved. Of course, there is still the problem of efficiency,
but that's something to be worried about for another time.

## Sep Holiday (5 Sep - 10 Sep) **Submission date is 10 Sep**

Here is where majority of the progres on tasks was made. I created the UI, now
in a nice grid and card format, and wrote a bunch of logic.

I also had to track down a rather nasty bug where the UI wouldn't update after I
changed the points for some reason. I was 100% sure it was working before, but
now it isn't. After quite some time, I realised that it was because the
onSnapshot listener which listens for changes from Firestore database wouldn't
be called if any _sub_ collection changes. Since I was storing the history as a
subcollection, adding a new history entry didn't actually cause the listener to
be fired. Previously, when I had the "points" field, the listener would be
fired, and since I re-fetched all the data of that particular member after each
update, the history would also get updated. To sovle this, I just use a hack-ish
way which is to just increment a dummy variable on the member document such that
it will trigger a change fired in the event listener. Believe it or not people
have acutally used this (according to some stackoverflow answer I read probaly
years ago) so it's not as hacky as it sounds.

Towards the end, I realised that although I had a usable website, a lot of the
stuff I wanted to add I didn't have time to add, so I just added a todo list and
I shall continue working on it even after the CEP submission deadline.

I also had to tie up a bunch of lose ends. Remember the whole error handling
mess I found myself in? In the end I just decided to revert everything back to
the good ol try catch. It was a decision made mostly on laziness because most of
my new code was already structured that way anyway. I also added a global error
handler in case I missed anything, so the site should theoretically never crash.

I also realised that documentation, readability, and proper modular design were
worth a lot of marks in the rubrics, so I spent the last few hours making some
refactors. Remember the copypasted modals from earlier? I had accumulated 5 of
them, all copypasted from each other, so I refactored that one out. I also
refacotred out some shared firebase stuff between the tasks and the members. I
also added a bunch of comments. Since this project is using Firebase, I also had
to write my Firestore security rules to prevent anyone from just being able to
hack into my database.
