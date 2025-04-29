class User {
    constructor(name, health, wallet, luck, energy) {
        this.name = name;
        this.health = health;
        this.wallet = wallet;
        this.luck = luck;
        this.energy = energy;
    }

    //to serialize object to JSON (for saving game)
    toJSON() {
        return JSON.stringify({
            name: this.name,
            health: this.health,
            wallet: this.wallet,
            luck: this.luck,
            energy: this.energy,
        });
    }
  
    //display the user's stats on the web page
    stats() {
      //puts stats where they should be displayed
      const statsBox = document.getElementById("stats-box");
  
      //sets up the stats box
      statsBox.innerHTML = `
      <div style="text-align: center;">
          <h2>User Stats</h2>
          <p><strong>Name:</strong> ${this.name}</p>
          <p><strong>Health:</strong> ${this.health}</p>
          <p><strong>Money:</strong> $${this.wallet}</p>
          <p><strong>Luck:</strong> ${this.luck}</p>
          <p><strong>Energy:</strong> ${this.energy}</p>
      </div>
      `;
    }
  }
  

  