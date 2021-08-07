const userQueryService = require('../infrastructure/services/userQueryService');
const bcrypt = require('bcrypt');
const accessTokenValidator = require('../../private_modules/validators/accessTokenValidator');
const log4js = require('../../private_modules/default/logerHandler/log4js');
const userDtoService = require('../infrastructure/DTO/userDto');

const logger = log4js.log();
const loggerConsole = logger.getLogger();
const loggerWarn = logger.getLogger('fileWarn');
const loggerErr = logger.getLogger('fileErr');

class UserService {
  async logIn(params) {
    // log in a user
    let ERROR;
    const user = await userQueryService.getUserDataAndRole(params);
    let userDirection;
    // validate that the user exist and the password
    if (user.length != 0) {
      userDirection = await userQueryService.getUserDirection(user[0].user_id);
      const passwordIsOk = bcrypt.compareSync(
        params.password,
        user[0].user_password
      );
      // generate the user token
      if (passwordIsOk) {
        delete user[0].user_password;
        const token = accessTokenValidator.generateToken(user[0]);
        const response = userDtoService.getUserLogin(
          user[0],
          userDirection[0],
          token
        );
        return response;
      } else {
        ERROR = 'Invalid password';
        loggerConsole.warn(ERROR);
        loggerWarn.warn(ERROR);
        return {
          ERROR,
        };
      }
    } else {
      ERROR = 'Invalid user';
      loggerConsole.warn(ERROR);
      loggerWarn.warn(ERROR);
      return {
        ERROR,
      };
    }
  }

  async register(params) {
    // encrypt my password
    const hashPassword = bcrypt.hashSync(params.password, 10);
    try {
      const user = {
        user_email: params.email,
        user_password: hashPassword,
        user_first_name: params.personal_details.first_name,
        user_last_name: params.personal_details.last_name,
        user_phone_number: params.personal_details.phone_number,
        user_admin: params.personal_details.admin ? true : false,
      };
      // add the user to the DB
      const responseDb = await userQueryService.register(user);
      const userDirection = {
        user_direction_street:
          params.personal_details.delivery_direction.street,
        user_direction_house_number:
          params.personal_details.delivery_direction.house_number,
        user_direction_postal_code:
          params.personal_details.delivery_direction.postal_code,
        user_direction_floor: params.personal_details.delivery_direction.floor,
        user_direction_department:
          params.personal_details.delivery_direction.department,
        user_id: responseDb[0],
      };
      // add user direction to DB
      await userQueryService.addDirection(userDirection);
      const response = await userDtoService.getUserRegister(
        user,
        userDirection,
        responseDb
      );
      return response;
    } catch (err) {
      loggerConsole.error(err);
      loggerErr.error('Error in register');
      return 'Error in register';
    }
  }
}

module.exports = new UserService();
