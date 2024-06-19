
require('dotenv').config();
const axios = require('axios');
 
const services = {
    glossaryService :  async (user, inputs = {
        lessonId : "",
        conceptComputerScience : "",
        conceptScience : "",
        conceptTech : "",
        conceptEngineering : "",
        conceptArt : "",
        concepMath : ""
    }, response_mode = "blocking") => {
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
    quizService : async (user, inputs = {
        lessonId : "",
        lessonImage: "",
        lessonTopic: "",
        lessonGoal : "",
        levelDescription : "",
        projectDescription : "",
        projectTools : "",
        conceptComputerScience : "",
        conceptScience : "",
        conceptTech : "",
        conceptEngineering : "",
        conceptArt : "",
        concepMath : "",
        previousConcepts : "",
        rememberCheckQuestionNum : "",
        undersandCheckQuestionNum : "",
        applyCheckQuestionNum : "",
        analyzeCheckQuestionNum : "",
        evaluateCheckQuestionNum : "",
        createCheckQuestionNum : "",
        questionTypes: "",
    }, response_mode = 'blocking') => {
        try {
            const headers = {
                "Authorization": `Bearer ${process.env.KEY_QUIZ_AI}`,
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
    projectInstructionService :  async (user, inputs = {
        lessonId : "",
        lessonImage: "",
        lessonTopic: "",
        lessonGoal : "",
        levelDescription : "",
        projectDescription : "",
        projectTools : "",
        previousConcepts : "",
        conceptComputerScience : "",
        conceptScience : "",
        conceptTech : "",
        conceptEngineering : "",
        conceptArt : "",
        concepMath : "",
    }, response_mode = "blocking") => {
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
    activityService :  async (user, inputs = {}, response_mode = "blocking") => {
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