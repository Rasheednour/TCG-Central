import "../App.css";
import TopRibbon from "../components/TopRibbon.js";
import Button from "@mui/material/Button";
import GameSummary from "../components/GameSummary";

function TCGPortal() {
  console.log("can I even log at all?");
  return (
    <div className="TCGPortal">
      <TopRibbon />
      <div className="TCG-Container">
        <h1>TCG Portal</h1>
        <h2>Browse Published Trading Card Games</h2>
      </div>
    </div>
  );
}

export default TCGPortal;
