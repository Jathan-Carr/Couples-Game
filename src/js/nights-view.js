import { escapeHtml, siteHeader, shelfBack, starterChips, levelDot } from "./ui.js";
import { DARES, categoryList } from "./nights.js";
import { categoryMeta, LEVELS } from "./categories.js";
import { getLater, getMorning, getVeto, getLastNight } from "./keeps.js";

export function handoffLock(name, act, blurb = "No peeking.") {
  return `
    <div class="handoff-lock" role="dialog" aria-label="Pass the phone">
      <p class="hello">Pass the phone</p>
      <h1>Hand it to ${escapeHtml(name)}.</h1>
      <p>${escapeHtml(blurb)}</p>
      <button class="button button--dark button--large" data-act="${escapeHtml(act)}">I’m ${escapeHtml(name)} →</button>
    </div>`;
}

export function nightTools(card) {
  if (!card?.id && !card?.question) return "";
  return `
    <div class="night-tools">
      ${card.id ? `<button type="button" class="chip" data-act="pin-later" data-value="${escapeHtml(card.id)}">For later</button>
      <button type="button" class="chip" data-act="veto-q" data-value="${escapeHtml(card.id)}">Hide this one</button>` : ""}
      <button type="button" class="chip" data-act="stamp-round">Stamp into album</button>
    </div>`;
}

function shell(title, inner) {
  return `${siteHeader({ title, actions: shelfBack() })}<main class="screen container night-screen">${inner}</main>`;
}

function qcard(card, extra = "") {
  if (!card?.question && !card?.text) {
    return `<article class="question-card"><p class="muted">No questions left in this pile.</p></article>`;
  }
  if (card.text && !card.question) {
    return `<article class="question-card idle-wiggle"><p class="hello">A kind dare</p><h2>${escapeHtml(card.text)}</h2>${nightTools(card)}${extra}</article>`;
  }
  const meta = categoryMeta(card.level, card.category);
  return `<article class="question-card idle-wiggle">
    <span class="question-level ${card.level}">${meta.emoji} ${meta.label}</span>
    <h2>${escapeHtml(card.question)}</h2>
    <p>Take your time. Skip is still kind.</p>
    ${nightTools(card)}
    ${extra}
  </article>`;
}

export function renderNight(route, ctx) {
  const views = {
    dare: viewDare,
    hotseat: viewHotseat,
    never: viewNever,
    bookmark: viewBookmark,
    postcards: viewPostcards,
    whosaid: viewWho,
    slowdance: viewSlow,
    morning: viewMorning,
    letter: viewLetter,
    later: viewLater,
    category: viewCategory,
    close: viewClose,
  };
  const view = views[route];
  if (!view) return null;
  return view(ctx);
}

function viewDare({ session, skip }) {
  if (session.phase === "pick") {
    return shell(
      "Truth or Dare",
      `<header class="section-heading"><p class="hello">Stationery edition</p><h1>Pick a slip.</h1><p>Dares stay small and kind. Skip still exists.</p></header>
      <div class="question-actions">
        <button class="button button--dark button--large" data-act="dare-pick" data-value="truth">Truth</button>
        <button class="button button--large" data-act="dare-pick" data-value="dare">Dare</button>
      </div>
      <p class="muted">${DARES.length} dares in the envelope.</p>`
    );
  }
  const skipBtn = skip ? `<button class="button" data-act="dare-skip">Skip →</button>` : "";
  return shell(
    "Truth or Dare",
    `${qcard(session.current, `<div class="question-actions">
      <button class="button button--dark button--large" data-act="dare-done">We did it</button>
      ${skipBtn}
      <button class="button" data-act="dare-pick" data-value="${session.slip === "dare" ? "dare" : "truth"}">Another slip</button>
    </div>`)}`
  );
}

function viewHotseat({ session, skip, me }) {
  if (session.phase === "pick") {
    return shell(
      "Hot Seat",
      `<header class="section-heading"><p class="hello">Five questions</p><h1>Who sits first?</h1></header>
      <div class="party-members" style="justify-content:flex-start">
        ${session.people.map((name) => `<button type="button" class="party-chip" data-act="hotseat-pick" data-value="${escapeHtml(name)}">${escapeHtml(name)}</button>`).join("")}
      </div>`
    );
  }
  if (session.phase === "pass") {
    return shell(
      "Hot Seat",
      `<section class="question-card"><p class="hello">${escapeHtml(session.seat)} answered five.</p><h1>Pass the chair.</h1>
      <div class="question-actions">
        <button class="button button--dark button--large" data-act="hotseat-pass">Next person →</button>
        <a class="button" href="#/play">Back to the shelf</a>
      </div></section>`
    );
  }
  const skipBtn = skip ? `<button class="button" data-act="hotseat-skip">Skip →</button>` : "";
  return shell(
    "Hot Seat",
    `<p class="hello">${escapeHtml(session.seat)} · ${session.left} left</p>
    ${qcard(session.current, `<div class="question-actions">
      <button class="button button--dark button--large" data-act="hotseat-answer">${escapeHtml(session.seat === me ? "I answered" : "They answered")}</button>
      ${skipBtn}
    </div>`)}`
  );
}

function viewNever({ session, skip }) {
  if (session.phase === "done") {
    return shell(
      "Never Have I",
      `<section class="question-card"><p class="hello">Last fingers standing</p>
      <h1>${session.winner ? `${escapeHtml(session.winner)} still has a finger.` : "You’re out of fingers. You’re not out of the night."}</h1>
      <p>The winner picks the next book — or you keep talking.</p>
      <div class="question-actions">
        <button class="button button--dark" data-act="never-reset">Another round</button>
        <a class="button" href="#/play">Shelf</a>
      </div></section>`
    );
  }
  const skipBtn = skip ? `<button class="button" data-act="never-skip">Skip →</button>` : "";
  return shell(
    "Never Have I",
    `<div class="finger-row">${session.people
      .map((name) => `<span class="finger-chip">${escapeHtml(name)} · ${"☝".repeat(session.fingers[name] || 0) || "out"}</span>`)
      .join("")}</div>
    <p class="hello">Never have I ever sat with this:</p>
    ${qcard(session.current, `<div class="question-actions">
      ${session.people
        .filter((name) => (session.fingers[name] || 0) > 0)
        .map((name) => `<button class="button button--dark" data-act="never-has" data-value="${escapeHtml(name)}">${escapeHtml(name)} has</button>`)
        .join("")}
      <button class="button" data-act="never-safe">Nobody has</button>
      ${skipBtn}
    </div>`)}`
  );
}

function viewBookmark({ session, skip, me, her }) {
  if (session.phase === "plant1" || session.phase === "plant2") {
    const who = session.phase === "plant1" ? me : her;
    if (session.phase === "plant2" && session.handoff !== false) {
      return shell("The Bookmark", handoffLock(her, "bookmark-unlock", "They pick a question they hope you’ll get."));
    }
    return shell(
      "The Bookmark",
      `<header class="section-heading"><p class="hello">${escapeHtml(who)} plants a bookmark</p><h1>Which question do you hope they get?</h1></header>
      <div class="level-list">
        ${(session.choices || [])
          .map(
            (item) => `<button class="level" data-act="bookmark-plant" data-value="${escapeHtml(item.id)}"><h3>${escapeHtml(item.question)}</h3></button>`
          )
          .join("")}
      </div>`
    );
  }
  if (session.phase === "done") {
    return shell(
      "The Bookmark",
      `<section class="question-card"><h1>The pile is empty.</h1>
      <div class="question-actions"><a class="button button--dark" href="#/play">Shelf</a></div></section>`
    );
  }
  const planted =
    session.current && (session.current.id === session.plant1?.id || session.current.id === session.plant2?.id);
  const who = session.current?.id === session.plant1?.id ? me : her;
  const skipBtn = skip ? `<button class="button" data-act="bookmark-skip">Skip →</button>` : "";
  return shell(
    "The Bookmark",
    `${planted ? `<p class="hello">That was the bookmark. ${escapeHtml(who)} hoped you’d get this.</p>` : `<p class="hello">A page from the pile</p>`}
    ${qcard(session.current, `<div class="question-actions">
      <button class="button button--dark button--large" data-act="bookmark-answer">I answered</button>
      ${skipBtn}
    </div>`)}`
  );
}

function viewPostcards({ session, skip, me, her }) {
  if (session.phase === "handoff") {
    return shell("Postcards", handoffLock(her, "postcard-go", "Same prompt. Sixty seconds. Don’t peek."));
  }
  if (session.phase === "reveal") {
    return shell(
      "Postcards",
      `<header class="section-heading"><p class="hello">Flip</p><h1>${escapeHtml(session.current?.question || "")}</h1></header>
      <div class="reveal-grid two">
        <article class="question-card"><p class="hello">${escapeHtml(me)}</p><p>${escapeHtml(session.a1)}</p></article>
        <article class="question-card"><p class="hello">${escapeHtml(her)}</p><p>${escapeHtml(session.a2)}</p></article>
      </div>
      <div class="question-actions">
        <button class="button button--dark" data-act="stamp-round">Stamp into album</button>
        <button class="button" data-act="postcard-again">Another postcard</button>
      </div>`
    );
  }
  const who = session.phase === "p2" ? her : me;
  const skipBtn = skip ? `<button class="button" data-act="postcard-skip">Skip →</button>` : "";
  return shell(
    "Postcards",
    `<p class="hello">${escapeHtml(who)} · sixty seconds</p>
    <div class="postcard-timer" data-ends="${session.endsAt || 0}"></div>
    ${qcard(session.current, `${starterChips("postcard-text")}
      <label class="field" style="display:block"><span class="muted">Your postcard</span>
      <textarea id="postcard-text" rows="4" maxlength="400"></textarea></label>
      <div class="question-actions">
        <button class="button button--dark button--large" data-act="postcard-lock">Seal it</button>
        ${skipBtn}
      </div>`)}`
  );
}

function viewWho({ session }) {
  if (!session.quiz || session.phase === "empty") {
    return shell(
      "Who Said It",
      `<section class="question-card"><p class="hello">Not enough keepsakes yet</p>
      <h1>Play Two of Us first.</h1>
      <p>Notes from the end of that game become this quiz.</p>
      <a class="button button--dark" href="#/duo">Two of Us →</a></section>`
    );
  }
  if (session.phase === "reveal") {
    return shell(
      "Who Said It",
      `<section class="question-card">
        <p class="hello">${session.correct ? "That’s them." : "Not quite."}</p>
        <h1>${escapeHtml(session.quiz.note.from)} wrote it.</h1>
        <p>${escapeHtml(session.quiz.note.text)}</p>
        <p class="muted">${session.score}/${session.total}</p>
        <div class="question-actions"><button class="button button--dark" data-act="who-next">Another note</button></div>
      </section>`
    );
  }
  return shell(
    "Who Said It",
    `<header class="section-heading"><p class="hello">Guess</p><h1>Who left this?</h1></header>
    <article class="note-letter"><p>${escapeHtml(session.quiz.note.text)}</p></article>
    <div class="question-actions">
      ${session.quiz.options
        .map((name) => `<button class="button button--dark button--large" data-act="who-guess" data-value="${escapeHtml(name)}">${escapeHtml(name)}</button>`)
        .join("")}
    </div>`
  );
}

function viewSlow({ session, skip }) {
  const skipBtn = skip ? `<button class="button" data-act="slow-skip">Skip →</button>` : "";
  return shell(
    "Slow Dance",
    `<header class="section-heading"><p class="hello">No timer</p><h1>Sit with this one.</h1></header>
    ${qcard(session.current, `<div class="question-actions">
      <button class="button button--dark button--large" data-act="slow-done">We’re done</button>
      <button class="button" data-act="slow-next">Another song</button>
      ${skipBtn}
    </div>`)}`
  );
}

function viewMorning({ session }) {
  const morning = session.morning || getMorning();
  if (session.phase === "done") {
    return shell(
      "Morning Page",
      `<section class="question-card"><p class="hello">Streak ${morning.streak}</p>
      <h1>That’s your page.</h1>
      <p>${escapeHtml(session.current?.question || morning.lastCard?.question || "")}</p>
      <a class="button button--dark" href="#/play">Shelf</a></section>`
    );
  }
  return shell(
    "Morning Page",
    `<p class="hello">Streak ${morning.streak} · surface only</p>
    ${qcard(session.current, `<div class="question-actions">
      <button class="button button--dark button--large" data-act="morning-done">That’s my page</button>
      <button class="button" data-act="morning-skip">Another sip</button>
    </div>`)}`
  );
}

function viewLetter({ session }) {
  if (session.phase === "pick") {
    return shell(
      "Unopened Letter",
      `<header class="section-heading"><p class="hello">Seal it for a week</p><h1>Which Deep question waits?</h1></header>
      <div class="level-list">${(session.choices || [])
        .map((item) => `<button class="level" data-act="letter-seal" data-value="${escapeHtml(item.id)}"><h3>${escapeHtml(item.question)}</h3></button>`)
        .join("")}</div>`
    );
  }
  if (session.phase === "sealed") {
    const when = new Date(session.letter.openAt).toLocaleDateString();
    return shell(
      "Unopened Letter",
      `<section class="question-card wax">
        <p class="hello">Sealed</p>
        <h1>Don’t open until ${escapeHtml(when)}.</h1>
        <p>GTK Y will offer it again. Skip is kind if you’re not ready then either.</p>
        <a class="button" href="#/play">Shelf</a>
      </section>`
    );
  }
  return shell(
    "Unopened Letter",
    `<p class="hello">A week later</p>
    ${qcard(session.current, `<div class="question-actions">
      <button class="button button--dark" data-act="letter-open">I sat with it</button>
      <button class="button" data-act="letter-reseal">Seal a new one</button>
    </div>`)}`
  );
}

function viewLater({ session, skip }) {
  const pile = getLater();
  if (session.phase === "show" && session.current) {
    const skipBtn = skip ? `<button class="button" data-act="later-skip">Skip →</button>` : "";
    return shell(
      "For Later",
      `${qcard(session.current, `<div class="question-actions">
        <button class="button button--dark" data-act="later-answer">I answered</button>
        ${skipBtn}
        <button class="button" data-act="later-list">Back to the pile</button>
      </div>`)}`
    );
  }
  return shell(
    "For Later",
    `<header class="section-heading"><p class="hello">The flinch pile</p><h1>${pile.length ? "Questions you weren’t ready for." : "Nothing saved yet."}</h1>
    <p>Pin from any card with For later.</p></header>
    ${
      pile.length
        ? `<div class="library-list">${pile
            .map(
              (item) => `<article class="library-item">
                <p>${escapeHtml(item.question)}</p>
                <div class="question-actions">
                  <button class="button button--dark" data-act="later-draw" data-value="${escapeHtml(item.id)}">Ask it</button>
                  <button class="button" data-act="later-drop" data-value="${escapeHtml(item.id)}">Let it go</button>
                </div>
              </article>`
            )
            .join("")}</div>`
        : `<p class="muted">When a question stings, pin it. Come back when the night is softer.</p>`
    }`
  );
}

function viewCategory({ session, skip }) {
  if (session.phase === "pick" || !session.category) {
    return shell(
      "Category Night",
      `<header class="section-heading"><p class="hello">One shelf</p><h1>What is tonight about?</h1></header>
      <div class="cat-grid">${categoryList()
        .map(
          (cat) => `<button type="button" class="cat-chip" data-act="category-start" data-value="${escapeHtml(cat.id)}" data-level="${escapeHtml(cat.level)}">
            ${cat.emoji} ${escapeHtml(cat.label)} <small>${LEVELS[cat.level].label}</small>
          </button>`
        )
        .join("")}</div>`
    );
  }
  if (session.phase === "empty") {
    return shell("Category Night", `<section class="question-card"><h1>That shelf is empty.</h1><button class="button" data-act="category-reset">Pick another</button></section>`);
  }
  const skipBtn = skip ? `<button class="button" data-act="category-skip">Skip →</button>` : "";
  return shell(
    "Category Night",
    `<p class="hello">${session.remaining.length + (session.current ? 1 : 0)} left on this shelf</p>
    ${qcard(session.current, `<div class="question-actions">
      <button class="button button--dark button--large" data-act="category-answer">I answered</button>
      ${skipBtn}
    </div>`)}`
  );
}

function viewClose({ session }) {
  const last = getLastNight();
  return shell(
    "Close the book",
    `<header class="section-heading"><p class="hello">End of night</p><h1>One favorite each.</h1>
    <p>Then download albums if you want them tomorrow.</p></header>
    <form id="close-book" class="question-card">
      <div class="field"><label for="fav-q">Favorite question tonight</label>
      <textarea id="fav-q" name="q" rows="2" maxlength="280">${escapeHtml(session.favoriteQ || "")}</textarea></div>
      <div class="field"><label for="fav-a">Favorite answer you heard</label>
      <textarea id="fav-a" name="a" rows="3" maxlength="400">${escapeHtml(session.favoriteA || "")}</textarea></div>
      <div class="question-actions">
        <button class="button button--dark button--large" type="submit">Seal the night →</button>
        <button class="button" type="button" data-act="album-export">Download albums</button>
      </div>
    </form>
    ${last?.favoriteQ ? `<p class="muted">Last time you kept: ${escapeHtml(last.favoriteQ)}</p>` : ""}`
  );
}

export function lastNightBook(last) {
  if (!last) return "";
  const title = last.label || "Last night";
  return `<button type="button" class="book book--play book--last" style="background:#4a2c1c" data-act="last-night" aria-label="${escapeHtml(title)}">
    <b>${escapeHtml(title)}</b><small>resume the shelf</small>
  </button>`;
}

export function vetoListHTML() {
  const ids = getVeto();
  if (!ids.length) return `<p class="muted">Nothing hidden. In the library or on a card, tap Hide this one.</p>`;
  return `<p class="muted">${ids.length} hidden. They won’t show up in new decks.</p>
    <div class="question-actions">${ids
      .slice(0, 12)
      .map((id) => `<button class="chip" data-act="unveto-q" data-value="${escapeHtml(id)}">Unhide ${escapeHtml(id.slice(0, 8))}</button>`)
      .join("")}</div>`;
}
