

export const createCode = async (next) => {
    
    try {
        let code;

        do {
            code = generateCode();

            visit = await Visit.findOne({ visitCode: code });
        } while (visit)

        return code;
    }

    catch (error) {
        next(error)
    }
}