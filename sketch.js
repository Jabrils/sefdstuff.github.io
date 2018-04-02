/* ===
ML5 Example
03_LSTM_Simple
Simple LSTM Generator example with p5.js
This uses a pre-trained model on a corpus of Hemingway
=== */

// Create the LSTM Generator passing it the model directory
const lstm = new ml5.LSTMGenerator('model', modelReady);

let textInput;
let lengthSlider;
let tempSlider;
let button;

function makeid() {
  var text = "";
  var possible = "_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var size = random(1,10);

  for (var i = 0; i < size; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function modelReady() {
  ToggleButton(true,"Generate!");
}

function setup() {
  noCanvas();

  // Grab the DOM elements
  textInput = select('#textInput');
  button = select('#generate');
  ToggleButton(false,"Can't Load!");

  // DOM element events
  button.mousePressed(generate);
}

// Generate new text
function generate() {
  // Update the status log
  ToggleButton(false,"Generating...");

  // Grab the original text
  let original = textInput.value();
  // Make it to lower case
  let txt = original.toLowerCase()+',';
  
  // var that we will use to send to our network
  let rTxt = "";
  
  // Check if there's something to send
  if (txt.length > 1) {
    rTxt = txt;
  }
  else
  {
    rTxt = makeid()+',';
  }

  // Check if there's something to send
    // This is what the LSTM generator needs
    // Seed text, temperature, length to outputs
    // TODO: What are the defaults?
    let data = {
      seed: rTxt,
      temperature: random(.7,.9),
      length: 50
    };

    // Generate text with the lstm
    lstm.generate(data, gotData);

    // When it's done
    function gotData(result) {
      // Update the status log
      ToggleButton(true,"Generate!");
      let fullList = ReturnTop3(result.generated);
      select('#result').html(ListThisArray(fullList));
      //select('#debug').html(rTxt + result.generated);
    }
  }

  // 
  function ReturnTop3(s)
{
  let fC = FindCaps(s);

  for (let j=0; j<fC.length; j++)
  {    
    s = CapitalizeLetter(s,fC[j]);
  }

  s = AddSpace(s);

  s=s.split(',');

  return s.splice(0,s.length-1);
}

function ListThisArray(h)
{
let ret = "";
for (let i=0; i<h.length; i++)
{
  ret+= h[i]+"<br />";
}
return ret;
}

// 
function ToggleButton(s,text)
{
  if(s)
  {
    button.removeAttribute('disabled');  
  }
  else
  {
    button.attribute('disabled',false);
  }
  button.html(text);
}

// 
function CapitalizeLetter(s,loc)
{  
  ret = "";

  for (let i=0; i<loc; i++)
  {
  ret+= s[i];
  }

  return ret+s.charAt(loc).toUpperCase() + s.slice(loc+1)
 }

 // 
function FindCaps(s)
{
  arr = [0];
  for (let i=0; i<s.length; i++)
  {
    if(s[i]=='_' || s[i]==',')
    {
      arr.push(i+1);
    }
  }

  return arr;
}

// 
function AddSpace(s)
{
  return s.replace(/_/g,' ');
}