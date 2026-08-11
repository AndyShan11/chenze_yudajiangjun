const ages = ["baby", "adult", "elder"];
const identities = ["chenze", "general"];
const genders = ["male", "female"];

const portraits = ages.flatMap((age) =>
  identities.flatMap((identity) =>
    genders.map((gender) => ({ age, identity, gender })),
  ),
);

const elements = {
  root: document.querySelector("#calibrator"),
  stack: document.querySelector("#portrait-stack"),
  identity: document.querySelector("#identity-slider"),
  gender: document.querySelector("#gender-slider"),
  age: document.querySelector("#age-slider"),
  identityOutput: document.querySelector("#identity-output"),
  genderOutput: document.querySelector("#gender-output"),
  ageOutput: document.querySelector("#age-output"),
  ageRailOutput: document.querySelector("#age-rail-output"),
  currentForm: document.querySelector("#current-form"),
  stateDetail: document.querySelector("#state-detail"),
};

const imageLayers = portraits.map((portrait) => {
  const image = document.createElement("img");
  image.src = `./portraits/${portrait.age}-${portrait.identity}-${portrait.gender}.webp`;
  image.alt = "";
  image.setAttribute("aria-hidden", "true");
  image.draggable = false;
  elements.stack.append(image);
  return { ...portrait, image };
});

function getAgeWeights(value) {
  const t = value / 100;
  const adultPoint = 0.34;
  if (t <= adultPoint) {
    const adult = t / adultPoint;
    return { baby: 1 - adult, adult, elder: 0 };
  }
  const elder = (t - adultPoint) / (1 - adultPoint);
  return { baby: 0, adult: 1 - elder, elder };
}

function getDisplayAge(value) {
  return Math.max(1, Math.round(1 + value * 0.89));
}

function render() {
  const identity = Number(elements.identity.value);
  const gender = Number(elements.gender.value);
  const age = Number(elements.age.value);
  const identityWeights = { chenze: 1 - identity / 100, general: identity / 100 };
  const genderWeights = { male: 1 - gender / 100, female: gender / 100 };
  const ageMix = getAgeWeights(age);

  imageLayers.forEach((portrait) => {
    portrait.image.style.opacity =
      identityWeights[portrait.identity] *
      genderWeights[portrait.gender] *
      ageMix[portrait.age];
  });

  const identityName = identity < 28 ? "陈泽" : identity > 72 ? "宇大将军" : "陈泽 × 宇大将军";
  const genderName = gender < 30 ? "男" : gender > 70 ? "女" : "中性过渡";
  const displayAge = getDisplayAge(age);
  const ageName = displayAge <= 6 ? "婴儿" : displayAge >= 70 ? "老人" : `${displayAge} 岁`;

  elements.root.style.setProperty("--identity", identity / 100);
  elements.root.style.setProperty("--gender", gender / 100);
  elements.root.style.setProperty("--age", age / 100);
  elements.identityOutput.value = String(Math.round(identity)).padStart(2, "0");
  elements.genderOutput.value = String(Math.round(gender)).padStart(2, "0");
  elements.ageOutput.value = String(displayAge).padStart(2, "0");
  elements.ageRailOutput.value = String(displayAge).padStart(2, "0");
  elements.currentForm.textContent = identityName;
  elements.stateDetail.textContent = `${genderName} · ${ageName}`;
  elements.stack.setAttribute("aria-label", `${ageName}，${genderName}，${identityName}`);
  elements.identity.setAttribute("aria-valuetext", `${Math.round(identity)}%，${identityName}`);
  elements.gender.setAttribute("aria-valuetext", `${Math.round(gender)}%，${genderName}`);
  elements.age.setAttribute("aria-valuetext", ageName);
}

[elements.identity, elements.gender, elements.age].forEach((slider) => {
  slider.addEventListener("input", render);
});

render();
