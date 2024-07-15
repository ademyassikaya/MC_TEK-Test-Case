// AUTH CONTROLLER
import login from "./auth/login.controller.js";
import register from "./auth/register.controller.js";
// DRAW CONTROLLER
import createDraw from "./draw/createDraw.controller.js";
import deleteDraw from "./draw/deleteDraw.controller.js";
import getDraws from "./draw/getDraws.controller.js";
import getDraw from "./draw/getDraw.controller.js";
import updateDraw from "./draw/updateDraw.controller.js";

const controller = {
  auth: {
    login,
    register,
  },
  draw: {
    createDraw,
    deleteDraw,
    getDraws,
    getDraw,
    updateDraw,
  },
};

export default controller;
