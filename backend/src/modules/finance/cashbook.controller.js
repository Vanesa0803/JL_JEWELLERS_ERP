import cashBookService from "./cashbook.service.js";

const getCashBookStatement = async (req, res) => {

    try {

        const result =
            await cashBookService.getCashBookStatement();

        res.status(200).json({

            success: true,

            data: result

        });

    }

    catch (error) {

        res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

export {

    getCashBookStatement

};

// Default export mirrors the named exports, so both
// `import x from` and `import { a } from` work.
export default {
    getCashBookStatement,
};
