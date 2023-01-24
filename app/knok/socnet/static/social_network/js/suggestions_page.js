var suggestions_page = new Vue({
    el: "#suggestions_page",
    data: {
        suggestions: [],
        suggestions_list: [],
        themes: [],
        user: [],
        user_info: [],
        first_name: '',
        isOpened: false,
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
        active_send: false,
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
        price_objects_list: [],
        favoriteObj: {
            'favorite_user': 0,
            'user': 0,
            'isConfirmed': false
        },
        newMessage: '',
        roomId: '',
        messageCreate: {
            user: 0,
            roomId: 0,
            text: ''
        },
        newDialog: {
            user: 0,
            interlocutor: 0,
            is_group: false
        },
    },
    async created() {
        this.get_suggestions();
    },
    methods: {
        open_create_suggest(){
            main_content.isActive = true
        },
        open_suggest(element){
            element.classList.add('opened');
            element.querySelector('.lorem').classList.remove('open_lorem');
            element.querySelector('.button_one_suggest ').classList.add('hiden_write');
        },
        close_suggest(element){
            element.classList.remove('opened');
            element.querySelector('.lorem').classList.add('open_lorem');
            element.querySelector('.button_one_suggest ').classList.remove('hiden_write');
        },
        active_send_price(user_id){
            send_price.active_send_price = true;
            send_price.user_id = user_id;
        },
        async send_kn(address){
            console.log(address);
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
            this.wallet = wallet;
            this.wallet.user = ls.getItem('id');
            this.wallet.money = this.wallet.money - Number(this.kn);
            if (this.wallet.money < 0){
                return;
            }
            console.log(this.wallet);
            await fetch(config.host +'/api/wallet/update/'+ls.getItem('id'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": csrftoken,
                    'Authorization': 'Bearer '+ls.getItem('access')
                },
                body: JSON.stringify(this.wallet)
            });


            var idetc = await fetch(config.host +'/api/wallet/'+address, {
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
            await fetch(config.host +'/api/wallet/update/'+address, {
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

            var idetc = await fetch(config.host +'/api/transfer_between_people/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": csrftoken,
                    'Authorization': 'Bearer '+localStorage.getItem('access')
                },
                body: JSON.stringify(this.transfer)
            });
            this.active_send = false;
        },
        active_send_kn_window(user_id){
            send_kn_vue.isActiveKn = true;
            send_kn_vue.address = user_id;
        },
        async get_suggestions(){
            var csrftoken = this.readCookie('csrftoken');
            localStorage = window.localStorage;
            var suggestions = await fetch(config.host + '/api/s_list', {
                    method: 'get',
                    headers: {
                        "X-CSRFToken": csrftoken,
                        'Authorization': 'Bearer '+localStorage.getItem('access')
                    },
                }
            );
            let suggestions_list = await suggestions.json();
            this.suggestions = suggestions_list;
            var now = new Date();
            for (var i = 0; i < suggestions_list.length; i++) {
                var dur_for_if = new Date(suggestions_list[i].duration);
                if(dur_for_if > now){
                    this.suggestions_list.push({'description': suggestions_list[i].description, 'duration': suggestions_list[i].duration, 'fire_suggestion': suggestions_list[i].fire_suggestion, 'id': suggestions_list[i].id, 'theme': suggestions_list[i].theme.name, 'time_create': suggestions_list[i].time_create, 'user': suggestions_list[i].user.id, 'avatar': suggestions_list[i].user.avatar, 'first_name': suggestions_list[i].user.first_name});
                }
            }
            var price_objects = await fetch(config.host +'/api/price_object/list', {
                    method: 'get',
                    headers: {
                        'Authorization': 'Bearer '+localStorage.getItem('access')
                    },
                }
            );
            this.price_objects_list = await price_objects.json();
            console.log(this.price_objects_list);
        },
        async createFavorite(user){
            localStorage = window.localStorage;
            this.favoriteObj.favorite_user = user;
            this.favoriteObj.user = localStorage.getItem('id');
            var csrftoken = this.readCookie('csrftoken');
            if (this.favoriteObj.user != user){
                var idetc = await fetch(config.host + '/api/f_list', {
                        method: 'get',
                        headers: {
                            'Authorization': 'Bearer '+localStorage.getItem('access'),
                            'Content-Type': 'application/json',
                        },
                    }
                );
                let favorites_list = await idetc.json();
                for(var i = 0; i < favorites_list.length; i++){
                    if((favorites_list[i].user.id == user && favorites_list[i].favorite_user.id == this.favoriteObj.user) || (favorites_list[i].user.id == this.favoriteObj.user && favorites_list[i].favorite_user.id == user)){
                        this.isExict.push(favorites_list[i]);
                    }
                }
                if (this.isExict.length == 0){
                    console.log('Данного пользователя нет в списке избранного!');
                    await fetch(config.host +'/api/favorite', {
                        method: 'post',
                        headers: {
                            'Authorization': 'Bearer '+localStorage.getItem('access'),
                            'Content-Type': 'application/json',
                            "X-CSRFToken": csrftoken,
                        },
                        body: JSON.stringify(this.favoriteObj)
                    })
                }
                else {
                    console.log('Данный пользователь есть в избранном или ему отправлена заявка!');
                }
            }
        },
        async send_message(user){
            var idetc = await fetch(config.host +'/api/dialog/list', {
                    method: 'get',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+localStorage.getItem('access')
                    }
                });
                let dialogues = await idetc.json();
                let dialogues_temp = [];
                for(var i=0;i < dialogues.length;i++) {
                    if(dialogues[i].user == user || dialogues[i].interlocutor == user && dialogues[i].user == localStorage.getItem('id') || dialogues[i].interlocutor == localStorage.getItem('id')){
                        this.roomId = dialogues[i].id;
                    }
                }
                if (this.roomId != ''){
                    localStorage = window.localStorage;
                    let time = new Date();
                    var duration = new Date(time).toLocaleString('ru', {
                                                                        year: 'numeric',
                                                                        month: 'numeric',
                                                                        day: 'numeric',
                                                                        hour: 'numeric',
                                                                        minute: 'numeric'
                                                                      });
                    socket.emit('chat-message', {
                        text: this.newMessage,
                        user: true,
                        roomId: this.roomId,
                        time_send: duration
                    });
                    var csrftoken = this.readCookie('csrftoken');
                    localStorage = window.localStorage;
                    this.messageCreate.user = localStorage.getItem('id');
                    this.messageCreate.roomId = this.roomId;
                    this.messageCreate.text = this.newMessage;
                    await fetch(config.host +'/api/messages/create', {
                        method: 'post',
                        headers: {
                            'Authorization': 'Bearer '+localStorage.getItem('access'),
                            'Content-Type': 'application/json',
                            "X-CSRFToken": csrftoken,
                        },
                        body: JSON.stringify(this.messageCreate)
                    });
                    this.newMessage = null;
                }
                else {
                    var csrftoken = this.readCookie('csrftoken');
                    localStorage = window.localStorage;
                    this.newDialog.user = localStorage.getItem('id');
                    this.newDialog.interlocutor = user;
                    await fetch(config.host +'/api/dialog/create', {
                        method: 'post',
                        headers: {
                            'Authorization': 'Bearer '+localStorage.getItem('access'),
                            'Content-Type': 'application/json',
                            "X-CSRFToken": csrftoken,
                        },
                        body: JSON.stringify(this.newDialog)
                    });
                    var idetc = await fetch(config.host +'/api/dialog/list', {
                        method: 'get',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer '+localStorage.getItem('access')
                        }
                    });
                    let dialogues = await idetc.json();
                    let dialogues_temp = [];
                    for(var i=0;i < dialogues.length;i++) {
                        if(dialogues[i].interlocutor == user && dialogues[i].user == localStorage.getItem('id')){
                            this.roomId = dialogues[i].id;
                        }
                    }
                    localStorage = window.localStorage;
                    let time = new Date();
                    var duration = new Date(time).toLocaleString('ru', {
                                                                        year: 'numeric',
                                                                        month: 'numeric',
                                                                        day: 'numeric',
                                                                        hour: 'numeric',
                                                                        minute: 'numeric'
                                                                      });
                    socket.emit('chat-message', {
                        text: this.newMessage,
                        user: true,
                        roomId: this.roomId,
                        time_send: duration
                    });
                    var csrftoken = this.readCookie('csrftoken');
                    localStorage = window.localStorage;
                    this.messageCreate.user = localStorage.getItem('id');
                    this.messageCreate.roomId = this.roomId;
                    this.messageCreate.text = this.newMessage;
                    await fetch(config.host +'/api/messages/create', {
                        method: 'post',
                        headers: {
                            'Authorization': 'Bearer '+localStorage.getItem('access'),
                            'Content-Type': 'application/json',
                            "X-CSRFToken": csrftoken,
                        },
                        body: JSON.stringify(this.messageCreate)
                    });
                    this.newMessage = null;
                }
        },
        pathAvatar(index){
            return `media/${this.suggestions_list[index].avatar}`;
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