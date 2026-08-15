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
 * Calculate one bill item.
 *
 * S2-3 — QUANTITY WAS BEING IGNORED
 * ---------------------------------
 * `quantity` was accepted, returned in the result, and never used in a single
 * calculation. The metal value was `net_weight * rate`, so a line for two
 * identical rings was charged as one.
 *
 * That undercharged every multi-quantity line on every bill, silently — the
 * arithmetic looks perfectly reasonable unless you multiply it out by hand,
 * and nothing in the totals hints that a quantity was dropped.
 *
 * `net_weight` is the weight of ONE piece, which is how a jeweller records it,
 * so the line weight is net_weight × quantity.
 *
 * Found by making the billing screen calculate the same figures and comparing:
 * the screen said ₹1,16,320 and the server stored ₹60,320 for the same two
 * lines. Neither was wrong about its own arithmetic; they disagreed about
 * whether quantity counts.
 */
const calculateBillItem = ({
    quantity = 1,
    net_weight,
    rate,
    making_charge_percent,
    discount = 0
}) => {

    const line_quantity = Number(quantity) || 1;

    // Step 1 — weight of one piece × rate × how many pieces
    const metal_value = Number(
        (net_weight * rate * line_quantity).toFixed(2)
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

        quantity: line_quantity,

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
