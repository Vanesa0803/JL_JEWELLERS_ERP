import MetalTypeRepository from '../repositories/metalType.repository.js';
import { ApiError } from '../utils/ApiError.js';

class MetalTypeService {
    async createMetalType(data) {
        if (!data.metal_code || !data.metal_name) {
            throw new ApiError(400, "metal_code and metal_name are required");
        }

        const existingCode = await MetalTypeRepository.findByCode(data.metal_code);
        if (existingCode) {
            throw new ApiError(409, "Metal type with this code already exists");
        }

        const metalId = await MetalTypeRepository.create(data);
        return await MetalTypeRepository.findById(metalId);
    }

    async getAllMetalTypes() {
        return await MetalTypeRepository.findAll();
    }

    async getMetalTypeById(id) {
        const metal = await MetalTypeRepository.findById(id);
        if (!metal) {
            throw new ApiError(404, "Metal type not found");
        }
        return metal;
    }

    async updateMetalType(id, data) {
        const existingMetal = await MetalTypeRepository.findById(id);
        if (!existingMetal) {
            throw new ApiError(404, "Metal type not found");
        }

        if (data.metal_code && data.metal_code !== existingMetal.metal_code) {
            const codeTaken = await MetalTypeRepository.findByCode(data.metal_code);
            if (codeTaken) {
                throw new ApiError(409, "Metal code is already in use");
            }
        }

        const affectedRows = await MetalTypeRepository.update(id, data);
        if (affectedRows === 0) {
            throw new ApiError(500, "Failed to update metal type");
        }

        return await MetalTypeRepository.findById(id);
    }

    async deleteMetalType(id) {
        const metal = await MetalTypeRepository.findById(id);
        if (!metal) {
            throw new ApiError(404, "Metal type not found");
        }

        try {
            await MetalTypeRepository.delete(id);
        } catch (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                throw new ApiError(400, "Cannot delete metal type because it is referenced in products or inventory");
            }
            throw error;
        }

        return true;
    }
}

export default new MetalTypeService();
