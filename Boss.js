// Define the Boss class
class Boss {
    constructor() {
      this.name = "Shrek's Insecurities";
      this.health = 800;
      this.pow = "Forcing Self-Reflection";
    }
  
    // Method to generate a random attack value (between 1 and 3)
    attack() {
      return Math.floor(Math.random() * 3) + 1; // Generates a random number between 1 and 3
    }
  
    // Method to subtract health from the boss
    takeDamage(damage) {
      this.health -= Math.floor(damage); // Converts decimal damage to integer and subtracts from health
    }
  }
  