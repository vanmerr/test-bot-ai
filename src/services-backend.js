
require('dotenv').config();
const axios = require('axios');

const services = {
    summaryService :  async (user, inputs = {}, response_mode = "blocking") => {
        try {
            const headers = {
                "Authorization": `Bearer ${process.env.KEY_SUMMARY_AI}`,
                "Content-Type": "application/json"
            };
            const body = {
                inputs,
                response_mode,
                user,
            };
            const response = await fetch(`${process.env.BASE_URL}/workflows/run`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body)
            });
            const data = await response.json();
            return data;

        } catch (error) {
            return {message: error.message}
        }
    },
}
    
module.exports =  services;