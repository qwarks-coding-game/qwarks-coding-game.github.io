"use client";

import { useContext, useEffect, useState } from "react";
import VisualizerCanvas from "../components/VisualizerCanvas";
import CodeEditor from "../components/CodeEditor";
import { createBot, getUserInfo, uploadBot } from "@/utils/firebase-caller";
import {zipTextToBytes, unzipBlobToJSON} from "@/utils/zip-file";
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
        qw.setIndicatorString(f"This is an indicator string.\\nMy energy is {qw.energy} and my location is ({qw.x}, {qw.y})")

        # Energizes the location to our right.
        if qw.canEnergize(qw.x + 1, qw.y, qw.energy): # Ensures that the action is valid
            qw.energize(qw.x + 1, qw.y, qw.energy) # Carries out the action if valid
`;

export default function Editor() {
    const { user } = useContext(AuthContext);

    interface Bot {
        id: string;
        name: string;
    }

    interface PlayerData {
        bots?: Bot[];
    }

    const [playerData, setPlayerData] = useState<PlayerData>({});

    const fetchPlayerData = async () => {
        const data = await getUserInfo();
        console.log(data);
        setPlayerData(data || {});
    };

    useEffect(() => {
        fetchPlayerData();
    }, [user]);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "0",
                maxWidth: "100vw",
                maxHeight: "calc(100vh - 70px)",
            }}>
            {playerData.bots?.length == 0 ? <h2>You do not have any bots!</h2> : playerData.bots?.map((bot: any) => {
                return (
                    <h2 key={bot.id} style={{ margin: "10px" }}>
                        {bot.name}
                    </h2>
                );
            })}
            <button onClick={async () => {await createBot(prompt("Enter bot name"));fetchPlayerData()}}>
                Create a Bot!
            </button>
        </div>
    );
}
