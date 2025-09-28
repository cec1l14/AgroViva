import jwt from 'jsonwebtoken';

function isAuthenticated(req, res, next) {
    try {
        const { authorization } = req.headers;
        if (!authorization) throw new Error('Token ausente');

        const [, token] = authorization.split(' ');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ auth: false, message: 'Token inválido ou ausente' });
    }
}

export { isAuthenticated };