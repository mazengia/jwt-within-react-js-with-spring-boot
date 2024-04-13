// AuthService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080';
const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

class AuthService {
    login(values) {
        return axios
            .post(`${API_URL}/users/sign-in`, values)
            .then(response => {
                window.sessionStorage.removeItem(TOKEN_KEY);
                window.sessionStorage.setItem(TOKEN_KEY, response.data.token);

                window.sessionStorage.removeItem(USER_KEY);
                window.sessionStorage.setItem(USER_KEY, JSON.stringify(response.data));

                return response.data;
            })
            .catch(error => {
                console.log("Login Error:", error);
                throw error;
            });
    }

    logout() {
        window.sessionStorage.clear();
        window.location.reload();
    }

    getCurrentUser() {
        return JSON.parse(window.sessionStorage.getItem(USER_KEY));
    }
}

export default new AuthService();
