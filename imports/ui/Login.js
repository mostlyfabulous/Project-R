import React from 'react';

class Login extends React.Component {


    render() {
        return (
          <template name="register">
            <h2>Register</h2>
              <form class="register">
                <p>Email: <input type="email" name="email"></p>
                <p>Password: <input type="password" name="password"></p>
                <p><input type="submit" value="Register"></p>
              </form>
          </template>
        )
    }
}

export default Sidebar;
