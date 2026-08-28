import metalRateService from "./metalRate.service.js";

const updateMetalRate = async (req, res) => {

    try {

        const result = await metalRateService.updateMetalRate(
            req.body.metal_type,
            req.body.rate,
            req.user.user_id,
            req.body.financial_pin
        );

        res.status(200).json(result);

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

const getLatestRate = async (req, res) => {

    try {

        const result = await metalRateService.getLatestRate(
            req.params.metal_type
        );

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export {
    updateMetalRate,
    getLatestRate
};

export default {
    updateMetalRate,
    getLatestRate
};