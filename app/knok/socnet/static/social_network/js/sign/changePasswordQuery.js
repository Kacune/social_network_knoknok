var changePasswordQuery = new Vue({
    el: "#changePasswordQuery",
    data: {
        email: '',
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
            let tokenJSON = await fetch(config.host + '/auth/users/reset_password/', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": csrftoken,
                },
                body: JSON.stringify({'email':this.email})
            });
            if (tokenJSON.ok){
                alert('Перейдите на почту и подтвердите изменения');
                this.new_password = '';
            }
            else{
                alert('Смена пароля не удалась');
            }
        }
    }
})