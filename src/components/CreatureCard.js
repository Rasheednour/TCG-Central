import React from "react";
import monster_art from "../assets/temp_db/monster_art.png";
import "./styles/CreatureCard.css";

function CreatureCard({
  title,
  cost,
  image,
  backgroundColor,
  type,
  description,
  effect,
  stats,
  domId,
}) {
  const backgroundStyle = "background-color: " + backgroundColor;
  return (
    <div
      className="card-container"
      style={{ background: backgroundColor }}
      id={domId}
    >
      <div
        className="card-title"
        key={"top-" + Math.floor(Math.random() * 10000)}
      >
        <h3>{title}</h3>
        <h4>{cost}</h4>
      </div>
      <div
        className="background-image"
        key={"image-" + Math.floor(Math.random() * 10000)}
      >
        <img
          src={image || monster_art}
          width="300"
          height="240"
          alt="trading card image"
        />
      </div>

      <div
        className="card-type"
        key={"type-" + Math.floor(Math.random() * 10000)}
      >
        <h3>{type}</h3>
      </div>

      <div
        className="card-description"
        key={"descr-" + Math.floor(Math.random() * 10000)}
      >
        <p>{effect}</p>
        <p>
          <i>{description}</i>
        </p>
        <div className="card-stats">
          <h5 key={"attack-" + Math.floor(Math.random() * 10000)}>
            ATK/ {stats[0]}
          </h5>
          <h5 key={"def-" + Math.floor(Math.random() * 10000)}>
            DEF/ {stats[1]}
          </h5>
          <h5 key={"hp-" + Math.floor(Math.random() * 10000)}>
            HP/ {stats[2]}
          </h5>
        </div>
      </div>
    </div>
  );
}

export default CreatureCard;
