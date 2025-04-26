let step = 0;
let Shrek;
let npcWins = 10;
let npcCombatStep = 0;
let currentEnemy;
let bossStep = 0;
let evilBoss;
let bossChoice = 0;

const actualName = "Shrek";

function writeToGameBox(text, clear = false) {
    const gameBox = document.getElementById("game-box");
    if (!gameBox) return console.error("game-box div not found!");

    // Turn every "\n" into "<br>" so newlines still work
    const html = text.replace(/\n/g, "<br>");

    if (clear) {
        gameBox.innerHTML = html;
    } else {
        gameBox.innerHTML += (gameBox.innerHTML ? "<br>" : "") + html;
    }
}
  
// Show intro text once on page load
window.onload = () => {
  const introText = 
`==============================================================================================
==============================================================================================
Ah, you’re awake.

Your surroundings? Unclear. Your purpose? Murkier still. But one truth echoes  
in your soul heavier than the unbearable weight of massive talent itself.

You must find Nicholas Cage.

Why? That’s not for you to question. Some say he holds the secret to charisma,
others whisper that he *is* the National Treasure. A few believe he’s simply
vibing somewhere between reality and dream, waiting for someone brave—or weird—enough
to seek him out.

You feel a strange energy pulling you forward… and an unsettling warmth from
the satchel at your side. You open it. Onions. So many onions. You don’t know why.

(hit enter)`;

  writeToGameBox(introText, true);
}

function nextStep() {
  const inputBox = document.getElementById("input-box");
  const input = inputBox.value.trim();
  inputBox.value = "";
    if (step === 100) { // NPC combat
    handleCombatInput(input);
    return;
  }
    if (step === 200) {  // Boss combat
    bossInputHandler(input);
    return;
  }
  switch (step) {
    case 0:
      writeToGameBox("\n\nBut first things first… what’s your name, traveler?");
      step++;
      break;
    case 1:
        const chosenName = input;
        writeToGameBox(`\n\nOops, typo detected! Don't worry, looks like autocorrect changed "${chosenName}" to "Shrek".`);
        writeToGameBox(`\n(Autocorrecting... ah, name found. It's Shrek now.)`);
        Shrek = new User("Shrek", 250, 10, 0, 250); // Use "Shrek" as player name
        Shrek.actualName = chosenName; // Store original for future fun
        writeToGameBox(`\n\nWelcome, ${actualName}! Is this name correct? Input yes or no.`);
        step++;
        break;
    case 2:
        writeToGameBox(`\n\nAlright Shrek, glad we're on the same page. Press Enter to continue!`);
        step++;
        break;
    case 3:
      writeToGameBox("\n\nLoading game...", true);
      writeToGameBox("1. Start a new game\n2. Load from save\n(Type 1 or 2)");
      step++;
      break;
    case 4:
    const choice = parseInt(input);
    if (choice === 1) {
        writeToGameBox("\n\nYou chose option 1.\nStarting a new game...");
        Shrek = new User("Shrek", 250, 10, 0, 250); // Create a new user
        Stats(); // Update and display stats
        step++;
      } else if (choice === 2) {
        writeToGameBox("\n\nYou chose option 2.\nLoading game...");
        Shrek = loadGame(); // Load saved game data
        if (!Shrek) {
          writeToGameBox("No save file found. Starting a new game...");
          Shrek = new User("Shrek", 250, 10, 0, 250);
        } else {
          writeToGameBox("Save file loaded. Resuming game...");
        }
        Stats(); // Update and display stats
        step++;
      } else {
        writeToGameBox("\n\nPlease enter a valid option (1 or 2).");
      }
      break;
    case 5:
        Stats();
        writeToGameBox(
            `\n\n==============================================================================================\n` +
            `You are making progress on your mystical quest to find Nick Cage\n\n` +
            `There appears 3 paths of uncertainty, which direction will you head?\n` +
            `==============================================================================================\n\n` +
            `1. Frolic into the direction of the wind\n` +
            `2. Follow some odd footprints\n` +
            `3. Tie a blindfold around your face and say Nicholas Cage 5 times! (the boss could approach, beware...)\n` +
            `4. Gaze into the stars\n` +
            `5. Abandon Quest\n\n`
        );
        step = 6;
        break;    
    case 6:
        const direction = parseInt(input);
        if (direction < 1 || direction > 5) {
            writeToGameBox("\n\nInvalid input!");
            break;
        }
        
        let Encounter = Math.floor(Math.random() * 101);

        switch (direction) {
            case 1:
            writeToGameBox("\n\nYou head into the wind...");
            if (Encounter < 25) {
                writeToGameBox("You suddenly smell capitalism.... [Merchant encounter coming soon]");
                return;       
            } else if (Encounter < 50) {
                writeToGameBox("You feel like you're being watched.... [Oracle encounter coming soon]");
                return;       
            } else {
                writeToGameBox("You see a familiar face in the distance.... [NPC encounter coming soon]");
                handleNPCEncounter();  // Start NPC combat when encountered
                return;               // ←— exit `nextStep` so step stays 200
            }
            break;
            case 2:
            writeToGameBox("\n\nYou follow the footprints...");
            if (Encounter < 33) {
                writeToGameBox("You smell capitalism again... [Merchant]");
                return;       
            } else if (Encounter < 66) {
                writeToGameBox("You feel watched... [Oracle]");
                return;       
            } else {
                writeToGameBox("You meet someone familiar... [NPC]");
                handleNPCEncounter();  // Start NPC combat when encountered
                return;               // ←— keep `step = 200`
            }
            break;
            case 3:
            writeToGameBox("\n\nA roar echoes nearby... [Boss encounter coming soon]");
            if (npcWins >= 10) {
                writeToGameBox("A mighty roar shakes the earth...\nThe boss approaches!!");
                step = 200;       // Tells the game you're now in boss mode
                bossStep = 0;     // Resets boss interaction step
                BossB(); // Start the boss battle
                return;       
              } else {
                writeToGameBox(`You feel a strange energy in the air... but you're not ready yet.\n(Win ${10 - npcWins} more battles to unlock the boss!)`);
              }
            break;
            case 4:
            Cage()
            break;
            case 5:
            gameOver("You have abandoned your quest. Nicholas Cage weeps.");
            return;
        }
        
        // Only loop back if no combat was triggered
        step = 5;
        break;
  }
}

function loadGame() {
    const savedData = localStorage.getItem("userData");
    if (savedData) {
      const parsedData = JSON.parse(savedData); // Deserialize back to a plain object
      return new User(parsedData.name, parsedData.health, parsedData.wallet, parsedData.luck, parsedData.energy);
    }
    return null; // No saved data found
  }
  
  function SaveGame(user) {
    // Ensure Shrek (or the player object) is saved correctly
    const userData = {
        name: user.name,
        health: user.health,
        wallet: user.wallet,
        luck: user.luck,
        energy: user.energy,
    };
    localStorage.setItem("userData", JSON.stringify(userData));  // Serialize the object
    console.log("Game saved!");
}

function Stats() {
   // Ensures key survival variables stay within a reasonable range
   if (Shrek.energy < 0) Shrek.energy = 0;
   if (Shrek.energy > 1000) Shrek.energy = 1000;
   if (Shrek.health < 0) Shrek.health = 0;
   if (Shrek.health > 1000) Shrek.health = 1000;

   // Get the element where stats should be displayed
   const statsBox = document.getElementById("stats-box");

   // Set the content inside the stats box
   statsBox.innerHTML = `
   <div style="text-align: center;">
       <h2>User Stats</h2>
       <p><strong>Name:</strong> ${Shrek.name}</p>
       <p><strong>Health:</strong> ${Shrek.health}</p>
       <p><strong>Money:</strong> $${Shrek.wallet}</p>
       <p><strong>Luck:</strong> ${Shrek.luck}</p>
       <p><strong>Energy:</strong> ${Shrek.energy}</p>
   </div>
   `;
 }

function gameOver(reason = "Your journey ends here.") {
  writeToGameBox(`\n\n================ GAME OVER ================\n${reason}\n===========================================`, true);
  step = -1; // Set step to an invalid value to prevent further input
  document.getElementById("input-box").disabled = true;
}


//image of Nick Cage displaying?
function Cage() {
    writeToGameBox(`
  ==============================================================================================
  *You look at the oddly Nick Cage-shaped stars*
  Game has been saved...
  `);
    SaveGame(Shrek);
  }

function BossB() {
  evilBoss = new Boss(); // initialize the boss
  bossStep = 0;
  step = 200; // boss combat mode
  writeRed(`\n\nYou have spotted the Boss... oh ho, ha ha...`);
  writeToGameBox(`\n${evilBoss.name} blocks your path to Nick Cage.\nPrepare for battle!`);
  setTimeout(showBossMenu, 300); // slight delay for smoothness
}

function showBossMenu() {
  Stats();
  writeRed(`\nEnemy Stats: ${evilBoss.name} | Health: ${evilBoss.health}\n`);
  writeToGameBox(
    `Choose your attack:\n` +
    `1. Unlayer the Ogre\n` +
    `2. Do the roar\n` +
    `3. Be a swampy boy`
  );
  bossStep = 1;
}

function bossInputHandler(input) {
    // CASE 0: show the menu and advance to waiting for the player's selection
    if (bossStep === 0) {
      Stats();

      // red stats line:
      writeRed(`\nEnemy Stats: ${evilBoss.name} | Health: ${evilBoss.health}\n`);
      writeToGameBox(
        `Choose your attack:\n` +
        `1. Unlayer the Ogre\n` +
        `2. Do the roar\n` +
        `3. Be a swampy boy`
      );
      bossStep = 1;
      return;
    }
    
    if (Shrek.health <= 0) {
      gameOver("You were crushed by the boss's power!");
      return;
    }
    if (Shrek.energy <= 0) {
      gameOver("You're out of energy... the fight slips away.");
      return;
    }

    // CASE 1: process the player's selection
    if (bossStep === 1) {
      const choice = parseInt(input);
      if (![1, 2, 3].includes(choice)) {
        writeToGameBox("Invalid move. Choose 1, 2, or 3.");
        return; // stay in step 1, waiting for a valid move
      }
  
      // boss picks its move
      const bossMove = Math.floor(Math.random() * 3) + 1;
  
      // Rock–Paper–Scissors logic
      if (choice === bossMove) {
        writeToGameBox(`\nDraw! ${evilBoss.name}'s "${evilBoss.pow}" deflects your move.`, true);
        Shrek.energy -= 10;
      } else if (
        (choice === 1 && bossMove === 3) ||
        (choice === 2 && bossMove === 1) ||
        (choice === 3 && bossMove === 2)
      ) {
        const damage = 30 + (30 * Shrek.luck);
        evilBoss.health -= damage;
        Shrek.energy -= 10;
        Shrek.luck += 0.025;
        writeToGameBox(`\nHit! You land a blow on ${evilBoss.name} for ${evilBoss.toFixed(1)} damage.`, true);
      } else {
        writeToGameBox(`\n${evilBoss.name} strikes with "${evilBoss.pow}"! You take 20 damage.`, true);
        Shrek.health -= 20;
        Shrek.energy -= 10;
      }
  
      // CHECK FOR END-OF-COMBAT
      if (evilBoss.health <= 0) {
        const reward = 10 + (10 * Shrek.luck);
        Shrek.wallet += reward;
        npcWins++;
          writeToGameBox(`
            ==============================================================================================
            You have defeated ${evilBoss.name}! 🏆
            You approach the mystery man... "Nick Cage?" you ask.
            Suddenly, Mufasa's voice booms from the heavens: 
            "There is no Nick Cage, Shrek. There never was."
            Nick Cage was the friends we made along the way 💫.
            CONGRATS ${Shrek.actualName}!!! You beat the game. HA, I did know your name all along Shrek. 
            ==============================================================================================
            `);
        Stats();
      // cleanly exit combat:
        step = 5;
        bossStep = 0;
        evilBoss = null;
        return;
      }
      if (Shrek.health <= 0) {
        writeToGameBox("\nYou have been defeated! Game over.", true);
        Stats();
        step = 5;
        bossStep = 0;
        evilBoss = null;
        return;
      }
  
      // STILL FIGHTING → reset to show menu again *immediately*
      bossStep = 0;
      writeToGameBox("\nPreparing for the next round...");
      setTimeout(() => {
      writeToGameBox("\nYour move again...");
      Stats();
      writeRed(`\nEnemy Stats: ${evilBoss.name} | Health: ${evilBoss.health}\n`);
      writeToGameBox(
        `Choose your attack:\n` +
        `1. Unlayer the Ogre\n` +
        `2. Do the roar\n` +
        `3. Be a swampy boy`
      );
      bossStep = 1;
    }, 500); // purely visual delay
    }
}

function createRandomWackyCharacter() {
const names = [
    "Frodo Baggins", "Gandalf The Gray", "Big Dwarf Man", "Aristotle", "Donkey",
    "Batman", "Napoleon Dynamite", "Elon Musk", "Yoda", "Darth Vader",
    "Jeff Bezos", "Pac Man", "1010000 Mark Zuckerberg 000010101", 
    "Student Loans", "Sketchy Circus Clown"
];

const attacks = [
    "Second Breakfast", "Wizarding Scheme", "Body Slam", "Philosophic Throttle", "Waffle Tussle",
    "Brooding Silence", "Tater Pocket", "Purchase the clothes off your back", "Crazed Lightsaber Rampage",
    "Reveal Parental Status", "2 Day Shipping", "waka waka", "ISHuman() = false", 
    "Interest Payments", "*Unsettling Giggles*"
];

const health = Math.floor(Math.random() * 51) + 50; // 50–100 health
const index = Math.floor(Math.random() * names.length);
const name = names[index];
const pow = attacks[index];

return new NPC(name, health, pow); // you may want to allow custom power if needed
}
  
// Encounter logic for NPC
function handleNPCEncounter() {
  const npc = createRandomWackyCharacter();
  currentEnemy = npc;
  npcCombatStep = 0;
  step = 100;
  writeRed(`\n\nYou encounter ${npc.name}! Prepare for combat.`);
  writeToGameBox(`\n\n[Combat starts with ${npc.name}]\n\n`);
  handleCombatInput(""); // Immediately prompt the attack choices
}

  
function handleCombatInput(input) {
  // CASE 0: show the menu and advance to waiting for the player's selection
  if (npcCombatStep === 0) {
    Stats();

    // red stats line:
    writeRed(`\nEnemy: ${currentEnemy.name} | Health: ${currentEnemy.health}`);
    writeToGameBox(
      `Choose your attack:\n` +
      `1. Unlayer the Ogre\n` +
      `2. Do the roar\n` +
      `3. Be a swampy boy`
    );
    npcCombatStep = 1;
    return;
  }

  if (Shrek.health <= 0) {
    gameOver("You have been defeated in combat!");
    return;
  }
  if (Shrek.energy <= 0) {
    gameOver("You ran out of energy... so very tired.");
    return;
  }
  
  // CASE 1: process the player's selection
  if (npcCombatStep === 1) {
    const choice = parseInt(input);
    if (![1, 2, 3].includes(choice)) {
      writeToGameBox("Invalid move. Choose 1, 2, or 3.");
      return; // stay in step 1, waiting for a valid move
    }

    // NPC picks its move
    const npcMove = Math.floor(Math.random() * 3) + 1;

    // Rock–Paper–Scissors logic
    if (choice === npcMove) {
      writeToGameBox(`\nDraw! ${currentEnemy.name}'s ${currentEnemy.pow} deflects your move.`, true);
      Shrek.energy -= 10;
    } else if (
      (choice === 1 && npcMove === 3) ||
      (choice === 2 && npcMove === 1) ||
      (choice === 3 && npcMove === 2)
    ) {
      const damage = 30 + (30 * Shrek.luck);
      currentEnemy.health -= damage;
      Shrek.energy -= 10;
      Shrek.luck += 0.025;
      writeToGameBox(`\nHit! You land a blow on ${currentEnemy.name} for ${damage.toFixed(1)} damage.`, true);
    } else {
      writeToGameBox(`\n${currentEnemy.name} strikes with ${currentEnemy.pow}! You take 20 damage.`, true);
      Shrek.health -= 20;
      Shrek.energy -= 10;
    }

    // CHECK FOR END-OF-COMBAT
    if (currentEnemy.health <= 0) {
      const reward = 10 + (10 * Shrek.luck);
      Shrek.wallet += reward;
      npcWins++;
      writeToGameBox(
        `\nVictory! You defeated ${currentEnemy.name} and gained $${reward.toFixed(2)}.\n` +
        `Total NPC wins: ${npcWins}`,
        true
      );
      Stats();
      // cleanly exit combat:
      step = 5;
      npcCombatStep = 0;
      currentEnemy = null;
      return;
    }
    if (Shrek.health <= 0) {
      writeToGameBox("\nYou have been defeated! Try again later.", true);
      Stats();
      step = 5;
      npcCombatStep = 0;
      currentEnemy = null;
      return;
    }
    // Smooth pacing — not recursive
    npcCombatStep = 0;
    writeToGameBox("\nPreparing for the next round...");
    setTimeout(() => {
      writeToGameBox("\nYour move again...");
      Stats();
      writeRed(`\nEnemy: ${currentEnemy.name} | Health: ${currentEnemy.health}`);
      writeToGameBox(
        `Choose your attack:\n` +
        `1. Unlayer the Ogre\n` +
        `2. Do the roar\n` +
        `3. Be a swampy boy`
      );
      npcCombatStep = 1;
    }, 500);
  }
}

function writeRed(text) {
    const gameBox = document.getElementById("game-box");
    // wrap in a div so it’s on its own line
    gameBox.innerHTML += `<div style="color:rgb(217, 84, 110)">${text}</div>`;
}
  
/*

function Merchant() {
    // Product list, similar to C# method
    let pro1 = new Products("Apple Pie", 4.69, 0, 50, 0);
    let pro2 = new Products("Battery Acid", 4.20, 0, -25, 100);
    let pro3 = new Products("Coffee", 4.50, 0, 0, 50);
    let pro4 = new Products("Hearty helping of steak", 10.0, 0, 100, 100);
    let pro5 = new Products("Questionable leftovers?", 4.44, 0, 100, -25);

    let products = [pro1, pro2, pro3, pro4, pro5];

    let exit = 2; // exit variable to end merchant visit
    let totalFin = 0; // Total cost tracker

    do {
        Stats(); // Display stats

        console.log(`==============================================================================================\nWelcome! You must be hungry and tired.\nI am the Merchant and I sell some tasty treats! Buy and use here at the shop before you head back out on your travels. I assure you, no negative side effects :)\nPlease place your order by selecting the product and subsequently providing the quantity desired.\n\nHere is the menu:`);

        products.forEach((product, i) => {
            console.log(`| ${i} | Product:  ${product.name}   | Price:  ${product.price}   | Your Quant:  ${product.quant}   | Health Benefits:  ${product.health}   | Energy Benefits:  ${product.energy}   |`);
        });

        console.log("==============================================================================================\nWhat would you like to order?");
        let order = parseInt(prompt("Enter your choice: "), 10);

        if (order >= 0 && order < products.length) { // If product selection is valid
            console.clear();
            let selectedProduct = products[order];

            console.log("==============================================================================================\nHow many would you like to order?");
            let quantity = parseFloat(prompt("Enter quantity: "));

            console.log(`==============================================================================================\nYou want ${quantity} of ${selectedProduct.name}`);
            let total = quantity * selectedProduct.price;
            selectedProduct.quant += quantity;
            totalFin += total;

            console.log(`==============================================================================================\nThe current total for your order is $${totalFin}`);

            console.log("If you are finished ordering, please input 1; otherwise, if you would\nlike to add to your order, please input 2.");
            exit = parseInt(prompt("Choose option (1 to finish, 2 to continue): "), 10);
        } else {
            console.clear();
            console.log("==============================================================================================\nHey bud, you failed to select an option please try again if ya got the munchies.");
        }

    } while (exit === 2);

    while (exit === 1) {
        console.clear();
        console.log("==============================================================================================\nHere is a summary of your final order:");
        products.forEach(product => {
            console.log(`| Product:  ${product.name}   | Quant:  ${product.quant} |`);
        });

        console.log(`==============================================================================================\nThe total cost for your order is $${totalFin}`);
        console.log(`\nYour current wallet has $${Shrek.wallet}`);

        if (Shrek.wallet < totalFin) {
            console.clear();
            console.log("==============================================================================================\nSorry, you are too broke for this purchase, leave my store...");
            return;
        } else {
            console.clear();
            console.log("==============================================================================================\nSubtracting money from user account and applying items effects to Shrek's stats!");
            Shrek.wallet -= totalFin;

            products.forEach(product => {
                Shrek.health += product.health * product.quant;
                Shrek.energy += product.energy * product.quant;
            });
            break;
        }
    }

    if (exit !== 2 && exit !== 1) {
        console.clear();
        console.log("==============================================================================================\nError!");
        return;
    }
}///End of Merchant

let questionQuant = 0; // Global quantity for the question variable
let totalFin = 0; // Global variable that adds up the total price
let quest = false; // Trigger for "another question"
let luck = 0; // Creates a luck pool variable
let CarriedResponses = []; // Creates an empty array to store past conversations
let response = ""; // This will store the generated response

let good = ["a pretty chill guy.", "Throw caution to the wind, you got this!", "you're too good for Mr. Cage.", "unlayer your onion Shrek."];
let neutral = ["a bagel", "explore and find random encounters.", "why not?", "drink some caffeine."];
let bad = ["you're a sad pathetic lil bug.", "quit the game, you don't look like you can find Nick.", "...you just ain't it Shrek.", "get out of MY swamp Shrek, you hypocrite."];
let text = ["Nicholas Cage thinks your", "Today is a day to", "Question yourself because", "This is an ideal time to"];

function Oracle() {
    // Creates array for response pool below
    const text = ["Nicholas Cage thinks your", "Today is a day to", "Question yourself because", "This is an ideal time to"];

    // End of responses based on good, neutral, and bad
    const good = ["a pretty chill guy.", "Throw caution to the wind, you got this!", "your too good for Mr. Cage.", "unlayer your onion Shrek."];
    const neutral = ["a bagel", "explore and find random encounters.", "why not?", "drink some caffeine."];
    const bad = ["your a sad pathetic lil bug.", "quit the game, you don't look like you can find Nick.", "...you just aint it Shrek.", "get out of MY swamp Shrek, you hypocrite."];

    let questionQuant = 0;  // Global quantity if question variable
    let totalFin = 0.00;  // Works as a global variable that adds up your total price
    let quest = false;  // my bool for triggering "another question"
    let response;  // this will be given through my method
    let luck = 0.00;  // creates a luck pool variable

    // Clears the console (if using Node.js, you might need a package like 'console.clear()')
    console.clear();
    console.log("==============================================================================================\nPlease be aware, I do charge $3.50 a question, and if you ask be ready to pay or I will be upset.");

    do {
        Stats();  // displays stats

        while (quest === false) {  // OG question
            console.log(`==============================================================================================\n1) Ask a question\n2) Review questions/responses\n3) Quit services and pay`);
            break;
        }

        while (quest === true) {  // Another question
            console.log(`==============================================================================================\n1) Ask another question\n2) Review questions/responses\n3) Quit services and pay`);
            break;
        }

        let selection1 = parseInt(prompt());  // Read user input (use prompt in browser or readline in Node.js)

        if (selection1 === 1) {
            console.clear();
            questionQuant += 1;  // adds 1 to global quant
            totalFin += 3.50;  // adds cost of question to global total

            console.log("==============================================================================================\nWhat is your question, child?");  // asks question
            let question = prompt();  // Uses input and stores it as question

            // Adds question to a list (since no list class in JS, use array)
            CarriedResponses.push(`Question: ${question}`);

            myResponse();  // response is generated
            console.log(response);

            // Adds response to the list
            CarriedResponses.push(`Response: ${response}`);

            console.log();
            quest = true;  // triggers loop
        } else if (selection1 === 2) {
            console.clear();
            console.log("==============================================================================================\nThe oracle knows all. Here are your fortunes to review:\n");
            storedResponses();  // fortune history is displayed
        } else if (selection1 === 3) {
            console.clear();
            console.log("==============================================================================================\nThank you for visiting the mighty and incredibly awesome machine, myth, and legend, The Oracle. I hope you enjoyed your visit you silly human.\n");
            console.log(`You asked ${questionQuant} questions. You currently owe $${totalFin}. I accept all major credit cards from all major banks.\nI also accept praise and affirmation, does not count as payment though.\nClick 1 to pay and collect your fortune. 2 to quit and leave without any buffs.`);
            let payOracle = parseInt(prompt());

            if (payOracle === 1 && Shrek.Wallet >= totalFin) {
                console.clear();
                Shrek.Wallet -= totalFin;  // subtracts expense
                console.log("==============================================================================================\nYou have paid me well, let your rightful fortune be placed upon you!");
                Shrek.Luck += luck;  // adds good fortune
            } else if (payOracle === 2 || Shrek.Wallet < totalFin) {
                console.clear();
                console.log("==============================================================================================\nYou have attempted to leave without paying or have insufficient funds, you have angered the oracle!\nBad Faith has been placed on you and your journey...");
                let curse = questionQuant * 0.05;  // curse is added based on the amount of questions asked
                Shrek.Luck -= curse;  // curse is placed on user's luck
            } else {
                console.clear();
                console.log("==============================================================================================\nYou have failed to either input a correct value or have insufficient funds, you have angered the oracle!\nBad Faith has been placed on you and your journey...");
                let curse = questionQuant * 0.05;  // curse is added based on the amount of questions asked
                Shrek.Luck -= curse;  // curse is placed on user's luck
            }
            break;  // exit loop
        } else {
            console.clear();
            console.log("==============================================================================================\nERROR, ERROR, ERROR, Beep Boop Beep Boop. You have failed to provide correct input, if you are trying to quit, you suck. If you have a total, please input 3 to quit, if not you're free to leave.");
        }

    } while (questionQuant > 0);  // if they have asked a question, the program will loop through until they quit

    // Method for generating a response
    function myResponse() {
        const switchRan = Math.floor(Math.random() * 3);  // creates random variable for switch path
        const RanRan = Math.floor(Math.random() * 4);  // creates random variable for text

        let goodbadneutral = "";  // creates empty string variable to store eventual random

        switch (switchRan) {
            case 0:
                goodbadneutral = good[RanRan];  // picks an end task from good list
                luck += 0.10;  // stores good luck
                break;
            case 1:
                goodbadneutral = bad[RanRan];  // picks an end task from bad list
                luck -= 0.05;  // stores bad luck
                break;
            case 2:
                goodbadneutral = neutral[RanRan];  // picks an end task from neutral list
                break;
        }

        response = `${text[RanRan]} ${goodbadneutral}`; 
        return response;  // returns full message for response
    }

    // Method for storing and displaying past responses
    function storedResponses() {
        CarriedResponses.forEach(item => {
            console.log(`\n${item}`);
        });
    }
}
*/












