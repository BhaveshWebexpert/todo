import 'dotenv/config'

const config = {
    connectionURL : process.env.CONNECTION_URL ,
    jwt_token : process.env.JWT_SECRET
}

export default config;