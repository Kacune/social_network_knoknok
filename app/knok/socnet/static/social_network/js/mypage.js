var mypage_photos = new Vue({
    el: "#block_photo_mypage",
    data: {
        'photos': [],
        'count_photo_all'  : 0,
        'count_photo_paid' : 0,
        'count_photo_free' : 0,
        'characteristics'  : '',
        'favorite': 0,
        'suggestions_count': 0,
        'prices_count': 0,
    },
    async created() {
        this.getPhotos();
        socket.on('create-photo', (data) => {
            this.photos = [];
            this.getPhotos();
        });
    },
    methods: {
        async getPhotos(){
            localStorage = window.localStorage;
            var photos = await fetch(config.host +'/api/photos/?user=' + localStorage.getItem('id'), {
                    method: 'get',
                    headers: {
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
        open_slider(index){
            document.getElementById('photo_all_screen').style.display = 'flex';
            photo_all_screen.show_image_function(index);
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

var mypage_top = new Vue({
    el: "#main_block_mypage",
    data: {
        user: {
            avatar: '',
            bio: '',
            age: 0,
            city: '',
            first_name: '',
            last_name: ''
        },
        characteristics: {},
        my_suggestons_count: 0,
        clicked: false,
        'selectedFile': ''
    },
    async created() {
        this.getUser();
    },
    methods: {
        async add_avatar(){
            var csrftoken = this.readCookie('csrftoken');
            ls = window.localStorage;
            const data = new FormData();
            data.append('avatar', this.selectedFile, this.selectedFile.name);
            data.append('username', '');
            event.preventDefault();
            axios({
                withCredentials: true,
                url: config.host + '/api/user/update/avatar/'+ls.getItem('id'),
                headers: {
                    'Authorization': 'Bearer '+localStorage.getItem('access')
                },
                method: 'PUT',
                data: data
            })
        },
        editImage(event){
            this.selectedFile = event.target.files[0];
            if (event.target.files && event.target.files[0]) {
                var reader = new FileReader();
                reader.onloadend = function(e) {
                    $('#avatar_mypage').attr('src', e.target.result);
                    $('#avatar_mypage').css('display', 'inline-block');
                }
                reader.readAsDataURL(event.target.files[0]);
            }
            this.add_avatar();
        },
        async getUser(){
            localStorage = window.localStorage;
            var id = localStorage.getItem('id');
            var users = await fetch(config.host +'/api/user/get/'+localStorage.getItem('id'), {
                    method: 'get',
                    headers: {
                        'Authorization': 'Bearer '+localStorage.getItem('access')
                    },
                }
            );
            let user_self = await users.json();
            let birthday = new Date(user_self.birthday);
            let today = new Date();
            let age = today.getYear() - birthday.getYear();
            let month = today.getMonth() - birthday.getMonth();
            if (month < 0){
                age--;
            }
            console.log(age);
            this.user.avatar = user_self.avatar;
            this.user.bio = user_self.bio;
            this.user.age = age;
            this.user.city = user_self.city;
            this.user.first_name = user_self.first_name;
            this.user.last_name = user_self.last_name;

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

            var suggestions = await fetch(config.host +'/api/s_list', {
                    method: 'get',
                    headers: {
                        'Authorization': 'Bearer '+localStorage.getItem('access')
                    },
                }
            );
            let suggestions_list = await suggestions.json();
            for (var i = 0; i < suggestions_list.length; i++){
                if(suggestions_list[i].user.id == id && new Date(suggestions_list[i].duration) > new Date()){
                    this.my_suggestons_count++;
                }
            }
        },
        pathAvatar(){
            return `media/${this.user.avatar}`;
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

