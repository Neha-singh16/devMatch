const auth =  (req ,res , next) => {
    console.log("Auth Middlewarw");
    const token = "xyz";
    const isAuthenticated = token === "xyz";
    if(!isAuthenticated){
        res.status(401).send("Not Authenticated");
    }else{
        next();
        // res.send("user Auth");
        
    }    
}

module.exports = {
    auth,
}