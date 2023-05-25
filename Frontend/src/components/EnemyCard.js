import React from "react";
import "./styles/EnemyCard.css";

function EnemyCard({
  title,
  level,
  image,
  backgroundColor,
  description,
  effect,
  stats,
  domId,
}) {
  return (
    <div
      className="enemy-card-container"
      style={{ background: backgroundColor }}
      id={domId}
    >
      <div className="card-title">
        <h3>{title}</h3>
        <h4>{level}</h4>
      </div>
      <div className="background-image">
        <img src={image} width="300" height="280" alt="trading card image" />
      </div>

      <div className="card-description">
        <p>{effect}</p>
        <p>
          <i>{description}</i>
        </p>
        <div className="card-stats">
          <h5>ATK/ {stats[0]}</h5>
          <h5>DEF/ {stats[1]}</h5>
          <h5>HP/ {stats[2]}</h5>
        </div>
      </div>
    </div>
  );
}

export default EnemyCard;
