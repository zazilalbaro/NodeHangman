var inquirer = require("inquirer");

var game = {
	babies: ["calf", "fawn", "foal", "hatchling", "joey", "kit", "kitten", "peachick", "piglet", "porcupette", "puggle", "squab", "tadpole", "pup"],
	wins: 0,
	losses: 0,
	baby: "",
	badGuesses: [],
	correctGuesses: [],
	corrGuessNum: 0,
	userLtr: "",
	gameOn: false,
	remGuesses: 0,

	newGame: function() {
		this.reset();
		this.promptUser();
	},

	reset: function() {
		this.gameOn = true;
		this.corrGuessNum = 0;
		this.baby = "";
		this.badGuesses = [];
		this.correctGuesses = [];
		this.generateWord();
		this.remGuesses = this.baby.length * 2;
	},

	generateWord: function() {
		this.baby = this.babies[Math.floor(Math.random() * this.babies.length)].toUpperCase();
		console.log(this.baby)
	},

	promptUser: function() {
		console.log("\nRemaining Guesses: " + this.remGuesses);		
		this.displayWord();
		inquirer.prompt([
			{
				type: "input",
				message: "Guess a letter!",
				name: "letter"
			}
		]).then(function(userEntry) {
			var userLtr= userEntry.letter.toUpperCase();
			game.userGuess(userLtr);
		});
	},

	displayWord: function() {
		var wordInProgress = "";
		this.corrGuessNum = 0;
		for (var i=0; i < this.baby.length; i++) {
			if (this.correctGuesses.indexOf(this.baby.charAt(i)) != -1) {
			// show letter, guessed
			wordInProgress = wordInProgress + this.baby.charAt(i) + " ";
			this.corrGuessNum++;
			} 
			else {
			// show dash, not guessed
			wordInProgress = wordInProgress + "_ ";
			}
		};
		console.log("\nWord:\n" + wordInProgress + "\n");
	},

	userGuess: function(letter) {
		if (this.gameOn) {
			// check if letter already guessed.
			if ((this.badGuesses.indexOf(letter) < 0) && (this.correctGuesses.indexOf(letter) < 0)) {
				// Determine if guess is correct.
				if (this.baby.indexOf(letter) != -1) {
					// Good Guess
					this.correctGuesses.push(letter);
					this.ltrGuessed();
				} 
				else {
					// Bad Guess
					this.badGuesses.push(letter);
					this.ltrNotGuessed();
				};
			}
		}
	},

	// function to process after good guess
	ltrGuessed: function() {
		this.displayWord();
		// For new guesses reduce remGuesses
		this.remGuesses--;
		// check if they won (all letters guessed)
		if (this.corrGuessNum == this.baby.length) {
			this.wins++;
			console.log("You Won!\nWins: " + this.wins);
			this.gameOn = false;
			this.playAgain();
		}
		// check if they lost (out of guesses)
		else if (this.remGuesses == 0) {
			this.losses++;
			console.log("You're out of guesses!\nLosses: " + this.losses);
			this.gameOn = false;
			this.playAgain();
		}
		// keep playing
		else {
			console.log("Good guess!")
			this.promptUser();
		}
	},

	// function to process after bad guess
	ltrNotGuessed: function() {
		// For new guesses reduce remGuesses
		this.remGuesses--;
		console.log(this.remGuesses)
		// check if they lost (out of guesses)
		if (this.remGuesses == 0) {
			this.losses++;
			console.log("\nYou're out of guesses!\nLosses: " + this.losses);
			this.gameOn = false;
			this.playAgain();
		}
		// keep playing
		else {
			console.log("\nNo matches :(")
			this.promptUser();
		}
	},

	playAgain: function() {
		inquirer.prompt([
			{
			type: "list",
			message: "Want to play again?",
			choices: ["yes","no"],
			name: "play"
			}
		]).then(function(userEntry) {
			var answer = userEntry.play;
			console.log(answer)
			if (answer == "yes") {
				game.newGame();
			}
			else {
				console.log("Ok, see you next time!");
			}			
		});
	}
}; // end of game object

// display word when game initiated
game.newGame();

// kicks out when out of guesses
// kicks out when guess same letter as before
