var cards = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
var suits = ["diamonds", "hearts", "spades", "clubs"];
var faces = ["A", "J", "Q", "K"];
var deck = new Array();
var hand1 = new Array();
var hand2 = new Array();
var stack = new Array();

function getDeck()
{
	var deck = new Array();

	for(var i = 0; i < suits.length; i++)
	{
		for(var x = 0; x < cards.length; x++)
		{
			var card = {Value: cards[x], Suit: suits[i]};
			deck.push(card);
		}
	}

	return deck;
}

function shuffle()
{
	// for 1000 turns
	// switch the values of two random cards
	for (var i = 0; i < 1000; i++)
	{
		var location1 = Math.floor((Math.random() * deck.length));
		var location2 = Math.floor((Math.random() * deck.length));
		var tmp = deck[location1];

		deck[location1] = deck[location2];
		deck[location2] = tmp;
	}

    splitDeck();
}

function splitDeck() {
    //for >2 cases (will figure out later); need to add val parameter
    // var count = 0;
    // var deckSize = 52;
    // while(deckSize%val!=0) {
    //     deckSize--;
    //     count++;
    // }
    // if(deckSize < 52) {
    //     deck = deck.splice(0,count);
    // }
    // var handSize = deckSize/val;
    // var hand1 = deck.splice(0, handSize);

    hand1 = deck.slice(0,26);
    //socket.io: send hand2 values to player 2 (and hand1 values to player 1?)
    hand2 = deck.slice(26,52);


}

function turn(hand) {
    var tempHand = new Array();
    var altHand = new Array();
    //determines which hand is the active hand; not sure whether this particular implementation will work w/ io logic
    if (Boolean(hand.length === hand1.length && hand.every(function(value, index) { return value === hand1[index]})) ) {
        tempHand = hand1;
        altHand = hand2;
    } else {
        tempHand = hand2;
        altHand = hand1;
    }

    var card = hand.splice(0,1);
    stack.push(card);
    flip(card, tempHand);
}

function flip(turnCard, turnHand) {
    //card face is revealed on W or up arrow 
    document.body.onkeydown = function(e){
        if (e.code === '87' || e.code === '38') {
            document.getElementById('Turn Card').innerHTML = '';
            var card = document.createElement("div");
            var value = document.createElement("div");
            var suit = document.createElement("div");
            card.className = "card";
            value.className = "value";
            suit.className = "suit " + turnCard.Suit;

            value.innerHTML = turnCard.Value;
            card.appendChild(value);
            card.appendChild(suit);

            document.getElementById("Board").appendChild(card);

            document.body.onkeyup = function(e){
                if (e.code === 'Space') {
                    if (stack.length >= 2) {
                        if (stack[stack.length-1] == stack[stack.length-2]) {
                            //player correctly slapped on a double; takes stack
                            turnHand.push(stack);
                            stack = [];
                        } else if (stack.length >= 3){
                            if(stack[stack.length-1] == stack[stack.length-3]) {
                                //player correctly slapped on a sandwich; takes stack
                                turnHand.push(stack);
                                stack = [];
                            }
                        } else {
                            //player burns card for incorrect slap
                            stack.push(turnHand.pop());
                        }
                    } 

                }
            }
            var attempts = 0;
            if (faces.includes(turnCard.cards)) {
                if (turnCard.cards === "J") {
                    attempts = 1;
                } else if (turnCard.cards === "Q") {
                    attempts = 2;
                } else if (turnCard.cards === "K") {
                    attempts = 3;
                } else if (turnCard.cards === "A") {
                    attempts = 4;
                }
            }
            while (attempts > 0) {
                //socket.io: switch possession to player 2 
                turn(altHand);
                attempts--;
            }   
    }
    
}
  
function load()
{
	deck = getDeck();
	shuffle();

}

window.onload = load;
