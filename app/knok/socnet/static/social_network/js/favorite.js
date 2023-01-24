var favorite = new Vue({
    el: "#favorites",
    data: {
        favorites_pre: [],
        favorites: [],
        favorite: {
            'favorite_user': '',
            'isConfirmed': false
        },
        black_list_dialogues: [],
    },
    async created() {
        await this.getFavorites();
        socket.on('delete-favorite', (data) => {
            this.favorites = null;
            this.favorites_pre = [];
            this.favorites = [];
            this.getFavorites();
        })
        socket.on('add-favorite', (data) => {
            this.favorites = null;
            this.favorites_pre = [];
            this.favorites = [];
            this.getFavorites();
        })
    },
    methods: {
        pageId(index){
            window.localStorage.setItem('pageId', this.favorites[index].favorite_user);
        },
        page_link(index){
            return config.host + '/'+this.favorites[index].favorite_user;
        },
        open_confirm(id){
            console.log(this.favorites);
            confirmation_window_favorite.id = id;
            confirmation_window_favorite.text_confirmation = 'Вы уверены, что желаете удалить данного пользователя из избранного?!';
            confirmation_window_favorite.isActive = true;
        },
        async delete_favorite(id){
            var csrftoken = this.readCookie('csrftoken');
            localStorage = window.localStorage;
            var idetc = await fetch(config.host +'/api/favorite/delete/'+id, {
                    method: 'post',
                    headers: {
                        'Authorization': 'Bearer '+localStorage.getItem('access'),
                        'Content-Type': 'application/json',
                        "X-CSRFToken": csrftoken,
                    },
                }
            );
        },
        async getFavorites(){
            var csrftoken = this.readCookie('csrftoken');
            localStorage = window.localStorage;
            let my_id = localStorage.getItem('id');
            var idetc = await fetch(config.host +'/api/f_list', {
                    method: 'get',
                    headers: {
                        'Authorization': 'Bearer '+localStorage.getItem('access'),
                        'Content-Type': 'application/json',
                    },
                }
            );
            let favorites_list = await idetc.json();
            for (var i = 0; i < favorites_list.length; i++){
                if ((favorites_list[i].user.id == localStorage.getItem('id') && favorites_list[i].isConfirmed == true) || (favorites_list[i].favorite_user.id == localStorage.getItem('id') && favorites_list[i].isConfirmed == true)){
                    this.favorites_pre.push(favorites_list[i]);
                }
            }
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
            let in_black_list = false;

            for (var i = 0; i < this.favorites_pre.length; i++){
                if (this.favorites_pre[i].user.id == my_id){
                    let birthday = new Date(this.favorites_pre[i].favorite_user.birthday);
                    let today = new Date();
                    let age = today.getYear() - birthday.getYear();
                    let month = today.getMonth() - birthday.getMonth();
                    if (month < 0){
                        age--;
                    }
                    for (var j = 0; j < this.black_list_dialogues.length; j++){
                        if(this.black_list_dialogues[j].black_list_user == this.favorites_pre[i].favorite_user.id){
                            in_black_list = true;
                            break;
                        }
                    }
                    if(!in_black_list){
                        this.favorites.push({'id': this.favorites_pre[i].id, 'name': this.favorites_pre[i].favorite_user.first_name + ' ' + this.favorites_pre[i].favorite_user.last_name , 'favorite_user': this.favorites_pre[i].favorite_user.id, 'avatar': this.favorites_pre[i].favorite_user.avatar, 'age': age});
                    }
                }
                else{
                    let birthday = new Date(this.favorites_pre[i].user.birthday);
                    let today = new Date();
                    let age = today.getYear() - birthday.getYear();
                    let month = today.getMonth() - birthday.getMonth();
                    if (month < 0){
                        age--;
                    }
                    if (this.favorites_pre[i].user.first_name == null){
                        this.favorites_pre[i].user.first_name = '';
                    }
                    if (this.favorites_pre[i].user.last_name == null){
                        this.favorites_pre[i].user.last_name = '';
                    }
                    for (var j = 0; j < this.black_list_dialogues.length; j++){
                        if(this.black_list_dialogues[j].black_list_user == this.favorites_pre[i].user.id){
                            in_black_list = true;
                            break;
                        }
                    }
                    if(!in_black_list){
                        this.favorites.push({'id': this.favorites_pre[i].id, 'name': this.favorites_pre[i].user.first_name + ' ' + this.favorites_pre[i].user.last_name , 'favorite_user': this.favorites_pre[i].user.id, 'avatar': this.favorites_pre[i].user.avatar, 'age': age});
                    }
                    in_black_list = false;
                }
            }
        },
        pathAvatar(index){
            return `media/${this.favorites[index].avatar}`;
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
        async createFavoriteQuery(idFavorite){
            this.favorite = idFavorite;
            var csrftoken = this.readCookie('csrftoken');
            localStorage = window.localStorage;
            await fetch(config.host +'/api/suggest', {
                method: 'post',
                headers: {
                    'Authorization': 'Bearer '+localStorage.getItem('access'),
                    'Content-Type': 'application/json',
                    "X-CSRFToken": csrftoken,
                },
                body: JSON.stringify(this.favorite)
            });
        }
    }
})

var favorite_in = new Vue({
    el: "#favorite_in",
    data: {
        favorites_pre: [],
        favorites_in: [],
        favoriteObj: {
            'id' : 0,
            'favorite_user': 0,
            'user': 0,
            'isConfirmed': false
        },
        favorite: {
            'favorite_user': '',
        },
        black_list_dialogues: [],
    },
    async created() {
        socket.on('add-favorite', (data) => {
            this.favorites_in = null;
            this.favorites_in = [];
            this.favorites_pre = [];
            this.getFavoritesIn();
        });
        await this.getFavoritesIn();
    },
    methods: {
        async updateFavorite(index){
            let f = this.favorites_in[index];
            var csrftoken = this.readCookie('csrftoken');
            localStorage = window.localStorage;
            console.log(f);
            this.favoriteObj.user = localStorage.getItem('id');
            this.favoriteObj.favorite_user = f.favorite_user;
            this.favoriteObj.id = f.id;
            this.favoriteObj.isConfirmed = true;
            var idetc = await fetch(config.host +'/api/u_favorite/'+f.id, {
                    method: 'post',
                    headers: {
                        'Authorization': 'Bearer '+localStorage.getItem('access'),
                        'Content-Type': 'application/json',
                        "X-CSRFToken": csrftoken,
                    },
                    body: JSON.stringify(this.favoriteObj)
                }
            );
            setTimeout(function () {
                socket.emit('add-favorite', f.id);
            }, 2000);

        },
        pageId(index){
            window.localStorage.setItem('pageId', this.favorites_in[index].favorite_user);
        },
        page_link(index){
            return config.host + '/'+this.favorites_in[index].favorite_user;
        },
        async getFavoritesIn(){
            var csrftoken = this.readCookie('csrftoken');
            localStorage = window.localStorage;
            var idetc = await fetch(config.host +'/api/f_list', {
                    method: 'get',
                    headers: {
                        'Authorization': 'Bearer '+localStorage.getItem('access'),
                        'Content-Type': 'application/json',
                        "X-CSRFToken": csrftoken,
                    },
                }
            );
            let favorites_list = await idetc.json();
            for (var i = 0; i < favorites_list.length; i++){
                if (favorites_list[i].favorite_user.id == localStorage.getItem('id') && favorites_list[i].isConfirmed == false){
                    this.favorites_pre.push(favorites_list[i]);
                }
            }
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
            let in_black_list = false;
            for (var i = 0; i < this.favorites_pre.length; i++){
                let birthday = new Date(this.favorites_pre[i].user.birthday);
                let today = new Date();
                let age = today.getYear() - birthday.getYear();
                let month = today.getMonth() - birthday.getMonth();
                if (month < 0){
                    age--;
                }
                if (this.favorites_pre[i].user.first_name == null){
                    this.favorites_pre[i].user.first_name = '';
                }
                if (this.favorites_pre[i].user.last_name == null){
                    this.favorites_pre[i].user.last_name = '';
                }
                for (var j = 0; j < this.black_list_dialogues.length; j++){
                    if(this.black_list_dialogues[j].black_list_user == this.favorites_pre[i].user.id){
                        in_black_list = true;
                        break;
                    }
                }
                if(!in_black_list){
                    this.favorites_in.push({'id': this.favorites_pre[i].id, 'name': this.favorites_pre[i].user.first_name + ' ' + this.favorites_pre[i].user.last_name , 'favorite_user': this.favorites_pre[i].user.id, 'avatar': this.favorites_pre[i].user.avatar, 'age': age});
                }
                in_black_list = false;
            }
        },
        pathAvatar(index){
            return `media/${this.favorites_in[index].avatar}`;
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
        async createFavoriteQuery(idFavorite){
            this.favorite = idFavorite;
            var csrftoken = this.readCookie('csrftoken');
            localStorage = window.localStorage;
            await fetch(config.host +'/api/suggest', {
                method: 'post',
                headers: {
                    'Authorization': 'Bearer '+localStorage.getItem('access'),
                    'Content-Type': 'application/json',
                    "X-CSRFToken": csrftoken,
                },
                body: JSON.stringify(this.favorite)
            });
        }
    }
})

var favorite_out = new Vue({
    el: "#favorite_out",
    data: {
        favorites_pre: [],
        favorites_out: [],
        favoriteObj: {
            'id' : 0,
            'favorite_user': 0,
            'user': 0,
            'isConfirmed': false
        },
        favorite: {
            'favorite_user': '',
        },
        black_list_dialogues: [],
    },
    async created() {
        socket.on('add-favorite', (data) => {
            this.favorites_out = null;
            this.favorites_out = [];
            this.favorites_pre = [];
            this.getFavoritesOut();
        });
        await this.getFavoritesOut();
    },
    methods: {
        async updateFavorite(index){
            let f = this.favorites_in[index];
            var csrftoken = this.readCookie('csrftoken');
            localStorage = window.localStorage;
            this.favoriteObj.user = f.user;
            this.favoriteObj.favorite_user = f.favorite_user;
            this.favoriteObj.id = f.id;
            this.favoriteObj.isConfirmed = true;
            var idetc = await fetch(config.host +'/api/u_favorite/'+f.id, {
                    method: 'post',
                    headers: {
                        'Authorization': 'Bearer '+localStorage.getItem('access'),
                        'Content-Type': 'application/json',
                        "X-CSRFToken": csrftoken,
                    },
                    body: JSON.stringify(this.favoriteObj)
                }
            );
        },
        async getFavoritesOut(){
            var csrftoken = this.readCookie('csrftoken');
            localStorage = window.localStorage;
            var idetc = await fetch(config.host +'/api/f_list', {
                    method: 'get',
                    headers: {
                        'Authorization': 'Bearer '+localStorage.getItem('access'),
                        'Content-Type': 'application/json',
                        "X-CSRFToken": csrftoken,
                    },
                }
            );
            let favorites_list = await idetc.json();
            for (var i = 0; i < favorites_list.length; i++){
                if (favorites_list[i].user.id == localStorage.getItem('id') && favorites_list[i].isConfirmed == false){
                    this.favorites_pre.push(favorites_list[i]);
                }
            }
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
            let in_black_list = false;
            for (var i = 0; i < this.favorites_pre.length; i++){
                let birthday = new Date(this.favorites_pre[i].favorite_user.birthday);
                let today = new Date();
                let age = today.getYear() - birthday.getYear();
                let month = today.getMonth() - birthday.getMonth();
                if (month < 0){
                    age--;
                }
                if (this.favorites_pre[i].favorite_user.first_name == null){
                    this.favorites_pre[i].favorite_user.first_name = '';
                }
                if (this.favorites_pre[i].favorite_user.last_name == null){
                    this.favorites_pre[i].favorite_user.last_name = '';
                }
                for (var j = 0; j < this.black_list_dialogues.length; j++){
                    if(this.black_list_dialogues[j].black_list_user == this.favorites_pre[i].favorite_user.id){
                        in_black_list = true;
                        break;
                    }
                }
                if(!in_black_list){
                    this.favorites_out.push({'id': this.favorites_pre[i].id, 'name': this.favorites_pre[i].favorite_user.first_name + ' ' + this.favorites_pre[i].favorite_user.last_name , 'favorite_user': this.favorites_pre[i].favorite_user.id, 'avatar': this.favorites_pre[i].favorite_user.avatar, 'age': age});
                }
                in_black_list = false;
            }
        },
        pageId(index){
            window.localStorage.setItem('pageId', this.favorites_out[index].favorite_user);
        },
        page_link(index){
            return config.host + '/'+this.favorites_out[index].favorite_user;
        },
        pathAvatar(index){
            return `media/${this.favorites_out[index].avatar}`;
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
        async createFavoriteQuery(idFavorite){
            this.favorite = idFavorite;
            var csrftoken = this.readCookie('csrftoken');
            localStorage = window.localStorage;
            await fetch(config.host +'/api/favorite', {
                method: 'post',
                headers: {
                    'Authorization': 'Bearer '+localStorage.getItem('access'),
                    'Content-Type': 'application/json',
                    "X-CSRFToken": csrftoken,
                },
                body: JSON.stringify(this.favorite)
            });
        }
    }
})

var confirmation_window_favorite = new Vue({
    el: "#confirmation_window_favorite",
    data: {
        isActive: false,
        id: 0,
        text_confirmation: ''
    },
    methods: {
        async yes_delete(){
            favorite.delete_favorite(this.id);
            this.isActive = false;
            socket.emit('delete-favorite', this.id);
        },
        deactivate_window(){
            this.isActive = false;
        }
    }
})
