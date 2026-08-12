import StoneTypeRepository from '../repositories/stoneType.repository.js';
import { ApiError } from '../utils/ApiError.js';

class StoneTypeService {
    async createStoneType(data) {
        if (!data.stone_code || !data.stone_name) {
            throw new ApiError(400, "stone_code and stone_name are required");
        }

        const existingCode = await StoneTypeRepository.findByCode(data.stone_code);
        if (existingCode) {
            throw new ApiError(409, "Stone type with this code already exists");
        }

        const stoneId = await StoneTypeRepository.create(data);
        return await StoneTypeRepository.findById(stoneId);
    }

    async getAllStoneTypes() {
        return await StoneTypeRepository.findAll();
    }

    async getStoneTypeById(id) {
        const stone = await StoneTypeRepository.findById(id);
        if (!stone) {
            throw new ApiError(404, "Stone type not found");
        }
        return stone;
    }

    async updateStoneType(id, data) {
        const existingStone = await StoneTypeRepository.findById(id);
        if (!existingStone) {
            throw new ApiError(404, "Stone type not found");
        }

        if (data.stone_code && data.stone_code !== existingStone.stone_code) {
            const codeTaken = await StoneTypeRepository.findByCode(data.stone_code);
            if (codeTaken) {
                throw new ApiError(409, "Stone code is already in use");
            }
        }

        const affectedRows = await StoneTypeRepository.update(id, data);
        if (affectedRows === 0) {
            throw new ApiError(500, "Failed to update stone type");
        }

        return await StoneTypeRepository.findById(id);
    }

    async deleteStoneType(id) {
        const stone = await StoneTypeRepository.findById(id);
        if (!stone) {
            throw new ApiError(404, "Stone type not found");
        }

        try {
            await StoneTypeRepository.delete(id);
        } catch (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                throw new ApiError(400, "Cannot delete stone type because it is referenced in products or inventory");
            }
            throw error;
        }

        return true;
    }
}

export default new StoneTypeService();
