"use client";

import { useContext, useEffect, useState } from "react";
import VisualizerCanvas from "../components/VisualizerCanvas";
import CodeEditor from "../components/CodeEditor";
import { createBot, getUserInfo, uploadBot } from "@/utils/firebase-caller";
import {zipTextToBytes, unzipBlobToJSON} from "@/utils/zip-file";
import {requestMatch} from "@/utils/match-server";
import { AuthContext } from "../context/AuthContext";

const TEMPLATE_PLAYER = `from template import Player as Template
from qwark import Qwark

# A very simple example bot that energizes the location to its right.
class Player(Template): # Each instance of a Qwark will have its own instance of your player
    def __init__(self, qw: Qwark): # Called when the player is first created.
        self.qwark = qw # Store the reference to our Qwark, to be able to access it later

    def run(self): # Called every round
        qw = self.qwark # Create a shortcut variable to be able to easily access our Qwark

        # Sets the indicator string for debugging purposes. This can be viewed in the visualizer.
        qw.setIndicatorString(f"I'm a Qwark!")

        # Energizes the location to our right.
        if qw.canEnergize(qw.x + 1, qw.y, qw.energy): # Ensures that the action is valid
            qw.energize(qw.x + 1, qw.y, qw.energy) # Carries out the action if valid
`;

export default function Editor() {
    const [matchData, setMatchData] = useState({});
    const [code, setCode] = useState(TEMPLATE_PLAYER);
    const { user } = useContext(AuthContext);
    const [selectedBot, setSelectedBot] = useState("");
    const [running, setRunning] = useState(false);
    const [saving, setSaving] = useState(false);

    interface Bot {
        id: string;
        name: string;
    }

    interface PlayerData {
        bots?: Bot[];
    }

    const [playerData, setPlayerData] = useState<PlayerData>({});

    useEffect(() => {
        const fetchPlayerData = async () => {
            const data = await getUserInfo();
            console.log(data);
            setPlayerData(data || {});
        };
        fetchPlayerData();
    }, [user]);

    const saveBot = async () => {
        setSaving(true);
        await uploadBot(selectedBot, await zipTextToBytes(code, "player.py"))
        setSaving(false);
    }
    

    const runMatch = async () => {
        setRunning(true);
        const match = await requestMatch([selectedBot, "exampleplayer"]);
        const data = await unzipBlobToJSON(await match.blob());
        console.log(data);
        setMatchData(data);
        setRunning(false);
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                padding: "0",
                maxWidth: "100vw",
                maxHeight: "calc(100vh - 70px)",
            }}
        >
            <div style={{ display: "flex", flexDirection: "column"}}>
                <VisualizerCanvas
                    style={{ width: "50vw", height: "calc(100vh - 70px)"  }}
                    width={"50vw"}
                    match={matchData}
                />
            </div>
            <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 70px)", width: "50vw", padding: "10px" }}>
                <CodeEditor
                    language="python"
                    value={code}
                    onChange={setCode}
                    width={"50vw"}
                    style={{flex: 1}}
                />
                <select
                    onChange={(e) => setSelectedBot(e.target.value)}
                    value={selectedBot}
                >
                    <option value="">Select a bot</option>
                    {playerData.bots?.map((bot: any) => {
                        return (
                            <option key={bot.id} value={bot.id}>
                                {bot.name}
                            </option>
                        );
                    })}
                </select>
                <button
                    disabled={selectedBot == ""}
                    onClick={async () => {saveBot()}}
                >
                    {saving ? "Saving..." : "Save!"}
                </button>
                <button
                    disabled={selectedBot == ""}
                    onClick={runMatch}
                >
                    {running ? "Running Match..." : "Test (vs exampleplayer)"}
                </button>
            </div>
        </div>
    );
}
