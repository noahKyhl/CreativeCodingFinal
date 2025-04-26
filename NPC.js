// Define the NPC class
class NPC {
  constructor(name, health, pow) {
      this.name = name;
      this.health = health;
      this.pow = pow;
  }

  attack() {
      // NPC randomly attacks with one of their powers (for example)
      return Math.floor(Math.random() * 3) + 1;
  }

  takeDamage(damage) {
      this.health -= damage;
      if (this.health <= 0) {
          this.health = 0;
          // Handle NPC death (could be a reward, etc.)
      }
  }
}
  