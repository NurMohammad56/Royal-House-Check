export const generateCode = () => {
    const digits = '0123456789';
    let result = '';
    for (let i = 0; i < 3; i++) {
        result += digits.charAt(Math.floor(Math.random() * digits.length));
    }

    return result;
}