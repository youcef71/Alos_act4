const instance = require("./tokenfile");

export const login = async (data) => {
  try {
    const answ = await instance.post("/v2/login", data);
    return answ;
  } catch (err) {
    throw err;
  }
};

export const signup = async (data) => {
  try {
    const answ = await instance.post("/v2/register", data);
    return answ;
  } catch (err) {
    throw err;
  }
};