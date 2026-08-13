/**
 * =====================================================
 * JL JEWELLERS ERP
 * Billing Calculator
 * =====================================================
 *
 * This file calculates ONE bill item.
 * It does NOT save anything to the database.
 * It only performs calculations.
 */

/**
 * Calculate one bill item
 */
const calculateBillItem = ({
    quantity = 1,
    net_weight,
    rate,
    making_charge_percent,
    discount = 0
}) => {

    // Step 1
    const metal_value = Number(
        (net_weight * rate).toFixed(2)
    );

    // Step 2
    const making_charge = Number(
        ((metal_value * making_charge_percent) / 100).toFixed(2)
    );

    // Step 3
    const taxable_value = Number(
        (metal_value + making_charge).toFixed(2)
    );

    // Step 4
    const gst_metal = Number(
        ((metal_value * 3) / 100).toFixed(2)
    );

    // Step 5
    const gst_making = Number(
        ((making_charge * 5) / 100).toFixed(2)
    );

    // Step 6
    const total_payable = Number(
        (
            taxable_value +
            gst_metal +
            gst_making -
            discount
        ).toFixed(2)
    );

    return {

        quantity,

        net_weight,

        rate,

        metal_value,

        making_charge,

        making_charge_percent,

        taxable_value,

        gst_metal,

        gst_making,

        discount,

        line_total: total_payable

    };

};

export {
    calculateBillItem
};

// Default export mirrors the named exports, so both
// `import x from` and `import { a } from` work.
export default {
    calculateBillItem,
};
