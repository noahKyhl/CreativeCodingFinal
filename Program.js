let step = 0;
let Shrek;
let npcWins = 10;
let npcCombatStep = 0;
let currentEnemy;
let bossStep = 0;
let evilBoss;
let bossChoice = 0;
let merchantStep = 0;
let merchantStepProductIndex = 0;
let questionQuant    = 0;
let totalFin         = 0;
let CarriedResponses = [];

let products = [
  { name: "Apple Pie", price: 4.69, quant: 0, health: 50, energy: 0 },
  { name: "Battery Acid", price: 4.20, quant: 0, health: -25, energy: 100 },
  { name: "Coffee", price: 4.50, quant: 0, health: 0, energy: 50 },
  { name: "Hearty Steak", price: 10.0, quant: 0, health: 100, energy: 100 },
  { name: "Leftovers?", price: 4.44, quant: 0, health: 100, energy: -25 }
];

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

function showImage(imagePath) {
  const imageBox = document.getElementById("image-box");
  const image = document.getElementById("event-image");

  image.src = imagePath;  // Set the path of the image
  imageBox.style.display = "block";  // Make the image container visible
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

(hit "submit" to PLAY)`;

writeToGameBox(introText, true);
}

showImage("images/cage princess.png");

function nextStep() {
  const inputBox = document.getElementById("input-box");
  const input = inputBox.value.trim();
  inputBox.value = "";
    if (step === 100) {
      handleCombatInput(input);
      return;
    }
    if (step === 200) {
      bossInputHandler(input);
      return;
    }
    if (step === 300) {
      // If we're at the confirmation prompt (merchantStep 3), send to confirmPurchase
      if (merchantStep === 3) {
        confirmPurchase(input);
      } else {
        handleMerchantInput(input);
      }
      return; 
    }
    if (step === 400) {
      handleOracleInput(input);
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
        showImage("images/happy shrek.png");
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
                setupMerchant();
                return;       
            } else if (Encounter < 50) {
                writeToGameBox("You feel like you're being watched.... [Oracle encounter coming soon]");
                setupOracle();
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
                setupMerchant();
                return;       
            } else if (Encounter < 66) {
                writeToGameBox("You feel watched... [Oracle]");
                setupOracle();
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
            showImage("images/quit.png");
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
  showImage("images/game over.png");
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
  showImage("images/unnamed.png");
    SaveGame(Shrek);
  }

function BossB() {
  evilBoss = new Boss(); // initialize the boss
  bossStep = 0;
  step = 200; // boss combat mode
  writeRed(`\n\nYou have spotted the Boss... oh ho, ha ha...`);
  writeToGameBox(`\n${evilBoss.name} blocks your path to Nick Cage.\nPrepare for battle!`);
  showImage("images/shreks boss.png");
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
            showImage("images/happy shrek.png");
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
        showImage("images/game over.png");
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
  showImage("images/fight.png");
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
    showImage("images/game over.png");
    return;
  }
  if (Shrek.energy <= 0) {
    gameOver("You ran out of energy... so very tired.");
    showImage("images/game over.png");
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

// cart resetter
function resetCart() {
  products.forEach(p => p.quant = 0);
}

// Merchant interaction - starting the encounter
function setupMerchant() {
  writeToGameBox("Welcome to the Merchant's shop! ------- ", true);
  showImage("images/merchant.png");
  merchantStep = 0; // Reset merchant flow
  step = 300; // Enter merchant interaction
  showMerchantMenu();
}

// Display the shop's menu with product options
function showMerchantMenu() {
  Stats();
  let menu = "Choose an item to purchase:\n";
  
  // Display each product and the quantity player owns
  products.forEach((p, i) => {
    menu += `${i + 1}. ${p.name} - $${p.price} | ❤️ ${p.health} | ⚡ ${p.energy} (You own: ${p.quant})\n`;
  });
  
  // Option to finish shopping and proceed
  menu += `${products.length + 1}. Finish and Checkout`;
  writeToGameBox(menu);
  merchantStep = 1;
}

function handleMerchantInput(input) {
  // Trim input and handle string conversion to integer
  const choice = parseInt(input.trim(), 10);  // Convert input to integer and remove spaces

  console.log("Input received:", input, "Parsed choice:", choice);  // Debugging

  // Player has chosen an item to purchase
  if (merchantStep === 1) {
    console.log("Merchant Step 1: Item selection");  // Debugging
    if (!isNaN(choice) && choice >= 1 && choice <= products.length) {
      // Ask for the quantity to buy
      merchantStep = 2;
      merchantStepProductIndex = choice - 1; // Save the selected product index (zero-based)
      writeToGameBox(`How many ${products[merchantStepProductIndex].name} would you like to buy?`);
    } else if (choice === products.length + 1) {
      // Player wants to checkout
      checkout();
    } else {
      writeToGameBox("Invalid choice. Please select a valid option.");
      showMerchantMenu(); // Re-display the menu
    }
  } 
  // Player has selected the quantity for the item
  else if (merchantStep === 2) {
    const quantity = parseInt(input.trim(), 10);
    console.log("Merchant Step 2: Quantity selection, Quantity:", quantity);  // Debugging
    if (isNaN(quantity) || quantity <= 0) {
      writeToGameBox("Invalid quantity. Please enter a valid number.");
      merchantStep = 1; // Go back to product menu for another attempt
      showMerchantMenu();
      return;
    }

    // Update the quantity of the chosen product
    products[merchantStepProductIndex].quant += quantity;
    writeToGameBox(`Added ${quantity} x ${products[merchantStepProductIndex].name} to your cart.`);
    merchantStep = 1; // Go back to the item selection menu
    showMerchantMenu();
  }
}

// Proceed with the checkout
function checkout() {
  let total = products.reduce((acc, p) => acc + p.price * p.quant, 0);
  writeToGameBox(`Your total is $${total.toFixed(2)}. You have $${Shrek.wallet}. Confirm purchase? (yes/no)`);
  merchantStep = 3; // Await confirmation
}

// Handle confirmation or cancellation of the purchase
function confirmPurchase(input) {
  let total = products.reduce((acc, p) => acc + p.price * p.quant, 0);

  if (input.toLowerCase() === "yes") {
    if (Shrek.wallet >= total) {
      // Deduct the cost
      Shrek.wallet -= total;

      // Apply effects of each purchased item
      products.forEach(p => {
        if (p.quant > 0) {
          // Apply health & energy effects
          Shrek.health += p.health * p.quant;
          Shrek.energy += p.energy * p.quant;

          writeToGameBox(
            `Purchased ${p.quant}× ${p.name} for $${(p.price * p.quant).toFixed(2)}. ` +
            `Effects: ${p.health * p.quant >= 0 ? "+" : ""}${p.health * p.quant} HP, ` +
            `${p.energy * p.quant >= 0 ? "+" : ""}${p.energy * p.quant} Energy.`
          );
        }
      });

      // Now that effects are applied, reset the cart
      resetCart();

      // Refresh the stats display
      Stats();

      writeToGameBox(`You have $${Shrek.wallet.toFixed(2)} left.`);
      merchantStep = 0;
      step = 5;
    } else {
      writeToGameBox("You don't have enough money! The Merchant kicks you out.");
      resetCart();
      merchantStep = 0;
      step = 5;
    }
  } 
  else if (input.toLowerCase() === "no") {
    writeToGameBox("You decided not to buy anything. The Merchant waves goodbye.");
    resetCart();
    merchantStep = 0;
    step = 5;
  } 
  else {
    writeToGameBox("Invalid input. Please type 'yes' or 'no'.");
  }
}

function setupOracle() {
  writeToGameBox("\n🌀 A smoky voice whispers:\n\n”The Oracle stands ready… $3.50 a question.”\n", true);
  showImage("images/oracle.png");
  questionQuant    = 0;
  totalFin         = 0;
  CarriedResponses = [];
  step = 400;
  showOracleMenu();
}

function showOracleMenu() {
  Stats();
  writeToGameBox(`
📜  Oracle Menu  📜

1) ❓  Ask a question  ($3.50 each)
2) 🔍  Review past fortunes
3) 💰  Pay and depart

`);
  merchantStep = 0;  // re-use merchantStep as “sub-step” inside Oracle
}

function handleOracleInput(input) {
  const choice = parseInt(input, 10);

  // SUB-STEP 0: main menu
  if (merchantStep === 0) {
    if (choice === 1) {
      merchantStep = 1;
      totalFin += 3.50;
      questionQuant++;
      writeToGameBox("What is your question?");
    }
    else if (choice === 2) {
      writeToGameBox("Your past questions & answers:");
      CarriedResponses.forEach(r => writeToGameBox("  " + r));
      showOracleMenu();
    }
    else if (choice === 3) {
      merchantStep = 2;
      writeToGameBox(`You owe $${totalFin.toFixed(2)}. Pay now? (yes/no)`);
    }
    else {
      writeToGameBox("Invalid—choose 1, 2, or 3.");
      showOracleMenu();
    }
    return;
  }

  // SUB-STEP 1: we’ve asked “What is your question?”
  if (merchantStep === 1) {
    const question = input;
    CarriedResponses.push("Q: " + question);

    // generate the Oracle’s answer

// 1) Define one array of cohesive “prefix + suffix” pairs:
const oracleResponses = [
  { prefix: "Nicholas Cage thinks you’re",          suffix: "a pretty chill soul." },
  { prefix: "Nicholas Cage thinks you’re",          suffix: "too good for Mr. Cage." },
  { prefix: "Nicholas Cage thinks you’re",          suffix: "destined for glory." },

  { prefix: "Beware, for",                           suffix: "you’re a sad, pathetic bug." },
  { prefix: "I regret to inform you that",           suffix: "your luck has run dry." },
  { prefix: "The fates whisper that",                suffix: "the swamp itself rejects you." },

  { prefix: "Curiously,",                            suffix: "you might enjoy a bagel." },
  { prefix: "For what it’s worth,",                  suffix: "you could use a strong coffee." },
  { prefix: "Some say that",                         suffix: "mysterious encounters await." },
];

// 2) Pick one at random:
const choice = oracleResponses[
  Math.floor(Math.random() * oracleResponses.length)
];

// 3) Build your answer from that single pair:
const answer = `${choice.prefix} ${choice.suffix}`;

// 4) Record & display it
CarriedResponses.push("A: " + answer);
writeToGameBox(`

  ✨  ${answer}
  
  `);

merchantStep = 0;
showOracleMenu();

}

  // SUB-STEP 2: confirmation of payment
  if (merchantStep === 2) {
    if (input.toLowerCase()==="yes") {
      if (Shrek.wallet >= totalFin) {
        Shrek.wallet -= totalFin;
        writeToGameBox(`Paid $${totalFin.toFixed(2)}. Luck +${questionQuant*0.1}.`);
        Shrek.luck += questionQuant * 0.1;
      } else {
        writeToGameBox("Not enough money—Oracle is displeased. Luck -0.05 per question.");
        Shrek.luck -= questionQuant * 0.05;
      }
    } else {
      writeToGameBox("You leave without paying. Luck -0.05 per question.");
      Shrek.luck -= questionQuant * 0.05;
    }
    Stats();
    step = 5;  // back to main game
    return;
  }
}

function writeRed(text) {
  const gameBox = document.getElementById("game-box");
  // wrap in a div so it’s on its own line
  gameBox.innerHTML += `<div style="color:rgb(217, 84, 110)">${text}</div>`;
}

document.addEventListener("keydown", function(event) {
const key = event.key;
console.log("Key pressed:", key);

// For steps 4–6 (main menu) and combat (100/200), still allow single-key shortcuts:
if ([4, 5, 6].includes(step)) {
  if (["1","2","3","4","5"].includes(key)) {
    event.preventDefault();
    document.getElementById("input-box").value = key;
    nextStep();
    return;
  }
}
if (step === 100 || step === 200) {
  if (["1","2","3"].includes(key)) {
    event.preventDefault();
    document.getElementById("input-box").value = key;
    nextStep();
    return;
  }
}

// **Merchant (step 300)**: let the user type any number of digits,
// then only on Enter do we submit.
if (step === 300) {
  if (key === "Enter") {
    event.preventDefault();
    nextStep();
  }
}

// Oracle (step 400): only submit on Enter too
if (step === 400) {
  if (key === "Enter") {
    event.preventDefault();
    nextStep();
  }
  return;
}
});










