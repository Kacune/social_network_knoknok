var page_photos = new Vue({
    el: "#bot_content_photo_block",
    data: {
        'photos': [],
        'count_photo_all'  : 0,
        'count_photo_paid' : 0,
        'count_photo_free' : 0,
        'characteristics'  : '',
        'cost' : false
    },
    async created() {
        localStorage  = window.localStorage;
        let id = localStorage.getItem('pageId');
        this.getPhotos(id);
    },
    methods: {
        open_slider(index){
            photo_all_screen_page.isActive = true;
            photo_all_screen_page.show_image_function(index);
        },
        async getPhotos(id){
            var csrftoken = this.readCookie('csrftoken');
            localStorage = window.localStorage;
            var photos = await fetch(config.host +'/api/photos/?user='+localStorage.getItem('pageId'), {
                    method: 'get',
                    headers: {
                        "X-CSRFToken": csrftoken,
                        'Authorization': 'Bearer '+localStorage.getItem('access')
                    },
                }
            );
            let photos_list = await photos.json();
            for(var i = 0; i < photos_list.length;i++){
                this.photos.push(photos_list[i]);
                if(photos_list[i].paid){
                    this.count_photo_paid++;
                }
            }
            this.count_photo_all = this.photos.length;
            this.count_photo_free = this.count_photo_all - this.count_photo_paid;

        },
        pathPhoto(index){
            return `media/${this.photos[index].path_photo}`;
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

var page_top = new Vue({
    el: "#top_content_page",
    data: {
        'user': '',
        'photos': [],
        'count_photo_all'  : 0,
        'count_photo_paid' : 0,
        'count_photo_free' : 0,
        'characteristics'  : {},
        'cost' : false,
        'noclick': true,
        'click': false
    },
    async created() {
        localStorage  = window.localStorage;
        let id = localStorage.getItem('pageId');
        this.getInfoAboutUser(id);
    },
    methods: {
        async getInfoAboutUser(id){
            localStorage = window.localStorage;
            let idetc = await fetch(config.host +'/api/u_list', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+localStorage.getItem('access')
                }
            });

            let users = await idetc.json();

            for(var i = 0; i < users.length;i++){
                if(users[i].id == id){
                    this.user = users[i];
                }
            }

            let char_response = await fetch(config.host +'/api/characteristics/list', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+localStorage.getItem('access')
                }
            });
            let char_list = await char_response.json();
            for (var j = 0; j < char_list.length; j++){
                if (char_list[j].user == id){
                    this.pk = char_list[j].id;
                    this.characteristics = char_list[j];
                }
            }

        },
        pathAvatar(){
            return `media/${this.user.avatar}`;
        },
        clickfun(){
            this.click = !this.click;
            this.noclick = !this.noclick;
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


var bot_func_block = new Vue({
    el: "#bot_content_functional_block",
    data: {
        user: 0,
        user_id: 0,
        favorite: {
            favorite_user: 0
        },
        isExict: [],
        isExictB: [],
        active_send: false,
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
        localStorage  = window.localStorage;
        this.user = localStorage.getItem('id');
        this.user_id = localStorage.getItem('pageId');
    },
    methods: {
        async send_message(){
            var idetc = await fetch(config.host +'/api/dialog/list', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+localStorage.getItem('access')
                }
            });
            let dialogues = await idetc.json();
            let dialogues_temp = [];
            console.log(this.user, this.user_id);
            console.log(dialogues);
            for(var i=0;i < dialogues.length;i++) {
                if(dialogues[i].user == this.user && dialogues[i].interlocutor == this.user_id){
                    this.roomId = dialogues[i].id;
                }
                else if (dialogues[i].interlocutor == this.user && dialogues[i].user == this.user_id){
                    this.roomId = dialogues[i].id;
                }
            }
            console.log(this.roomId);
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
                console.log("One");
                var csrftoken = this.readCookie('csrftoken');
                localStorage = window.localStorage;
                this.newDialog.user = localStorage.getItem('id');
                this.newDialog.interlocutor = this.user_id;
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
                    if(dialogues[i].interlocutor == this.user_id && dialogues[i].user == localStorage.getItem('id')){
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
        async add_in_black_list(){
            this.user = window.localStorage.getItem('id');
            this.user_id = window.localStorage.getItem('pageId');
            this.black_list.black_list_user = window.localStorage.getItem('pageId');
            this.black_list.user = window.localStorage.getItem('id');
            var csrftoken = this.readCookie('csrftoken');
            if (this.user != this.user_id){
                var idetc = await fetch(config.host + '/api/blacklist/list/?user='+ this.user, {
                        method: 'get',
                        headers: {
                            'Authorization': 'Bearer '+localStorage.getItem('access'),
                            'Content-Type': 'application/json',
                        },
                    }
                );
                let black_list = await idetc.json();
                let isExistBlack = [];
                for(var i = 0; i < black_list.length; i++){
                    if(black_list[i].black_list_user.id == this.user_id){
                        isExistBlack.push(black_list[i]);
                    }
                }
                if (isExistBlack.length == 0){
                    console.log('Данного пользователя нет в черном списке!');
                    await fetch(config.host + '/api/blacklist/create', {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json',
                            "X-CSRFToken": csrftoken,
                            'Authorization': 'Bearer '+localStorage.getItem('access')
                        },
                        body: JSON.stringify(this.black_list)
                    });
                    alert('Пользователь добавлен в черный список');
                }
                else {
                    alert('Данный пользователь есть в черном списке!');
                }
            }
        },
        async createFavorite(){
            this.favorite.favorite_user = window.localStorage.getItem('pageId');
            var csrftoken = this.readCookie('csrftoken');
            if (this.user != this.user_id){
                var idetc = await fetch(config.host + '/api/f_list', {
                        method: 'get',
                        headers: {
                            'Authorization': 'Bearer '+localStorage.getItem('access'),
                            'Content-Type': 'application/json',
                        },
                    }
                );
                let favorites_list = await idetc.json();
                console.log(favorites_list);
                for(var i = 0; i < favorites_list.length; i++){
                    if((favorites_list[i].user.id == this.user_id && favorites_list[i].favorite_user.id == this.user) || (favorites_list[i].user.id == this.user && favorites_list[i].favorite_user.id == this.user_id)){
                        this.isExict.push(favorites_list[i]);
                    }
                }
                if (this.isExict.length == 0){
                    console.log('Данного пользователя нет в списке избранного!');
                    await fetch(config.host + '/api/favorite', {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json',
                            "X-CSRFToken": csrftoken,
                            'Authorization': 'Bearer '+localStorage.getItem('access')
                        },
                        body: JSON.stringify(this.favorite)
                    });
                }
                else {
                    console.log('Данный пользователь есть в избранном или ему отправлена заявка!');
                }
            }
        },
        active_send_price(){
            send_price.active_send_price = true;
            send_price.user_id = this.user_id;
        },
        active_send_kn_window(){
            send_kn_vue.isActiveKn = true;
            send_kn_vue.address = window.localStorage.getItem('pageId');
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