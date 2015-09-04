# Swen

This is currently a simple notes app that provides the benefits of abstraction. Basically, every sentence can have extensive footnotes, and each sentence in the footnotes can have its own footnotes, and each of those can have footnotes, and so on ad infinitum.

#### How To Try It

You can get the bits from github, and then in a terminal you can cd into the main directory and type `meteor`.
Then in a browser address bar, type `localhost:3000`.

Or you can wait for the demo, which should be up soon.

#### Usage

It should be fairly self-documenting once you open the app, but basically it works as follows:
- When you click on a sentence, it is highlighted and centered. You see its parent note above it, its sibling notes around it, and its child notes below it.
- When you click the edit pencil icon at the top, the focus post becomes editable.
- If you meant to edit a different sentence that is still in view, you can click on that one.
- If you wish to insert a sibling note, click 'CONTINUE'.
- If you wish to insert a child note, click 'GO DEEPER'.
- To delete a post (assuming it has no child posts), simply erase its contents.
- If you are done editing, click 'SAVE'.

#### Issues

This project is still in the early stages. If you try to break it, you will probably succeed.

#### To Do

- Search.
- Speed up data entry by automatically starting a new post at the end of a sentence or line.
- Add authentication and permissions to allow more than one contributor.
- Allow comments as final child posts, introduced by the name of the poster.
- While a user is drafting, suggest existing posts and allow linking to them.
- Allow the removal of a whole tree--as well as the possibility of undoing removals.
- Bullets.
- Keystroke navigation.
- Code hosting.
- Multimedia content.

#### License

No license yet.
