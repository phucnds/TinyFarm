import { SpriteFrame, resources, ImageAsset, Texture2D } from "cc";
import { ItemType } from "../Game/Enums";

export function loadItemSprite(itemID: ItemType, callback: (spriteFrame: SpriteFrame | null) => void) {
    const itemName = ItemType[itemID];
    const path = `items/${itemName}`;

    resources.load(path, ImageAsset, (err, image) => {
        if (err) {
            console.error(`Failed to load item sprite at path: ${path}`, err);
            callback(null);

        } else {

            const texture = new Texture2D();
            texture.image = image;


            const spriteFrame = new SpriteFrame();
            spriteFrame.texture = texture;

            callback(spriteFrame);
        }
    });
}