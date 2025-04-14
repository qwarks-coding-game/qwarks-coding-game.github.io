"use client"

import {useState} from "react";
import VisualizerCanvas from "../components/VisualizerCanvas";
import CodeEditor from "../components/CodeEditor";
import {unzip} from "unzipit";

const TEMPLATE_PLAYER = `from template import Player as Template
from qwark import Qwark

# A very simple example bot that simply energizes the location to its right.
class Player(Template): # Each instance of a Qwark will have its own instance of your player
  def __init__(self, qw: Qwark): # Called when the player is first created.
    self.qwark = qw # Store the reference to our Qwark, to be able to access it later

  def run(self): # Called every round
    qw = self.qwark # Create a shortcut variable to be able to easily access our Qwark

    # Sets the indicator string for debugging purposes. This can be viewed in the visualizer.
    qw.setIndicatorString(f"I'm a Qwark!")

    # Energizes the location to our right.
    if qw.canEnergize(qw.x + 1, qw.y, qw.energy): # Ensures that the action is valid
      qw.energize(qw.x + 1, qw.y, qw.energy) # Carries out the action if it is valid
`;

export default function Editor() {
  const [matchData, setMatchData] = useState({});
  const [code, setCode] = useState(TEMPLATE_PLAYER);

  interface Entry {
    text: () => Promise<string>;
  }

  interface Entries {
    [key: string]: Entry;
  }

  const fileChanged = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;
    const {entries}: {entries: Entries} = await unzip(file);

    // print all entries and their sizes
    for (const [name, entry] of Object.entries(entries)) {
      if (name === "match.json") {
        const match = JSON.parse(await entry.text());
        setMatchData(match);
      }
    }
  };

  return (
    <div style={{display: "flex", flexDirection: "row", alignItems: "center", padding: "0", maxWidth: "100vw", maxHeight: "calc(100vh - 70px)"}}>
      <VisualizerCanvas style={{width: "50vw", height: "calc(100vh - 70px)"}} width={"50vw"} height={"calc(100vh - 70px)"} match={matchData}/>
      <div style={{display: "flex", flexDirection: "column"}}>
        <CodeEditor language="python" value={code} onChange={setCode} width={"50vw"} height={"calc(100vh - 200px)"}/>
        <button>Run!</button>
      </div>
    </div>
  );
}
