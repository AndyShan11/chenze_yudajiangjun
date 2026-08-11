const FRAME_COUNT = 31;
const genderStates = [
  { value: 0, key: "male", label: "男性", meter: "男" },
  { value: 50, key: "neutral", label: "中性", meter: "中" },
  { value: 100, key: "female", label: "女性", meter: "女" },
];
const ageStates = [
  { value: 0, key: "baby", label: "婴儿", age: 1 },
  { value: 50, key: "adult", label: "成人", age: 31 },
  { value: 100, key: "elder", label: "老人", age: 88 },
];
const elements = {
  root: document.querySelector("#calibrator"),
  portrait: document.querySelector("#portrait-frame"),
  identity: document.querySelector("#identity-slider"),
  gender: document.querySelector("#gender-slider"),
  age: document.querySelector("#age-slider"),
  identityOutput: document.querySelector("#identity-output"),
  genderOutput: document.querySelector("#gender-output"),
  ageOutput: document.querySelector("#age-output"),
  ageRailOutput: document.querySelector("#age-rail-output"),
  frameCounter: document.querySelector("#frame-counter"),
  currentForm: document.querySelector("#current-form"),
  stateDetail: document.querySelector("#state-detail"),
};
const preloadedSeries = new Set();
let requestedFrame = 0;

function nearestState(states, value) {
  return states.reduce((nearest, state) => Math.abs(state.value - value) < Math.abs(nearest.value - value) ? state : nearest);
}
function frameSource(age, gender, index) {
  return `./frames/${age}-${gender}/${String(index).padStart(2, "0")}.webp`;
}
function preloadSeries(age, gender) {
  const key = `${age}-${gender}`;
  if (preloadedSeries.has(key)) return;
  preloadedSeries.add(key);
  for (let index = 0; index < FRAME_COUNT; index += 1) {
    const image = new Image();
    image.decoding = "async";
    image.src = frameSource(age, gender, index);
  }
}
function showIndependentFrame(source, alt) {
  const request = ++requestedFrame;
  const image = new Image();
  image.decoding = "async";
  image.src = source;
  const commit = () => {
    if (request !== requestedFrame) return;
    elements.portrait.src = source;
    elements.portrait.alt = alt;
  };
  if (image.complete) commit();
  else image.decode().then(commit).catch(commit);
}
function identityLabel(value) {
  if (value <= 12) return "陈泽";
  if (value < 44) return "陈泽偏置";
  if (value <= 56) return "陈泽 × 宇大将军";
  if (value < 88) return "宇大将军偏置";
  return "宇大将军";
}
function render() {
  const identity = Number(elements.identity.value);
  const gender = nearestState(genderStates, Number(elements.gender.value));
  const age = nearestState(ageStates, Number(elements.age.value));
  const frameIndex = Math.round((identity / 100) * (FRAME_COUNT - 1));
  const frameNumber = frameIndex + 1;
  const person = identityLabel(identity);
  const source = frameSource(age.key, gender.key, frameIndex);
  const alt = `${age.label}、${gender.label}、${person}，第 ${frameNumber} 帧`;
  elements.root.style.setProperty("--identity", identity / 100);
  elements.root.style.setProperty("--gender", gender.value / 100);
  elements.root.style.setProperty("--age", age.value / 100);
  elements.identityOutput.value = String(Math.round(identity)).padStart(2, "0");
  elements.genderOutput.value = gender.meter;
  elements.ageOutput.value = String(age.age).padStart(2, "0");
  elements.ageRailOutput.value = String(age.age).padStart(2, "0");
  elements.frameCounter.textContent = `F${String(frameNumber).padStart(2, "0")} / ${FRAME_COUNT}`;
  elements.currentForm.textContent = `${age.label} · ${gender.label} · ${person}`;
  elements.stateDetail.textContent = `人物强度 ${Math.round(identity)}% · 独立帧 ${frameNumber}/${FRAME_COUNT}`;
  elements.identity.setAttribute("aria-valuetext", `${person}，第 ${frameNumber} 帧`);
  elements.gender.setAttribute("aria-valuetext", gender.label);
  elements.age.setAttribute("aria-valuetext", `${age.label}，约 ${age.age} 岁`);
  showIndependentFrame(source, alt);
  preloadSeries(age.key, gender.key);
}
[elements.identity, elements.gender, elements.age].forEach((slider) => slider.addEventListener("input", render));
render();
const scheduleWarmup = window.requestIdleCallback ?? ((callback) => setTimeout(callback, 700));
scheduleWarmup(() => {
  preloadSeries("adult", "male");
  preloadSeries("adult", "female");
});
