import { GameSettings } from "../assets/Scripts/Data/GameSettings";
import { merge, unset } from "lodash";
import { readFileSync, writeFileSync } from "fs";
import { ItemType } from "../assets/Scripts/Game/Enums";
import { InventoryItem } from "../assets/Scripts/Game/InventoryItem";

regenerateGameSettings();
function regenerateGameSettings(): void {
    const settingsPath: string = process.argv[2];
    let templateSettings: GameSettings = new GameSettings();
    const savedSettingsJson: string = readFileSync(settingsPath, "utf8");
    const savedSettings: GameSettings = <GameSettings>JSON.parse(savedSettingsJson);
    deleteUnusedProperties(templateSettings, savedSettings);
    const result: GameSettings = merge(templateSettings, savedSettings);

    writeFileSync(settingsPath, JSON.stringify(result));
}

function deleteUnusedProperties(templateSettings: GameSettings, savedSettings: GameSettings): void {
    const templateKeys: string[] = getAllKeys(templateSettings);
    const usedSettings: string[] = getAllKeys(savedSettings);

    usedSettings.forEach((key) => {
        if (key.match(/.\d+/)) return; // ignore arrays

        if (!templateKeys.includes(key)) {
            console.log("Removing unused property " + key);
            unset(savedSettings, key);
        }
    });
}

function getAllKeys(objectWithKeys: any, prefix = ""): string[] {
    if (typeof objectWithKeys === "string") return [];

    const keys: string[] = [];
    const objectKeys: string[] = Object.keys(objectWithKeys);

    for (let i = 0; i < objectKeys.length; i++) {
        keys.push(...getAllKeys(objectWithKeys[objectKeys[i]], `${prefix}${objectKeys[i]}.`));
        keys.push(`${prefix}${objectKeys[i]}`);
    }

    return keys;
}
