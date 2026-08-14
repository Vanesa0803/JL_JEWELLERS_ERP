import CategoryRepository from './category.repository.js';
import { ApiError } from '../../utils/ApiError.js';

class CategoryService {
    async createCategory(data) {
        if (!data.category_code || !data.category_name) {
            throw new ApiError(400, "category_code and category_name are required");
        }

        const existingCode = await CategoryRepository.findByCode(data.category_code);
        if (existingCode) {
            throw new ApiError(409, "Category with this code already exists");
        }

        const categoryId = await CategoryRepository.create(data);
        return await CategoryRepository.findById(categoryId);
    }

    async getAllCategories() {
        return await CategoryRepository.findAll();
    }

    async getCategoryById(id) {
        const category = await CategoryRepository.findById(id);
        if (!category) {
            throw new ApiError(404, "Category not found");
        }
        return category;
    }

    async updateCategory(id, data) {
        const existingCategory = await CategoryRepository.findById(id);
        if (!existingCategory) {
            throw new ApiError(404, "Category not found");
        }

        if (data.category_code && data.category_code !== existingCategory.category_code) {
            const codeTaken = await CategoryRepository.findByCode(data.category_code);
            if (codeTaken) {
                throw new ApiError(409, "Category code is already in use");
            }
        }

        const affectedRows = await CategoryRepository.update(id, data);
        if (affectedRows === 0) {
            throw new ApiError(500, "Failed to update category");
        }

        return await CategoryRepository.findById(id);
    }

    async deleteCategory(id) {
        const category = await CategoryRepository.findById(id);
        if (!category) {
            throw new ApiError(404, "Category not found");
        }

        try {
            await CategoryRepository.delete(id);
        } catch (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                throw new ApiError(400, "Cannot delete category because it contains subcategories or products");
            }
            throw error;
        }

        return true;
    }
}

export default new CategoryService();
