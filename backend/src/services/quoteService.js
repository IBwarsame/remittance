const RATES = { Somalia: 34, Ethiopia: 48.5 };
const FEE_PERCENTAGE = 0.02;
class QuoteService {
    calculate({ country, amountInGbp }) {
        if (
            (country !== "Somalia" && country !== "Ethiopia") ||
            typeof amountInGbp !== "number" ||
            amountInGbp <= 0
        ) {
            throw new Error(
                "Invalid input. Expected { country: 'Somalia'|'Ethiopia', amountInGbp: number > 0 }"
            );
        }

        const rate = RATES[country];
        const feeGbp = amountInGbp * FEE_PERCENTAGE;
        const amountOut = (amountInGbp - feeGbp) * rate;

        return {
            country,
            amountInGbp,
            feeGbp: parseFloat(feeGbp.toFixed(2)),
            feePercentage: FEE_PERCENTAGE * 100,
            rate,
            amountOut: parseFloat(amountOut.toFixed(2)),
            expiresInMinutes: 10,
        };
    }
}

module.exports = QuoteService;