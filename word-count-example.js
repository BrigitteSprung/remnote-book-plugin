class RemNoteAPIV0 {
  constructor() {
    this.usedMessageIds = 0;
    window.addEventListener("message", this.receiveMessage.bind(this), false);
    this.messagePromises = {};
  }

  async get(remId, options = {}) {
    return await this.makeAPICall("get", {
      remId,
      ...options
    });
  }

  async get_by_name(name, options = {}) {
    return await this.makeAPICall("get_by_name", {
      name,
      ...options
    });
  }

  async get_by_source(url, options = {}) {
    return await this.makeAPICall("get_by_source", {
      url,
      ...options
    });
  }

  async update(remId, options = {}) {
    return await this.makeAPICall("update", {
      remId,
      ...options
    });
  }

  async create(text, parentId, options = {}) {
    return await this.makeAPICall("create", {
      text,
      parentId,
      ...options
    });
  }

  async get_context(options = {}) {
    return await this.makeAPICall("get_context", options);
  }

  async makeAPICall(methodName, options) {
    const messageId = this.usedMessageIds;
    this.usedMessageIds += 1;

    const message = {
      isIntendedForRemNoteAPI: true,
      methodName,
      options,
      messageId,
      remNoteAPIData: {
        version: 0
      }
    };

    const messagePromise = new Promise((resolve, reject) => {
      this.messagePromises[messageId] = resolve;
      window.parent.postMessage(message, "*");
    });

    const response = await messagePromise;
    if (response.error) {
      throw response.error;
    } else {
      return response;
    }
  }

  receiveMessage(event) {
    const data = event.data;
    const messageId = data.messageId;
    this.messagePromises[messageId](data.response);
    delete this.messagePromises[messageId];
  }
}

const RemNoteAPI = {
  v0: new RemNoteAPIV0()
};

var words = [];
var docId = "";
if (window.self == window.top) {
  document.getElementById("stats").innerHTML =
    "Please make a new RemNote plugin by typing /plugin, then pasting this URL: https://remnotewordcount.glitch.me/ ";
}
RemNoteAPI.v0.get_context().then(function(x) {
  docId = x.documentId;
  setInterval(function() {
    words = [];

    RemNoteAPI.v0.get(docId).then(function(x) {
      x.visibleRemOnDocument.forEach(function(a, i, array) {
        RemNoteAPI.v0.get(a).then(function(j) {
          if (typeof j.name[0] != "object") {
            // console.log(j)
            words.push(
              (
                (j.name ? j.name[0] : "") +
                (j.content ? " " + j.content[0] : "")
              ).replace(/undefined/g, "")
            );
          }

          if (i == array.length - 1) {
            document.getElementById("stats").innerHTML =
              "Characters: <b>" +
              words.join("").length +
              "</b>       Words: <b>" +
              words
                .join(" ")
                .split(" ")
                .filter(function(x) {
                  return x;
                }).length +
              "</b>";
          }
        });
      });
    });
  }, 500);
  window.onerror = function() {
    document.getElementById("stats").innerHTML =
      "Please make a new RemNote plugin by typing /plugin, then pasting this URL: https://remnotewordcount.glitch.me/ ";
  };
});
