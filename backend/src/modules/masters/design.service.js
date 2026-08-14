import DesignRepository from './design.repository.js';
import { ApiError } from '../../utils/ApiError.js';

class DesignService {
    async createDesign(data) {
        if (!data.design_code || !data.design_name) {
            throw new ApiError(400, "design_code and design_name are required");
        }

        const existingCode = await DesignRepository.findByCode(data.design_code);
        if (existingCode) {
            throw new ApiError(409, "Design with this code already exists");
        }

        const designId = await DesignRepository.create(data);
        return await DesignRepository.findById(designId);
    }

    async getAllDesigns() {
        return await DesignRepository.findAll();
    }

    async getDesignById(id) {
        const design = await DesignRepository.findById(id);
        if (!design) {
            throw new ApiError(404, "Design not found");
        }
        return design;
    }

    async updateDesign(id, data) {
        const existingDesign = await DesignRepository.findById(id);
        if (!existingDesign) {
            throw new ApiError(404, "Design not found");
        }

        if (data.design_code && data.design_code !== existingDesign.design_code) {
            const codeTaken = await DesignRepository.findByCode(data.design_code);
            if (codeTaken) {
                throw new ApiError(409, "Design code is already in use");
            }
        }

        const affectedRows = await DesignRepository.update(id, data);
        if (affectedRows === 0) {
            throw new ApiError(500, "Failed to update design");
        }

        return await DesignRepository.findById(id);
    }

    async deleteDesign(id) {
        const design = await DesignRepository.findById(id);
        if (!design) {
            throw new ApiError(404, "Design not found");
        }

        try {
            await DesignRepository.delete(id);
        } catch (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                throw new ApiError(400, "Cannot delete design because it is referenced in products or inventory");
            }
            throw error;
        }

        return true;
    }
}

export default new DesignService();
