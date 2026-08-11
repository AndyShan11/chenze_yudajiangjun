"use client";

import { CSSProperties, useMemo, useState } from "react";

type AgeKey = "baby" | "adult" | "elder";
type IdentityKey = "chenze" | "general";
type GenderKey = "male" | "female";

const portraits: Array<{
  age: AgeKey;
  identity: IdentityKey;
  gender: GenderKey;
  src: string;
}> = (["baby", "adult", "elder"] as AgeKey[]).flatMap((age) =>
  (["chenze", "general"] as IdentityKey[]).flatMap((identity) =>
    (["male", "female"] as GenderKey[]).map((gender) => ({
      age,
      identity,
      gender,
      src: `/portraits/${age}-${identity}-${gender}.webp`,
    })),
  ),
);

function ageWeights(value: number): Record<AgeKey, number> {
  const t = value / 100;
  const adultPoint = 0.34;
  if (t <= adultPoint) {
    const adult = t / adultPoint;
    return { baby: 1 - adult, adult, elder: 0 };
  }
  const elder = (t - adultPoint) / (1 - adultPoint);
  return { baby: 0, adult: 1 - elder, elder };
}

function ageFromSlider(value: number) {
  return Math.max(1, Math.round(1 + value * 0.89));
}

export default function Home() {
  const [identity, setIdentity] = useState(34);
  const [gender, setGender] = useState(42);
  const [age, setAge] = useState(34);

  const weights = useMemo(() => {
    const identityWeights: Record<IdentityKey, number> = {
      chenze: 1 - identity / 100,
      general: identity / 100,
    };
    const genderWeights: Record<GenderKey, number> = {
      male: 1 - gender / 100,
      female: gender / 100,
    };
    const ages = ageWeights(age);
    return portraits.map((portrait) => ({
      ...portrait,
      opacity:
        identityWeights[portrait.identity] *
        genderWeights[portrait.gender] *
        ages[portrait.age],
    }));
  }, [identity, gender, age]);

  const identityName =
    identity < 28 ? "陈泽" : identity > 72 ? "宇大将军" : "陈泽 × 宇大将军";
  const genderName = gender < 30 ? "男" : gender > 70 ? "女" : "中性过渡";
  const displayAge = ageFromSlider(age);
  const ageName = displayAge <= 6 ? "婴儿" : displayAge >= 70 ? "老人" : `${displayAge} 岁`;

  const pageStyle = {
    "--identity": identity / 100,
    "--gender": gender / 100,
    "--age": age / 100,
  } as CSSProperties;

  return (
    <main className="calibrator" style={pageStyle}>
      <header className="masthead">
        <div>
          <p className="eyebrow">IDENTITY / GENDER / AGE CALIBRATOR</p>
          <h1>陈宇滑动变阻器</h1>
        </div>
        <div className="meter-bank" aria-live="polite">
          <div><span>人物</span><output>{String(Math.round(identity)).padStart(2, "0")}</output></div>
          <div><span>性别</span><output>{String(Math.round(gender)).padStart(2, "0")}</output></div>
          <div><span>年龄</span><output>{String(displayAge).padStart(2, "0")}</output></div>
        </div>
      </header>

      <section className="portrait-zone" aria-labelledby="current-form">
        <p className="stage-ghost" aria-hidden="true">泽 · 将</p>
        <div className="stage-cluster">
          <div className="portrait-shell">
            <div className="portrait-stack" role="img" aria-label={`${ageName}，${genderName}，${identityName}`}>
              {weights.map((portrait) => (
                <img
                  key={`${portrait.age}-${portrait.identity}-${portrait.gender}`}
                  src={portrait.src}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  style={{ opacity: portrait.opacity }}
                />
              ))}
            </div>
            <div className="scan-grid" aria-hidden="true" />
            <span className="frame-corner frame-corner--tl" aria-hidden="true" />
            <span className="frame-corner frame-corner--tr" aria-hidden="true" />
            <span className="frame-corner frame-corner--bl" aria-hidden="true" />
            <span className="frame-corner frame-corner--br" aria-hidden="true" />

            <div className="axis-line axis-line--horizontal" aria-hidden="true" />
            <div className="axis-line axis-line--vertical" aria-hidden="true" />

            <input
              className="cross-slider identity-slider"
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={identity}
              onChange={(event) => setIdentity(Number(event.target.value))}
              aria-label="人物：陈泽到宇大将军"
              aria-valuetext={`${Math.round(identity)}%，${identityName}`}
            />
            <input
              className="cross-slider gender-slider"
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={gender}
              onChange={(event) => setGender(Number(event.target.value))}
              aria-label="性别：男性到女性"
              aria-valuetext={`${Math.round(gender)}%，${genderName}`}
            />

            <span className="axis-label axis-label--left">陈泽</span>
            <span className="axis-label axis-label--right">宇大将军</span>
            <span className="axis-label axis-label--top">男</span>
            <span className="axis-label axis-label--bottom">女</span>
          </div>

          <aside className="age-control" aria-label="年龄控制">
            <div className="age-heading">
              <span>AGE</span>
              <output>{String(displayAge).padStart(2, "0")}</output>
            </div>
            <div className="age-rail">
              <span className="age-label age-label--top">婴儿</span>
              <input
                className="age-slider"
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={age}
                onChange={(event) => setAge(Number(event.target.value))}
                aria-label="年龄：婴儿到老人"
                aria-valuetext={ageName}
              />
              <span className="age-label age-label--bottom">老人</span>
            </div>
          </aside>
        </div>

        <div className="stage-readout">
          <span>当前形态</span>
          <p className="stage-name" id="current-form">{identityName}</p>
          <span>{genderName} · {ageName}</span>
        </div>
      </section>

      <footer className="footer-note">
        <span>拖动十字滑轨，连续校准人物与性别</span>
        <span>右上角调节年龄：婴儿 → 老人</span>
      </footer>
    </main>
  );
}
