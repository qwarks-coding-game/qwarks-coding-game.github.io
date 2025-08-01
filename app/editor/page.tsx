"use client";

import { useContext, useEffect, useState } from "react";
import VisualizerCanvas from "../components/VisualizerCanvas";
import CodeEditor from "../components/CodeEditor";
import { getUserInfo, uploadBot, downloadBot, setMatchCallback, downloadMatch } from "@/utils/firebase-caller";
import {zipTextToBytes, unzipBlobToJSON, unzipBlobToCode} from "@/utils/zip-file";
import {requestMatch} from "@/utils/match-server";
import { AuthContext } from "../context/AuthContext";
import { DocumentData } from "firebase/firestore";

const TEMPLATE_PLAYER = `from template import Player as Template
from qwark import Qwark

# A very simple example bot that energizes the location to its right.
class Player(Template): # Each instance of a Qwark will have its own instance of your player
    def __init__(self, qw: Qwark): # Called when the player is first created.
        self.qwark = qw # Store the reference to our Qwark, to be able to access it later

    def run(self): # Called every round
        qw = self.qwark # Create a shortcut variable to be able to easily access our Qwark

        # Sets the indicator string for debugging purposes. This can be viewed in the visualizer.
        qw.setIndicatorString(f"This is an indicator string.\\nMy energy is {qw.energy} and my location is ({qw.x}, {qw.y})")

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
    const [matchId, setMatchId] = useState("");
    const [roundNum, setRoundNum] = useState(0);

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

    useEffect(() => {
        if (selectedBot) {
            const fetchBot = async () => {
                const bot = await downloadBot(selectedBot);
                if (bot) {
                    const code = await unzipBlobToCode(bot);
                    setCode(code);
                }
            };
            fetchBot();
        }
    }, [selectedBot]);

    const saveBot = async () => {
        setSaving(true);
        await uploadBot(selectedBot, await zipTextToBytes(code, "player.py"))
        setSaving(false);
    }
    
    const runMatch = async () => {
        setRunning(true);
        const matchId = await requestMatch([selectedBot, "exampleplayer"]);
        setMatchId(matchId);
        setMatchCallback(matchId, async (response: DocumentData) => {
            if (response.status === "running") {
                setRoundNum(response.roundNum);
                return;
            }
            if (response.status === "created") {
                setRoundNum(1);
                return;
            }
            console.log("Match finished:", response);
            const matchBlob = await downloadMatch(response.matchName);
            const data = await unzipBlobToJSON(matchBlob);
            console.log(data);
            setMatchData(data);
            setRunning(false);
        });
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
                    {running ? (roundNum == 0 ? `Creating Match...` : `Running Match: Round ${roundNum}`) : "Test (vs exampleplayer)"}
                </button>
            </div>
        </div>
    );
}
