import { Crop } from "../assets/Scripts/Game/Crop";
import { ItemType, getPlantableConfig, PlantableConfig, PlotState, getConfigBySeed } from "../assets/Scripts/Game/Enums";
import { FarmPlot } from "../assets/Scripts/Game/FarmPlot";
import { Inventory } from "../assets/Scripts/Game/Inventory";

const tomatoSeed = ItemType.TomatoSeed;
const blueberrySeed = ItemType.BlueberrySeed;
const tomatoConfig = getConfigBySeed(tomatoSeed) as PlantableConfig; // Dùng getConfigBySeed để chắc chắn
const blueberryConfig = getConfigBySeed(blueberrySeed) as PlantableConfig;

describe('FarmPlot', () => {
    let plot: FarmPlot;
    let inventory: Inventory; // <<< Thêm biến inventory

    beforeEach(() => {
        plot = new FarmPlot();
        inventory = new Inventory(); // <<< Tạo inventory mới cho mỗi test
        // Thêm sẵn một ít hạt giống vào kho để test
        inventory.addItem(tomatoSeed, 5);
        inventory.addItem(blueberrySeed, 3);
    });

    it('Khởi tạo ô đất trống', () => {
        expect(plot.getCurrentState()).toBe(PlotState.Empty);
        expect(plot.getPlantedItem()).toBeNull();
    });

    // --- Test plant() ---
    it('plant thành công trên ô đất trống và đủ hạt giống', () => {
        const initialSeedCount = inventory.getItemQuantity(tomatoSeed);
        const success = plot.plant(tomatoSeed, inventory); // <<< Truyền inventory vào

        expect(success).toBe(true);
        expect(plot.getCurrentState()).toBe(PlotState.Growing);
        expect(plot.getPlantedItem()).toBeInstanceOf(Crop);
        expect(plot.getPlantedItem()?.getConfig().itemType).toBe(ItemType.Tomato);
        // Kiểm tra xem hạt giống đã bị trừ chưa
        expect(inventory.getItemQuantity(tomatoSeed)).toBe(initialSeedCount - 1);
    });

    it('plant thất bại trên ô đất không trống (không trừ hạt giống)', () => {
        plot.plant(tomatoSeed, inventory); // Trồng lần 1 thành công
        const initialSeedCount = inventory.getItemQuantity(blueberrySeed);
        const success = plot.plant(blueberrySeed, inventory); // Trồng lần 2 thất bại

        expect(success).toBe(false);
        expect(plot.getCurrentState()).toBe(PlotState.Growing); // Vẫn là Growing
        expect(plot.getPlantedItem()?.getConfig().itemType).toBe(ItemType.Tomato); // Vẫn là cà chua
        // Hạt giống không bị trừ đi
        expect(inventory.getItemQuantity(blueberrySeed)).toBe(initialSeedCount);
    });

    it('plant thất bại nếu không đủ hạt giống', () => {
        const initialSeedCount = inventory.getItemQuantity(blueberrySeed); // = 3
        inventory.removeItem(blueberrySeed, initialSeedCount); // Làm cho hết hạt việt quất
        expect(inventory.hasItem(blueberrySeed)).toBe(false); // Kiểm tra đã hết

        const success = plot.plant(blueberrySeed, inventory);
        expect(success).toBe(false);
        expect(plot.getCurrentState()).toBe(PlotState.Empty); // Vẫn trống
        expect(plot.getPlantedItem()).toBeNull();
        expect(inventory.getItemQuantity(blueberrySeed)).toBe(0); // Vẫn là 0
    });

    it('plant thất bại nếu không tìm thấy config cho hạt giống (không trừ hạt giống)', () => {
        const initialMilkCount = inventory.getItemQuantity(ItemType.Milk);
        const success = plot.plant(ItemType.Milk, inventory); // Milk không phải seed hợp lệ

        expect(success).toBe(false);
        expect(plot.getCurrentState()).toBe(PlotState.Empty);
        expect(plot.getPlantedItem()).toBeNull();
        expect(inventory.getItemQuantity(ItemType.Milk)).toBe(initialMilkCount); // Không thay đổi kho
    });

    // --- Các test case khác (update, harvest, decay, clearPlot) ---
    // Các test này không trực tiếp gọi plant nên không cần thay đổi nhiều,
    // nhưng phải đảm bảo chúng bắt đầu với trạng thái plot đã được trồng đúng cách (nếu cần)
    // Ví dụ:
    it('update chuyển trạng thái từ Growing sang ReadyToHarvest', () => {
        plot.plant(tomatoSeed, inventory); // Trồng thành công
        plot.update(tomatoConfig.harvestInterval - 1);
        expect(plot.getCurrentState()).toBe(PlotState.Growing);
        plot.update(1);
        expect(plot.getCurrentState()).toBe(PlotState.HasFruit);
    });

    it('harvest thành công từ trạng thái ReadyToHarvest', () => {
        plot.plant(tomatoSeed, inventory);
        plot.update(tomatoConfig.harvestInterval);
        const harvested = plot.harvest();
        expect(harvested).toBe(ItemType.Tomato);
        expect(plot.getCurrentState()).toBe(PlotState.Growing);
    });

    it('harvest lần cuối, chuyển sang HarvestedWaitingDecay', () => {
        plot.plant(tomatoSeed, inventory); // Trồng
        const crop = plot.getPlantedItem()!;
        (crop as any).currentYield = tomatoConfig.maxYield - 1; // Giả lập gần hết
        plot.update(tomatoConfig.harvestInterval); // Sẵn sàng lần cuối

        plot.harvest(); // Thu hoạch lần cuối
        expect(crop.canHarvest()).toBe(true);
        expect(plot.getCurrentState()).toBe(PlotState.ReadyToHarvest);
        expect(plot.getDecayTimerMinutes()).toBeGreaterThan(0);
    });

    it('update giảm decayTimer và chuyển sang Empty khi hết giờ', () => {
        // Thiết lập trạng thái chờ phân hủy
        plot.plant(tomatoSeed, inventory);
        const crop = plot.getPlantedItem()!;
        (crop as any).currentYield = tomatoConfig.maxYield;
        (crop as any).isDepleted = true;
        (plot as any).currentState = PlotState.ReadyToHarvest;
        const decayMinutes = tomatoConfig.decayTimeAfterFinalHarvest * 60;
        (plot as any).decayTimerMinutes = decayMinutes;

        plot.update(decayMinutes); // Cho thời gian trôi qua đúng bằng thời gian phân hủy
        expect(plot.getCurrentState()).toBe(PlotState.Empty);
        expect(plot.getPlantedItem()).toBeNull();
    });

    it('clearPlot xóa cây và reset trạng thái về Empty', () => {
        plot.plant(tomatoSeed, inventory);
        plot.clearPlot();
        expect(plot.getCurrentState()).toBe(PlotState.Empty);
        expect(plot.getPlantedItem()).toBeNull();
    });

});