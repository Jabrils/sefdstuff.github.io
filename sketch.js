// Create the LSTM Generator passing it the model directory
const lstm = new ml5.LSTMGenerator('model', modelReady);

let textInput;
let lengthSlider;
let tempSlider;
let button;

function modelReady() {
  //select('#status').html('Model Loaded');
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

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var size = random(1,10);

  for (var i = 0; i < size; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

// Generate new text
function generate() {
  // Update the status log
  //select('#status').html('Generating...');
  ToggleButton(false,"Generating...");

  // Grab the original text
  let original = textInput.value();
  // Make it to lower case
  let txt = original.toLowerCase();

  let rTxt = "";
  // Check if there's something to send
  if (txt.length > 0) {
    rTxt = txt;
  }
  else
  {
    rTxt = makeid();
  }
    // This is what the LSTM generator needs
    // Seed text, temperature, length to outputs
    // TODO: What are the defaults?
    let data = {
      seed: rTxt+",",
      temperature: random(),//tempSlider.value(),
      length: random()*100//lengthSlider.value()
    };

    
    // Generate text with the lstm
    lstm.generate(data, gotData);
    
    // When it's done
    function gotData(result) {
      // Update the status log
      //select('#status').html('Ready!');
  ToggleButton(true,"Generate!");
      
      let ret = result.generated.split(',');

      if(ret[0] == "")
      {
        print("WHOOPS");
      }
      
      let finalName = CleanName(ret[0]);
      select('#result').html(finalName);
      //print(data,finalName);
    }

}

function CleanName(s)
{
  let fC = FindCaps(s);

  for (let j=0; j<fC.length; j++)
  {    
    s = CapitalizeLetter(s,fC[j]);
  }

  s = AddSpace(s);

  return s;
}

function CapitalizeLetter(s,loc)
{  
  ret = "";

  for (let i=0; i<loc; i++)
  {
  ret+= s[i];
  }

  return ret+s.charAt(loc).toUpperCase() + s.slice(loc+1)
 }

function FindCaps(s)
{
  arr = [0];
  for (let i=0; i<s.length; i++)
  {
    if(s[i]=='_')
    {
      arr.push(i+1);
    }
  }

  return arr;
}

function AddSpace(s)
{
  return s.replace(/_/g,' ');
}