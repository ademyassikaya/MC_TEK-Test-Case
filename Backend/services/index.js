// AUTH SERVİCES
import login from "./auth/login.service.js";
import register from "./auth/register.service.js";

// DRAW SERVİCES
import createDraw from "./draw/createDraw.service.js";
import deleteDraw from "./draw/deleteDraw.service.js";
import getDraw from "./draw/getDraw.service.js";
import getDraws from "./draw/getDraws.service.js";
import updateDraw from "./draw/updateDraw.service.js";

const services = {
  user: {
    register,
    login,
  },
  draw: {
    createDraw,
    updateDraw,
    deleteDraw,
    getDraws,
    getDraw,
  },
};

export default services;
