import { Crop } from "../assets/Scripts/Game/Crop";
import { CropConfigs, ItemType, PlantableConfig } from "../assets/Scripts/Game/Enums";

const tomatoConfig = CropConfigs[ItemType.Tomato] as PlantableConfig;

describe('Crop', () => {
    let tomatoCrop: Crop;

    beforeEach(() => {
        // Tạo mới crop cho mỗi test case
        tomatoCrop = new Crop(tomatoConfig);
    });

    it('Khởi tạo đúng thông số ban đầu', () => {
        expect(tomatoCrop.getConfig()).toEqual(tomatoConfig);
        expect(tomatoCrop.getCurrentYield()).toBe(0);
        expect(tomatoCrop.getTimeToNextHarvest()).toBe(tomatoConfig.harvestInterval);
        expect(tomatoCrop.canHarvest()).toBe(false);
        expect(tomatoCrop.isReadyToHarvest()).toBe(false);
    });

    it('update giảm thời gian chờ thu hoạch', () => {
        tomatoCrop.update(5); // Trôi qua 5 phút
        expect(tomatoCrop.getTimeToNextHarvest()).toBe(tomatoConfig.harvestInterval - 5);
        expect(tomatoCrop.isReadyToHarvest()).toBe(false);
    });

    it('update làm cây sẵn sàng thu hoạch khi hết thời gian', () => {
        const ready = tomatoCrop.update(tomatoConfig.harvestInterval);
        expect(ready).toBe(true);
        expect(tomatoCrop.getTimeToNextHarvest()).toBe(0);
        expect(tomatoCrop.isReadyToHarvest()).toBe(true);
    });

    it('update không làm gì thêm khi đã sẵn sàng thu hoạch', () => {
        tomatoCrop.update(tomatoConfig.harvestInterval); // Sẵn sàng
        expect(tomatoCrop.getTimeToNextHarvest()).toBe(0);
        tomatoCrop.update(5); // Trôi thêm 5 phút
        expect(tomatoCrop.getTimeToNextHarvest()).toBe(0); // Vẫn là 0
        expect(tomatoCrop.isReadyToHarvest()).toBe(true);
    });

    it('harvest thành công khi đã sẵn sàng', () => {
        tomatoCrop.update(tomatoConfig.harvestInterval); // Làm cho sẵn sàng
        const harvestedItem = tomatoCrop.harvest();
        expect(harvestedItem).toBe(ItemType.Tomato);
        expect(tomatoCrop.getCurrentYield()).toBe(1);
        expect(tomatoCrop.getTimeToNextHarvest()).toBe(tomatoConfig.harvestInterval); // Reset timer
        expect(tomatoCrop.isReadyToHarvest()).toBe(false); // Không còn sẵn sàng nữa
        expect(tomatoCrop.canHarvest()).toBe(false);
    });

    it('harvest thất bại khi chưa sẵn sàng', () => {
        const harvestedItem = tomatoCrop.harvest();
        expect(harvestedItem).toBeNull();
        expect(tomatoCrop.getCurrentYield()).toBe(0);
    });

    it('harvest lần cuối cùng và đánh dấu isDepleted', () => {
        // Giả lập thu hoạch gần hết
        // Dùng cách truy cập trực tiếp để test (không nên làm trong code thường)
        (tomatoCrop as any).currentYield = tomatoConfig.maxYield - 1;
        tomatoCrop.update(tomatoConfig.harvestInterval); // Sẵn sàng cho lần cuối

        const harvestedItem = tomatoCrop.harvest();
        expect(harvestedItem).toBe(ItemType.Tomato);
        expect(tomatoCrop.getCurrentYield()).toBe(tomatoConfig.maxYield);
        expect(tomatoCrop.canHarvest()).toBe(true);
        // Thời gian không được reset nữa vì đã hết
        expect(tomatoCrop.getTimeToNextHarvest()).toBe(0); // Vẫn là 0 vì vừa thu hoạch xong
        expect(tomatoCrop.isReadyToHarvest()).toBe(false); // Không thể thu hoạch nữa

        // Thử harvest lần nữa sau khi depleted
        const harvestedAgain = tomatoCrop.harvest();
        expect(harvestedAgain).toBeNull();
        expect(tomatoCrop.getCurrentYield()).toBe(tomatoConfig.maxYield); // yield không tăng
    });

    it('update không làm gì khi đã isDepleted', () => {
        (tomatoCrop as any).currentYield = tomatoConfig.maxYield;
        (tomatoCrop as any).isDepleted = true;
        (tomatoCrop as any).timeToNextHarvest = 0; // Giả sử vừa thu hoạch xong

        const ready = tomatoCrop.update(100); // Trôi qua 100 phút
        expect(ready).toBe(false);
        expect(tomatoCrop.getTimeToNextHarvest()).toBe(0); // Thời gian không đổi
        expect(tomatoCrop.isReadyToHarvest()).toBe(false); // Không thể sẵn sàng nữa
    });

    it('ném lỗi nếu config là null hoặc undefined', () => {
        expect(() => new Crop(null as any)).toThrow("Config không được phép null hoặc undefined");
        expect(() => new Crop(undefined as any)).toThrow("Config không được phép null hoặc undefined");
    });
});