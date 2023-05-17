/**
 * Falling DNA animation.
 *
 * This falling DNA animation is a JavaScript implementation of the flash
 * animation found on the Shendure Lab website at:
 * 
 *      https://krishna.gs.washington.edu/index.html
 * 
 * @author Conor Camplisson.
 */

// configure animation
var MIN_FONT_SIZE = 1;          // minimum font size in pixels
var MAX_FONT_SIZE = 70;         // maximum font size in pixels
var MIN_SEQ_LEN=25;             // minimum sequence length
var MAX_SEQ_LEN=150;            // maximum sequence length
var NUM_SEQS = 100;              // number of sequences that exist concurrently
var FRAC_UPPERCASE = 0.5;       // fraction of sequences that are uppercase (0.0 - 1.0)
var MIN_SPEED = 1;              // minimum speed in pixels per step
var MAX_SPEED = 20;             // maximum speed in pixels per step
var FONT_COLOR = '#00ff00';     // font color
var BG_COLOR = '#000000';       // background color

// get the canvas element from the html page
var canvas = document.getElementById('canvas'); 

canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

var context = canvas.getContext('2d');

// store constants
var CAS9 = "\
ATGGATAAGAAGTATAGCATCGGCCTGGATATTGGAACTAACTCCGTGGGTTGGGCAGTGATTACAGACG\
ACTACAAGGTCCCTAGCAAGAAATTTAAGGTGCTGGGTAACACCGACAGGCACAGCATCAAGAAAAATCT\
GATTGGAGCCCTGCTGTTCGGTTCTGGAGAGACTGCCGAAGCAACACGCCTGAAAAGAACAGCAAGAAGG\
CGCTATACCAGAAGGAAGAATAGAATCTGTTACCTGCAGGAGATTTTCTCTAACGAAATGGCTAAGGTGG\
ACGATTCATTCTTTCATAGGCTGGAGGAAAGTTTCCTGGTCGAGGAAGATAAGAAACACGAGCGCCATCC\
TATCTTTGGAAACATTGTGGACGAGGTCGCCTATCACGAAAAATACCCAACCATCTATCATCTGCGCAAG\
AAACTGGCTGACTCTACTGATAAAGCCGACCTGAGACTGATCTATCTGGCTCTGGCCCACATGATTAAGT\
TCAGGGGTCATTTTCTGATCGAGGGCGATCTGAACCCCGACAATTCCGATGTGGACAAGCTGTTCATCCA\
GCTGGTCCAGATTTACAATCAGCTGTTTGAGGAAAACCCTATTAATGCTTCCAGAGTGGACGCAAAAGCT\
ATCCTGTCAGCCAGGCTGTCCAAGTCACGCAGACTGGAGAACCTGATTGCACAGCTGCCCGGAGAAAAGA\
GGAACGGTCTGTTTGGAAATCTGATCGCTCTGAGTCTGGGCCTGACTCCTAACTTCAAAAGCAATTTTGA\
TCTGGCTGAGGACGCCAAACTGCAGCTGTCAAAGGACACATATGACGATGACCTGGATAACCTGCTGGCA\
CAGATCGGAGATCAGTACGCTGACCTGTTCCTGGCTGCCAAAAATCTGTCCGACGCAATCCTGCTGTCAG\
ATATTCTGAGAGTGAACAGCGAGATTACAAAAGCACCTCTGAGTGCCAGCATGATCAAGAGATATGACGA\
GCACCATCAGGATCTGACCC";
var WIDTH = canvas.width;
var HEIGHT = canvas.height;
var SEQ_PADDING = CAS9.length - MAX_SEQ_LEN;
var FONT_SIZE_RANGE = MAX_FONT_SIZE - MIN_FONT_SIZE;
var SPEED_RANGE = MAX_SPEED - MIN_SPEED;

// store sequences
var SEQUENCES = [];

/**
 * Definition of a Sequence.
 */
function Sequence() {

    // initialize this sequence
    this.init();

}


/**
 * Initialize a random sequence and its properties.
 */
Sequence.prototype.init = function() {
    
    // get a random sequence sample from Cas9
    this.length = random_int(MIN_SEQ_LEN, MAX_SEQ_LEN);
    this.seq = cas9_nmer(this.length);

    // decide whether to make this sequence lowercase
    if (Math.random() >= FRAC_UPPERCASE) {
        this.seq = this.seq.toLowerCase();
    }

    // simulate distance by making font size and speed proportional
    this.z = random_float(1, 10);
    this.font_size = MIN_FONT_SIZE + Math.floor(FONT_SIZE_RANGE / this.z);
    this.speed = MIN_SPEED + SPEED_RANGE / this.z;

    // generate a random position
    this.x = random_float(0, WIDTH - this.font_size);
    this.y = random_float(-100, 0);

    // calculate total pixel height for this sequence
    this.height = this.font_size * this.length;

};


/**
 * Draws a Sequence on the canvas.
 */
Sequence.prototype.draw = function(context) {

    // set font parameters
    context.fillStyle = FONT_COLOR;
    context.font = this.font_size+"px courier";
    
    // draw each letter in this sequence
    for (var i = 0; i < this.seq.length; i++) {
        context.fillText(this.seq[i], this.x, this.y - i * this.font_size);
    }

    // increment y pixel value by speed    
    this.y += this.speed;
    
    // re-initialize sequences that have left the canvas
    if(this.y > this.height + HEIGHT) {
        this.init();
    }

};


/**
 * Updates the current state of the canvas.
 */
var update = function() {
    
    // clear the canvas
    context.fillStyle = BG_COLOR;
    context.fillRect(0, 0, WIDTH, HEIGHT);

    // draw each sequence
    for (var i = 0; i < NUM_SEQS; i++) {
        SEQUENCES[i].draw(context);
    }

    // request the next frame
    requestAnimationFrame(update);

};


/**
 * Generates a random decimal number between min and max.
 */
function random_float( min, max ) {

    // generate a random decimal number
    var rand_float = Math.random() * (max - min) + min;

    // success
    return rand_float;

}


/**
 * Generates a random integer number between min and max.
 */
function random_int(min, max) {

    // generate a random integer
    var rand_int = Math.floor(random_float(min, max));
    
    // success
    return rand_int;

}


/**
 * Returns a substring of length n from the Cas9 coding sequence sample.
 */
function cas9_nmer(n) {
    
    // get a random n_mer from cas9
    var start_idx = random_int(0, SEQ_PADDING);
    var seq = CAS9.substr(start_idx, n);

    // success    
    return seq;

}


// generate sequences
for (var i = 0; i < NUM_SEQS; i++) {
    SEQUENCES.push(new Sequence());
}

// begin the animation
update();
