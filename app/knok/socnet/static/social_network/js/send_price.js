var send_price = new Vue({
    el: "#send_price",
    data: {
        price_objects_list: [],
        active_send_price: false,
        user_id: 0,
        history_transfer: {
            'user': 0,
            'money': 0,
            'isIn': true
        },
        price: {
            'user': 0,
            'price_obj': 0,
            'who': 0,
            'isActive': true
        },
        active_confirm: false,
        which_price: 0
    },
    async created() {
        this.get_price_objects();
    },
    methods: {
        async get_price_objects(){
            var csrftoken = this.readCookie('csrftoken');
            localStorage = window.localStorage;

            var price_objects = await fetch(config.host +'/api/price_object/list', {
                    method: 'get',
                    headers: {
                        'Authorization': 'Bearer '+localStorage.getItem('access')
                    },
                }
            );
            this.price_objects_list = await price_objects.json();
        },
        async give_price(){
            index = this.which_price;
            var csrftoken = this.readCookie('csrftoken');
            ls = window.localStorage;
            var idetc = await fetch(config.host +'/api/wallet/'+ls.getItem('id'), {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ls.getItem('access')
                }
            });
            let wallet = await idetc.json();
            if(wallet.money < this.price_objects_list[index].cost){
                return;
            }

            wallet.money = wallet.money - this.price_objects_list[index].cost;
            wallet.user = ls.getItem('id');

            await fetch(config.host +'/api/wallet/update/'+ls.getItem('id'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": csrftoken,
                    'Authorization': 'Bearer '+ls.getItem('access')
                },
                body: JSON.stringify(wallet)
            });

            var idetc = await fetch(config.host +'/api/storage/get/1', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ls.getItem('access')
                }
            });
            let storage = await idetc.json();
            storage.money = storage.money + this.price_objects_list[index].cost;
            var idetc = await fetch(config.host +'/api/storage/update/1', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": csrftoken,
                    'Authorization': 'Bearer '+ls.getItem('access')
                },
                body: JSON.stringify(storage)
            });


            this.history_transfer.user = ls.getItem('id');
            this.history_transfer.money = this.price_objects_list[index].cost;

            await fetch(config.host +'/api/history_transfer/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": csrftoken,
                    'Authorization': 'Bearer '+ls.getItem('access')
                },
                body: JSON.stringify(this.history_transfer)
            });

            this.price.user = ls.getItem('id');
            this.price.price_obj = this.price_objects_list[index].id;
            this.price.who = this.user_id;

            await fetch(config.host +'/api/price/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": csrftoken,
                    'Authorization': 'Bearer '+ls.getItem('access')
                },
                body: JSON.stringify(this.price)
            });
            this.active_confirm = false;
            socket.emit('change-money');
        },
        pathImgPrice(index){
            return `media/${this.price_objects_list[index].image}`;
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