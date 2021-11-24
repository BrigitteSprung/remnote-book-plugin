/*
---------------------
Pull information from the RemNote API.

See (alpha) documentation here: https://www.remnote.io/api
---------------------
*/

async function getAllRemInDocument() {
  // Get the "context" representing the document in which this plugin is embedded
  const context = await RemNoteAPI.v0.get_context();

  // Find all Rem that are visible on this document.
  const documentRem = await RemNoteAPI.v0.get(context.documentId);
  const visibleRem = await Promise.all(
    documentRem.visibleRemOnDocument.map(remId => RemNoteAPI.v0.get(remId))
  );
  return visibleRem;
}

/*
Take a Rem, and extract its text. The rem.name and rem.content fields are both of type "RichTextInterface",
which is an array of text strings, or js objects representing rich text element. Text is extracted recursively from
Rem Reference elements.
*/
async function getRemText(rem, exploredRem = []) {
  if (!rem.found) return "";

  const richTextElementsText = await Promise.all(
    // Go through each element in the rich text
    rem.name.concat(rem.content || []).map(async richTextElement => {
      // If the element is a string, juts return it
      if (typeof richTextElement == "string") {
        return richTextElement;
        // If the element is a Rem Reference (i == "q"), then recursively get that Rem Reference's text.
      } else if (
        richTextElement.i == "q" &&
        !exploredRem.includes(richTextElement._id)
      ) {
        return await getRemText(
          await RemNoteAPI.v0.get(richTextElement._id),
          // Track explored Rem to avoid infinite loops
          exploredRem.concat([richTextElement._id])
        );
      } else {
        // If the Rem is some other rich text element, just take its .text property.
        return richTextElement.text;
      }
    })
  );
  return richTextElementsText.join("");
}

/*
---------------------
Build the Wordcloud
---------------------
*/

function initalizeCanvas() {
  document.getElementById("my_canvas").height = window.innerHeight - 20;
  document.getElementById("my_canvas").width = window.innerWidth - 20;
}

async function computeWordHistogramFromRem(visibleRem) {
  const MIN_FONT_SIZE = 20;

  const allWords = [];
  for (const x of visibleRem) {
    const words = (await getRemText(x))
      .replace(/"[object Object]"/g, "")
      .split(" ");
    const filteredWords = words.filter(
      word => word != "" && !commonWordsSet.has(word)
    );
    allWords.push(...filteredWords);
  }

  if (allWords.length == 0) {
    allWords.push(
      "There are no words on this Document (common words are stripped)!"
    );
  }

  const histogram = {};
  for (const word of allWords) {
    if (histogram[word] === undefined) {
      histogram[word] = MIN_FONT_SIZE;
    }
    histogram[word] += 5;
  }
  return histogram;
}

function renderWordCloud(histogram) {
  const list = Object.entries(histogram);

  WordCloud(document.getElementById("my_canvas"), {
    list: list,
    minRotation: -0.3,
    maxRotation: 0.3,
    shrinkToFit: true
  });
}

async function makeWordCloud() {
  const rems = await getAllRemInDocument();
  const histogram = await computeWordHistogramFromRem(rems);
  initalizeCanvas();
  renderWordCloud(histogram);
}

makeWordCloud();
document.onmouseover = function() {
  document.getElementById("download").href = document
    .getElementById("my_canvas")
    .toDataURL();
  document.getElementById("download").style.display = "block";
};
document.onmouseleave = function() {
  document.getElementById("download").href = document
    .getElementById("my_canvas")
    .toDataURL();
  document.getElementById("download").style.display = "none";
};
