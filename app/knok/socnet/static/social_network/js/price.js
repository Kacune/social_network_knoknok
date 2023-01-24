var price = new Vue({
    el: "#price_conteiner",
    data: {
        prices: [],
        wallet: {
            'id' : 0,
            'user' : 0,
            'money' : 0,
            'isActive' : true,
        },
        transfer: {
            'wallet': 0,
            'sum' : 0,
            'isIn' : true,
            'type' : 1
        },
        price: {
            'id' : 0,
            'price_obj': 0,
            'who' : 0,
            'isActive': false
        },
        history_transfer: {
            'user': 0,
            'money': 0,
            'isIn': false
        }
    },
    async created() {
        this.getPhotos();
        socket.on('change-price', (data) => {
            this.prices = null;
            this.getPhotos();
        });
    },
    methods: {
        async getPhotos(){
            localStorage = window.localStorage;
            var prices = await fetch(config.host +'/api/price/list', {
                    method: 'get',
                    headers: {
                        'Authorization': 'Bearer '+localStorage.getItem('access')
                    },
                }
            );
            let price_list = await prices.json();

            console.log(price_list);


            var price_objects = await fetch(config.host +'/api/price_object/list', {
                    method: 'get',
                    headers: {
                        'Authorization': 'Bearer '+localStorage.getItem('access')
                    },
                }
            );
            let price_object_list = await price_objects.json();


            var idetc = await fetch(config.host +'/api/u_list', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+localStorage.getItem('access')
                }
            });
            let users_list = await idetc.json();

            let id = localStorage.getItem('id');

            let prices_temp = [];

            for (var i = 0; i < price_list.length; i++){
                if (price_list[i].who == id && price_list[i].isActive == true){
                    for (var j = 0; j < users_list.length; j++){
                        if (users_list[j].id == price_list[i].user){
                            let time_create = new Date(price_list[i].time_create).toLocaleString('ru', {
                                                                                        year: 'numeric',
                                                                                        month: 'long',
                                                                                        day: 'numeric'
                                                                                      });
                            let birthday = new Date(users_list[j].birthday);
                            let today = new Date();
                            let age = today.getYear() - birthday.getYear();
                            let month = today.getMonth() - birthday.getMonth();
                            if (month < 0){
                                age--;
                            }

                            var image = '';
                            var cost = 0;
                            var price_id = 0;
                            for(var y = 0; y < price_object_list.length; y++) {
                                if(price_list[i].price_obj == price_object_list[y].id){
                                    image = price_object_list[y].image;
                                    cost = price_object_list[y].cost;
                                    price_id = price_object_list[y].id;
                                }
                            }
                            this.prices.push({'avatar': users_list[j].avatar, 'image': image, 'cost': cost, 'price_id': price_id, 'price': price_list[i].id,
                            'time_create': time_create, 'first_name': users_list[j].first_name, 'age': age, 'city': users_list[j].city, 'user': price_list[i].user});
                        }
                    }

                }
            }
            console.log(this.prices);
        },
        pathPrice(index){
            return `media/${this.prices[index].image}`;
        },
        pathAvatarSend(index){
            return `media/${this.prices[index].avatar}`;
        },
        async transferPrice(elem, index){
            console.log(elem);
            localStorage = window.localStorage;
            var idetc = await fetch(config.host +'/api/storage/get/1', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+localStorage.getItem('access')
                }
            });
            let storage = await idetc.json();

            var idetc = await fetch(config.host +'/api/wallet/'+window.localStorage.getItem('id'), {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+localStorage.getItem('access')
                }
            });
            let wallet = await idetc.json();

            var idetc = await fetch(config.host +'/api/price_object/one/'+elem.price_id, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+localStorage.getItem('access')
                }
            });
            let price_obj = await idetc.json();

            this.wallet.id = wallet.id;
            this.wallet.user = window.localStorage.getItem('id');
            this.wallet.money = wallet.money + price_obj.cost;

            storage.money = storage.money - price_obj.cost;


            var csrftoken = this.readCookie('csrftoken');

            var idetc = await fetch(config.host +'/api/storage/update/1', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": csrftoken,
                    'Authorization': 'Bearer '+localStorage.getItem('access')
                },
                body: JSON.stringify(storage)
            });

            this.history_transfer.user = localStorage.getItem('id');
            this.history_transfer.money = price_obj.cost;

            await fetch(config.host +'/api/history_transfer/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": csrftoken,
                    'Authorization': 'Bearer '+localStorage.getItem('access')
                },
                body: JSON.stringify(this.history_transfer)
            });

            await fetch(config.host +'/api/wallet/update/'+this.wallet.user, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": csrftoken,
                    'Authorization': 'Bearer '+localStorage.getItem('access')
                },
                body: JSON.stringify(this.wallet)
            });


            this.transfer.wallet = wallet.id;
            this.transfer.sum = price_obj.cost;

            await fetch(config.host +'/api/transfer/create' , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": csrftoken,
                    'Authorization': 'Bearer '+localStorage.getItem('access')
                },
                body: JSON.stringify(this.transfer)
            });

            var idetc = await fetch(config.host +'/api/price/one/'+ elem.price, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+localStorage.getItem('access')
                }
            });

            let price = await idetc.json();

            this.price.id = price.id;
            this.price.user = price.user;
            this.price.price_obj = price.price_obj;
            this.price.who = price.who;
            this.price.isActive = false;

            var res = await fetch(config.host +'/api/price/update/'+elem.price , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": csrftoken,
                    'Authorization': 'Bearer '+localStorage.getItem('access')
                },
                body: JSON.stringify(this.price)
            });
            let result = await res.json();

            console.log(result);
            socket.emit('change-money', this.transfer.sum);
            socket.emit('change-price', this.price);
            this.prices.splice(index, 1);
        },
        async refusePrice(elem, index){
            console.log(elem);
            localStorage = window.localStorage;
            var idetc = await fetch(config.host +'/api/storage/get/1', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+localStorage.getItem('access')
                }
            });
            let storage = await idetc.json();

            var idetc = await fetch(config.host +'/api/wallet/'+elem.user, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+localStorage.getItem('access')
                }
            });
            let wallet = await idetc.json();

            var idetc = await fetch(config.host +'/api/price_object/one/'+elem.price_id, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+localStorage.getItem('access')
                }
            });
            let price_obj = await idetc.json();

            this.wallet.id = wallet.id;
            this.wallet.user = elem.user;
            this.wallet.money = wallet.money + price_obj.cost;

            storage.money = storage.money - price_obj.cost;


            var csrftoken = this.readCookie('csrftoken');

            var idetc = await fetch(config.host +'/api/storage/update/1', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": csrftoken,
                    'Authorization': 'Bearer '+localStorage.getItem('access')
                },
                body: JSON.stringify(storage)
            });

            this.history_transfer.user = elem.user;
            this.history_transfer.money = price_obj.cost;

            await fetch(config.host +'/api/history_transfer/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": csrftoken,
                    'Authorization': 'Bearer '+localStorage.getItem('access')
                },
                body: JSON.stringify(this.history_transfer)
            });

            await fetch(config.host +'/api/wallet/update/'+elem.user, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": csrftoken,
                    'Authorization': 'Bearer '+localStorage.getItem('access')
                },
                body: JSON.stringify(this.wallet)
            });


            this.transfer.wallet = wallet.id;
            this.transfer.sum = price_obj.cost;

            await fetch(config.host +'/api/transfer/create' , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": csrftoken,
                    'Authorization': 'Bearer '+localStorage.getItem('access')
                },
                body: JSON.stringify(this.transfer)
            });

            var idetc = await fetch(config.host +'/api/price/one/'+ elem.price, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+localStorage.getItem('access')
                }
            });

            let price = await idetc.json();

            this.price.id = price.id;
            this.price.user = price.user;
            this.price.price_obj = price.price_obj;
            this.price.who = price.who;
            this.price.isActive = false;

            var res = await fetch(config.host +'/api/price/update/'+elem.price , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": csrftoken,
                    'Authorization': 'Bearer '+localStorage.getItem('access')
                },
                body: JSON.stringify(this.price)
            });
            let result = await res.json();
            console.log(result);
            socket.emit('change-price', this.price);
            this.prices.splice(index, 1);
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
