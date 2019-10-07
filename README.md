## Hosted on Heroku at https://personalstockapp.herokuapp.com/

# Running Local

## Requirements
- MongoDB
- Enviroment variables
    - Set `MONGODB_URI` in your `.env` to the url of your local mongodb database 
    - Set `API_KEY` to the key received when creating an account at [IEX Cloud](https://iexcloud.io/)

## Commands
- After cloning the repo run `npm install` within the folder
- To run the the client and server in development mode run `npm run dev`
- To run just the client issue the command `npm run client`
- To run the server in 'production mode' issue the command `npm run build && npm run start` 

To do
- [ ] Test endpoints
- [ ] Define prop types for components
