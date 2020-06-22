// "use strict;"

var productArray = ["bag","banana","bathroom","boots","breakfast","bubblegum","chair",
"cthulhu","dog-duck","dragon","pen","pet-sweep","scissors","shark","sweep","tauntaun",
"unicorn","usb","water-can","wine-glass"];

var imgArea = document.getElementById("imageArea"); // image variables
var productObjects = [];
var SortedObj = [];
var nImages = 3;
var nRandomImages = [];
var nPreviousImages = [];
var votingRound = 1;
var endRound = 25;

var productLabels = [];   // canvas variables
var productClicked = [];
var productShown = [];
var productColors = [];
var chartToggle = 1;



// -------------------- Constructor and Generation -------------------- //

function Product(name, id) {
  var newStr = name.replace(/-/, " "); // replaces hyphen in name with empty space
  this.name= newStr;
  this.id = id;
  this.clicked = 0;
  this.shown = 0;
  if (name == "usb"){
    this.url= "<img src='img/" +name + ".gif' id=" + id + " />"
  }
  else if (name == "sweep"){
    this.url= "<img src='img/" +name + ".png' id=" + id + " />"
  } 
  else {
    this.url= "<img src='img/" +name + ".jpg' id=" + id + " />"
  }
}

function generateObjects(){             // generate variable object from array
  for (var i = 0; i < productArray.length; i++){
    var product = new Product(productArray[i],i);
    productObjects.push(product);
  }
  generateNImages();
  console.log(productLabels);
}

function generateNImages() {    // generate random n images
  nPreviousImages = [];
  nPreviousImages = nPreviousImages.concat(nRandomImages); // saves previous array
  nRandomImages = [];
  var nUnique = new Boolean();

  do 
   {
    nRandomImages = [];
    var randomized = 0;
    for (var i = 0; i <= nImages; i++) {      // push bug into last index
      randomized = Math.floor(Math.random() * 20);

      console.log("now " + randomized)
      console.log("current " + nRandomImages)
      console.log("previous " + nPreviousImages[i])
      console.log("does it include previous " + nRandomImages.includes(nPreviousImages[i]))
      console.log("does it include itself " + nRandomImages.includes(randomized))
      console.log("step "+i)
      
      nUnique = (nRandomImages.includes(randomized) || uniquePrevious()) // check for replicating images of all input and previous
      if (nUnique) {break;console.log("break")}

      nRandomImages.push(randomized);
      console.log(nPreviousImages)
      console.log("nUnique previous func" + uniquePrevious())


    };
  } while (nUnique);
    nRandomImages.pop();        // popped last index
    console.log(nRandomImages)
    generateHTML();
}

function generateHTML(){              // invoke html, listener and add shown
  for (var i = 0; i < nImages; i++){
    productObjects[nRandomImages[i]].randImg(nRandomImages[i]);
    productObjects[nRandomImages[i]].shown += 1;
  }
}

function uniquePrevious(){                // checks for each iteration of nRandomImages if it already existed before.
  isNotUnique = false;
  for(i = 0; i < nPreviousImages.length; i++){
    if (nRandomImages.includes(nPreviousImages[i])){
      isNotUnique = true;
      break;
    }
  } return isNotUnique;
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
        renderResults();
      }
  })
}

// -------------------- Comparison and Result Generation -------------------- //

function renderResults(){
  var old_element = document.getElementById("imageArea"); // remove all listeners hack by node replication
  var new_element = old_element.cloneNode(true);
  old_element.parentNode.replaceChild(new_element, old_element);

  SortedObj = SortedObj.concat(productObjects);
  SortedObj.sort(compareShown);    // compare and print at the end
  SortedObj.sort(compareClicked);
  renderTable();
  addLabelData();
  renderBarChart();
  document.getElementById('toggleBtn').style.display = 'block'
}

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

function renderTable(){
  var html = "<table><thead>";
  html+="<tr><td></td><td>clicks</td><td>shown</td></thead><tbody>";
  for (var i = 0; i < SortedObj.length; i++) {
      html+="<tr>";
      html+="<td>"+SortedObj[i].name+"</td>";
      html+="<td>"+SortedObj[i].clicked+"</td>";
      html+="<td>"+SortedObj[i].shown+"</td>";
      html+="</tr>";
  }
  html+="</tr></tbody>";
  html+="</table>";
  document.getElementById("resultArea").innerHTML = html;
}

// -------------------- Charts Data -------------------- //


function renderBarChart(){
  var chartDiv = document.getElementById('myChart').getContext('2d'); // canvas drawing
  chartDiv.innerHTML = '';
  var chart = new Chart(chartDiv, {
    type: 'bar',
    data: {
      labels : productLabels,
      datasets : [
      {
        label: '# of votes',
        backgroundColor: '#7d5353',
        data : productClicked
      },
      {
        type: 'line',
        label: "# of shown images",
        fill: false,
        data: productShown,
      },
    ]}
  })
}

function renderPieChart(){
  console.log(productShown);
  console.log(productClicked + " clicked");

  var chartDiv = document.getElementById('myChart').getContext('2d'); // canvas drawing
  chartDiv.innerHTML = '';
  var chart = new Chart(chartDiv, {
    type: 'doughnut',
      data: {
      labels : productLabels,
      datasets : [
      {
        data: productShown,
        backgroundColor: productColors
        // options: options
      }
    ]}
  })
}

function addLabelData(){
  for (i = 0; i < SortedObj.length; i++){
    productLabels.push(SortedObj[i].name); // pushes label name
    productClicked.push(SortedObj[i].clicked); // pushes clicks
    productShown.push(SortedObj[i].shown); // pushes shown
    productColors.push(dynamicColors()); // pushes random colors
  }
}

function dynamicColors(){
    var x= Math.pow(Math.random(), 1/20); // light color factor 0.5

    var r = Math.floor(Math.random() * 255*x);
    var g = Math.floor(Math.random() * 255*x);
    var b = Math.floor(Math.random() * 255*x);
    return "rgb(" + r + "," + g + "," + b + ")";
}

generateObjects();

document.getElementById("toggleBtn").addEventListener("click", toggleCharts);

function toggleCharts() {
  console.log(chartToggle)
  if (chartToggle == 1) {
    renderPieChart();
    chartToggle = 2;
  } 
  else if (chartToggle == 2) {
    renderBarChart();
    chartToggle = 1;
  }
}
