class UserDtoService {
  async getUserRegister(user, userDirection, responseDb) {
    // returns the correct information after user registration
    const response = {
      user: {
        id_user: responseDb[0],
        email: user.user_email,
        personal_details: {
          first_name: user.user_first_name,
          last_name: user.user_last_name,
          phone_number: user.user_phone_number,
          admin: user.user_admin,
          delivery_direction: {
            street: userDirection.user_direction_street,
            house_number: userDirection.user_direction_house_number,
            postal_code: userDirection.user_direction_postal_code,
            floor: userDirection.user_direction_floor,
            department: userDirection.user_direction_department,
          },
        },
      },
    };
    return response;
  }

  async getUserLogin(user, userDirection, token) {
    // returns the correct information after user log in
    const response = {
      user: {
        id: user.user_id,
        email: user.user_email,
        access_token: token,
        user_role: {
          admin: user.user_admin ? true : false,
        },
        personal_details: {
          first_name: user.user_first_name,
          last_name: user.user_last_name,
          phone_number: user.user_phone_number,
          delivery_direction: {
            street: userDirection.user_direction_street,
            house_number: userDirection.user_direction_house_number,
            postal_code: userDirection.user_direction_postal_code,
            floor: userDirection.user_direction_floor,
            department: userDirection.user_direction_department,
          },
        },
      },
    };
    return response;
  }
}

module.exports = new UserDtoService();
