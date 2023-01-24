var changePasswordVue = new Vue({
    el: "#changePasswordForm",
    data: {
        new_password: '',
        reset_data: {
            uid: window.localStorage.getItem('uid'),
            token: window.localStorage.getItem('token'),
            new_password: this.new_password,
        },
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
        async changePassword(){
            var csrftoken = this.readCookie('csrftoken');
            var reg = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}/g
            if (reg.test(this.new_password)){
                this.reset_data.new_password = this.new_password;
                let tokenJSON = await fetch(config.host + '/auth/users/reset_password_confirm/', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        "X-CSRFToken": csrftoken,
                    },
                    body: JSON.stringify(this.reset_data)
                });
                if (tokenJSON.ok){
                    alert('Пароль успешно изменен');
                    this.new_password = '';
                }
                else{
                    alert('Смена пароля не удалась');
                }
            }
        }
    }
})
