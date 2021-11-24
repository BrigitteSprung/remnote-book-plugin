var page = 0;
var urlList = [];
var cs = [c1,c2,c3,c4];
cs.forEach(function(x,i){
  x.style.left=i*20+(i*5)+2+"%";
})
var ccount = 0;
searchScript.onload = function() {
  window.__gcse.searchCallbacks = {
    web: {
      rendered: "myWebResultsRenderedCallback"
    },
    image: {
      rendered: "myWebResultsRenderedCallback"
    }
  };
};

function getImages(term) {
  page = 0;
  urlList = [];
  google.search.cse.element.getAllElements()["standard0"].execute(term);
}

function myWebResultsRenderedCallback(x) {
  if(document.getElementsByClassName("gs-imageResult gs-result gs-no-results-result").length>0){
    loadingText.style.display = "none";
  loadingGif.style.display = "none";
    noResults.style.display = "block";
  }
  if (page < 4) {
    urlList = [];
    [
      ...document.getElementsByClassName(
        "gsc-imageResult gsc-imageResult-popup gsc-result"
      )
    ].forEach(function(j) {
      displayImages(j.children[0].children[0].children[0].children[0].children[0].src)
        // urlList.push(
        //   j.children[0].children[0].children[0].children[0].children[0].src
        // );
    });
// displayImages(urlList);
    page++;
    document.getElementsByClassName("gsc-cursor")[0].children[page].click();
  } else {
    // displayImages(urlList);
    // top.postMessage({list:urlList,msg:"imageList"}, "*");
  }
}

function displayImages(j) {
  loadingText.style.display = "none";
  loadingGif.style.display = "none";
  // x.forEach(function(j) {
    var temp = new Image();
    temp.onload = function() {
      this.style.height = "auto";
      this.style.background = "unset";
    };
    temp.src = j;
    temp.classList.add("imageResult");
    temp.onmouseover = function() {
      temp.style.boxShadow = "gray 0px 0px 9px";
    };
    temp.onmouseout = function() {
      temp.style.boxShadow = "unset";
    };
  // temp.onerror = function(){
  //   this.remove();
  // }
    temp.onclick = function() {
      addToDoc(this.src);
    };
    cs[ccount%cs.length].appendChild(temp);
    ccount++;
  // });
}
async function addToDoc(url) {
  var id = await RemNoteAPI.v0.get_context();
  id = id.remId;
  var parentText = await RemNoteAPI.v0.get(id);
  if (parentText.content) {
    await RemNoteAPI.v0.update(id, {
      content: parentText.contentAsMarkdown + `![](${url})`
    });
  } else {
    await RemNoteAPI.v0.update(id, { name: parentText.nameAsMarkdown + `![](${url})` });
  }
  await RemNoteAPI.v0.close_popup();
}
document.onkeydown = function(e) {
  if (e.which == 13) {
    document.getElementById("searchButton").click();
  }
};
document.getElementById("searchButton").onclick = function() {
  document.getElementById("loadingGif").play();
          noResults.style.display = "none";

  getImages(searchInput.value);
  cs.forEach(function(j){
    j.innerHTML = ""
  })
  loadingText.style.display = "block";
  loadingGif.style.display = "block";
};

loadingText.style.display = "none";
loadingGif.style.display = "none";
document.getElementById("searchInput").focus();
window.onload = load;
async function load(){
  try{
  var selected = await RemNoteAPI.v0.get_context();
  if (selected.selectedTextAtActivation){
    document.getElementById("searchInput").value = selected.selectedTextAtActivation
      document.getElementById("searchButton").click();

  }
  }
  catch{
    console.error("This is not a RemNote plugin!");
  }
}