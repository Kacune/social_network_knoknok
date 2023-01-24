    let vue = new Vue({
        el: '#dialogues',
        data: {
            dialogues: [],
            roomId: 0,
            userId: 0,
            prt: null,
            newMessage: null,
            messages: [],
            typing: false,
            username: null,
            ready: false,
            info: [],
            connections: 0,
            name_interlocutor: '',
            avatar_get: '',
            selectedRoom: false,
            index_dialog: 0,
            messageCreate: {
                user: 0,
                roomId: 0,
                text: ''
            },
            favorite: {
                favorite_user: 0
            },
            black_list: {
                black_list_user: 0,
                user: 0
            },
            isExict: [],
            black_list_dialogues: [],
        },
        async created() {
            this.userId = window.localStorage.getItem('id');
            window.onbeforeunload = window.onunload = function(e){
                socket.emit('leave', this.username);
            };

            socket.on('chat-message', (data) => {
                this.messages.push({
                    text: data.text,
                    user: false,
                    roomId: data.roomId,
                    time_send: data.time
                });
            });
            socket.on('typing', (data) => {
                this.typing = true;
                this.prt = data.username;
            });
            socket.on('stopTyping', (data) => {
                this.typing = data;
            });
            socket.on('joined', (data) => {
                this.info.push({
                    username: data,
                    type: 'joined'
                });
                setTimeout(() => {
                    this.info = [];
                }, 5000);
            });
            socket.on('leave', (data) => {
                this.info.push({
                    username: data,
                    type: 'left'
                });
                setTimeout(() => {
                    this.info = [];
                }, 5000);
            });
            socket.on('connections', (data) => {
                this.connections += data;
            });

            await this.get_dialogues();
        },
        watch: {
            newMessage(value) {
                value ? socket.emit('typing', {username: this.username, roomId: this.roomId}) : socket.emit('stopTyping', this.roomId)
            }
        },
        methods: {
            async createFavorite(){
                if (this.selectedRoom){
                    this.user = window.localStorage.getItem('id');
                    this.user_id = window.localStorage.getItem('chat_user');
                    this.favorite.favorite_user = window.localStorage.getItem('chat_user');
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
                        for(var i = 0; i < favorites_list.length; i++){
                            if((favorites_list[i].user == this.user_id && favorites_list[i].favorite_user == this.user) || (favorites_list[i].user == this.user && favorites_list[i].favorite_user == this.user_id)){
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
                            alert('Данный пользователь есть в избранном или ему отправлена заявка!');
                        }
                    }
                }
            },
            async add_in_black_list(){
                if (this.selectedRoom){
                    this.user = window.localStorage.getItem('id');
                    this.user_id = window.localStorage.getItem('chat_user');
                    this.black_list.black_list_user = window.localStorage.getItem('chat_user');
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
                                this.isExict.push(black_list[i]);
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
                            this.dialogues.splice(this.index_dialog, 1);
                            this.selectedRoom = false;
                            this.name_interlocutor = '';
                            this.messages = [];
                        }
                        else {
                            alert('Данный пользователь есть в черном списке!');
                        }
                    }
                }
            },
            active_send_price(){
                if (this.selectedRoom){
                    send_price.active_send_price = true;
                    send_price.user_id = window.localStorage.getItem('chat_user');
                }
            },
            active_send_kn_window(){
                if (this.selectedRoom){
                    send_kn_vue.isActiveKn = true;
                    send_kn_vue.address = window.localStorage.getItem('chat_user');
                }
            },
            async send() {
                if (this.selectedRoom){
                    localStorage = window.localStorage;
                    this.userId = localStorage.getItem('id');
                    let time = new Date();
                    var duration = new Date(time).toLocaleString('ru', {
                                                                        year: 'numeric',
                                                                        month: 'numeric',
                                                                        day: 'numeric',
                                                                        hour: 'numeric',
                                                                        minute: 'numeric'
                                                                      });
                    this.messages.push({
                        text: this.newMessage,
                        user: true,
                        roomId: this.roomId,
                        time_send: duration
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
            open_flist(){
                $('#list_favorites_dialogues').addClass('is_active');
            },
            async get_dialogues(){
                localStorage = window.localStorage;
                var idetc = await fetch(config.host +'/api/dialog/list', {
                    method: 'get',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+localStorage.getItem('access')
                    }
                });
                let dialogues = await idetc.json();
                idetc = await fetch(config.host +'/api/blacklist/is_exict', {
                    method: 'get',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+localStorage.getItem('access')
                    }
                });
                let black_list = await idetc.json();
                let id_my = localStorage.getItem('id');
                for(var i=0; i < black_list.length; i++){
                    if (black_list[i].user.id == id_my || black_list[i].black_list_user.id == id_my){
                        if (black_list[i].user.id == id_my){
                            this.black_list_dialogues.push({
                                "user": id_my,
                                "black_list_user": black_list[i].black_list_user.id
                            });
                        }
                        else {
                            this.black_list_dialogues.push({
                                "user": id_my,
                                "black_list_user": black_list[i].user.id
                            });
                        }
                    }
                }

                let dialogues_temp = [];
                let in_black_list = false;
                for(var i=0;i < dialogues.length;i++) {
                    if(dialogues[i].user == localStorage.getItem('id') || dialogues[i].interlocutor == localStorage.getItem('id')){
                        if (dialogues[i].user == localStorage.getItem('id')){
                            var idetc = await fetch(config.host +'/api/user/get/'+dialogues[i].interlocutor, {
                                method: 'get',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer '+localStorage.getItem('access')
                                }
                            });
                            let user = await idetc.json();
                            if (user.first_name == null){
                                user.first_name = '';
                            }
                            if (user.last_name == null){
                                user.last_name = '';
                            }
                            for (var j = 0; j < this.black_list_dialogues.length; j++){
                                if(this.black_list_dialogues[j].black_list_user == dialogues[i].interlocutor){
                                    in_black_list = true;
                                    break;
                                }
                            }
                            if (!in_black_list){
                                this.dialogues.push({
                                "id": dialogues[i].id,
                                "user": dialogues[i].user,
                                "interlocutor": dialogues[i].interlocutor,
                                "username": user.first_name + ' ' + user.last_name,
                                "avatar": user.avatar});
                            }
                            in_black_list = false;
                        }
                        else if(dialogues[i].interlocutor == localStorage.getItem('id')) {
                            var idetc = await fetch(config.host +'/api/user/get/'+dialogues[i].user, {
                                method: 'get',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer '+localStorage.getItem('access')
                                }
                            });
                            let user = await idetc.json();
                            if (user.first_name == null){
                                user.first_name = '';
                            }
                            if (user.last_name == null){
                                user.last_name = '';
                            }
                            for (var j = 0; j < this.black_list_dialogues.length; j++){
                                if(this.black_list_dialogues[j].black_list_user == dialogues[i].user){
                                    in_black_list = true;
                                    break;
                                }
                            }
                            if (!in_black_list){
                                this.dialogues.push({
                                    "id": dialogues[i].id,
                                    "user": dialogues[i].interlocutor,
                                    "interlocutor": dialogues[i].user,
                                    "username": user.first_name + ' ' + user.last_name,
                                    "avatar": user.avatar});
                            }
                            in_black_list = false;
                        }
                    }
                }
            },
            async addUser(index,roomId,username) {
                this.index_dialog = index;
                this.selectedRoom = true;
                window.localStorage.setItem('chat_user', this.dialogues[index].interlocutor);
                this.messages = [];
                this.name_interlocutor = this.dialogues[index].username;
                this.avatar_get = this.dialogues[index].avatar;
                this.ready = true;
                this.roomId = roomId;
                this.username = username;
                var idetc = await fetch(config.host +'/api/messages/get/?roomId='+roomId, {
                    method: 'get',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+localStorage.getItem('access')
                    }
                });
                let messages = await idetc.json();
                for(var i=0;i < messages.length;i++) {
                    let userType = false;
                    if(messages[i].user == this.userId){
                        userType = true;
                    }
                    this.messages.push({
                        user: userType,
                        roomId: messages[i].roomId,
                        text: messages[i].text,
                        time_send: new Date(messages[i].time_create).toLocaleString('ru', {
                                                                    year: 'numeric',
                                                                    month: 'numeric',
                                                                    day: 'numeric',
                                                                    hour: 'numeric',
                                                                    minute: 'numeric'
                                                                  })
                    });
                }
                socket.emit('joined', {username: this.username, roomId: this.roomId});
            },
            open_list_dialogues(){
                list_dialogues.isActive = true;
            },
            pathAvatarInt(){
                return `media/${this.avatar_get}`;
            },
            pathAvatar(index){
                return `media/${this.dialogues[index].avatar}`;
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
            },
        },
      });