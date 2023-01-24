var signUp = new Vue({
    el: "#signUp",
    data: {
        isActive: false,
        user: {
            email: '',
            phone: '',
            password: '',
        },
        email: '',
        phone: '',
        password: '',
        re_password: '',
        error: '',
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
        async createUser(){
            var csrftoken = this.readCookie('csrftoken');
            var reg = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}/g;
            console.log(this.password);
            if (reg.test(this.password)){
                if(this.re_password == this.password){
                    this.user.email = this.email;
                    this.user.phone = this.phone;
                    this.user.password = this.password;
                    console.log(this.user);
                    let status = await fetch(config.host + '/auth/users/',{
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json',
                            "X-CSRFToken": csrftoken,
                        },
                        body: JSON.stringify(this.user)
                    });
                    console.log(status.text);
                    if (status.status > 300){
                        this.error = status.statusText;
                        alert(this.error);
                    }
                    else{
                        alert('Вы успешно зарегестрированы, перейдите на свою почту для подтверждения регистрации');
                        document.location.href = config.host_page + '/sign/in';
                        this.isActive = true;
                        setTimeout(function () {
                            signUp.isActive = false;
                        }, 2000);
                        this.error = '';
                    }
                }
                else{
                    this.error = "Пароли не совпадают";
                }
            }
            else {
                this.error = "Пароль должен быть 8 символов и боле, содержать заглавные и сторчные буквы, а также содержать цифры!"
            }
            if (this.error != ''){
                alert(this.error);
            }
        }
    }
})