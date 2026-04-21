/**
 * Usage:
 *   validate((body) => {
 *       if (!body.email) return "Email is required";
 *   })
 */
function validate(fn) {
    return (req, res, next) => {
        const error = fn(req.body);
        if (error) return res.status(400).json({ error });
        next();
    };
}

module.exports = validate;