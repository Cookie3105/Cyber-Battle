# Cyber-Battle
```text
A browser-based Red Team vs Blue Team cybersecurity game featuring strategic cards, attack simulations, defensive tactics, random events, and interactive gameplay. Built with HTML, CSS, and JavaScript.
```

===

# Cyber Battle — Red Team vs Blue Team

> An educational cybersecurity game in which two teams compete: the **Red Team** simulates an attack campaign, while the **Blue Team** must identify threats, contain them, and protect the infrastructure.

Cyber Battle is a small web game built with **vanilla HTML, CSS, and JavaScript**. Its interface is inspired by a neo-brutalist style, featuring a geometric grid, bold borders, hard shadows, and a color palette of pink, purple, lime green, white, and black.

> [!IMPORTANT]
> This project is an educational simulation only. It does not perform real scans, exploits, logins, or cyberattacks, and it does not interact with external systems.

---

## Table of Contents

- [Project Goal](#project-goal)
- [Technologies Used](#technologies-used)
- [File Structure](#file-structure)
- [Installation and Setup](#installation-and-setup)
- [How to Play](#how-to-play)
- [Interface and Features](#interface-and-features)
- [Teams and Cards](#teams-and-cards)
- [Game Turn](#game-turn)
- [Random Events and Dice](#random-events-and-dice)
- [Victory Conditions](#victory-conditions)
- [Final Statistics](#final-statistics)
- [Code Structure](#code-structure)
- [Customization](#customization)
- [Accessibility and Responsive Design](#accessibility-and-responsive-design)
- [Troubleshooting](#troubleshooting)
- [Possible Future Improvements](#possible-future-improvements)
- [License](#license)

---

## Project Goal

The game represents a simulated scenario set in **TechCompany**, a company that manages an online platform and stores:

- user credentials;
- customers' personal data;
- confidential documents;
- exposed web services;
- an internal corporate network.

The player chooses a team and faces an opponent controlled by the game:

- **Red Team:** selects cards representing threats and attempted compromises.
- **Blue Team:** selects countermeasures to reduce or neutralize the impact of attacks.

A match lasts a maximum of **5 turns**. The main indicator is the infrastructure's integrity, which starts at 100%.

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Structure of the screens, game board, cards, and reports |
| CSS3 | Layout, colors, components, animations, and responsive behavior |
| JavaScript | Game rules, turn management, cards, timer, dice, events, and statistics |
| Google Fonts | `Space Grotesk` and `DM Mono` fonts |

No JavaScript frameworks, databases, or backends are used. The game runs entirely in the browser.

---

## File Structure

The project is organized into three main files:

```text
cyber-battle/
│
├── index.html       # Interface structure and content
├── style.css        # Visual styling and responsive design
├── script.js        # Game logic and functionality
│
└── README.md        # Project documentation
```

### Linking the Files

Inside the `<head>` section of `index.html`, the stylesheet must be linked:

```html
<link rel="stylesheet" href="style.css">
```

JavaScript must be loaded before the closing `</body>` tag:

```html
<script src="script.js"></script>
```

**Important:** if you are starting from the originally supplied single HTML version, which contains embedded CSS and JavaScript, follow these steps to create the three-file structure:

1. Copy all the content between `<style>` and `</style>` into `style.css`, without including the `<style>` tags.
2. Copy all the content between `<script>` and `</script>` into `script.js`, without including the `<script>` tags.
3. Remove the `<style>` and `<script>` blocks from `index.html`.
4. Add the two links shown above.
5. Keep the HTML structure and Google Fonts links in `index.html`.

The filenames used in the links must match the actual filenames in the project folder exactly.

---

## Installation and Setup

### Requirements

- A modern browser: Chrome, Firefox, Edge, or Safari.
- A text or code editor, such as Visual Studio Code.
- The three files `index.html`, `style.css`, and `script.js` in the same folder.

No package installation is required.

### Running Locally

1. Download or clone the repository.
2. Make sure all three files are in the same folder.
3. Open `index.html` in your browser.

Alternatively, you can use the **Live Server** extension in Visual Studio Code:

1. Open the project folder in Visual Studio Code.
2. Right-click `index.html`.
3. Select **Open with Live Server**.

Live Server is optional: the game does not require an application server.

### Publishing with GitHub Pages

1. Upload the project files to a GitHub repository.
2. Open **Settings → Pages**.
3. In the publishing section, select the branch to use and the root folder (`/root`).
4. Save the configuration.
5. Wait for the site to be published, then open the URL provided by GitHub Pages.

The entry file must be named `index.html`, and the CSS and JavaScript paths must be correct and relative.

---

## How to Play

### 1. Start Screen

The home page includes:

- the **Red Team vs Blue Team** title;
- a short description of the company scenario;
- a button that takes you to team selection;
- a link to the rules;
- a mission summary;
- role selection.

### 2. Choosing a Team

Two game modes are available:

| Choice | Player's Role | Opponent |
|---|---|---|
| Red Team | Selects attacks | Blue Team controlled by the game |
| Blue Team | Selects defenses | Red Team controlled by the game |

The match starts immediately after a team is selected.

### 3. Battlefield

During the match, several areas are available:

- **System Integrity:** displays the infrastructure's current integrity.
- **Attack Path:** displays the four layers of the scenario.
- **Attack Vector:** displays the selected attack card.
- **Countermeasure:** displays the selected defense card or indicates that no defense was chosen.
- **Random Event:** displays the event determined by the dice.
- **Your Hand:** contains the cards available to the player.
- **Mission Control:** describes the current phase.
- **Timer:** displays the time available for the Blue Team's response.
- **Battle Log:** records match events.
- **Scoreboard:** summarizes damage dealt and damage prevented.

### 4. Selecting Cards

To play a card:

1. Read its name and description.
2. Check the effect shown at the bottom.
3. Click the card you want to play.
4. Wait for the turn to be resolved.

When playing as the Blue Team, the **No Defense / Pass** button is also available. If the timer reaches zero, the turn continues without a countermeasure.

### 5. Subsequent Turns

After the attack and event have been resolved, a button to continue appears. Clicking it starts the next turn.

The match ends when:

- integrity reaches zero;
- integrity drops below the 60% threshold;
- all 5 turns have been completed.

---

## Interface and Features

| Feature | Description |
|---|---|
| Start navigation | Provides access to the scenario, rules, and team selection |
| Role selection | Starts a match as either the Red Team or the Blue Team |
| Card hand | Displays the available cards and allows the player to select them |
| AI opponent | Automatically selects attacks or defenses |
| Blue Team timer | Gives the Blue player 30 seconds to respond; some events can reduce this to 20 seconds on the following turn |
| Integrity bar | Updates the infrastructure's integrity percentage in real time |
| Attack path | Highlights the infrastructure layer involved |
| Dice | Generates two values from 1 to 6 |
| Random events | Applies the effects associated with the sum of the dice |
| Battle Log | Records attacks, defenses, damage, and events |
| Scoreboard | Shows damage dealt by the Red Team and damage prevented by the Blue Team |
| Final report | Displays the winner and match statistics |
| New simulation | Returns to team selection |
| Back to home | Reopens the start screen |

---

## Teams and Cards

Cards are defined in the `RED` and `BLUE` arrays in `script.js`. Each deck contains two copies of every card.

### Red Team — Attack Cards

| Card | Potential Damage | Target Layer | Description |
|---|---:|---|---|
| Phishing | 20% | Employees | Attempt to steal credentials through a fraudulent message |
| Service Scanning | 10% | Web server | Reconnaissance of exposed services |
| Compromised Credentials | 25% | Web server | Attempt to gain access using weak or exposed credentials |
| Lateral Movement | 30% | Internal network | Attempt to reach other systems |
| Data Exfiltration | 40% | Customer data | Simulated attempt to steal confidential information |

The listed damage is the base value. It can be reduced by defenses or increased by the chain bonus.

### Blue Team — Defense Cards

| Card | Effect |
|---|---|
| MFA Authentication | Completely blocks Phishing and Compromised Credentials; reduces Lateral Movement damage by 25% |
| Firewall & Filtering | Blocks Service Scanning; reduces Lateral Movement and Data Exfiltration damage by 50%, and Compromised Credentials damage by 25% |
| SIEM Monitoring | Reduces the damage of all attacks by 50% |
| Patch Management | Reduces Service Scanning damage by 50% and Compromised Credentials and Lateral Movement damage by 25%; also restores 5 integrity points |
| Server Isolation | Completely blocks Lateral Movement and Data Exfiltration; reduces Phishing damage by 25% |

A defense is effective only to the extent specified by the interaction between the attack card and the defense card. If a card has no countermeasure rule for a particular attack, it contributes zero damage reduction.

---

## Game Turn

Each turn follows this sequence:

1. **Draw:** both teams draw one card, if their respective decks still contain cards.
2. **Attack:** the Red Team plays an attack card.
3. **Response:** the Blue Team selects a defense card within the available time or passes.
4. **Resolution:** the effective damage is calculated and integrity is updated.
5. **Update:** the attack path, statistics, and Battle Log are updated.
6. **Event:** two dice are rolled and the event corresponding to their sum is applied.
7. **Continue:** if the match has not ended, the next turn can begin.

### Damage Calculation

The game uses the following formula:

```text
Base Damage = Attack Card Damage + Chain Bonus

Effective Damage = Base Damage × (1 − Block Percentage)

New Integrity = Previous Integrity − Effective Damage
```

The damage result is rounded to the nearest whole number.

Example:

```text
Attack: Lateral Movement = 30%
Chain Bonus: +5%
Defense: Firewall = 50%

Base Damage = 30 + 5 = 35
Effective Damage = 35 × (1 − 0.50) = 17.5
Applied Damage = 18 points
```

### Chain Bonus

If a previous attack was not mitigated by at least 50%, the next attack receives a **+5 percentage-point** bonus to its base damage.

The chain is interrupted when a defense blocks at least 50% of the attack or when the **SOC Alert** event occurs.

---

## Random Events and Dice

At the end of each turn, two six-sided dice are rolled. Their sum determines the event.

| Dice Sum | Event | Effect |
|---:|---|---|
| 2 | No Anomaly | No change |
| 3 | After-Hours Activity | Integrity −10%; the Blue Team's timer is set to 20 seconds on the next turn |
| 4 | No Anomaly | No change |
| 5 | Human Error | Integrity −10% |
| 6 | No Anomaly | No change |
| 7 | No Anomaly | No change |
| 8 | SOC Alert | Integrity +5%; interrupts the attack chain |
| 9 | No Anomaly | No change |
| 10 | Emergency Maintenance | Integrity +10%; the Blue Team loses one random card, if it has any |
| 11 | No Anomaly | No change |
| 12 | Verified Backup | Integrity +15% |

Integrity is always kept within the range of 0% to 100%.

Events that do not change integrity are still displayed on the battlefield and recorded in the log. The activated-events counter in the final statistics counts only events that have an actual gameplay effect.

---

## Victory Conditions

The result is checked at the end of the match:

| Final Integrity | Result |
|---:|---|
| 60%–100% | Blue Team wins |
| 1%–59% | Red Team wins |
| 0% | Red Team wins |

The threshold is therefore **60%**: the Blue Team must keep integrity at or above this level to win.

The match can end early if integrity reaches zero.

---

## Final Statistics

At the end of the simulation, a report is displayed with:

- **Cards Played:** number of cards actually used by each team.
- **Successful Attacks:** number of attacks that received less than 50% mitigation.
- **Total Blocks:** number of defenses that completely neutralized the damage.
- **Damage Dealt:** total damage actually applied by the Red Team.
- **Damage Prevented:** difference between the attack's base damage, including any chain bonus, and the effective damage.
- **Integrity Restored:** points restored through the effects of defense cards.
- **Average Response Time:** average of the recorded response times for the Blue Team.
- **Random Events Triggered:** number of events with an actual gameplay effect.

> [!NOTE]
> Damage prevented and integrity restored are separate metrics. Restored integrity is not added to damage prevented. Average response time is an indicative metric: when the Blue Team is controlled by the AI, the time is simulated.

---

## Code Structure

### `index.html` — Structure

Contains the application's elements and screens:

- home page and scenario;
- team selection;
- game area;
- integrity bar;
- attack path;
- card slots;
- dice area;
- player's hand;
- Mission Control panel;
- Battle Log and Scoreboard;
- results screen.

HTML identifiers (`id`) are used by JavaScript to update the content dynamically.

### `style.css` — Appearance

Contains:

- CSS variables for the color palette;
- fonts and typography settings;
- home page layout;
- card components;
- battlefield layout;
- panels and buttons;
- animations and transitions;
- media queries for tablets and smartphones;
- rules for reducing animations.

The main visual variables are defined in `:root`:

```css
:root {
  --paper: #f5f3ed;
  --white: #fffefa;
  --ink: #090909;
  --pink: #ff789b;
  --lime: #c8f34a;
  --purple: #7950ef;
  --red: #f0444b;
  --blue: #4388e8;
}
```

### `script.js` — Logic

Contains the data and functions that control the match.

| Element | Responsibility |
|---|---|
| `RED` | Defines the attack cards |
| `BLUE` | Defines the defense cards |
| `EVENTS` | Defines the events associated with the dice sum |
| `shuffle()` | Shuffles the decks |
| `showScreen()` | Displays the requested screen |
| `log()` | Adds a message to the Battle Log |
| `cardButton()` | Creates a card UI component |
| `renderHand()` | Displays the available cards |
| `draw()` | Draws a card from the deck |
| `setIntegrity()` | Updates the integrity bar and percentage |
| `setPhase()` | Updates the Mission Control panel |
| `renderCardSlot()` | Displays the attack, defense, or event card |
| `updateNodes()` | Updates the visual state of the attack path |
| `askPlayer()` | Handles the player's choice and the timer |
| `aiAttack()` | Selects the AI's attack |
| `aiDefense()` | Selects the AI's defense |
| `resolveRound()` | Calculates damage, mitigation, and statistics |
| `rollEvent()` | Rolls the dice and applies the event |
| `playTurn()` | Handles the complete sequence of a turn |
| `startGame()` | Initializes a new match |
| `finish()` | Calculates and displays the final report |

The current game state is stored in the global `game` object, which contains integrity, turn number, cards, decks, timer, and statistics.

---

## Customization

### Changing the Colors

Open `style.css` and edit the variables defined in `:root`.

### Changing Attack Damage

Open `script.js` and edit the `damage` field of the cards in the `RED` array.

Example:

```js
{
  id: "phishing",
  name: "Phishing",
  desc: "Card description.",
  damage: 20,
  node: "staff",
  effect: "Human-factor threat"
}
```

### Changing Defenses

In the `BLUE` array, the `blocks` field specifies the percentage of damage blocked for each attack type.

Example:

```js
blocks: {
  phishing: 1,  // 100% block
  lateral: 0.5  // 50% block
}
```

Values range from `0` (no blocking) to `1` (complete blocking).

### Adding an Attack Card

Add a new object to the `RED` array, specifying at least:

- `id`: unique identifier;
- `name`: displayed name;
- `desc`: description;
- `damage`: base damage;
- `node`: infrastructure layer involved;
- `effect`: short effect displayed on the card.

The `node` field must match one of the existing layers: `staff`, `web`, `net`, `data`.

### Adding a Defense Card

Add a new object to the `BLUE` array, specifying:

- `id`;
- `name`;
- `desc`;
- `blocks`, with block percentages for the attack IDs;
- `effect`.

You can also add `heal` to restore integrity.

### Changing the Timer and Match Length

In `script.js`:

- the standard timer is set to `30` seconds in `startGame()`;
- the After-Hours Activity event sets `nextTimer` to `20` seconds;
- the maximum number of turns is set to `5` in `playTurn()` and in the round display.

If you change the number of turns, also update the interface text and indicators.

### Changing the Victory Threshold

The threshold is currently set to 60%. To change it, update all of the following consistently:

- the victory check in `finish()`;
- the visual threshold in `style.css` or the HTML;
- the informational text on the home page and battlefield.

---

## Accessibility and Responsive Design

The interface includes:

- an adaptive layout for desktop, tablet, and smartphone screens;
- buttons that can be used with a mouse and keyboard;
- a `focus-visible` indicator to make the selected control recognizable;
- support for the `prefers-reduced-motion` system preference;
- text descriptions on cards, in addition to color differences.

For the best experience, use an up-to-date browser.

---

## Troubleshooting

| Issue | Possible Solution |
|---|---|
| The page does not display its styling | Check the link to `style.css` and verify the filename |
| Buttons do not work | Check the path to `script.js` and look for errors in the browser console |
| Fonts look different | Check your Internet connection: Google Fonts is loaded remotely |
| The game does not start | Make sure `index.html`, `style.css`, and `script.js` are in the same folder |
| Changes do not appear | Refresh the page or clear the browser cache |
| The layout looks different on mobile | Check the `viewport` meta tag in the HTML |

To check for JavaScript errors, open the browser's developer tools (`F12`) and select the **Console** tab.

---

## Possible Future Improvements

The project could be extended with:

- a local two-human-player mode;
- new cards and company scenarios;
- difficulty levels for the AI opponent;
- additional event types;
- a scoring system and leaderboards;
- educational explanations after each attack and defense;
- match result saving;
- additional animations and visual feedback.

These features are possible future extensions and are not part of the current version.

---

## License

This project was created for educational purposes as part of a cybersecurity exercise focused on **Red Team vs Blue Team** dynamics.

Before distributing the project publicly, add an explicit license to the repository if needed.
