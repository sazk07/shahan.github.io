"use strict";

const fetchData = async (url) => {
  try {
    const dataPromise = await fetch(url);
    if (!dataPromise.ok) {
      throw new Error(dataPromise.statusText);
    }
    const data = await dataPromise.json();
    if (!data) {
      throw new Error("no data found");
    }
    return data;
  } catch (error) {
    console.error(error.message);
    return error;
  }
};

const createSpan = (slot, text, parent) => {
  const vocabSpan = document.createElement("span");
  vocabSpan.setAttribute("slot", slot);
  vocabSpan.textContent = text;
  parent.appendChild(vocabSpan);
};

const createLi = (slot, text, parent) => {
  const li = document.createElement("li");
  li.setAttribute("slot", slot);
  li.innerHTML = text;
  parent.appendChild(li);
};

const main = async () => {
  const mainElem = document.querySelector("main");
  const data = await fetchData("data/data.json");
  if (data instanceof Error) {
    mainElem.textContent = data.message;
    return;
  }
  for (const elem of data) {
    const { word, definition, mark, etym } = elem;
    // create custom elem
    const vocabElement = document.createElement("vocab-element");
    mainElem.appendChild(vocabElement);
    createSpan("vocab", word, vocabElement);

    // check if elem definition is in array form
    const definitions = Array.isArray(definition) ? definition : [definition];
    for (const def of definitions) {
      createLi("definition", def, vocabElement);
    }

    // check if elem mark is in array form
    if (mark) {
      const marks = Array.isArray(mark) ? mark : [mark];
      marks?.forEach((mark, index) => {
        const currentEtym = Array.isArray(etym) ? etym[index] : etym;
        const concatEtym = `<mark>${mark}</mark>: <span>${currentEtym}</span>`;
        createLi("etym", concatEtym, vocabElement);
      });
    }

    // close previous details element if new vocab element clicked
    vocabElement.addEventListener("click", (e) => {
      const allVocabs = document.querySelectorAll("vocab-element");
      for (const vocab of allVocabs) {
        if (vocab !== e.currentTarget) {
          const details = vocab.shadowRoot.querySelector("details");
          if (details.open) {
            details.removeAttribute("open");
          }
        }
      }
    });
  }
};
main();
