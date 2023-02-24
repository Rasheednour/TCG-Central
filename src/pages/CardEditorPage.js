import "./styles/SignUpPage.css";
import TopRibbon from "../components/TopRibbon.js";
import EnemyCard from "../components/EnemyCard";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { CONFIG } from "../config";
import getAllFetch from "../utils/getAllFetch";
import { Button, Container, Stack } from "@mui/material";
import CreatureCard from "../components/CreatureCard";
import SpellCard from "../components/SpellCard";
import CardEditor from "../components/CardEditor";
import EnemyEditor from "../components/EnemyEditor";

export default function CardEditorPage() {
  const BACKEND_CODE = CONFIG.BACKEND_CODE;
  const BACKEND_URL = CONFIG.BACKEND_URL;
  const ACCESS_TOKEN = CONFIG.ACCESS_TOKEN;
  const DEFAULT_CARD = CONFIG.DEFAULT_CARD;
  const DEFAULT_ENEMY = CONFIG.DEFAULT_ENEMY;

  let navigate = useNavigate();
  const location = useLocation();
  const params = useParams(); //params.game_id is the game's id
  const [pageType, setPageType] = useState(location.pathname.split("/")[1]);
  const [info, setInfo] = useState({});
  const [notLoaded, setNotLoaded] = useState(true);
  const [triggerSave, setTriggerSave] = useState(false);

  useEffect(() => {
    async function getCardInfo() {
      let path_params = location.pathname.split("/");
      if (path_params[3] != "new") {
        let loadInfo = await getAllFetch(
          BACKEND_URL,
          BACKEND_CODE,
          ACCESS_TOKEN,
          `/${path_params[1]}/${path_params[3]}`
        ).catch((err) => {
          console.log(`error fetching cards/enemies for game: ${err}`);
        });
        setInfo(loadInfo);
      } else {
        setInfo(pageType == "enemies" ? DEFAULT_ENEMY : DEFAULT_CARD);
      }
    }
    if (notLoaded) {
      getCardInfo().then(console.log);
      setNotLoaded(false);
    }
  }, [notLoaded, info, pageType]);

  useEffect(() => {
    let saveInfo = async () => {
      let groomed_info = info;
      console.log("groomed card before grooming", groomed_info);
      if (!groomed_info["game_ids"].includes(location.pathname.split("/")[2])) {
        groomed_info["game_ids"].push(location.pathname.split("/")[2]);
      }
      await fetch(
        BACKEND_URL + `/games/${location.pathname.split("/")[2]}/${pageType}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + ACCESS_TOKEN,
          },
          method: "POST",
          body: JSON.stringify(groomed_info),
        }
      )
        .then((res) => {
          if (res.status < 300) {
            return res.json();
          } else {
            console.log(`error in posting update`, res.status, res.json());
            return {};
          }
        })
        .then((data) => {
          if (
            !((pageType == "cards" ? "card_id" : "enemy_id") in groomed_info)
          ) {
            groomed_info[pageType == "cards" ? "card_id" : "enemy_id"] =
              data[pageType == "cards" ? "card_id" : "enemy_id"];
          }
          setInfo(groomed_info);
        });
    };
    if (triggerSave) {
      setTriggerSave(false);
      saveInfo();
    }
  }, [info, triggerSave]);

  const updateInfo = (infoObj) => {
    setInfo(infoObj);
    setTriggerSave(true);
  };

  return (
    <div className="CardEditorPage">
      <TopRibbon />
      <h1>
        Editting {pageType == "cards" && "Card"}
        {pageType == "enemies" && "Enemy"}
      </h1>

      <div className="cards-body" style={{ display: "flex", flexFlow: "wrap" }}>
        {pageType == "enemies" && (
          <EnemyCard
            domId={`id-enemy-card-${info.enemy_id}`}
            key={`enemy-${info.enemy_id}`}
            title={info.name}
            level={info.level}
            image={info.image}
            backgroundColor={info.color || "purple"}
            description={info.description}
            effect={info.effect || "None"}
            stats={[info.attack, info.defense, info.health]}
          />
        )}
        {pageType == "cards" && info.type == "CREATURE" && (
          <CreatureCard
            domId={`id-card-${info.card_id}`}
            key={`card-${info.card_id}`}
            title={info.name}
            cost={info.cost}
            type={info.type}
            image={info.image_url || info.image}
            backgroundColor={info.color || "blue"}
            description={info.description}
            effect={
              info.effect && info.effect.length > 0 ? info.effect : ["None"]
            }
            stats={[info.attack, info.defense, info.health]}
          />
        )}
        {pageType == "cards" && info.type == "SPELL" && (
          <SpellCard
            domId={`id-spell-card-${info.card_id}`}
            key={`card-spell-${info.card_id}`}
            title={info.name}
            cost={info.cost}
            type={info.type}
            image={info.image_url || info.image}
            backgroundColor={info.color || "blue"}
            description={info.description}
            effect={
              info.effect && info.effect.length > 0 ? info.effect : ["None"]
            }
          />
        )}
        {pageType == "cards" && (
          <CardEditor cardInfo={info} saveCard={updateInfo} />
        )}
        {pageType == "enemies" && (
          <EnemyEditor enemyInfo={info} saveEnemy={updateInfo} />
        )}
      </div>
    </div>
  );
}
