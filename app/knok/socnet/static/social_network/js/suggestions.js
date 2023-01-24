var one_suggest = new Vue ({
    el: '#one_suggest',
    data: {
        isActive: false,
        user_id: 0,
        theme_id: 0,
        duration: '',
        description: '',
        avatar: '',
        first_name: '',
        last_name: '',
        theme: '',
        fire_suggestion: false,
        isOpened: false,
        favorite: {
            favorite_user: 0
        },
        isExict: [],
        active_send: false,
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
        isActiveKn: false,
        send_kn_block: true,
    },
    methods: {
        async find_info(id){
            var csrftoken = this.readCookie('csrftoken');
            let localStorage = window.localStorage;
            var idetc = await fetch(config.host + '/api/suggest/'+id, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": csrftoken,
                    'Authorization': 'Bearer '+localStorage.getItem('access')
                }
            });
            let suggestion = await idetc.json();

            this.user_id = suggestion.user.id;
            this.theme_id = suggestion.theme.id;
            this.description = suggestion.description;
            this.fire_suggestion = suggestion.fire_suggestion;
            this.duration = new Date(suggestion.duration).toLocaleString('ru', {
                                                                                year: 'numeric',
                                                                                month: 'long',
                                                                                day: 'numeric'
                                                                              });


            this.avatar = suggestion.user.avatar;
            this.first_name = suggestion.user.first_name;
            this.last_name = suggestion.user.last_name;
            this.theme = suggestion.theme.name;
        },
        open_write(elem){
            this.isOpened = true;
        },
        close_suggestion_window(){
            this.isOpened = false;
            this.isActive = false;
        },
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
                for(var i=0;i < dialogues.length;i++) {
                    if(dialogues[i].user == this.user_id || dialogues[i].interlocutor == this.user_id && dialogues[i].user == localStorage.getItem('id') || dialogues[i].interlocutor == localStorage.getItem('id')){
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
        path_avatar_suggest(avatar){
            return `media/${avatar}`;
        },
        async createFavorite(index){
            var csrftoken = this.readCookie('csrftoken');
            var localStorage = window.localStorage;
            var my_id = localStorage.getItem('id');
            if (my_id != index){
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
                    if((favorites_list[i].user.id == index && favorites_list[i].favorite_user.id == my_id) || (favorites_list[i].user.id == my_id && favorites_list[i].favorite_user.id == index)){
                        this.isExict.push(favorites_list[i]);
                    }
                }
                this.favorite.favorite_user = index;
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
        active_send_price(user_id){
            send_price.active_send_price = true;
            send_price.user_id = user_id;
        },
        active_send_kn_window(user_id){
            send_kn_vue.isActiveKn = true;
            send_kn_vue.address = user_id;
        },
        async createPrice(id){
            //Добавление подарка, добавить диалоговое окно
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

var suggestions_bar = new Vue({
    el: "#suggestions_bar",
    data: {
        suggestions: [],
        suggestions_list: [],
        themes: [],
        user: [],
        user_info: [],
        first_name: ''
    },
    async created() {
        this.get_suggestions();
        socket.on('create-suggetsion', (data) => {
            this.suggestions_list = [];
            this.get_suggestions();
        });
    },
    methods: {
        open_create_suggest(){
            main_content.isActive = true
        },
        open_suggest(id){
            one_suggest.find_info(id);
            one_suggest.isActive = true;
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
        },

        pathAvatar(index){
            return `media/${this.suggestions_list[index].avatar}`;
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



var main_content = new Vue({
    el: "#main_content",
    data: {
        isActive: false,
        themes: [],
        theme: 0,
        suggest: {
            'description': '',
            'theme': '',
            'duration': '',
            'fire_suggestion': false
        },
        now_date: '',
    },
    async created() {
        await this.getThemes();
        let date = new Date();
        let month = date.getMonth()+1;
        this.now_date = ''+ date.getFullYear() + '-'+month+'-'+date.getDate();
        console.log(this.now_date);
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
        async getThemes(){
            var csrftoken = this.readCookie('csrftoken');
            var idetc = await fetch(config.host + '/api/ts_list', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": csrftoken,
                    'Authorization': 'Bearer '+localStorage.getItem('access')
                }
            });
            let themes_list = await idetc.json();
            for (let i = 0; i < themes_list.length; i++) {
                    this.themes.push({'id':themes_list[i].id, 'name': themes_list[i].name});
            }
        },
        async createSuggest(){
            for (let i = 0; i < this.themes.length; i++) {
                if (this.themes[i].name == this.theme){
                    this.suggest.theme = this.themes[i].id;
                }
            }
            var now = new Date();
            console.log(new Date(this.suggest.duration));
            if (new Date(this.suggest.duration) < new Date(now.setDate(now.getDate()+1))){
                this.suggest.fire_suggestion = true;
            }
            this.suggest.user = window.localStorage.getItem('id');
            if (new Date(this.suggest.duration) > new Date()){
                var csrftoken = this.readCookie('csrftoken');
                await fetch(config.host + '/api/suggest', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        "X-CSRFToken": csrftoken,
                        'Authorization': 'Bearer '+localStorage.getItem('access')
                    },
                    body: JSON.stringify(this.suggest)
                });
                this.isActive = false;
                success_suggest.isActive = true;
                setTimeout(function () {
                    success_suggest.isActive = false;
                }, 2000);
                socket.emit('create-suggestion', {
                    suggest: {
                        description: this.suggest.description,
                        theme: this.suggest.theme,
                        duration: this.suggest.duration,
                        fire_suggestion: this.suggest.fire_suggestion
                    }
                });
            }
            else{
                alert('Создать предложение не удалось, дата предложения должна быть больше нынешней даты');
            }
        }
    }
})

var success_suggest = new Vue({
    el: "#success_suggest",
    data: {
        isActive: false
    }
})
