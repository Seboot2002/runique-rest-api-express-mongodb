const jwt = require("jsonwebtoken");

async function verifyToken(req, res, next){

    const authHeader = await req.headers['authorization']

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(403).send("No existe un token o es inválido");
    }
    
    const token = authHeader.split(" ")[1];
    
    try {
        const decoded = await jwt.verify(token, "myTotallySecretKey");
    
        req.token_usuarioId = decoded.id;
        next();
        
    } catch (error) {
        
        if (error.name === 'TokenExpiredError') return res.status(401).send("El token ha expirado");

        return res.status(401).send("Token inválido");
    }
    
}

module.exports = verifyToken;