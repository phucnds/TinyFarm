import { Crop } from "../assets/Scripts/Game/Crop";
import { PlantableConfig, CropConfigs, ItemType } from "../assets/Scripts/Game/Enums";
import { FarmTechnology } from "../assets/Scripts/Game/FarmTechnology";

describe('Crop', () => {
    let tomatoConfig: PlantableConfig;
    let cowConfig: PlantableConfig;

    beforeAll(() => {
        tomatoConfig = CropConfigs[ItemType.Tomato]!;
        cowConfig = CropConfigs[ItemType.Cow]!;
        if (!tomatoConfig || !cowConfig) {
            throw new Error("Crop configs not found for testing");
        }
    });

    it('should initialize correctly', () => {
        const crop = new Crop(tomatoConfig);
        expect(crop.getConfig()).toBe(tomatoConfig);
        expect(crop.getCurrentYield()).toBe(0);
        expect(crop.ProducedItemCount).toBe(0); 
        expect(crop.getTimeToNextHarvest()).toBe(tomatoConfig.harvestInterval);
        expect(crop.getCanHarvest()).toBe(false);
    });

    it('should throw error if config is null', () => {
        expect(() => new Crop(null as any)).toThrow("Config null.");
    });

    it('should decrease timeToNextHarvest on update', () => {
        const crop = new Crop(tomatoConfig);
        crop.update(60); // 1 phút
        expect(crop.getTimeToNextHarvest()).toBe(tomatoConfig.harvestInterval - 60);
        expect(crop.ProducedItemCount).toBe(0);
        expect(crop.getCanHarvest()).toBe(false);
    });

    it('should produce an item when time reaches 0', () => {
        const crop = new Crop(tomatoConfig);
        const needsUpdate = crop.update(tomatoConfig.harvestInterval); // Đúng thời gian
        expect(needsUpdate).toBe(true); 
        expect(crop.getTimeToNextHarvest()).toBe(0); 
        expect(crop.getCurrentYield()).toBe(1);
        expect(crop.ProducedItemCount).toBe(1);
        expect(crop.getCanHarvest()).toBe(false); // Chưa đạt maxYield
    });

    it('should produce multiple items if enough time passes', () => {
        const crop = new Crop(tomatoConfig);
        // Giả lập thời gian trôi qua đủ cho 3 lần thu hoạch
        const timePassed = tomatoConfig.harvestInterval * 2.5;
        const needsUpdate1 = crop.update(tomatoConfig.harvestInterval);
        expect(needsUpdate1).toBe(true);
        expect(crop.ProducedItemCount).toBe(1);

        crop.resetTime();
        const needsUpdate2 = crop.update(tomatoConfig.harvestInterval); 
        expect(needsUpdate2).toBe(true);
        expect(crop.ProducedItemCount).toBe(2); 

        crop.resetTime();
        const needsUpdate3 = crop.update(tomatoConfig.harvestInterval * 0.5); 
        expect(needsUpdate3).toBe(false);
        expect(crop.ProducedItemCount).toBe(2);
        expect(crop.getTimeToNextHarvest()).toBeCloseTo(tomatoConfig.harvestInterval * 0.5);
    });


    it('should set canHarvest to true when maxYield is reached', () => {
        const crop = new Crop(tomatoConfig);
        // Giả lập sản xuất đến maxYield
        (crop as any).currentYield = tomatoConfig.maxYield - 1;
        (crop as any).producedItemCount = tomatoConfig.maxYield - 1;
        crop.resetTime(); 

        const needsUpdate = crop.update(tomatoConfig.harvestInterval);
        expect(needsUpdate).toBe(true);
        expect(crop.getCurrentYield()).toBe(tomatoConfig.maxYield);
        
        expect(crop.ProducedItemCount).toBe(tomatoConfig.maxYield);
        expect(crop.getCanHarvest()).toBe(true);
        expect(crop.getTimeToNextHarvest()).toBe(0); 
    });

    it('should return true from update if already canHarvest', () => {
        const crop = new Crop(tomatoConfig);
        (crop as any).canHarvest = true;
        (crop as any).timeToNextHarvest = 0;
        const needsUpdate = crop.update(100); 
        expect(needsUpdate).toBe(true);
        expect(crop.getTimeToNextHarvest()).toBe(0); 
    });

    it('should reset producedItemCount on harvest', () => {
        const crop = new Crop(tomatoConfig);
       
        (crop as any).producedItemCount = 5;
        (crop as any).currentYield = 5;

        const harvestedAmount = crop.harvest();
        expect(harvestedAmount).toBe(5);
        expect(crop.ProducedItemCount).toBe(0); 
        
        expect(crop.getCurrentYield()).toBe(5);
    });

    it('should reset timeToNextHarvest correctly', () => {
        const crop = new Crop(tomatoConfig);
        crop.update(tomatoConfig.harvestInterval); 
        expect(crop.getTimeToNextHarvest()).toBe(0);
        crop.resetTime();
        expect(crop.getTimeToNextHarvest()).toBe(tomatoConfig.harvestInterval);
    });
})


describe('FarmTechnology', () => {
    it('should initialize correctly', () => {
        const tech = new FarmTechnology(1, 500, 0.1);
        expect(tech.level).toBe(1);
        expect(tech.upgradeCost).toBe(500);
        expect(tech.multiply).toBe(0.1);
    });

    it('should calculate production multiplier correctly', () => {
        const tech1 = new FarmTechnology(1, 500, 0.1);
        expect(tech1.getProductionMultiplier()).toBeCloseTo(1.1); // Level 1 -> 1 + 1 * 0.1 = 1.1

        const tech5 = new FarmTechnology(5, 500, 0.1);
        expect(tech5.getProductionMultiplier()).toBeCloseTo(1.5); // Level 5 -> 1 + 5 * 0.1 = 1.5
    });

    it('should increase level on upgrade', () => {
        const tech = new FarmTechnology(2, 500, 0.1);
        tech.upgrade();
        expect(tech.level).toBe(3);
    });

    it('should not change upgradeCost on upgrade (based on commented code)', () => {
        const tech = new FarmTechnology(2, 500, 0.1);
        tech.upgrade();
        expect(tech.upgradeCost).toBe(500);
    });
});