const FRAME_COUNT = 31;
const GENDER_STEPS = 9;
const GENDER_MAX = GENDER_STEPS - 1;
const AGE_STEPS = 17;
const AGE_MAX = AGE_STEPS - 1;

const elements = {
  root: document.querySelector("#calibrator"),
  portrait: document.querySelector("#portrait-frame"),
  joystick: document.querySelector("#joystick"),
  joystickOutput: document.querySelector("#joystick-output"),
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
let requestedSource = "";
let activePointer = null;
let preloadTimer = 0;
let renderFrame = 0;
let lastJoystickPosition = "";

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function gridIndex(value, maximum) {
  return Math.round((clamp(value, 0, 100) / 100) * maximum);
}

function frameSource(ageIndex, genderIndex, identityIndex) {
  const age = String(ageIndex).padStart(2, "0");
  const gender = String(genderIndex).padStart(2, "0");
  const identity = String(identityIndex).padStart(2, "0");
  return `./lattice/a${age}-g${gender}/${identity}.webp`;
}

function preloadSeries(ageIndex, genderIndex) {
  const key = `${ageIndex}-${genderIndex}`;
  if (preloadedSeries.has(key)) return;
  preloadedSeries.add(key);
  for (let index = 0; index < FRAME_COUNT; index += 1) {
    const image = new Image();
    image.decoding = "async";
    image.src = frameSource(ageIndex, genderIndex, index);
  }
}

function showIndependentFrame(source, alt) {
  if (source === requestedSource) {
    elements.portrait.alt = alt;
    return;
  }
  requestedSource = source;
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

function scheduleSeriesPreload(ageIndex, genderIndex) {
  window.clearTimeout(preloadTimer);
  preloadTimer = window.setTimeout(() => {
    const runWhenIdle = window.requestIdleCallback ?? ((callback) => window.setTimeout(callback, 250));
    runWhenIdle(() => preloadSeries(ageIndex, genderIndex), { timeout: 1200 });
  }, 450);
}

function scheduleRender() {
  if (renderFrame) return;
  renderFrame = window.requestAnimationFrame(() => {
    renderFrame = 0;
    render();
  });
}

function identityLabel(value) {
  if (value <= 12) return "陈泽";
  if (value < 44) return "陈泽偏置";
  if (value <= 56) return "陈泽 × 宇大将军";
  if (value < 88) return "宇大将军偏置";
  return "宇大将军";
}

function genderLabel(value) {
  if (value <= 6) return "男性";
  if (value < 44) return `男性 → 中性 ${Math.round((value / 50) * 100)}%`;
  if (value <= 56) return "中性";
  if (value < 94) return `中性 → 女性 ${Math.round(((value - 50) / 50) * 100)}%`;
  return "女性";
}

function genderMeter(value) {
  if (value <= 6) return "男";
  if (value < 44) return "男·中";
  if (value <= 56) return "中";
  if (value < 94) return "中·女";
  return "女";
}

function displayAge(value) {
  if (value <= 50) return Math.round(1 + (value / 50) * 30);
  return Math.round(31 + ((value - 50) / 50) * 57);
}

function ageLabel(age) {
  if (age <= 3) return "婴儿";
  if (age <= 12) return "儿童";
  if (age <= 18) return "少年";
  if (age <= 35) return "青年";
  if (age <= 55) return "中年";
  if (age <= 69) return "年长";
  return "老人";
}

function render() {
  const identity = Number(elements.identity.value);
  const genderValue = Number(elements.gender.value);
  const ageValue = Number(elements.age.value);
  const gender = genderLabel(genderValue);
  const age = displayAge(ageValue);
  const lifeStage = ageLabel(age);
  const frameIndex = Math.round((identity / 100) * (FRAME_COUNT - 1));
  const frameNumber = frameIndex + 1;
  const genderIndex = gridIndex(genderValue, GENDER_MAX);
  const ageIndex = gridIndex(ageValue, AGE_MAX);
  const person = identityLabel(identity);
  const source = frameSource(ageIndex, genderIndex, frameIndex);
  const alt = `${age} 岁、${gender}、${person}，第 ${frameNumber} 帧`;

  elements.root.style.setProperty("--identity", identity / 100);
  elements.root.style.setProperty("--gender", genderValue / 100);
  elements.root.style.setProperty("--age", ageValue / 100);
  const joyLeft = 17 + identity * 0.66;
  const joyTop = 15 + genderValue * 0.54;
  const joystickPosition = `${joyLeft}:${joyTop}`;
  if (joystickPosition !== lastJoystickPosition) {
    lastJoystickPosition = joystickPosition;
    elements.joystick.style.setProperty("--joy-left", `${joyLeft}%`);
    elements.joystick.style.setProperty("--joy-top", `${joyTop}%`);
    const bounds = elements.joystick.getBoundingClientRect();
    const deltaX = ((joyLeft - 50) / 100) * bounds.width;
    const deltaY = ((joyTop - 88) / 100) * bounds.height;
    elements.joystick.style.setProperty("--lever-length", `${Math.hypot(deltaX, deltaY)}px`);
    elements.joystick.style.setProperty("--lever-angle", `${Math.atan2(deltaY, deltaX) * (180 / Math.PI)}deg`);
  }
  elements.identityOutput.value = String(Math.round(identity)).padStart(2, "0");
  elements.genderOutput.value = genderMeter(genderValue);
  elements.ageOutput.value = String(age).padStart(2, "0");
  elements.ageRailOutput.value = String(age).padStart(2, "0");
  elements.joystickOutput.value = `X ${String(Math.round(identity)).padStart(2, "0")} / Y ${String(Math.round(genderValue)).padStart(2, "0")}`;
  elements.frameCounter.textContent = `F${String(frameNumber).padStart(2, "0")} / ${FRAME_COUNT}`;
  elements.currentForm.textContent = `${age} 岁 · ${gender} · ${person}`;
  elements.stateDetail.textContent = `${lifeStage} · 人物强度 ${Math.round(identity)}% · 年龄 ${ageIndex + 1}/${AGE_STEPS} × 性别 ${genderIndex + 1}/${GENDER_STEPS}`;
  elements.joystick.setAttribute("aria-label", `二维游戏摇杆：人物 ${Math.round(identity)}%，${gender}`);
  elements.age.setAttribute("aria-valuetext", `${age} 岁，${lifeStage}`);

  showIndependentFrame(source, alt);
  scheduleSeriesPreload(ageIndex, genderIndex);
}

function updateJoystickFromPointer(event) {
  const bounds = elements.joystick.getBoundingClientRect();
  const x = clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
  const y = clamp((event.clientY - bounds.top) / bounds.height, 0, 1);
  elements.identity.value = String(x * 100);
  elements.gender.value = String(y * 100);
  scheduleRender();
}

elements.joystick.addEventListener("pointerdown", (event) => {
  activePointer = event.pointerId;
  elements.joystick.setPointerCapture(event.pointerId);
  elements.joystick.classList.add("is-active");
  updateJoystickFromPointer(event);
});

elements.joystick.addEventListener("pointermove", (event) => {
  if (event.pointerId !== activePointer) return;
  updateJoystickFromPointer(event);
});

function finishJoystick(event) {
  if (event.pointerId !== activePointer) return;
  activePointer = null;
  elements.joystick.classList.remove("is-active");
}

elements.joystick.addEventListener("pointerup", finishJoystick);
elements.joystick.addEventListener("pointercancel", finishJoystick);

elements.joystick.addEventListener("keydown", (event) => {
  const identityStep = 100 / (FRAME_COUNT - 1);
  const genderStep = 100 / GENDER_MAX;
  let handled = true;
  if (event.key === "ArrowLeft") elements.identity.value = String(clamp(Number(elements.identity.value) - identityStep, 0, 100));
  else if (event.key === "ArrowRight") elements.identity.value = String(clamp(Number(elements.identity.value) + identityStep, 0, 100));
  else if (event.key === "ArrowUp") elements.gender.value = String(clamp(Number(elements.gender.value) - genderStep, 0, 100));
  else if (event.key === "ArrowDown") elements.gender.value = String(clamp(Number(elements.gender.value) + genderStep, 0, 100));
  else if (event.key === "Enter" || event.key === " ") {
    elements.identity.value = "50";
    elements.gender.value = "50";
  } else handled = false;
  if (!handled) return;
  event.preventDefault();
  scheduleRender();
});

[elements.identity, elements.gender, elements.age].forEach((slider) => slider.addEventListener("input", scheduleRender));
window.addEventListener("resize", () => {
  lastJoystickPosition = "";
  scheduleRender();
});
render();
