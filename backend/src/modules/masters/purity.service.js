import PurityRepository from './purity.repository.js';
import { ApiError } from '../../utils/ApiError.js';

class PurityService {
    async createPurity(data) {
        if (!data.purity_code || !data.purity_name) {
            throw new ApiError(400, "purity_code and purity_name are required");
        }

        const existingCode = await PurityRepository.findByCode(data.purity_code);
        if (existingCode) {
            throw new ApiError(409, "Purity with this code already exists");
        }

        const purityId = await PurityRepository.create(data);
        return await PurityRepository.findById(purityId);
    }

    async getAllPurity() {
        return await PurityRepository.findAll();
    }

    async getPurityById(id) {
        const purity = await PurityRepository.findById(id);
        if (!purity) {
            throw new ApiError(404, "Purity not found");
        }
        return purity;
    }

    async updatePurity(id, data) {
        const existingPurity = await PurityRepository.findById(id);
        if (!existingPurity) {
            throw new ApiError(404, "Purity not found");
        }

        if (data.purity_code && data.purity_code !== existingPurity.purity_code) {
            const codeTaken = await PurityRepository.findByCode(data.purity_code);
            if (codeTaken) {
                throw new ApiError(409, "Purity code is already in use");
            }
        }

        const affectedRows = await PurityRepository.update(id, data);
        if (affectedRows === 0) {
            throw new ApiError(500, "Failed to update purity");
        }

        return await PurityRepository.findById(id);
    }

    async deletePurity(id) {
        const purity = await PurityRepository.findById(id);
        if (!purity) {
            throw new ApiError(404, "Purity not found");
        }

        try {
            await PurityRepository.delete(id);
        } catch (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                throw new ApiError(400, "Cannot delete purity because it is referenced in products or inventory");
            }
            throw error;
        }

        return true;
    }
}

export default new PurityService();
