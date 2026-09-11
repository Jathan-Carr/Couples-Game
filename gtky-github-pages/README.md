# GTKY — Get To Know You

A cute stationery question game. Start with favorite colors. Wander into stories. End with the questions you don’t usually ask.

Four decks — Surface, Personal, Deep, and **Together** — plus Random, which shuffles all 1,000 prompts. Together questions are about the other person, or about the two of you.

No accounts. Works on phones, desktops, and **GitHub Pages** (GitHub’s free public link).

## Put this on the internet (GitHub Pages)

You do not need to run Node on GitHub. The `docs/` folder is already the built website.

1. Download **[gtky-github-pages.zip](public/gtky-github-pages.zip)** (or copy this whole folder).
2. Unzip it. Upload **everything inside** to your GitHub repo root — for example [Jathan-Carr/Couples-Game](https://github.com/Jathan-Carr/Couples-Game). Do not nest the files in an extra folder.
3. On GitHub: **Settings → Pages**.
4. Under **Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/docs**
5. Save. After a minute, GitHub shows the site URL, usually:

   `https://jathan-carr.github.io/Couples-Game/`

That is the link to share. Two-phone parties need this Pages URL, not `localhost`.

If Pages is already set to **GitHub Actions**, a push to `main` also builds and publishes automatically.

## Play

Enter your name on the menu, then **Start**. Join a party with a code or create one (pick the party size). Share the code so friends load the **same GTKY site** and join.

The **bookcase** is the game menu:

- **Singleplayer** — The Deck, The Wheel, One Page, The Nightstand, Coffee Stains, Midnight Chapter, Morning Page, Unopened Letter, For Later, Category Night.
- **Together** — Two of Us, Even & Odd, Pass the Mug, Truth or Dare, Hot Seat, Never Have I, The Bookmark, Postcards, Who Said It, Slow Dance.
- **Albums!** — Skinny shelf. Title a blank book, turn pages forever, drop in photos, stickers, sticky notes, recipe cards, and 10-second voice memos. Stamp a round into a page. Print a spread. Party hosts keep **The table** album in sync for small scraps. Import / export JSON next to the Albums! label. **(clear albums)** wipes every book after a confirm.

Keepsakes on the top shelf are for looking. **Last night** resumes a paused game. **Close the book** ends the night with a favorite question and answer.

Daily spark sits on the menu. Hide questions from the library or a card. Pin flinches to For Later.

Party lobby: copy the full join link (not localhost), **I’m still here** to rejoin, host the same code again, watch as a spectator, and host locks for Deep / skip / dares.

Even & Odd: she picks evens or odds (or High/Low, or Red/Black). You automatically get the other side. A 1–32 wheel decides who answers.

Pause or leave a game and GTKY will remind you to download albums. **Return to bookshelf** sits at the bottom of every game.

Skipped Deck cards go back into a “later” pile. Pause saves the game on this device.

At the end of Two of Us you each leave a note, then GTKY builds an **About Us** zine.

Two-phone rooms use a peer connection (no GTKY account). Both people need the **same GTKY website**.

## Run locally

```bash
npm install
npm run dev
```

Opens on [http://127.0.0.1:4721](http://127.0.0.1:4721). The menu and bookcase paint as soon as the app JS is in; questions load in the background.

```bash
npm run build
npm run preview
```

`npm run build` writes the public site into `docs/` (what GitHub Pages serves). Rebuild the download zip with `npm run pack`.

Rebuild questions after editing `scripts/questions/`:

```bash
npm run questions
```

## License

MIT
