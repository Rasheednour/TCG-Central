import "./styles/SignUpPage.css";
import TopRibbon from "../components/TopRibbon.js";
import EnemyCard from "../components/EnemyCard";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { CONFIG } from "../config";
import getAllFetch from "../utils/getAllFetch";
import { Button, Container, Stack } from "@mui/material";
import CreatureCard from "../components/CreatureCard";
import SpellCard from "../components/SpellCard";

function CardsAndEnemiesPage() {
  const [pageType, setPageType] = useState("cards");
  const [notLoaded, setNotLoaded] = useState(true);
  const [info, setInfo] = useState([]);
  const BACKEND_CODE = CONFIG.BACKEND_CODE;
  const BACKEND_URL = CONFIG.BACKEND_URL;
  const ACCESS_TOKEN = CONFIG.ACCESS_TOKEN;

  let navigate = useNavigate();
  const location = useLocation();
  const params = useParams(); //params.game_id is the game's id

  useEffect(() => {
    async function getCardInfo() {
      let path_params = location.pathname.split("/");
      let loadInfo = await getAllFetch(
        BACKEND_URL,
        BACKEND_CODE,
        ACCESS_TOKEN,
        `/games/${path_params[2]}/${path_params[1]}`
      ).catch((err) => {
        console.log(`error fetching cards/enemies for game: ${err}`);
      });
      console.log("setting game info to", loadInfo);
      setInfo(loadInfo);
    }
    console.log("checking if", location.pathname, "and", notLoaded);
    if (location.pathname) {
      console.log("location.pathname", location.pathname);
      setPageType(location.pathname.split("/")[1]);
    }
    if (notLoaded) {
      console.log("calling load function");
      getCardInfo().then(console.log);
      setNotLoaded(false);
    }
  }, [info, notLoaded, pageType, setPageType, setNotLoaded, setInfo]);

  function newCard() {
    let path = `${location.pathname}/new`;
    navigate(path);
    //console.log("new card");
  }

  return (
    <div className="CreatePage">
      <TopRibbon />
      <div className="cards-upper-half">
        <div className="cards-intro" bg-color="black">
          <h1>Customize Cards and Enemies</h1>
          <h3> Click on a card to edit it</h3>
          <Container sx={{ width: 4 / 7 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={newCard}
              fullWidth
            >
              Create New {pageType == "enemies" ? "Enemy" : "Card"}
            </Button>
          </Container>
        </div>
        <div
          className="cards-body"
          style={{ display: "flex", flexFlow: "wrap" }}
        >
          {pageType == "enemies" &&
            info.map((enemy) => {
              return (
                <Link to={`${location.pathname}/${enemy.enemy_id}`}>
                  <EnemyCard
                    domId={`id-card-${enemy.enemy_id}`}
                    key={`enemy-${enemy.enemy_id}`}
                    title={enemy.name}
                    level={enemy.level}
                    image={enemy.image}
                    backgroundColor={enemy.color || "purple"}
                    description={enemy.description}
                    effect={enemy.effect || "None"}
                    stats={[enemy.attack, enemy.defense, enemy.health]}
                  />
                </Link>
              );
            })}
          {pageType == "cards" &&
            info.map((card) => {
              if (
                card.availability &&
                (card.type == "SPELL" || card.type == "CREATURE")
              ) {
                let av_str = card.availability.split("_");
                if (av_str.length > 3) {
                  card.type = card.type + " - " + av_str[3];
                }
              }
              if (card.type.startsWith("CREATURE")) {
                return (
                  <Link to={`${location.pathname}/${card.card_id}`}>
                    <CreatureCard
                      domId={`id-card-${card.card_id}`}
                      key={`card-${card.card_id}`}
                      title={card.name}
                      cost={card.cost}
                      type={card.type}
                      image={card.image_url || card.image}
                      backgroundColor={card.color || "blue"}
                      description={card.description}
                      effect={
                        card.effect && card.effect.length > 0
                          ? card.effect
                          : ["None"]
                      }
                      stats={[card.attack, card.defense, card.health]}
                    />
                  </Link>
                );
              }
              if (card.type.startsWith("SPELL")) {
                return (
                  <Link to={`${location.pathname}/${card.card_id}`}>
                    <SpellCard
                      domId={`id-card-${card.card_id}`}
                      key={`card-${card.card_id}`}
                      title={card.name}
                      cost={card.cost}
                      type={card.type}
                      image={card.image_url || card.image}
                      backgroundColor={card.color || "blue"}
                      description={card.description}
                      effect={
                        card.effect && card.effect.length > 0
                          ? card.effect
                          : ["None"]
                      }
                    />
                  </Link>
                );
              }
            })}
        </div>
      </div>
    </div>
  );
}

export default CardsAndEnemiesPage;
