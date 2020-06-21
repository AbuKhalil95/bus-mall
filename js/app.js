// "use strict;"

var productArray = ["bag","banana","bathroom","boots","breakfast","bubblegum","chair",
"cthulhu","dog-duck","dragon","pen","pet-sweep","scissors","shark","sweep","tauntaun",
"unicorn","usb","water-can","wine-glass"];

var imgArea = document.getElementById("imageArea");
var productObjects = [];
var nImages = 6;
var nRandomImages = [];
var votingRound = 1;
var endRound = 25;

// -------------------- Constructor and Generation -------------------- //
function Product(name, id) {
  var newStr = name.replace(/-/, " "); // replaces hyphen in name with empty space
  this.name= newStr;
  this.id = id;
  this.clicked = 0;
  this.shown = 0;
  if (name == "usb"){
    this.url= "<img src='../img/" +name + ".gif' id=" + id + " />"
  }
  else if (name == "sweep"){
    this.url= "<img src='../img/" +name + ".png' id=" + id + " />"
  } 
  else {
    this.url= "<img src='../img/" +name + ".jpg' id=" + id + " />"
  }
}

function generateObjects(){             // generate variable object from array
  for (var i = 0; i < productArray.length; i++){
    var product = new Product(productArray[i],i);
    productObjects.push(product);
  }
  console.log(productObjects);
  generateNImages();
}

function generateNImages() {    // generate random n images
  nRandomImages = [];
  var unique = new Boolean();

  while (unique) {
    nRandomImages = [];
    var randomized = 0;
    for (var i = 0; i < nImages; i++) {
      randomized = Math.floor(Math.random() * 20);

      unique = nRandomImages.includes(randomized); // check for replicating images of all input
      if (unique) {break;}

      nRandomImages.push(randomized);    
    }
  }
    generateHTML();
}

function generateHTML(){              // invoke html, listener and add shown
  for (var i = 0; i < nImages; i++){
    productObjects[nRandomImages[i]].randImg(nRandomImages[i]);
    productObjects[nRandomImages[i]].shown += 1;
  }
}

Product.prototype.randImg =  function(el){    // add listener and append to area
  var square = document.createElement("div");
  square.className = "image";
  square.innerHTML += this.url;
  imgArea.appendChild(square);
  
  document.getElementById(el).addEventListener("click", function(){
      // alert(this.id);
      productObjects[el].clicked += 1;    // reset and generate after click
      imgArea.innerHTML = '';
      generateNImages();

      votingRound++;
      if (votingRound >= endRound) {
        var old_element = document.getElementById("imageArea"); // remove all listeners hack by node replication
        var new_element = old_element.cloneNode(true);
        old_element.parentNode.replaceChild(new_element, old_element);

        productObjects.sort(compareShown);    // compare and print at the end
        productObjects.sort(compareClicked);
        resultsRender();
        // for (var i = 0; i < nRandomImages.length; i++) {
          // var removeListener = document.getElementById(productObjects[nRandomImages[i]].id) 
          // removeListener.removeEventListener('click', arguments.callee,);
          // console.log(i);
          // console.log(removeListener);
        // }
      }
  })
}

// -------------------- Comparison and Result Generation -------------------- //

function compareClicked(a, b) {
  const clickA = a.clicked
  const ClickB = b.clicked

  let comparison = 0;
  if (clickA > ClickB) {
    comparison = -1;
  } else if (clickA < ClickB) {
    comparison = 1;
  }
  return comparison;
}

function compareShown(a, b) {
  const shownA = a.shown
  const shownB = b.shown

  let comparison = 0;
  if (shownA > shownB) {
    comparison = -1;
  } else if (shownA < shownB) {
    comparison = 1;
  }
  return comparison;
}

function resultsRender(){
  var html = "<table>";
  html+="<tr>";
  for (var i = 0; i < productObjects.length; i++) {
      html+="<tr>";
      html+="<td>"+productObjects[i].name+"</td>";
      html+="<td>"+productObjects[i].clicked+"</td>";
      html+="<td>"+productObjects[i].shown+"</td>";
      html+="</tr>";
  }
  html+="</tr>";
  html+="</table>";
  document.getElementById("resultArea").innerHTML = html;
}

generateObjects();
