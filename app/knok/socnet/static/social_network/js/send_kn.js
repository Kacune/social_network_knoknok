var send_kn_vue = new Vue({
    el: "#send_kn_form",
    data: {
        isActiveKn: false,
        address: 0,
        wallet: {
            'id' : 0,
            'user' : 0,
            'money' : 0,
            'isActive' : true,
        },
        wallet_address: {
            'id' : 0,
            'user' : 0,
            'money' : 0,
            'isActive' : true,
        },
        kn: '',
        transfer: {
            'wallet': 0,
            'wallet_who': 0,
            'sum': 0
        },
        transfer_address: {
            'wallet': 0,
            'wallet_who': 0,
            'sum': 0
        },
        active_send_kn_value: 0,
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
        async send_kn(){
            let address = this.address;
            var csrftoken = this.readCookie('csrftoken');
            ls = window.localStorage;
            var idetc = await fetch(config.host + '/api/wallet/'+ls.getItem('id'), {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ls.getItem('access')
                }
            });
            let wallet = await idetc.json();
            this.wallet = wallet;
            this.wallet.user = ls.getItem('id');
            this.wallet.money = this.wallet.money - Number(this.kn);
            if (this.wallet.money < 0){
                return;
            }
            console.log(this.wallet);
            await fetch(config.host + '/api/wallet/update/'+ls.getItem('id'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": csrftoken,
                    'Authorization': 'Bearer '+ls.getItem('access')
                },
                body: JSON.stringify(this.wallet)
            });


            var idetc = await fetch(config.host + '/api/wallet/'+address, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ls.getItem('access')
                }
            });
            let wallet_address = await idetc.json();
            this.wallet_address = wallet_address;
            this.wallet_address.user = address;
            this.wallet_address.money = this.wallet_address.money + Number(this.kn);
            console.log(this.wallet_address);
            await fetch(config.host + '/api/wallet/update/'+address, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": csrftoken,
                    'Authorization': 'Bearer '+ls.getItem('access')
                },
                body: JSON.stringify(this.wallet_address)
            });

            this.transfer.wallet = wallet.id;
            this.transfer.wallet_who = wallet_address.id;
            this.transfer.sum = this.kn;

            var idetc = await fetch(config.host + '/api/transfer_between_people/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": csrftoken,
                    'Authorization': 'Bearer '+localStorage.getItem('access')
                },
                body: JSON.stringify(this.transfer)
            });
            //$('#close_send').removeClass('active_send');
            this.isActiveKn = false;
            socket.emit('change-money');
        },
        close_send_kn(){
            this.isActiveKn = !this.isActiveKn;
        },
    }
})