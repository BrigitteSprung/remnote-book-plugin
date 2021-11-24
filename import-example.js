  staxgo.onclick = function () {
  if (staxenterUrl.value != "") {
    var counter = 0;
    var parentid = "";

    var url = document.getElementById("staxenterUrl").value;
    // prompt("URL of openstax key terms");
    load.style.display = "block";
    add.style.display = "none";
    fetch("https://cors.bridged.cc/" + url, {
      origin: "https://openstax.org"
    }).then(function (r) {
      r.text().then(function (t) {
        try{
        hidden.innerHTML = t;
  
        RemNoteAPI.v0.get_context().then(function (context) {
          parentid = context.documentId;
  if (hidden.getElementsByClassName(
                "os-eoc os-glossary-container"
              ).length==0){
    throw "Must be wrong URL"
  }
          (async function () {
            for (item of [
              ...hidden.getElementsByClassName(
                "os-eoc os-glossary-container"
              )[0].children
            ]) {
              var temp = (item.children[0].innerText + (double.checked?"::":":") + item.children[1].innerText)
              await RemNoteAPI.v0.create(
                upperCaseThis(temp),
                parentid
              );
            }
            load.innerHTML = "Done!<br><br><a href='javascript:location.reload();'>Add more?</a>";

          })();


        });
        
      }catch{
         document.body.innerHTML = "Please make sure this is a valid OpenStax URL. (It must be the key terms for the chapter!)<br><br><a href='javascript:location.reload();'>Try again?</a>"; 
      }
      });
    }).catch(function(){
                         document.body.innerHTML = "Please make sure this is a valid OpenStax URL. (It must be the key terms for the chapter!)<br><br><a href='javascript:location.reload();'>Try again?</a>"; 

    });
  }
};

function upperCaseThis(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}
staxenterUrl.oninput = function () {
  if (staxenterUrl.value.indexOf("key-terms") != -1) {
    staxgo.style.display = "block";
  } else {
    staxgo.style.display = "none";
  }
};
quizletgo.onclick = function () {
  if (quizletenterUrl.value != "") {
    var counter = 0;
    var parentid = "";

    var url = quizletenterUrl.value;
    load.style.display = "block";
    add.style.display = "none";
    fetch("https://cors.bridged.cc/" + url, {
      origin: "https://quizlet.com"
    }).then(function (r) {
      r.text().then(function (t) {
        try{
        hidden.innerHTML = t;
 if (document.getElementsByClassName("SetPageTerms-term").length==0){
    throw "Must be wrong URL"
  }
        RemNoteAPI.v0.get_context().then(function (context) {
          parentid = context.documentId;

          (async function () {
              for (item of [...document.getElementsByClassName("SetPageTerms-term")]) {
                await RemNoteAPI.v0.create(
                  upperCaseThis(item.children[0].children[0].children[0].children[0].children[0].innerText) + (double.checked?"::":":") + item.children[0].children[0].children[0].children[0].children[1].innerText,
                  parentid
                );

              }
            load.innerHTML = "Done!<br><br><a href='javascript:location.reload();'>Add more?</a>";

          })();

        });
      }catch{
         document.body.innerHTML = "Please make sure this is a valid Quizlet URL. (It must be a public set!)<br><br><a href='javascript:location.reload();'>Try again?</a>";
      }
      });
    }).catch(function(){
                     document.body.innerHTML = "Please make sure this is a valid Quizlet URL. (It must be a public set!)<br><br><a href='javascript:location.reload();'>Try again?</a>";

    });
  }
};
quizletenterUrl.oninput = function () {
  if (quizletenterUrl.value.indexOf("quizlet") != -1) {
    quizletgo.style.display = "block";
  } else {
    quizletgo.style.display = "none";
  }
};

kahootgo.onclick = function () {
  if (kahootenterUrl.value != "") {
    var counter = 0;
    var parentid = "";

    var url = kahootenterUrl.value;
    load.style.display = "block";
    add.style.display = "none";
    fetch("https://cors.bridged.cc/" + "https://create.kahoot.it/rest/kahoots/" + url.split("/")[4] + "/card/?includeKahoot=true", {
    }).then(function (r) {
      r.text().then(function (t) {
try{

        var temp = JSON.parse(t)
        temp = temp.kahoot.questions;
  if (temp.length==0){
    throw "Must be wrong URL"
  }
        var rem = [];
        temp.forEach(function (a) {
          if (a.type == "quiz") {
            rem.push(a.question + (double.checked?"::":":") + a.choices.filter(function (x) {
              return x.correct
            })[0].answer)
          }
        })
        RemNoteAPI.v0.get_context().then(function (context) {
          parentid = context.documentId;

          (async function () {
            for (item of rem) {
              await RemNoteAPI.v0.create(
                upperCaseThis(item),
                parentid
              );
            }
            load.innerHTML = "Done!<br><br><a href='javascript:location.reload();'>Add more?</a>";

          })();

        });
        }catch{
         document.body.innerHTML = "Please make sure this is a valid Kahoot URL. (The set must be public!)<br><br><a href='javascript:location.reload();'>Try again?</a>";
      }
      });
    }).catch(function(){
               document.body.innerHTML = "Please make sure this is a valid Kahoot URL. (The set must be public!)<br><br><a href='javascript:location.reload();'>Try again?</a>";

    });
  }
};
kahootenterUrl.oninput = function () {
  if (kahootenterUrl.value.indexOf("details") != -1) {
    kahootgo.style.display = "block";
  } else {
    kahootgo.style.display = "none";
  }
};


chooseOpenstax.onclick = function () {
  chooseZone.style.display = "none";
  openstaxadd.style.display = "block";
};
chooseQuizlet.onclick = function () {
  chooseZone.style.display = "none";
  quizletadd.style.display = "block";
};
chooseKahoot.onclick = function () {
  chooseZone.style.display = "none";
  kahootadd.style.display = "block";
};

