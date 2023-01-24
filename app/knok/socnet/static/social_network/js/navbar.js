var navbar = new Vue({
    el: "#navbar",
    data: {
        wallet_sum: 0,
        avatar_navbar: '',
    },
    async created() {
        socket.on('change-money', (data) => {
            this.wallet_sum += data;
        });
        this.get_money();
        this.get_avatar();
    },
    methods: {
        async get_money(){
            ls = window.localStorage;
            var idetc = await fetch(config.host +'/api/wallet/'+ls.getItem('id'), {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ls.getItem('access')
                }
            });
            let wallet = await idetc.json();
            this.wallet_sum = wallet.money;
        },
        async get_avatar(){
            ls = window.localStorage;
            var idetc = await fetch(config.host +'/api/user/get/'+ls.getItem('id'), {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ls.getItem('access')
                }
            });
            let user = await idetc.json();
            console.log(user.avatar);
            this.avatar_navbar = `media/${user.avatar}`;
        },
        path_avatar_navbar(){
            return this.avatar_navbar;
        },
        async logout(){
            var csrftoken = this.readCookie('csrftoken');
            let auth_token = await fetch(config.host + '/auth/token/logout', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": csrftoken,
                    'Autorization': 'Bearer ' + window.localStorage.getItem('auth_token'),
                }
            });
            setTimeout(function () {
                window.localStorage.clear();
            }, 4000);
            document.location.href = config.host_page + '/sign/in';
        },
        readCookie(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
            }
            return null;
        }
    }
})