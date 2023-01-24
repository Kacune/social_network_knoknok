var signIn = new Vue({
    el: "#signIn",
    data: {
        isActive: false,
        user: {
            email: '',
            password: '',
        },
        email: '',
        password: '',
        error: ''
    },
    methods: {
        readCookie(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
            }
            return null;
        },
        async getToken(){
            var csrftoken = this.readCookie('csrftoken');
            this.user.email = this.email;
            this.user.password = this.password;

            let auth_token = await fetch(config.host + '/auth/token/login', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": csrftoken,
                },
                body: JSON.stringify({'email' :this.user.email, 'password': this.user.password})
            });
            let token = await auth_token.json();
            localStorage = window.localStorage;
            localStorage.setItem('auth_token', token.auth_token);

            let tokenJSON = await fetch(config.host + '/token/', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": csrftoken,
                    'Authorization': 'Token '+localStorage.getItem('auth_token'),
                },
                body: JSON.stringify(this.user)
            });
            token = await tokenJSON.json();
            localStorage.setItem('access', token.access);
            localStorage.setItem('refresh', token.refresh);

            let userData = await fetch(config.host + '/auth/users/me/', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": csrftoken,
                    'Authorization': 'Bearer '+localStorage.getItem('access'),
                }
            });
            let data = await userData.json();
            localStorage.setItem('id', data.id);
            localStorage.setItem('phone', data.phone);
            localStorage.setItem('email', data.email);
            if(data.id){
                document.location.href = config.host_page + '/mypage';
            }
            else{
                alert('Неверный логин или пароль!');
            }
        }
    }
})