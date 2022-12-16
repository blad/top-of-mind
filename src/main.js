let store = [];

function render(config) {
  const container = document.querySelector(".list-container");
  // Clear Old Links
  Array.from(container.childNodes).forEach(child =>
    container.removeChild(child)
  );

  // Add New Links
  const total = config.length;
  config.forEach((element, index) => {
    // Build Styled Bookmark Title
    const linkText = document.createElement("span");
    linkText.innerText = element.title;
    linkText.style.transform = "scale(" + (1 - 0.5 * (index + 1) / total) + ")";

    // Build Styled Link URL
    const linkUrl = document.createElement("span");
    linkUrl.innerText = "" + element.url + "";
    linkUrl.style.transform = "scale(" + (1 - 0.5 * (index + 2) / total) + ")";
    linkUrl.style.opacity = 0.4;

    const linkTags = document.createElement("span");
    linkTags.innerText = " [" + element.tags.join("][") + "]";
    linkTags.style.transform = "scale(" + (1 - 0.5 * (index + 2) / total) + ")";
    linkTags.style.opacity = 0.7;


    // Line Break
    const lineBreak = document.createElement("br");

    // Build Clickable Styled Link Element with Title and URL
    const link = document.createElement("a");
    link.href = element.url;
    link.target = "_blank";
    link.style.opacity = 1 - 0.5 * (index + 1) / total;

    link.appendChild(linkText);
    link.appendChild(linkTags);
    link.appendChild(lineBreak);
    link.appendChild(linkUrl);

    // Add it to the document to make it visible
    container.appendChild(link);
  });
}

function sortResults(input) {
  const newConfig = store.map(item => {
    item.score = compareTwoStrings(
      (input.value || "").toLowerCase(),
      (item.title || "").toLowerCase()
    );
    return item;
  });
  newConfig.sort((a, b) => b.score - a.score);
  render(newConfig);
}

window.onload = () =>
  fetch("/data.json")
    .then(response => response.json())
    .then(configuration => {
      store = configuration;
      render(store.sort((a, b) => a.title.localeCompare(b.title)));
    });

function compareTwoStrings(string1, string2) {
  // Algorithm from: https://en.wikibooks.org/wiki/Algorithm_Implementation/Strings/Dice%27s_coefficient#Javascript
  let intersection = 0;
  const length1 = string1.length - 1;
  const length2 = string2.length - 1;
  if (length1 < 1 || length2 < 1) return 0;
  const bigrams2 = [];
  for (let i = 0; i < length2; i++) {
    bigrams2.push(string2.substr(i, 2));
  }
  for (let i = 0; i < length1; i++) {
    const  bigram1 = string1.substr(i, 2);
    for (let j = 0; j < length2; j++) {
      if (bigram1 == bigrams2[j]) {
        intersection++;
        bigrams2[j] = null;
        break;
      }
    }
  }
  return 2.0 * intersection / (length1 + length2);
}
