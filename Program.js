let step = 0; //main variable to determine current event in program
let Shrek; //user
let npcWins = 0; //determine progress for fighting boss
let npcCombatStep = 0; //determine turn based combat events
let currentEnemy; //whacky character
let bossStep = 0; //determine boss event
let evilBoss; //the boss
let bossChoice = 0; //boss attack
let merchantStep = 0; //determine merchant event
let merchantStepProductIndex = 0; //for the shop
let questionQuant    = 0; //oracle question quantity
let totalFin         = 0; //purchase amount charged
let CarriedResponses = []; //stores oracle responses

let products = [
  { name: "Apple Pie", price: 4.69, quant: 0, health: 50, energy: 0 },
  { name: "Battery Acid", price: 4.20, quant: 0, health: -25, energy: 100 },
  { name: "Coffee", price: 4.50, quant: 0, health: 0, energy: 50 },
  { name: "Hearty Steak", price: 10.0, quant: 0, health: 100, energy: 100 },
  { name: "Leftovers?", price: 4.44, quant: 0, health: 100, energy: -25 }
]; //the market

const actualName = "Shrek"; //user name

function writeToGameBox(text, clear = false) {
    const gameBox = document.getElementById("game-box");
    if (!gameBox) return console.error("game-box div not found!");

    //every "\n" turns into "<br>" 
    const html = text.replace(/\n/g, "<br>");

    if (clear) {
        gameBox.innerHTML = html;
    } else {
        gameBox.innerHTML += (gameBox.innerHTML ? "<br>" : "") + html;
    }
}  //helps with GameBox display

function showImage(imagePath) {
  const imageBox = document.getElementById("image-box");
  const image = document.getElementById("event-image");

  image.src = imagePath;  //set the path of image
  imageBox.style.display = "block";  //image visiblity
}

  
//shows intro text once on page load
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

//this is the main function that the game runs through
function nextStep() {
  const inputBox = document.getElementById("input-box");
  const input = inputBox.value.trim();
  inputBox.value = "";
    if (step === 100) { //these if's determine what events are being played
      handleCombatInput(input);
      return;
    }
    if (step === 200) {
      bossInputHandler(input);
      return;
    }
    if (step === 300) {
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
    if (step === 299) {  
      if (input.toLowerCase() === "yes") {
        merchantStep = 0; 
        step = 300; 
        showMerchantMenu();
      } else {
        writeToGameBox("You leave the Merchant alone.", true);
        step = 5;  
      }
      return;
    }    
    if (step === 399) { 
      if (input.toLowerCase() === "yes") {
        questionQuant    = 0;
        totalFin         = 0;
        CarriedResponses = [];
        step = 400; 
        showOracleMenu();
      } else {
        writeToGameBox("You leave the Oracle untouched.", true);
        step = 5; 
      }
      return;
    }

  switch (step) {
    case 0:
      writeToGameBox("\n\nBut first things first… what’s your name, traveler?", true);
      step++;
      break;
    case 1:
        const chosenName = input;
        writeToGameBox(`\n\nOops, typo detected! Don't worry, looks like autocorrect changed "${chosenName}" to "Shrek".`, true);
        writeToGameBox(`\n(Autocorrecting... ah, name found. It's Shrek now.)`); //this is a joke so that they cant actually name their character
        Shrek = new User("Shrek", 250, 10, 0, 250); 
        Shrek.actualName = chosenName; //store original for winning players
        writeToGameBox(`\n\nWelcome, ${actualName}! Is this name correct? Input yes or no.`);
        step++;
        break;
    case 2:
        writeToGameBox(`\n\nAlright Shrek, glad we're on the same page. Press Enter to continue!`, true);
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
        Shrek = new User("Shrek", 250, 10, 0, 250); //create a new user
        Stats(); 
        step++;
      } else if (choice === 2) {
        writeToGameBox("\n\nYou chose option 2.\nLoading game...");
        Shrek = loadGame(); //load saved game data
        if (!Shrek) {
          writeToGameBox("No save file found. Starting a new game...");
          Shrek = new User("Shrek", 250, 10, 0, 250);
        } else {
          writeToGameBox("Save file loaded. Resuming game...");
        }
        Stats();
        step++;
      } else {
        writeToGameBox("\n\nPlease enter a valid option (1 or 2).");
      }
      break;
    case 5:
        Stats();
        showImage("images/happy shrek.png");
        //MAIN MENU:
        writeToGameBox(
            `\n\n==============================================================================================\n` +
            `You are making progress on your mystical quest to find Nick Cage\n\n` +
            `There appears 3 paths of uncertainty, which direction will you head?\n` +
            `==============================================================================================\n\n` +
            `1. Frolic into the direction of the wind\n` +
            `2. Follow some odd footprints\n` +
            `3. Close your eyes and say Nicholas Cage 5 times!\n` +
            `4. Gaze into the stars\n` +
            `5. Abandon Quest\n\n`, true
        );
        step = 6;
        break;    
    case 6:
        const direction = parseInt(input);
        if (direction < 1 || direction > 5) {
            writeToGameBox("\n\nInvalid input!");
            break;
        }
        //RNG based encounters
        let Encounter = Math.floor(Math.random() * 101);

        switch (direction) {
            case 1:
            writeToGameBox("\n\nYou head into the wind...");
            if (Encounter < 25) {
                writeToGameBox("You suddenly smell capitalism.... ");
                setupMerchant();//[Merchant encounter coming soon]
                return;       
            } else if (Encounter < 50) {
                writeToGameBox("You feel like you're being watched.... ");
                setupOracle();//[Oracle encounter coming soon]
                return;       
            } else {
                writeToGameBox("You see a familiar face in the distance.... ", true);
                handleNPCEncounter();  //[NPC encounter coming soon]
                return;              
            }
            break;
            case 2:
            writeToGameBox("\n\nYou follow the footprints...");
            if (Encounter < 33) {
                writeToGameBox("You smell capitalism again... [Merchant]");
                setupMerchant();//[Merchant encounter coming soon]
                return;       
            } else if (Encounter < 66) {
                writeToGameBox("You feel watched... [Oracle]");
                setupOracle();//[Oracle encounter coming soon]
                return;       
            } else {
                writeToGameBox("You meet someone familiar... [NPC]", true);
                handleNPCEncounter();  //[NPC encounter coming soon]
                return;              
            }
            break;
            case 3:
            writeToGameBox("\n\nA roar echoes nearby... [Boss encounter coming soon]", true);
            if (npcWins >= 10) {
                writeToGameBox("A mighty roar shakes the earth...\nThe boss approaches!!");
                step = 200;      
                bossStep = 0;  
                BossB(); //Start the boss battle
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
        
        //only loop back if no combat was triggered
        step = 5;
        break;
      }
    }
function loadGame() {
    const savedData = localStorage.getItem("userData");
    if (savedData) {
      const parsedData = JSON.parse(savedData); //deserialize back to a plain object
      npcWins = parsedData.npcWins || 0;
      return new User(parsedData.name, parsedData.health, parsedData.wallet, parsedData.luck, parsedData.energy);
    }
    return null; // no saved data found
  }
  
  function SaveGame(user) {
    //player object is saved 
    const userData = {
        name: user.name,
        health: user.health,
        wallet: user.wallet,
        luck: user.luck,
        energy: user.energy,
        npcWins: npcWins
    };
    localStorage.setItem("userData", JSON.stringify(userData));  //Serialize the object
    console.log("Game saved!");
}

function Stats() {
   //ensures key survival variables stay within a reasonable range
   if (Shrek.energy < 0) Shrek.energy = 0;
   if (Shrek.energy > 1000) Shrek.energy = 1000;
   if (Shrek.health < 0) Shrek.health = 0;
   if (Shrek.health > 1000) Shrek.health = 1000;

   //stats should be displayed in stats-box
   const statsBox = document.getElementById("stats-box");

   //set the content inside the stats box
   statsBox.innerHTML = `
   <div style="text-align: center;">
       <h2>User Stats</h2>
       <p><strong>Name:</strong> ${Shrek.name}</p>
       <p><strong>Health:</strong> ${Shrek.health}</p>
       <p><strong>Money:</strong> $${Shrek.wallet}</p>
       <p><strong>Luck:</strong> ${Shrek.luck}</p>
       <p><strong>Energy:</strong> ${Shrek.energy}</p>
       <p><strong>NPC Wins:</strong> ${npcWins}</p>
   </div>
   `;
 }

function gameOver(reason = "Your journey ends here.") {
  writeToGameBox(`\n\n================ GAME OVER ================\n${reason}\n===========================================`, true);
  showImage("images/game over.png");
  step = -1; //set step to an invalid value to prevent further input
  document.getElementById("input-box").disabled = true;
}


//image of Nick Cage displaying
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
  evilBoss = new Boss(); //initialize the boss
  bossStep = 0;
  step = 200; //boss combat mode
  writeRed(`\n\nYou have spotted the Boss... oh ho, ha ha...`);
  writeToGameBox(`\n${evilBoss.name} blocks your path to Nick Cage.\nPrepare for battle!`);
  showImage("images/shreks boss.png");
  setTimeout(showBossMenu, 300); //slight delay for smoothness
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
    //show the menu and advance to waiting for the player's selection
    if (bossStep === 0) {
      Stats();

      //red stats line:
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

    //process the player's selection
    if (bossStep === 1) {
      const choice = parseInt(input);
      if (![1, 2, 3].includes(choice)) {
        writeToGameBox("Invalid move. Choose 1, 2, or 3.");
        return; // stay in step 1, waiting for a valid move
      }
  
      //boss picks its move
      const bossMove = Math.floor(Math.random() * 3) + 1;
  
      //Rock–Paper–Scissors logic to land attacks
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
  
      //win
      if (evilBoss.health <= 0) {
        const reward = 10 + (10 * Shrek.luck);
        Shrek.wallet += reward;
        npcWins++;
          writeToGameBox(`
            ==============================================================================================
            You have defeated ${evilBoss.name}! 🏆
            You approach the mystery man... "Nick Cage?" you ask.\n
            Suddenly, Mufasa's voice booms from the heavens: 
            "There is no Nick Cage, Shrek. There never was."\n
            Nick Cage was the friends we made along the way 💫.\n\n
            CONGRATS ${Shrek.actualName}!!! You beat the game. HA, I did know your name all along Shrek. 
            ==============================================================================================
            `);
            showImage("images/lion.jpg");
        Stats();
      //cleanly exit combat
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
  
      //reset to show menu again 
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
    }, 500); 
    }
}

//npc whacky character creator:
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
const pow = attacks[index]; //name of their attacks

return new NPC(name, health, pow); 
}

//sets up npc combat
function handleNPCEncounter() {
  const npc = createRandomWackyCharacter();
  currentEnemy = npc;
  npcCombatStep = 0;
  step = 100;
  writeRed(`\n\nYou encounter ${npc.name}! Prepare for combat.`);
  writeToGameBox(`\n\n[Combat starts with ${npc.name}]\n\n`);
  showImage("images/fight.png");
  handleCombatInput("");
}

//for attack logic
function handleCombatInput(input) {
  //show the menu and advance to waiting for the player's selection
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
  
  //process the player's selection
  if (npcCombatStep === 1) {
    const choice = parseInt(input);

    if (![1, 2, 3].includes(choice)) {
      writeToGameBox("Invalid move. Choose 1, 2, or 3.");
      return; //stay in step 1, waiting for a valid move
    }

    //NPC picks its move
    const npcMove = Math.floor(Math.random() * 3) + 1;

    //Rock–Paper–Scissors logic
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

    //if win
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
      //clean exit 
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

//cart resetter
function resetCart() {
  products.forEach(p => p.quant = 0);
}

//merchant interaction
function setupMerchant() {
  writeToGameBox("Welcome to the Merchant's shop! \nDo you want to approach? (yes/no)\n", true);
  showImage("images/merchant.png");
  step = 299;
}

//display the shop's menu with product options
function showMerchantMenu() {
  Stats();
  let menu = "Choose an item to purchase:\n";
  
  //display each product, their effects, and the quantity player has in their cart
  products.forEach((p, i) => {
    menu += `${i + 1}. ${p.name} - $${p.price} | ❤️ ${p.health} | ⚡ ${p.energy} (You own: ${p.quant})\n`;
  });
  
  //finish shopping?
  menu += `${products.length + 1}. Finish and Checkout`;
  writeToGameBox(menu);
  merchantStep = 1;
}

function handleMerchantInput(input) {
  //string conversion to integer
  const choice = parseInt(input.trim(), 10);  

  // player has chosen an item to purchase
  if (merchantStep === 1) {
    if (!isNaN(choice) && choice >= 1 && choice <= products.length) {
      //ask for the quantity 
      merchantStep = 2;
      merchantStepProductIndex = choice - 1; //save the selected product index 
      writeToGameBox(`How many ${products[merchantStepProductIndex].name} would you like to buy?`, true);
    } else if (choice === products.length + 1) {
      //checkout
      checkout();
    } else {
      writeToGameBox("Invalid choice. Please select a valid option.", true);
      showMerchantMenu(); //Re-display the menu
    }
  } 
  //after selected the quantity for the item
  else if (merchantStep === 2) {
    const quantity = parseInt(input.trim(), 10);
    if (isNaN(quantity) || quantity <= 0) {
      writeToGameBox("Invalid quantity. Please enter a valid number.");
      merchantStep = 1; //go back to product menu
      showMerchantMenu();
      return;
    }

    //update the quantity 
    products[merchantStepProductIndex].quant += quantity;
    writeToGameBox(`Added ${quantity} x ${products[merchantStepProductIndex].name} to your cart.`, true);
    merchantStep = 1; //go back to the item selection menu
    showMerchantMenu();
  }
}

//checkout
function checkout() {
  let total = products.reduce((acc, p) => acc + p.price * p.quant, 0);
  writeToGameBox(`Your total is $${total.toFixed(2)}. You have $${Shrek.wallet}. Confirm purchase? (yes/no)`, true);
  merchantStep = 3; 
}

//confirmation or cancellation of the purchase
function confirmPurchase(input) {
  let total = products.reduce((acc, p) => acc + p.price * p.quant, 0);

  if (input.toLowerCase() === "yes") {
    if (Shrek.wallet >= total) {
      //Deduct the cost from poor shrek's wallet
      Shrek.wallet -= total;

      //apply effects of each purchased item:
      products.forEach(p => {
        if (p.quant > 0) {
          Shrek.health += p.health * p.quant;
          Shrek.energy += p.energy * p.quant;

          writeToGameBox(
            `Purchased ${p.quant}× ${p.name} for $${(p.price * p.quant).toFixed(2)}. ` +
            `Effects: ${p.health * p.quant >= 0 ? "+" : ""}${p.health * p.quant} HP, ` +
            `${p.energy * p.quant >= 0 ? "+" : ""}${p.energy * p.quant} Energy.`
          );
        }
      });
      resetCart();
      //refresh the stats display
      Stats();

      writeToGameBox(`You have $${Shrek.wallet.toFixed(2)} left.`);
      merchantStep = 0;
      step = 5;
    } else {
      writeToGameBox("You don't have enough money! The Merchant kicks you out.", true);
      resetCart();
      merchantStep = 0;
      step = 5;
    }
  } 
  else if (input.toLowerCase() === "no") {
    writeToGameBox("You decided not to buy anything. The Merchant waves goodbye.", true);
    resetCart();
    merchantStep = 0;
    step = 5;
  } 
  else {
    writeToGameBox("Invalid input. Please type 'yes' or 'no'.", true);
  }
}

function setupOracle() { //ORACLE ENCOUNTER!!!!!
  writeToGameBox("\n🌀 A smoky voice whispers:\n\n”The Oracle stands ready… $3.50 a question.”\nDo you want to approach? (yes/no)\n", true);
  showImage("images/oracle.png");
  step = 399;
}

function showOracleMenu() {
  Stats();
  writeToGameBox(`
📜  Oracle Menu  📜

1) ❓  Ask a question  ($3.50 each)
2) 🔍  Review past fortunes
3) 💰  Pay and depart

`);
  merchantStep = 0;  //re-use merchantStep inside Oracle
}

function handleOracleInput(input) {
  const choice = parseInt(input, 10);

  //main menu
  if (merchantStep === 0) {
    if (choice === 1) {
      merchantStep = 1;
      totalFin += 3.50;
      questionQuant++;
      writeToGameBox("What is your question?", true);
    }
    else if (choice === 2) {
      writeToGameBox("Your past questions & answers:", true);
      CarriedResponses.forEach(r => {
        if (typeof r === "string") {
          writeToGameBox(r); //cool display
        } else if (typeof r === "object" && r !== null) {
          writeToGameBox(`🗨️ Q: ${r.question}`);
          writeToGameBox(`✨ A: ${r.answer}`);
        }
      });
      showOracleMenu();
    }
    else if (choice === 3) {
      merchantStep = 2;
      writeToGameBox(`You owe $${totalFin.toFixed(2)}. Pay now? (yes/no)`, true);
    }
    else {
      writeToGameBox("Invalid—choose 1, 2, or 3.", true);
      showOracleMenu();
    }
    return;
  }

  if (merchantStep === 1) {
    const question = input;
    CarriedResponses.push("Q: " + question);

    //generate the Oracle’s answer

//Define one array of correlating “prefix + suffix” pairs:
const oracleResponses = [
  { prefix: "Nicholas Cage thinks you’re", suffix: "a pretty chill soul.", isGood: true },
  { prefix: "Nicholas Cage thinks you’re", suffix: "too good for Mr. Cage.", isGood: true },
  { prefix: "Nicholas Cage thinks you’re", suffix: "destined for glory.", isGood: true },

  { prefix: "Beware, for", suffix: "you’re a sad, pathetic bug.", isGood: false },
  { prefix: "I regret to inform you that", suffix: "your luck has run dry.", isGood: false },
  { prefix: "The fates whisper that", suffix: "the swamp itself rejects you.", isGood: false },

  { prefix: "Curiously,", suffix: "you might enjoy a bagel.", isGood: true },
  { prefix: "For what it’s worth,", suffix: "you could use a strong coffee.", isGood: true },
  { prefix: "Some say that", suffix: "mysterious encounters await.", isGood: true },
];

//pick one at random
const choiceObj = oracleResponses[
  Math.floor(Math.random() * oracleResponses.length)
];
const answer = `${choiceObj.prefix} ${choiceObj.suffix}`;

CarriedResponses.push({ question: question, answer: answer, isGood: choiceObj.isGood }); 
writeToGameBox(`

  ✨  ${answer}
  
  `);

merchantStep = 0;
showOracleMenu();

}

  //confirmation of payment
  if (merchantStep === 2) {
    if (input.toLowerCase() === "yes") {
      if (Shrek.wallet >= totalFin) {
        Shrek.wallet -= totalFin;
        //apply only good fortunes
        const goodFortunes = CarriedResponses.filter(r => r.isGood).length;
        writeToGameBox(`Paid $${totalFin.toFixed(2)}. Luck +${goodFortunes * 0.2}.`, true);
        Shrek.luck += goodFortunes * 0.2;
      } else {
        writeToGameBox("Not enough money—Oracle is displeased. Luck -0.05 per question.", true);
        Shrek.luck -= questionQuant * 0.05;
      }
    } else {
      writeToGameBox("You leave without paying. Luck -0.05 per question.", true);
      Shrek.luck -= questionQuant * 0.05;
    }    
    Stats();
    step = 5;  //back to main menu
    return;
  }
}

function writeRed(text) {
  const gameBox = document.getElementById("game-box");
  //wrap in a div so it’s on its own line
  gameBox.innerHTML += `<div style="color:rgb(217, 84, 110)">${text}</div>`;
}

document.addEventListener("keydown", function(event) {
const key = event.key;
console.log("Key pressed:", key);

//for steps 4–6 (main menu) and combat (100/200), still allow single-key shortcuts
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

//only submit on Enter
if (step === 300 || step === 299) {
  if (key === "Enter") {
    event.preventDefault();
    nextStep();
  }
}

//only submit on Enter
if (step === 400 ||  step === 399) {
  if (key === "Enter") {
    event.preventDefault();
    nextStep();
  }
  return;
}
});










