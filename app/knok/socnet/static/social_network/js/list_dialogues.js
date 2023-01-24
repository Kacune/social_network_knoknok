    let list_dialogues = new Vue({
        el: '#list_favorites_dialogues',
        data: {
            dialogues: [],
            favorites_pre: [],
            favorites: [],
            no_dialogues: [],
            isActive: false,
            newDialog: {
                user: 0,
                interlocutor: 0,
                is_group: false
            }
        },
        async created() {
            await this.getFavorites();
            await this.get_dialogues();
            this.get_user_no_dialogue();
        },
        methods: {
            async getFavorites(){
                var csrftoken = this.readCookie('csrftoken');
                localStorage = window.localStorage;
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
                    if ((favorites_list[i].user == localStorage.getItem('id') && favorites_list[i].isConfirmed == true) || (favorites_list[i].favorite_user == localStorage.getItem('id') && favorites_list[i].isConfirmed == true)){
                        this.favorites_pre.push(favorites_list[i]);
                    }
                }
                idetc = await fetch(config.host +'/api/u_list', {
                    method: 'get',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+localStorage.getItem('access')
                    }
                });

                let users = await idetc.json();

                for (var i = 0; i < this.favorites_pre.length; i++){
                    for(var j = 0; j < users.length; j++){
                        if (this.favorites_pre[i].user == users[j].id){
                            let birthday = new Date(users[i].birthday);
                            let today = new Date();
                            let age = today.getYear() - birthday.getYear();
                            let month = today.getMonth() - birthday.getMonth();
                            if (month < 0){
                                age--;
                            }
                            this.favorites.push({'id': this.favorites_pre[i].id, 'name': users[j].first_name + ' ' + users[j].last_name , 'favorite_user': this.favorites_pre[i].user, 'avatar': users[j].avatar, 'age': age});
                        }
                    }
                }
            },
            close_flist(elem){
                elem.classList.remove('is_active');
                console.log(elem);
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
                let dialogues_temp = [];
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
                            this.dialogues.push({
                                "id": dialogues[i].id,
                                "user": dialogues[i].user,
                                "interlocutor": dialogues[i].interlocutor,
                                "username": user.first_name + ' ' + user.last_name,
                                "avatar": user.avatar});
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
                            this.dialogues.push({
                                "id": dialogues[i].id,
                                "user": dialogues[i].interlocutor,
                                "interlocutor": dialogues[i].user,
                                "username": user.first_name + ' ' + user.last_name,
                                "avatar": user.avatar});
                        }
                    }
                }
            },
            get_user_no_dialogue(){
                var count = 0;
                for(var i = 0; i < this.favorites.length; i++){
                    for(var j = 0; j < this.dialogues.length; j++){
                        if(this.favorites[i].favorite_user != this.dialogues[j].interlocutor && this.favorites [i].favorite_user != this.dialogues[j].user || this.favorites[i].user != this.dialogues[j].interlocutor && this.favorites [i].user != this.dialogues[j].user){
                            console.log(this.favorites[i].favorite_user, this.dialogues[j].interlocutor, this.dialogues[j].user);

                            for(let z = 0; z < this.no_dialogues.length; z++){
                                if (this.no_dialogues[z].interlocutor == this.favorites[i].favorite_user || this.no_dialogues[z].interlocutor == this.favorites[i].user){
                                    count++;
                                }
                            }
                            if (count == 0){
                                this.no_dialogues.push({'interlocutor': this.favorites[i].favorite_user, 'avatar': this.favorites[i].avatar, 'name': this.favorites[i].name,  'age': this.favorites[i].age});
                            }
                            count = 0;
                        }
                    }
                }
                for(var i = 0; i < this.no_dialogues.length; i++){
                    for(var j = 0; j < this.dialogues.length; j++){
                        if(this.no_dialogues[i].interlocutor == this.dialogues[j].interlocutor || this.no_dialogues[i].interlocutor == this.dialogues[j].user){
                            this.no_dialogues.splice(i, 1);
                        }
                    }
                }
                console.log(this.no_dialogues);
            },
            async create_dialogues(id){
                var csrftoken = this.readCookie('csrftoken');
                localStorage = window.localStorage;
                this.newDialog.user = localStorage.getItem('id');
                this.newDialog.interlocutor = id;
                await fetch(config.host +'/api/dialog/create', {
                    method: 'post',
                    headers: {
                        'Authorization': 'Bearer '+localStorage.getItem('access'),
                        'Content-Type': 'application/json',
                        "X-CSRFToken": csrftoken,
                    },
                    body: JSON.stringify(this.newDialog)
                });
            },
            pathAvatar(index){
                return `media/${this.no_dialogues[index].avatar}`;
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