import SubcategoryRepository from './subcategory.repository.js';
import CategoryRepository from './category.repository.js';
import { ApiError } from '../../utils/ApiError.js';

class SubcategoryService {
    async createSubcategory(data) {
        if (!data.category_id || !data.subcategory_code || !data.subcategory_name) {
            throw new ApiError(400, "category_id, subcategory_code, and subcategory_name are required");
        }

        const category = await CategoryRepository.findById(data.category_id);
        if (!category) {
             throw new ApiError(404, "Parent category not found");
        }

        const existingCode = await SubcategoryRepository.findByCode(data.subcategory_code);
        if (existingCode) {
            throw new ApiError(409, "Subcategory with this code already exists");
        }

        const subcategoryId = await SubcategoryRepository.create(data);
        return await SubcategoryRepository.findById(subcategoryId);
    }

    async getSubcategoriesByCategory(categoryId) {
        const category = await CategoryRepository.findById(categoryId);
        if (!category) {
             throw new ApiError(404, "Parent category not found");
        }
        return await SubcategoryRepository.findAllByCategoryId(categoryId);
    }

    async getSubcategoryById(id) {
        const subcategory = await SubcategoryRepository.findById(id);
        if (!subcategory) {
            throw new ApiError(404, "Subcategory not found");
        }
        return subcategory;
    }

    async updateSubcategory(id, data) {
        const existingSub = await SubcategoryRepository.findById(id);
        if (!existingSub) {
            throw new ApiError(404, "Subcategory not found");
        }

        if (data.subcategory_code && data.subcategory_code !== existingSub.subcategory_code) {
            const codeTaken = await SubcategoryRepository.findByCode(data.subcategory_code);
            if (codeTaken) {
                throw new ApiError(409, "Subcategory code is already in use");
            }
        }

        if (data.category_id && data.category_id !== existingSub.category_id) {
             const category = await CategoryRepository.findById(data.category_id);
             if (!category) {
                  throw new ApiError(404, "New parent category not found");
             }
        }

        const affectedRows = await SubcategoryRepository.update(id, data);
        if (affectedRows === 0) {
            throw new ApiError(500, "Failed to update subcategory");
        }

        return await SubcategoryRepository.findById(id);
    }

    async deleteSubcategory(id) {
        const subcategory = await SubcategoryRepository.findById(id);
        if (!subcategory) {
            throw new ApiError(404, "Subcategory not found");
        }

        try {
            await SubcategoryRepository.delete(id);
        } catch (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                throw new ApiError(400, "Cannot delete subcategory because it contains products");
            }
            throw error;
        }

        return true;
    }
}

export default new SubcategoryService();
